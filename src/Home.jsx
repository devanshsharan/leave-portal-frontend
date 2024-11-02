import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Css/Home.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployeeId,
  selectCurrentToken,
  selectCurrentRole,
  logOut,
  setCredentials,
} from "./features/auth/authSlice";
import { GiHamburgerMenu } from "react-icons/gi";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = useSelector(selectCurrentToken);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    }
  }, [navigate, jwt]);

  return (
    <div className="layout">
      <Header />
      {
        <div
          className="hamburger"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <GiHamburgerMenu size={24} />
        </div>
      }
      <Sidebar
        isOpen={isSidebarOpen}
        className={isSidebarOpen ? "open" : "hidden"}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
