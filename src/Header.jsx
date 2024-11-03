import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Header.css";
import logo from "./assets/beehyvlogo.png";
import { FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployeeId,
  selectCurrentRole,
  selectCurrentToken,
  logOut,
  setCredentials,
} from "./features/auth/authSlice";
import useFetchInterceptor from "./CustomHooks/useFetchInterceptor";
import { setLeaveRequestId } from "./features/auth/leaveSlice";

const API_BASE_URL = "https://leave-portal-backend-1.onrender.com";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwtToken = useSelector(selectCurrentToken);
  const employeeId = useSelector(selectCurrentEmployeeId);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const fetchWithInterceptor = useFetchInterceptor();

  const handleLogout = async () => {
    dispatch(logOut());
    navigate("/");

    fetch("https://leave-portal-backend-1.onrender.com/deleteCookie", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.log("Logout request error:", error);
      // You can handle further error logging or actions here if needed
    });
  };

  const loadNotifications = async () => {
    try {
      if (employeeId && jwtToken) {
        const response = await fetchWithInterceptor(
          `${API_BASE_URL}/uncleared/${employeeId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const notificationsData = await response.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      setFetchError("Error fetching notifications");
      console.error(error);
    }
  };

  useEffect(() => {
    const startPolling = () => {
      const pollingInterval = setInterval(() => {
        loadNotifications();
      }, 60000);

      return () => clearInterval(pollingInterval);
    };

    if (employeeId && jwtToken) {
      loadNotifications();
      const cleanupPolling = startPolling();
      return cleanupPolling;
    }
  }, []);

  const postStatusUpdate = async (status) => {
    try {
      const response = await fetchWithInterceptor(
        "https://leave-portal-backend-1.onrender.com/updateStatus",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId, response: status }),
        }
      );
      if (status === "SEEN") {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            status: "SEEN",
          }))
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error sending status update:", error);
    }
  };

  const handleBellClick = () => {
    if (notifications.length > 0) {
      postStatusUpdate("SEEN");
    }
    setShowNotifications((prev) => !prev);
  };

  const handleClearNotifications = async () => {
    if (notifications.length > 0) {
      await postStatusUpdate("CLEARED");
      setNotifications([]);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log(notification);
    dispatch(setLeaveRequestId(notification.leaveRequest.id));
    if (notification.type === "RESPONSE") {
      navigate("/home/leaves");
    } else {
      navigate("/home/leave-response");
    }
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        if (notifications.length > 0) {
          postStatusUpdate("SEEN");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifications]);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatLeaveDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (start === end) {
      return start;
    } else {
      return `${start} - ${end} ${new Date(endDate).getFullYear()}`;
    }
  };

  return (
    <div className="header parent">
      <div>
        <img className="beehyvLogo" src={logo} alt="Logo" />
      </div>
      <div className="for-bell final-touch">
        <div
          ref={bellRef}
          onClick={handleBellClick}
          className="notification-icon-wrapper"
        >
          <FaBell className="bell-icon" />
          {notifications.filter(
            (notification) => notification.status === "UNSEEN"
          ).length > 0 && (
            <span className="notification-badge">
              {
                notifications.filter(
                  (notification) => notification.status === "UNSEEN"
                ).length
              }
            </span>
          )}
        </div>
        {showNotifications && (
          <div className="notification-dropdown" ref={dropdownRef}>
            <ul>
              {notifications.length === 0 ? (
                <li>No notifications</li>
              ) : (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.type === "REQUEST" ? (
                      <>
                        A new leave request from{" "}
                        {notification.leaveRequest?.employee?.name + " "}
                        on{" "}
                        {formatLeaveDateRange(
                          notification.leaveRequest?.leaveStartDate,
                          notification.leaveRequest?.leaveEndDate
                        )}{" "}
                        has arrived.
                      </>
                    ) : (
                      <>
                        Your leave request on{" "}
                        {formatLeaveDateRange(
                          notification.leaveRequest?.leaveStartDate,
                          notification.leaveRequest?.leaveEndDate
                        )}{" "}
                        is now {notification.responseStatus}.
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
            {notifications.length > 0 && (
              <button
                type="button"
                className="clear-button"
                onClick={handleClearNotifications}
              >
                Clear
              </button>
            )}
          </div>
        )}
        <button className="final-touch" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
