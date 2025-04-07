import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS

# Initialize extensions
db = SQLAlchemy()
cors = CORS()

def create_app():
    # Define the absolute path to the database file
    basedir = os.path.abspath(os.path.dirname(__file__))
    database_path = os.path.join(basedir, '..', 'database', 'securetrade.db')

    # Ensure the database directory exists
    os.makedirs(os.path.dirname(database_path), exist_ok=True)

    # Create the Flask app
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with the app
    db.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow CORS for all routes from frontend

    # Import and register routes
    from .routes import bp
    app.register_blueprint(bp)

    return app