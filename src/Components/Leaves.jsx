import React, { useState, useEffect } from "react";
import "../Css/Leaves.css";
import LeaveCard from "../RightContent/LeaveCard";
import Pagination from "../RightContent/Pagination";
import LeaveForm from "../RightContent/LeaveForm";
import { useSelector, useDispatch } from "react-redux";
import SkeletonLoader from "../RightContent/SkeletonLoader";
import {
  selectCurrentEmployeeId,
  selectCurrentToken,
  logOut,
  setCredentials,
} from "../features/auth/authSlice";
import useFetchInterceptor from "../CustomHooks/useFetchInterceptor";
import { clearLeaveRequestId } from "../features/auth/leaveSlice";

function Leaves() {
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
    leaveReason: "",
  });
  const [flag, setFlag] = useState(false);
  const [flag3, setFlag3] = useState(false);
  const dispatch = useDispatch();
  const employeeId = useSelector(selectCurrentEmployeeId);
  const token = useSelector(selectCurrentToken);
  const fetchWithInterceptor = useFetchInterceptor();
  const leaveRequestId = useSelector((state) => state.leave.leaveRequestId);
  useEffect(() => {
    if (leaveRequestId) {
      setFlag((prevFlag) => !prevFlag);
    }
  }, [leaveRequestId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeId: employeeId,
      }));

      try {
        const detailsResponse = await fetchWithInterceptor(
          `https://leave-portal-backend-1.onrender.com/totalLeave/${employeeId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!detailsResponse.ok) {
          throw new Error("Failed to fetch leave details");
        }

        const detailsData = await detailsResponse.json();
        setLeaveDetails(detailsData);

        const requestsUrl = leaveRequestId
          ? `https://leave-portal-backend-1.onrender.com/leaveRequestList/${employeeId}/${offset}/${pageSize}?leaveRequestId=${leaveRequestId}`
          : `https://leave-portal-backend-1.onrender.com/leaveRequestList/${employeeId}/${offset}/${pageSize}`;

        const requestsResponse = await fetchWithInterceptor(requestsUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (requestsResponse.status === 204) {
          setLeaveRequests([]);
        } else if (!requestsResponse.ok) {
          throw new Error("Failed to fetch leave requests");
        } else {
          const requestsData = await requestsResponse.json();
          setLeaveRequests(requestsData.content);
          setTotalPages(requestsData.totalPages);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        if (leaveRequestId) {
          dispatch(clearLeaveRequestId());
        }
      }
    };

    fetchData();
  }, [offset, pageSize, flag, flag3]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchWithInterceptor(
        "https://leave-portal-backend-1.onrender.com/apply",
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

      setFlag((prev) => !prev);
      setShowModal(false);
      setFormData({
        employeeId: "",
        leaveStartDate: "",
        leaveEndDate: "",
        leaveType: "",
        leaveReason: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    // Show skeleton loader when loading
    return (
      <div className="skeleton-container">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="leaves-section">
      <div className="leave-cards">
        <div className="leave-card casual-leave">
          <h3>Casual Leave</h3>
          <div className="leave-details">
            <div className="leave-inside">
              <div className="leave-box leave-box1">
                <div className="box-content">
                  {leaveDetails ? leaveDetails.totalCasualLeave : "N/A"}
                </div>
              </div>
              <span className="box-label">Entitled Leaves</span>
            </div>
            <div className="leave-inside">
              <div className="leave-box leave-box2">
                <div className="box-content">
                  {leaveDetails ? leaveDetails.casualLeaveTaken : "N/A"}
                </div>
              </div>
              <span className="box-label">Availed Leaves</span>
            </div>
          </div>
        </div>
        <div className="leave-card hospitalization-leave">
          <h3>Hospitalization Leave</h3>
          <div className="leave-details">
            <div className="leave-inside">
              <div className="leave-box leave-box1">
                <div className="box-content">
                  {leaveDetails
                    ? leaveDetails.totalHospitalizationLeave
                    : "N/A"}
                </div>
              </div>
              <span className="box-label">Entitled Leaves</span>
            </div>
            <div className="leave-inside">
              <div className="leave-box leave-box2">
                <div className="box-content">
                  {leaveDetails
                    ? leaveDetails.hospitalizationLeaveTaken
                    : "N/A"}
                </div>
              </div>
              <span className="box-label">Availed Leaves</span>
            </div>
          </div>
        </div>
      </div>
      <div className="leave-history">
        {leaveRequests.length > 0 ? (
          <div>
            <div className="history-columns">
              {leaveRequests.map((leave, index) => (
                <LeaveCard
                  key={leave.id}
                  leave={leave}
                  setFlag3={setFlag3}
                  setOffset={setOffset}
                  setPageSize={setPageSize}
                  setCurrentPage={setCurrentPage}
                />
              ))}
            </div>
            <Pagination
              setOffset={setOffset}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
            />
          </div>
        ) : (
          <p>No leave history</p>
        )}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-floating"
        onClick={() => setShowModal(true)}
      >
        <span className="plus-icon">+</span>
      </button>
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

export default Leaves;
