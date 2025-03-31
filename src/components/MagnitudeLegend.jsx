import React from 'react';

function MagnitudeLegend() {
  return (
    <div className="legend">
      <div className="legend--title">Magnitude</div>
      <div className="circle--container">
        <span className="circle circle--red">
          <span className="legend--text">4.5+</span>
        </span>
      </div>
      <div className="circle--container">
        <span className="circle circle--orange">
          <span className="legend--text">2.5+</span>
        </span>
      </div>
      <div className="circle--container">
        <span className="circle circle--yellow">
          <span className="legend--text">1.0+</span>
        </span>
      </div>
    </div>
  );
}

export default MagnitudeLegend;