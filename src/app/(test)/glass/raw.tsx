import React from "react";
import "./LiquidGlassButton.css";

const LiquidGlassButton = ({
  children = "Explore More",
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div className="liquid-container">
      {/* 后台的液态流动色彩球 */}
      {/* <div className="bg-blur">
        <div className="liquid-blob blob-1"></div>
        <div className="liquid-blob blob-2"></div>
      </div> */}

      {/* 前层的毛玻璃按钮 */}
      <div className="btn-wrapper">
        <button
          className={`glass-btn ${className}`}
          onClick={onClick}
          {...props}
        >
          {children}
        </button>
      </div>
    </div>
  );
};

export default LiquidGlassButton;
