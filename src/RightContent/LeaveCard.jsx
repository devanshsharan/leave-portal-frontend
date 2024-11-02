import React, { useState, useEffect } from "react";
import "../Css/LeaveCard.css";
import LeaveForm from "./LeaveForm";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { GiSkullCrossedBones } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployeeId,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import useFetchManagerResponses from "../CustomHooks/useFetchManagerResponses";
import useFetchInterceptor from "../CustomHooks/useFetchInterceptor";

function LeaveCard({
  leave,
  setFlag3,
  setOffset,
  setPageSize,
  setCurrentPage,
}) {
  const [error1, setError1] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [showResponses, setShowResponses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [firstTime, setFirstTime] = useState(false);
  const [formData, setFormData] = useState({
    leaveRequestId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
    leaveReason: "",
  });
  const fetchWithInterceptor = useFetchInterceptor();
  const { managerResponses, error, loading, fetchManagerResponses } =
    useFetchManagerResponses();

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      leaveRequestId: leave.id,
      leaveStartDate: leave.leaveStartDate,
      leaveEndDate: leave.leaveEndDate,
      leaveType: leave.leaveType,
      leaveReason: leave.leaveReason,
    }));
  }, [leave.id, showModal]);

  const handleToggleResponses = () => {
    setShowResponses(!showResponses);
    if (!firstTime) {
      setFirstTime(true);
      fetchManagerResponses(leave.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const monthAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${monthAbbreviations[month - 1]} ${year}`;
  };

  const getResponseIcon = (response) => {
    switch (response) {
      case "APPROVED":
        return <FaCheckCircle style={{ color: "#28A745" }} />;
      case "REJECTED":
        return <GiSkullCrossedBones style={{ color: "#DC3545" }} />;
      case "CANCELLED":
        return <FcCancel />;
      case "PENDING":
      default:
        return <GiSandsOfTime style={{ color: "#FFA500" }} />;
    }
  };

  const handleCancel = async () => {
    if (!token) {
      setError1("No token found");
      return;
    }

    try {
      const response = await fetchWithInterceptor(
        "https://leave-portal-backend-1.onrender.com/cancel",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ leaveRequestId: leave.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel leave");
      }
      setFlag3((prevFlag) => !prevFlag);
    } catch (error) {
      console.error("Error cancelling leave:", error);
      setError1("Error cancelling leave");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchWithInterceptor(
        "https://leave-portal-backend-1.onrender.com/reschedule",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        throw new Error(errorData.message);
      }
      setShowModal(false);
      setOffset(0);
      setPageSize(5);
      setCurrentPage(1);
      setFlag3((prevFlag) => !prevFlag);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const handleClick = () => {
    if (leave.status !== "PENDING") {
      alert("Leave request is already " + leave.status);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="history-card">
      <div className="row1">
        <div className="leaveType">{leave.leaveType}</div>
        <div className="row11">
          <div className="date">
            {leave.leaveStartDate === leave.leaveEndDate
              ? formatDate(leave.leaveStartDate)
              : `${formatDate(leave.leaveStartDate)} - ${formatDate(
                  leave.leaveEndDate
                )}`}
          </div>
          <div className="cancel-reschedule-box">
            <button
              type="button"
              className="btn btn-outline-danger cancel-button"
              onClick={handleCancel}
              disabled={leave.status === "CANCELLED"}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-success cancel-button"
              onClick={handleClick}
              disabled={leave.status === "CANCELLED"}
            >
              Reschedule
            </button>
          </div>
        </div>
        <div
          className={`icons-design status ${
            leave.status === "CANCELLED"
              ? "cancelled"
              : leave.status.toLowerCase()
          }`}
        >
          <span>
            {leave.status === "CANCELLED" ? "CANCELLED" : leave.status}
          </span>
          <span>
            {getResponseIcon(
              leave.status === "CANCELLED" ? "CANCELLED" : leave.status
            )}
          </span>
        </div>
      </div>
      <div className="arrow-icon2" onClick={handleToggleResponses}>
        {showResponses ? <FaAnglesUp /> : <FaAnglesDown />}
      </div>

      {showResponses && (
        <div className="response-section">
          {loading ? (
            <p>Loading manager responses...</p>
          ) : error ? (
            <p>{error}</p>
          ) : managerResponses.length > 0 ? (
            <div className="manager-responses">
              <div className="leave-reason2 leaveReason">
                <div className="leave-reason-heading">Leave Reason:</div>
                <div>{leave.leaveReason}</div>
              </div>
              <h6>Approval Status:</h6>
              {managerResponses.map((response, index) => (
                <div key={index} className="response-card1">
                  <div className="response-inside1">
                    <div>{response.manager.name}</div>
                    <div className="leave-comments">
                      {leave.status === "CANCELLED"
                        ? "No Comments"
                        : response.comments}
                    </div>
                    <div
                      className={`icons-design status ${
                        leave.status === "CANCELLED"
                          ? "cancelled"
                          : response.response.toLowerCase()
                      }`}
                    >
                      <span>
                        {leave.status === "CANCELLED"
                          ? "CANCELLED"
                          : response.response}
                      </span>
                      <span className="response-icon-hi">
                        {getResponseIcon(
                          leave.status === "CANCELLED"
                            ? "CANCELLED"
                            : response.response
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No manager responses</p>
          )}
        </div>
      )}
      <LeaveForm
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        formData={formData}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </div>
  );
}

export default LeaveCard;
