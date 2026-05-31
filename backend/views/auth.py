from flask import Blueprint, request, jsonify
from datetime import datetime
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt, create_refresh_token
from app import db, mail
from flask_mail import Message
from models import User,TokenBlocklist


auth_bp = Blueprint("auth_bp", __name__)


# REGISTER USER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({
            "error": "Username, email and password are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "Email already exists"
        }), 409

    new_user = User(
        username=username,
        email=email
    )

    # Hash password using werkzeug method from the User model
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    msg = Message(
        subject="noreply@sportsclub.com",
        recipients=[email],
        body="You have a new sign up in your application."
    )
    mail.send(msg)

    return jsonify({
        "success": "User registered successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }), 201


# LOGIN USER
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    if not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id)) 
    msg = Message(
        subject="noreply@sportsclub.com",
        recipients=[email],
        body="Someone logged in your application."
    )
    mail.send(msg)
    return jsonify({
        "success": "Login successful",
        "access_token": access_token,"refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200


# REFRESH AUTH TOKEN
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():

    #get user id from the refresh token
    current_user_id = get_jwt_identity()

    access_token = create_access_token(identity=str(current_user_id))
    return jsonify({"access_token": access_token}),200


# GET CURRENT LOGGED-IN USER
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()

    user = User.query.get(int(current_user_id))

    if not user:
        return jsonify({
            "error": "User does not exist"
        }), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200


# LOGOUT USER
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify(msg="JWT revoked")