const { default: makeWASocket, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs');

async function connectToWhatsApp() {
    const authFolder = path.join(__dirname, 'auth_info'); // cria uma pasta para armazenar os dados de autenticação
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const { version, isLatest } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, fs)
        },
        printQRInTerminal: true // mostra o QR code no terminal
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode) !== DisconnectReason.loggedOut;

            console.log('Conexão fechada. Reconectar?', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Conectado com sucesso!');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        console.log('Mensagem recebida:', JSON.stringify(m, undefined, 2));

        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message?.conversation) {
            const resposta = 'Olá! Recebi sua mensagem: ' + msg.message.conversation;
            await sock.sendMessage(msg.key.remoteJid, { text: resposta });
        }
    });
}

connectToWhatsApp();
