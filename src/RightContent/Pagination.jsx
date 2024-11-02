import React from "react";
import "../Css/Pagination.css";

function Pagination({
  setOffset,
  setCurrentPage,
  setPageSize,
  currentPage,
  totalPages,
  pageSize,
}) {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setOffset((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setOffset((prev) => prev - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setOffset(0);
    setCurrentPage(1);
  };
  return (
    <div className="pagination-controls">
      <div className="inner-boxx">
        <button
          className="btn-l-r"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <svg
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="NavigateBeforeIcon"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </svg>
        </button>
        <div className="currentPageNumber">{currentPage}</div>
        <button
          className="btn-l-r"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <svg
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-lrb33l"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="NavigateNextIcon"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
      <div className="cardSizeContainer">
        <select
          className="cardSize"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
}

export default Pagination;
