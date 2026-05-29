import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-[2rem] p-10 text-slate-950 mb-10">
        <h1 className="text-4xl font-black mb-3">
          Welcome, {user?.username}
        </h1>

        <p className="text-slate-800 max-w-2xl">
          Manage your sports, teams, and players from one dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/sports"
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500 transition"
        >
          <p className="text-5xl mb-5">🏆</p>
          <h2 className="text-2xl font-bold text-white mb-2">Sports</h2>
          <p className="text-slate-400">Create and manage sports categories.</p>
        </Link>

        <Link
          to="/teams"
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500 transition"
        >
          <p className="text-5xl mb-5">👥</p>
          <h2 className="text-2xl font-bold text-white mb-2">Teams</h2>
          <p className="text-slate-400">Create teams under different sports.</p>
        </Link>

        <Link
          to="/players"
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500 transition"
        >
          <p className="text-5xl mb-5">⭐</p>
          <h2 className="text-2xl font-bold text-white mb-2">Players</h2>
          <p className="text-slate-400">Register players and assign them.</p>
        </Link>
      </div>
    </main>
  );
}

export default Dashboard;