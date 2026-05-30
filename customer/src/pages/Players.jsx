import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../server/api";

function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  const [playerForm, setPlayerForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    age: "",
  });

  const [assignForm, setAssignForm] = useState({
    player_id: "",
    team_id: "",
    position: "",
  });

  async function fetchPlayersAndTeams() {
    try {
      const playersData = await apiRequest("/players");
      const teamsData = await apiRequest("/teams");

      setPlayers(playersData);
      setTeams(teamsData);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchPlayersAndTeams();
  }, []);

  function handlePlayerChange(e) {
    setPlayerForm({
      ...playerForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleAssignChange(e) {
    setAssignForm({
      ...assignForm,
      [e.target.name]: e.target.value,
    });
  }

  async function createPlayer(e) {
    e.preventDefault();

    if (!playerForm.first_name || !playerForm.last_name) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      await apiRequest("/players", {
        method: "POST",
        body: JSON.stringify({
          first_name: playerForm.first_name,
          last_name: playerForm.last_name,
          email: playerForm.email,
          phone: playerForm.phone,
          age: playerForm.age ? Number(playerForm.age) : null,
        }),
      });

      toast.success("Player created successfully");

      setPlayerForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        age: "",
      });

      fetchPlayersAndTeams();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function assignPlayer(e) {
    e.preventDefault();

    if (!assignForm.player_id || !assignForm.team_id) {
      toast.error("Player and team are required");
      return;
    }

    try {
      await apiRequest("/players/assign", {
        method: "POST",
        body: JSON.stringify({
          player_id: Number(assignForm.player_id),
          team_id: Number(assignForm.team_id),
          position: assignForm.position,
        }),
      });

      toast.success("Player assigned to team successfully");

      setAssignForm({
        player_id: "",
        team_id: "",
        position: "",
      });

      fetchPlayersAndTeams();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deletePlayer(id) {
    try {
      await apiRequest(`/players/${id}`, {
        method: "DELETE",
      });

      toast.success("Player deleted successfully");
      fetchPlayersAndTeams();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Players</h1>
        <p className="text-slate-400 mt-2">
          Register players and assign them to teams.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <form
            onSubmit={createPlayer}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
          >
            <h2 className="text-2xl font-bold mb-5 text-white">
              Add Player
            </h2>

            <label className="block text-sm text-slate-300 mb-2">
              First Name
            </label>
            <input
              name="first_name"
              value={playerForm.first_name}
              onChange={handlePlayerChange}
              placeholder="David"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Last Name
            </label>
            <input
              name="last_name"
              value={playerForm.last_name}
              onChange={handlePlayerChange}
              placeholder="Musembi"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={playerForm.email}
              onChange={handlePlayerChange}
              placeholder="player@example.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Phone
            </label>
            <input
              name="phone"
              value={playerForm.phone}
              onChange={handlePlayerChange}
              placeholder="0712345678"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Age
            </label>
            <input
              name="age"
              type="number"
              value={playerForm.age}
              onChange={handlePlayerChange}
              placeholder="24"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-emerald-500"
            />

            <button className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-emerald-400">
              Save Player
            </button>
          </form>

          <form
            onSubmit={assignPlayer}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
          >
            <h2 className="text-2xl font-bold mb-5 text-white">
              Assign Player
            </h2>

            <label className="block text-sm text-slate-300 mb-2">
              Player
            </label>
            <select
              name="player_id"
              value={assignForm.player_id}
              onChange={handleAssignChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.first_name} {player.last_name}
                </option>
              ))}
            </select>

            <label className="block text-sm text-slate-300 mb-2">
              Team
            </label>
            <select
              name="team_id"
              value={assignForm.team_id}
              onChange={handleAssignChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            <label className="block text-sm text-slate-300 mb-2">
              Position
            </label>
            <input
              name="position"
              value={assignForm.position}
              onChange={handleAssignChange}
              placeholder="Striker, Goalkeeper, Guard"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-emerald-500"
            />

            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-400">
              Assign to Team
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {players.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">⭐</p>
              <h2 className="text-2xl font-bold text-white mb-2">
                No players added yet
              </h2>
              <p className="text-slate-400">
                Create your first player using the form on the left.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-4xl mb-4">⭐</p>
                      <h3 className="text-2xl font-bold text-white">
                        {player.first_name} {player.last_name}
                      </h3>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                      Age {player.age || "N/A"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-slate-400">
                    <p>Email: {player.email || "Not provided"}</p>
                    <p>Phone: {player.phone || "Not provided"}</p>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-white font-semibold mb-2">
                      Teams
                    </h4>

                    {player.teams && player.teams.length > 0 ? (
                      <div className="space-y-2">
                        {player.teams.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                          >
                            <p className="text-white">
                              {assignment.team?.name || "Unknown team"}
                            </p>
                            <p className="text-sm text-slate-400">
                              Position: {assignment.position || "Not specified"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Not assigned to any team.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Players;