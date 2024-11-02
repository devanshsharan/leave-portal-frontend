import React, { useState, useEffect } from "react";
import ResponseCard from "../RightContent/ResponseCard";
import Pagination from "../RightContent/Pagination";
import "../Css/LeaveResponse.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentEmployeeId,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import useFetchInterceptor from "../CustomHooks/useFetchInterceptor";
import { clearLeaveRequestId } from "../features/auth/leaveSlice";

function LeaveResponse() {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const managerId = useSelector(selectCurrentEmployeeId);
  const token = useSelector(selectCurrentToken);
  const fetchWithInterceptor = useFetchInterceptor();
  const dispatch = useDispatch();
  const leaveRequestId = useSelector((state) => state.leave.leaveRequestId);
  const [flag2, setFlag2] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leaveCount, setLeaveCount] = useState(0);

  useEffect(() => {
    if (leaveRequestId) {
      setFlag2((prevFlag) => !prevFlag);
      setSearchQuery("");
      setStatusFilter("");
    }
  }, [leaveRequestId]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      if (!managerId) {
        setError("No manager ID found.");
        setLoading(false);
        return;
      }

      try {
        let requestsUrl = `https://leave-portal-backend-1.onrender.com/manager/${managerId}/${offset}/${pageSize}`;

        const params = [];

        if (leaveRequestId) {
          params.push(`leaveRequestId=${leaveRequestId}`);
        } else {
          if (searchQuery) {
            params.push(`employeeName=${searchQuery}`);
          }
          if (statusFilter) {
            params.push(`status=${statusFilter}`);
          }
        }

        if (params.length > 0) {
          requestsUrl += `?${params.join("&")}`;
        }

        const response = await fetchWithInterceptor(requestsUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 204) {
          setResponses([]);
        } else if (!response.ok) {
          throw new Error("Failed to fetch leave responses.");
        } else {
          const data = await response.json();
          setResponses(data.content);
          setTotalPages(data.totalPages);
          setLeaveCount(data.totalElements);
          setError(null);
        }
      } catch (error) {
        setError("Error fetching leave responses.");
      } finally {
        setLoading(false);
        if (leaveRequestId) {
          dispatch(clearLeaveRequestId());
        }
      }
    };

    fetchResponses();
  }, [offset, pageSize, managerId, flag2, searchQuery, statusFilter]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="responselayout">
      <div className="search-container">
        <input
          className="searchbar"
          type="text"
          placeholder="Search by employee name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="dropdown-response-container">
          <select
            className="status-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Sort by Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pending-response">
            <div className="circle">{leaveCount}</div>
            <span>
              {statusFilter === "pending" && "PENDING"}
              {statusFilter === "approved" && "APPROVED"}
              {statusFilter === "rejected" && "REJECTED"}
              {!statusFilter && "TOTAL"}
            </span>
          </div>
        </div>
      </div>
      {responses.length > 0 ? (
        <div>
          <div className="history-columns">
            {responses.map((response) => (
              <ResponseCard
                key={response.id}
                response={response}
                setFlag2={setFlag2}
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
        <p className="notFoundMessage">No response history available.</p>
      )}
    </div>
  );
}

export default LeaveResponse;
