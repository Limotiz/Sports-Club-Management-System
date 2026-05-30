import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../server/api";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sport_id: "",
  });

  async function fetchTeamsAndSports() {
    try {
      const teamsData = await apiRequest("/teams");
      const sportsData = await apiRequest("/sports");

      setTeams(teamsData);
      setSports(sportsData);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchTeamsAndSports();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.sport_id) {
      toast.error("Team name and sport are required");
      return;
    }

    try {
      await apiRequest("/teams", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          sport_id: Number(formData.sport_id),
        }),
      });

      toast.success("Team created successfully");

      setFormData({
        name: "",
        category: "",
        sport_id: "",
      });

      fetchTeamsAndSports();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteTeam(id) {
    try {
      await apiRequest(`/teams/${id}`, {
        method: "DELETE",
      });

      toast.success("Team deleted successfully");
      fetchTeamsAndSports();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Teams</h1>
        <p className="text-slate-400 mt-2">
          Create and manage teams under different sports.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit"
        >
          <h2 className="text-2xl font-bold mb-5 text-white">Add Team</h2>

          <label className="block text-sm text-slate-300 mb-2">
            Team Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter team"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
          />

          <label className="block text-sm text-slate-300 mb-2">
            Category
          </label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
          />

          <label className="block text-sm text-slate-300 mb-2">
            Sport
          </label>
          <select
            name="sport_id"
            value={formData.sport_id}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-emerald-500"
          >
            <option value="">Select sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>

          <button className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-emerald-400">
            Save Team
          </button>
        </form>

        <div className="lg:col-span-2">
          {teams.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">👥</p>
              <h2 className="text-2xl font-bold text-white mb-2">
                No teams added yet
              </h2>
              <p className="text-slate-400">
                Create your first team using the form on the left.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-4xl mb-4">👥</p>
                      <h3 className="text-2xl font-bold text-white">
                        {team.name}
                      </h3>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                      {team.sport?.name || "No sport"}
                    </span>
                  </div>

                  <p className="text-slate-400 mt-3">
                    Category: {team.category || "Not specified"}
                  </p>

                  <p className="text-slate-500 mt-2 text-sm">
                    Team ID: {team.id}
                  </p>

                  <button
                    onClick={() => deleteTeam(team.id)}
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

export default Teams;