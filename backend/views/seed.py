from app import app, db
from models import User, Sport, Team, Player, TeamPlayer


with app.app_context():
    print("Deleting old data...")

    TeamPlayer.query.delete()
    Player.query.delete()
    Team.query.delete()
    Sport.query.delete()
    User.query.delete()

    print("Creating user...")

    admin = User(
        username="admin",
        email="admin@sports.com"
    )

    admin.set_password("password123")

    db.session.add(admin)
    db.session.commit()

    print("Creating sports...")

    football = Sport(
        name="Football",
        description="Football teams and players",
        user_id=admin.id
    )

    basketball = Sport(
        name="Basketball",
        description="Basketball teams and players",
        user_id=admin.id
    )

    athletics = Sport(
        name="Athletics",
        description="Track and field athletes",
        user_id=admin.id
    )

    db.session.add_all([football, basketball, athletics])
    db.session.commit()

    print("Creating teams...")

    senior_football = Team(
        name="Senior Football Team",
        category="Senior Men",
        sport_id=football.id,
        user_id=admin.id
    )

    junior_football = Team(
        name="Junior Football Team",
        category="Junior Boys",
        sport_id=football.id,
        user_id=admin.id
    )

    basketball_team = Team(
        name="Basketball Team",
        category="Mixed",
        sport_id=basketball.id,
        user_id=admin.id
    )

    db.session.add_all([
        senior_football,
        junior_football,
        basketball_team
    ])
    db.session.commit()

    print("Creating players...")

    player1 = Player(
        first_name="David",
        last_name="Musembi",
        email="david@example.com",
        phone="0712345678",
        age=24,
        user_id=admin.id
    )

    player2 = Player(
        first_name="Mary",
        last_name="Wanjiku",
        email="mary@example.com",
        phone="0723456789",
        age=22,
        user_id=admin.id
    )

    player3 = Player(
        first_name="John",
        last_name="Otieno",
        email="john@example.com",
        phone="0734567890",
        age=23,
        user_id=admin.id
    )

    db.session.add_all([player1, player2, player3])
    db.session.commit()

    print("Assigning players to teams...")

    assignment1 = TeamPlayer(
        player_id=player1.id,
        team_id=senior_football.id,
        position="Striker"
    )

    assignment2 = TeamPlayer(
        player_id=player2.id,
        team_id=senior_football.id,
        position="Goalkeeper"
    )

    assignment3 = TeamPlayer(
        player_id=player1.id,
        team_id=basketball_team.id,
        position="Guard"
    )

    db.session.add_all([assignment1, assignment2, assignment3])
    db.session.commit()

    print("Seeding complete!")