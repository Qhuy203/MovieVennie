import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import Trending from "./pages/Trending";
import MovieDetail from "./components/PopularMovies/Detail";
import Sidebar from "./components/SideBar";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
      <Sidebar />
    </Router>
  );
};

export default App;