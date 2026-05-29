import { Link } from "react-router-dom";
import SportCard from "../components/SportCard";

function Home() {
  const sports = [
    {
      id: 1,
      name: "Football",
      description: "Manage football teams, players, positions, and team assignments.",
      icon: "⚽",
      teams: 4,
      bg: "bg-gradient-to-br from-emerald-500 to-green-700",
    },
    {
      id: 2,
      name: "Basketball",
      description: "Organize basketball squads, player roles, and club participation.",
      icon: "🏀",
      teams: 2,
      bg: "bg-gradient-to-br from-orange-500 to-red-700",
    },
    {
      id: 3,
      name: "Athletics",
      description: "Track athletes, events, and training groups with ease.",
      icon: "🏃",
      teams: 3,
      bg: "bg-gradient-to-br from-blue-500 to-indigo-700",
    },
    {
      id: 4,
      name: "Volleyball",
      description: "Manage volleyball teams, players, and match preparations.",
      icon: "🏐",
      teams: 2,
      bg: "bg-gradient-to-br from-purple-500 to-pink-700",
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-emerald-400 font-semibold mb-4">
              Sports Club Management System
            </p>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Manage your club, teams and players in one place.
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              SportClub helps you organize sports, create teams, register
              players, and assign players to different teams using a clean
              full-stack system.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:border-emerald-500"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-3xl p-6">
                <p className="text-4xl font-black text-emerald-400">12+</p>
                <p className="text-slate-400 mt-2">Teams Managed</p>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6">
                <p className="text-4xl font-black text-orange-400">50+</p>
                <p className="text-slate-400 mt-2">Players Tracked</p>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6">
                <p className="text-4xl font-black text-blue-400">4</p>
                <p className="text-slate-400 mt-2">Sports Categories</p>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6">
                <p className="text-4xl font-black text-purple-400">JWT</p>
                <p className="text-slate-400 mt-2">Secure Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-emerald-400 font-semibold mb-2">
            Available Sports
          </p>

          <h2 className="text-4xl font-black text-white mb-4">
            Sports you can manage
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto">
            The system can support football and other sports in your club.
            Each sport can have many teams, and players can belong to multiple
            teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-emerald-500 rounded-[2rem] p-10 md:p-14 text-slate-950 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Ready to manage your sports club?
            </h2>

            <p className="text-slate-800 max-w-2xl">
              Register, login, create sports, add teams, register players, and
              assign players to teams.
            </p>
          </div>

          <Link
            to="/register"
            className="bg-slate-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800"
          >
            Start Now
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;