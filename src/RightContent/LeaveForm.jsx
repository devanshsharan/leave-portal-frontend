import React, { useEffect } from "react";

function LeaveForm({
  handleSubmit,
  setFormData,
  formData,
  showModal,
  setShowModal,
}) {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("modal")) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showModal, setShowModal]);

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{
        display: showModal ? "block" : "none",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      id="applyLeaveModal"
      tabIndex="-1"
      aria-labelledby="applyLeaveModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog">
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="modal-body">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h5
                className="modal-title"
                id="applyLeaveModalLabel"
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                  marginBottom: "20px",
                }}
              >
                Apply
              </h5>
              <h5
                className="modal-title"
                id="applyLeaveModalLabel"
                style={{ display: "inline-block", marginBottom: "20px" }}
              >
                for Leave
              </h5>
            </div>

            <div className="mb-3">
              <label htmlFor="leaveStartDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="leaveStartDate"
                name="leaveStartDate"
                className="form-control"
                value={formData.leaveStartDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="leaveEndDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="leaveEndDate"
                name="leaveEndDate"
                className="form-control"
                value={formData.leaveEndDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="leaveType" className="form-label">
                Leave Type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                className="form-control"
                value={formData.leaveType}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="HOSPITALIZATION">Hospitalization Leave</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="leaveReason" className="form-label">
                Leave Reason
              </label>
              <textarea
                id="leaveReason"
                name="leaveReason"
                className="form-control"
                value={formData.leaveReason}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveForm;
