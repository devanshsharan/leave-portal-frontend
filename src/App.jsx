import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Dashboard from "./Components/Dashboard";
import Leaves from "./Components/Leaves";
import LeaveResponse from "./Components/LeaveResponse";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole } from "./features/auth/authSlice";

function App() {
  const userRole = useSelector(selectCurrentRole);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="" element={<Dashboard />} />
          {(userRole === "MANAGER" || userRole === "EMPLOYEE") && (
            <Route path="leaves" element={<Leaves />} />
          )}
          {(userRole === "MANAGER" || userRole === "ADMIN") && (
            <Route path="leave-response" element={<LeaveResponse />} />
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
