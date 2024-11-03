import React from "react";
import "../Css/Skeleton.css"; // Make sure this path is correct

function SkeletonLoader() {
  return (
    <>
      <div className="top-images">
        <div className="skeleton-card">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
          </div>
          <div className="loading-spinner" />
        </div>
        <div className="skeleton-card">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
          </div>
          <div className="loading-spinner" />
        </div>
      </div>
      <div className="bottom-list">
        <div className="skeleton-card1">
          <div className="skeleton-content">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
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

export default SkeletonLoader;
