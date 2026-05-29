from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///super.db"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# JWT conf
from flask_jwt_extended import JWTManager
app.config["JWT_SECRET_KEY"] = "fyujvkyxbhvfjnxfgdbvkx,jvxhjbkjmhv"  # Change this!
jwt = JWTManager(app)

CORS(app)

# models
import models

from views import *

# Registering Blueprints
app.register_blueprint(sport_bp)
app.register_blueprint(team_bp)
app.register_blueprint(player_bp)
app.register_blueprint(auth_bp, url_prefix="/auth")


# Callback function to check if a JWT exists in the database blocklist
from models import TokenBlocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None


 #export FLASK_APP=app.py
 #export FLASK_DEBUG=1