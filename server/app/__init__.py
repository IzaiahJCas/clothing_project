from flask import Flask
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Initialize SQLAlchemy and Migrate

def create_app(config_name='default'):
    app = Flask(__name__, static_folder="../build", static_url_path="/")
    CORS(app)

    # Load environment variables
    load_dotenv()

    # Register blueprints (if you have any)
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

app = create_app()