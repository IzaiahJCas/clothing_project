from flask import Blueprint, request, jsonify, send_from_directory, send_file, request
from werkzeug.utils import secure_filename
import os
from . import chatBot

main = Blueprint('main', __name__, static_folder="../build", static_url_path="/")

@main.route('/')
def index():
    return send_from_directory(main.static_folder, 'index.html')

@main.route("/api/user_chat", methods = ["POST"])
def get_chat():
    data = request.get_json()
    chat = data.get('userChat')
    
    response = chatBot.chat_with(chat)
    response_list = [response]

    return jsonify({"response": response_list}), 200