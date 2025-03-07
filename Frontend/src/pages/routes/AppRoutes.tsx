import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import Rules from "../Rules";
import Profile from "../Profile";
import EnterArena from "../EnterArena";
import Leaderboard from "../Leaderboard";
import Registration from "../Registration";
// import Login from "../Login";
import Dashboard from "../Dashboard";
import Queue from "../Queue";
import Quiz  from "../Quiz";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/enter-arena" element={<EnterArena />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/registration" element={<Registration/>}/>
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/Queue" element={<Queue/>}/>
      <Route path="/Quiz" element={<Quiz/>}/>
    </Routes>
  );
};

export default AppRoutes;
