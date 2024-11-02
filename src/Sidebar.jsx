import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdTimeToLeave, MdQuestionAnswer } from "react-icons/md";
import "./Css/Sidebar.css";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "./features/auth/authSlice";
import { GiHamburgerMenu } from "react-icons/gi";
<GiHamburgerMenu />;

function Sidebar({ isOpen, className, setSidebarOpen }) {
  const location = useLocation();
  const userRole = useSelector(selectCurrentRole);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    if (currentPath === "home") {
      setActiveItem("dashboard");
    } else {
      setActiveItem(currentPath);
    }
  }, [location]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setSidebarOpen(false);
  };

  return (
    <div className={`sidebar ${className}`}>
      <ul className="sidebar-menu">
        <li
          className={`sidebar-item ${
            activeItem === "dashboard" ? "active" : ""
          }`}
        >
          <Link to="/home" onClick={() => handleItemClick("dashboard")}>
            <FaHome /> Dashboard
          </Link>
        </li>
        {(userRole === "MANAGER" || userRole === "EMPLOYEE") && (
          <li
            className={`sidebar-item ${
              activeItem === "leaves" ? "active" : ""
            }`}
          >
            <Link to="/home/leaves" onClick={() => handleItemClick("leaves")}>
              <MdTimeToLeave /> Leaves
            </Link>
          </li>
        )}
        {(userRole === "MANAGER" || userRole === "ADMIN") && (
          <li
            className={`sidebar-item ${
              activeItem === "leave-response" ? "active" : ""
            }`}
          >
            <Link
              to="/home/leave-response"
              onClick={() => handleItemClick("leave-response")}
            >
              <MdQuestionAnswer /> Leave Response
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
