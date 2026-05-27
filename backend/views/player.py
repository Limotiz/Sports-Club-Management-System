from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import Player, Team, TeamPlayer


player_bp = Blueprint("player_bp", __name__)


# READ ALL PLAYERS
@player_bp.route("/players")
@jwt_required()
def fetch_players():
    current_user_id = int(get_jwt_identity())

    players = Player.query.filter_by(user_id=current_user_id).all()

    results = []

    for player in players:
        teams = []

        for team_player in player.team_players:
            teams.append({
                "id": team_player.id,
                "team_id": team_player.team_id,
                "player_id": team_player.player_id,
                "position": team_player.position,
                "joined_date": str(team_player.joined_date),
                "team": {
                    "id": team_player.team.id,
                    "name": team_player.team.name,
                    "category": team_player.team.category
                } if team_player.team else None
            })

        results.append({
            "id": player.id,
            "first_name": player.first_name,
            "last_name": player.last_name,
            "email": player.email,
            "phone": player.phone,
            "age": player.age,
            "user_id": player.user_id,
            "teams": teams
        })

    return jsonify(results), 200


# CREATE PLAYER
@player_bp.route("/players", methods=["POST"])
@jwt_required()
def add_player():
    data = request.get_json()

    current_user_id = int(get_jwt_identity())

    new_player = Player(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data.get("email"),
        phone=data.get("phone"),
        age=data.get("age"),
        user_id=current_user_id
    )

    db.session.add(new_player)
    db.session.commit()

    return jsonify({
        "success": "Player created successfully",
        "player": {
            "id": new_player.id,
            "first_name": new_player.first_name,
            "last_name": new_player.last_name,
            "email": new_player.email,
            "phone": new_player.phone,
            "age": new_player.age,
            "user_id": new_player.user_id
        }
    }), 201


# READ ONE PLAYER
@player_bp.route("/players/<int:id>")
@jwt_required()
def fetch_player(id):
    current_user_id = int(get_jwt_identity())

    player = Player.query.get(id)

    if not player:
        return jsonify({"error": "Player does not exist"}), 404

    if player.user_id != current_user_id:
        return jsonify({"error": "You are not allowed to view this player"}), 403

    teams = []

    for team_player in player.team_players:
        teams.append({
            "id": team_player.id,
            "team_id": team_player.team_id,
            "player_id": team_player.player_id,
            "position": team_player.position,
            "joined_date": str(team_player.joined_date),
            "team": {
                "id": team_player.team.id,
                "name": team_player.team.name,
                "category": team_player.team.category
            } if team_player.team else None
        })

    return jsonify({
        "id": player.id,
        "first_name": player.first_name,
        "last_name": player.last_name,
        "email": player.email,
        "phone": player.phone,
        "age": player.age,
        "user_id": player.user_id,
        "teams": teams
    }), 200


# UPDATE PLAYER
@player_bp.route("/players/<int:id>", methods=["PUT"])
@jwt_required()
def update_player(id):
    player = Player.query.get(id)

    if not player:
        return jsonify({"error": "Player does not exist"}), 404

    current_user_id = int(get_jwt_identity())

    if player.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to update this player"
        }), 403

    data = request.get_json()

    player.first_name = data.get("first_name", player.first_name)
    player.last_name = data.get("last_name", player.last_name)
    player.email = data.get("email", player.email)
    player.phone = data.get("phone", player.phone)
    player.age = data.get("age", player.age)

    db.session.commit()

    return jsonify({
        "success": "Player updated successfully",
        "player": {
            "id": player.id,
            "first_name": player.first_name,
            "last_name": player.last_name,
            "email": player.email,
            "phone": player.phone,
            "age": player.age,
            "user_id": player.user_id
        }
    }), 200


# DELETE PLAYER
@player_bp.route("/players/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_player(id):
    player = Player.query.get(id)

    if not player:
        return jsonify({
            "error": "The player you want to delete does not exist"
        }), 404

    current_user_id = int(get_jwt_identity())

    if player.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to delete this player"
        }), 403

    db.session.delete(player)
    db.session.commit()

    return jsonify({
        "success": "Player deleted successfully"
    }), 200


# ASSIGN PLAYER TO TEAM
@player_bp.route("/players/assign", methods=["POST"])
@jwt_required()
def assign_player_to_team():
    data = request.get_json()

    current_user_id = int(get_jwt_identity())

    player = Player.query.get(data["player_id"])
    team = Team.query.get(data["team_id"])

    if not player:
        return jsonify({"error": "Player does not exist"}), 404

    if not team:
        return jsonify({"error": "Team does not exist"}), 404

    if player.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to assign this player"
        }), 403

    if team.user_id != current_user_id:
        return jsonify({
            "error": "You are not allowed to assign a player to this team"
        }), 403

    existing_assignment = TeamPlayer.query.filter_by(
        player_id=data["player_id"],
        team_id=data["team_id"]
    ).first()

    if existing_assignment:
        return jsonify({
            "error": "Player already belongs to this team"
        }), 409

    new_team_player = TeamPlayer(
        player_id=data["player_id"],
        team_id=data["team_id"],
        position=data.get("position")
    )

    db.session.add(new_team_player)
    db.session.commit()

    return jsonify({
        "success": "Player assigned to team successfully",
        "assignment": {
            "id": new_team_player.id,
            "player_id": new_team_player.player_id,
            "team_id": new_team_player.team_id,
            "position": new_team_player.position,
            "joined_date": str(new_team_player.joined_date)
        }
    }), 201