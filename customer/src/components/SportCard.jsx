import { Link } from "react-router-dom";

function SportCard({ sport }) {
  return (
    <Link
      to="/sports"
      className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-300 hover:border-emerald-500 block"
    >
      <div className={`h-36 ${sport.bg} flex items-center justify-center`}>
        <span className="text-6xl">{sport.icon}</span>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{sport.name}</h3>

        <p className="text-slate-400 mb-4">{sport.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-emerald-400 font-semibold">
            {sport.teams} Teams
          </span>

          <span className="text-sm text-slate-500 group-hover:text-white">
            View sport →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default SportCard;