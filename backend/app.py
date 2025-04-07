from flask import Flask, jsonify, request

from backend.commands import executar_comando

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Assistente Pessoal está rodando!"

@app.route("/mensagem", methods=["POST"])
def mensagem():
    data = request.get_json()
    texto = data.get("mensagem", "")
    resposta = executar_comando(texto)
    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
