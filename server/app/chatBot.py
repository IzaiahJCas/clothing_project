from flask import Flask
import pathlib
import textwrap
import os
import google.generativeai as genai
import argparse
# from IPython.display import display
# from IPython.display import Markdown
import re
from dotenv import load_dotenv
from pathlib import Path

app = Flask(__name__)
dotenv_path = Path(__file__).resolve().parent / 'clothing_project' / '.env'
load_dotenv()
GEMINI_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

def chat_with(user_message):
    chat = model.start_chat(
    history=[
        {"role": "user", "parts": "Hello"},
        {"role": "model", "parts": "Great to meet you. What would you like to know?"},
    ]
    )
    
    while True:
        if user_message.lower() in ["exit", "quit"]:
            print("Ending the conversation.")
            break
        response = chat.send_message(user_message)
        print(f"You: {user_message}")
        return response.text