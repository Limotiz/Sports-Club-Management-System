from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    sports = db.relationship("Sport", back_populates="user", cascade="all, delete-orphan")
    teams = db.relationship("Team", back_populates="user", cascade="all, delete-orphan")
    players = db.relationship("Player", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Sport(db.Model):
    __tablename__ = "sports"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="sports")
    teams = db.relationship("Team", back_populates="sport", cascade="all, delete-orphan")


class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String)

    sport_id = db.Column(db.Integer, db.ForeignKey("sports.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    sport = db.relationship("Sport", back_populates="teams")
    user = db.relationship("User", back_populates="teams")

    team_players = db.relationship(
        "TeamPlayer",
        back_populates="team",
        cascade="all, delete-orphan"
    )


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    phone = db.Column(db.String)
    age = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="players")

    team_players = db.relationship(
        "TeamPlayer",
        back_populates="player",
        cascade="all, delete-orphan"
    )


class TeamPlayer(db.Model):
    __tablename__ = "team_players"

    id = db.Column(db.Integer, primary_key=True)

    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)

    position = db.Column(db.String)
    joined_date = db.Column(db.Date, default=date.today)

    team = db.relationship("Team", back_populates="team_players")
    player = db.relationship("Player", back_populates="team_players")

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)    