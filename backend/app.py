from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///super.db"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# JWT conf
from flask_jwt_extended import JWTManager
app.config["JWT_SECRET_KEY"] = "fyujvkyxbhvfjnxfgdbvkx,jvxhjbkjmhv" 
jwt = JWTManager(app)
mail = Mail(app)

# mail
app.config["MAIL_SERVER"]= "smtp.gmail.com"
app.config["MAIL_PORT"]=587
app.config["MAIL_USE_TLS"]=True
app.config["MAIL_USE_SSL"]=False

app.config["MAIL_USERNAME"]="tizlimo486@gmail.com"
app.config["MAIL_PASSWORD"]="mjtb qwap lbmu bhcy"
app.config["MAIL_DEFAULT_SENDER"]="tizlimo486@gmail.com"

CORS(app)
app.secret_key = "ftyouhfyftdyljgyfftfygguguyjuytr"

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