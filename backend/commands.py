import webbrowser
from datetime import datetime


def executar_comando(comando: str) -> str:
    comando = comando.lower()

    if "hora" in comando:
        return f"Agora são {datetime.now().strftime('%H:%M:%S')}."

    elif "abrir google" in comando:
        webbrowser.open("https://www.google.com")
        return "Abrindo o Google."

    elif "olá" in comando:
        return "Olá! Como posso ajudar?"

    else:
        return "Desculpe, não entendi o comando."
