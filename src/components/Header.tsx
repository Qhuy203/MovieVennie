import React from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import User from "../assets/user.png"

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#1e1e2a] z-100">
      <nav className="mx-auto max-w-[1060px] w-full flex items-center justify-between pr-0 pl-0 pt-4 pb-4">
        {/* Logo */}
        <Link
          to="/"
          className="logo text-[1.4rem] text-[#fcfeff] font-semibold uppercase mr-auto"
        >
          Movie<span className="text-[#ffb43a]">Vennie</span>
        </Link>

        {/* Search Box */}
        <div className="search-box relative w-full max-w-60 p-[8px_15px] bg-[#2d2e37] rounded-full mr-4 flex items-center">
          <input
            type="text"
            id="search-input"
            name="search"
            placeholder="Search Movie"
            className="w-full border-none outline-none text-[#fcfeff] bg-transparent text-[0.938rem] search-clear-hidden"
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="text-white w-5 h-5" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center">
          <img
            src={User}
            alt="User"
            className="w-[60px] h-[60px] rounded-full object-cover object-center cursor-pointer"
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;