import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../server/api";

function Sports() {
  const [sports, setSports] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  async function fetchSports() {
    try {
      const data = await apiRequest("/sports");
      setSports(data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchSports();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await apiRequest("/sports", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Sport created successfully");

      setFormData({
        name: "",
        description: "",
      });

      fetchSports();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteSport(id) {
    try {
      await apiRequest(`/sports/${id}`, {
        method: "DELETE",
      });

      toast.success("Sport deleted");
      fetchSports();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Sports</h1>
        <p className="text-slate-400 mt-2">
          Create and manage sports categories for your club.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit"
        >
          <h2 className="text-2xl font-bold mb-5">Add Sport</h2>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Sport name"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-4 outline-none focus:border-emerald-500"
          />

          <button className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-emerald-400">
            Save Sport
          </button>
        </form>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
            >
              <p className="text-4xl mb-4">🏆</p>

              <h3 className="text-2xl font-bold text-white">{sport.name}</h3>

              <p className="text-slate-400 mt-2">{sport.description}</p>

              <button
                onClick={() => deleteSport(sport.id)}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}

          {sports.length === 0 && (
            <p className="text-slate-400">No sports added yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Sports;