import React from "react";
import "../Css/Skeleton.css";

function SkeletonLoader1() {
  return (
    <>
      <div className="bottom-list">
        <div className="skeleton-card1">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
            <div className="loading-spinner" />
          </div>
        </div>
        <div className="skeleton-card1">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
            <div className="loading-spinner" />
          </div>
        </div>
        <div className="skeleton-card1">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SkeletonLoader1;
