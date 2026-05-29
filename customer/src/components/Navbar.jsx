import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-emerald-400 font-semibold"
      : "text-slate-300 hover:text-emerald-400";

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-slate-950">
            SC
          </div>
          <span className="text-xl font-bold text-white">SportClub</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {token && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/sports" className={linkClass}>
                Sports
              </NavLink>
              <NavLink to="/teams" className={linkClass}>
                Teams
              </NavLink>
              <NavLink to="/players" className={linkClass}>
                Players
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white hidden sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-400"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-sm text-slate-400">
                Hi, {user?.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;