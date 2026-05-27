from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import Team, Sport


team_bp = Blueprint("team_bp", __name__)


# READ ALL TEAMS
@team_bp.route("/teams")
def fetch_teams():
   
    teams = Team.query.all()

    results = []

    for team in teams:
        results.append({
            "id": team.id,
            "name": team.name,
            "category": team.category,
            "sport_id": team.sport_id,
            "user_id": team.user_id,
            "sport": {
                "id": team.sport.id,
                "name": team.sport.name,
                "description": team.sport.description
            } if team.sport else None
        })

    return jsonify(results), 200


# CREATE TEAM
@team_bp.route("/teams", methods=["POST"])
@jwt_required()
def add_team():
    data = request.get_json()

    current_user_id = int(get_jwt_identity())

    sport = Sport.query.get(data["sport_id"])

    if not sport:
        return jsonify({"error": "Sport does not exist"}), 404

    if sport.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to add a team to this sport"
        }), 403

    new_team = Team(
        name=data["name"],
        category=data.get("category"),
        sport_id=data["sport_id"],
        user_id=current_user_id
    )

    db.session.add(new_team)
    db.session.commit()

    return jsonify({
        "success": "Team created successfully",
        "team": {
            "id": new_team.id,
            "name": new_team.name,
            "category": new_team.category,
            "sport_id": new_team.sport_id,
            "user_id": new_team.user_id
        }
    }), 201


# READ ONE TEAM
@team_bp.route("/teams/<int:id>")
@jwt_required()
def fetch_team(id):
   
    team = Team.query.get(id)

    if not team:
        return jsonify({"error": "Team does not exist"}), 404

    return jsonify({
        "id": team.id,
        "name": team.name,
        "category": team.category,
        "sport_id": team.sport_id,
        "user_id": team.user_id,
        "sport": {
            "id": team.sport.id,
            "name": team.sport.name,
            "description": team.sport.description
        } if team.sport else None
    }), 200


# UPDATE TEAM
@team_bp.route("/teams/<int:id>", methods=["PUT"])
@jwt_required()
def update_team(id):
    team = Team.query.get(id)

    if not team:
        return jsonify({"error": "Team does not exist"}), 404

    current_user_id = int(get_jwt_identity())

    if team.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to update this team"
        }), 403

    data = request.get_json()

    if "sport_id" in data:
        sport = Sport.query.get(data["sport_id"])

        if not sport:
            return jsonify({"error": "Sport does not exist"}), 404

        if sport.user_id != current_user_id:
            return jsonify({
                "error": "You are not allowed to move team to this sport"
            }), 403

        team.sport_id = data["sport_id"]

    team.name = data.get("name", team.name)
    team.category = data.get("category", team.category)

    db.session.commit()

    return jsonify({
        "success": "Team updated successfully",
        "team": {
            "id": team.id,
            "name": team.name,
            "category": team.category,
            "sport_id": team.sport_id,
            "user_id": team.user_id
        }
    }), 200


# DELETE TEAM
@team_bp.route("/teams/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_team(id):
    team = Team.query.get(id)

    if not team:
        return jsonify({
            "error": "The team you want to delete does not exist"
        }), 404

    current_user_id = int(get_jwt_identity())

    if team.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to delete this team"
        }), 403

    db.session.delete(team)
    db.session.commit()

    return jsonify({
        "success": "Team deleted successfully"
    }), 200