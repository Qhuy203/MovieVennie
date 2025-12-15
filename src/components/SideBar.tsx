import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Flame, Compass, Tv, Heart, Eye, EyeOff } from "lucide-react";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const itemClass = (active?: boolean) =>
    `flex flex-col items-center px-2 py-2 transition-all duration-200 ${
      active ? "text-yellow-400" : "text-gray-500 hover:text-white hover:scale-110"
    }`;

  return (
    <>
      {/* Floating opener when sidebar is closed */}
      {!open && (
        <button
          aria-label="Open sidebar"
          onClick={() => setOpen(true)}
          className="fixed left-3 bottom-6 z-50 bg-[#0b1220] p-3 rounded-full shadow-lg text-yellow-400"
        >
          <Eye size={18} />
        </button>
      )}
      {/* Sidebar */}
      <nav
        className={`h-[420px] flex flex-row justify-center bg-[#1e1e2a] text-white text-[13px] fixed bottom-0 left-0 w-full space-x-2 lg:flex-col lg:justify-center lg:items-center lg:space-y-2 lg:space-x-0 lg:left-3 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-auto z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:opacity-0"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <NavLink to="/" className={({ isActive }) => itemClass(isActive)}>
          <Home size={19} className="mb-2" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/trending" className={({ isActive }) => itemClass(isActive)}>
          <Flame size={19} className="mb-2" />
          <span className="text-xs">Trending</span>
        </NavLink>

        <NavLink to="/explore" className={({ isActive }) => itemClass(isActive)}>
          <Compass size={19} className="mb-2" />
          <span className="text-xs">Explore</span>
        </NavLink>

        <NavLink to="/movies" className={({ isActive }) => itemClass(isActive)}>
          <Tv size={19} className="mb-2" />
          <span className="text-xs">Movies</span>
        </NavLink>

        <NavLink to="/favorite" className={({ isActive }) => itemClass(isActive)}>
          <Heart size={19} className="mb-2" />
          <span className="text-xs">Favorite</span>
        </NavLink>

        {/* Toggle eye icon inside nav (when sidebar open show eye-off which hides it) */}
        <div className="mt-2">
          <button
            aria-label={open ? "Hide sidebar" : "Show sidebar"}
            onClick={() => setOpen((s) => !s)}
            className={`flex flex-col items-center px-2 py-2 transition-all duration-200 ${
              !open ? "text-yellow-400" : "text-gray-500 hover:text-white hover:scale-110"
            }`}
          >
            {open ? <EyeOff size={18} className="mb-1" /> : <Eye size={18} className="mb-1" />}
            <span className="text-xs">{open ? "Hide" : "Show"}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;