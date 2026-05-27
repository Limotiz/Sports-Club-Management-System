from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import Sport


sport_bp = Blueprint("sport_bp", __name__)


# READ ALL SPORTS
@sport_bp.route("/sports")
def fetch_sports():

    sports = Sport.query.get.all()

    results = []

    for sport in sports:
        results.append({
            "id": sport.id,
            "name": sport.name,
            "description": sport.description,
            "user_id": sport.user_id
        })

    return jsonify(results), 200


# CREATE SPORT
@sport_bp.route("/sports", methods=["POST"])
@jwt_required()
def add_sport():
    data = request.get_json()

    current_user_id = int(get_jwt_identity())

    if not data.get("name"):
        return jsonify({"error": "Sport name is required"}), 400

    new_sport = Sport(
        name=data["name"],
        description=data.get("description"),
        user_id=current_user_id
    )

    db.session.add(new_sport)
    db.session.commit()

    return jsonify({
        "success": "Sport created successfully",
        "sport": {
            "id": new_sport.id,
            "name": new_sport.name,
            "description": new_sport.description,
            "user_id": new_sport.user_id
        }
    }), 201


# READ ONE SPORT
@sport_bp.route("/sports/<int:id>")
def fetch_sport(id):

    sport = Sport.query.get(id)

    if not sport:
        return jsonify({"error": "Sport does not exist"}), 404

    return jsonify({
        "id": sport.id,
        "name": sport.name,
        "description": sport.description,
        "user_id": sport.user_id
    }), 200


# UPDATE SPORT
@sport_bp.route("/sports/<int:id>", methods=["PUT"])
@jwt_required()
def update_sport(id):
    sport = Sport.query.get(id)

    if not sport:
        return jsonify({"error": "Sport does not exist"}), 404

    current_user_id = int(get_jwt_identity())

    if sport.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to update this sport"
        }), 403

    data = request.get_json()

    sport.name = data.get("name", sport.name)
    sport.description = data.get("description", sport.description)

    db.session.commit()

    return jsonify({
        "success": "Sport updated successfully",
        "sport": {
            "id": sport.id,
            "name": sport.name,
            "description": sport.description,
            "user_id": sport.user_id
        }
    }), 200


# DELETE SPORT
@sport_bp.route("/sports/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_sport(id):
    sport = Sport.query.get(id)

    if not sport:
        return jsonify({
            "error": "The sport you want to delete does not exist"
        }), 404

    current_user_id = int(get_jwt_identity())

    if sport.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to delete this sport"
        }), 403

    db.session.delete(sport)
    db.session.commit()

    return jsonify({
        "success": "Sport deleted successfully"
    }), 200