import React from 'react';

function EarthquakeStats({ stats, isLoading }) {
  return (
    <div className="flex-left">
      <div className="box">
        <div className="box-1">
          <div className="box-title">
            Earthquakes In The Last <span id="days-data">
              {stats.daysToFetch === 1 ? '24 Hours' : `${stats.daysToFetch} Days`}
            </span>
          </div>
          <div className="box-value">
            {isLoading ? <div className="spinner spinner-box" /> : stats.total}
          </div>
          <div className="box-footer box-footer-time">
            {stats.lastUpdate ? `Data retrieved: ${stats.lastUpdate}` : ''}
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-2">
          <div className="box-title">Earthquakes By Magnitude</div>
          <div className="box-list">
            <div>
              <span className="circle circle--red"></span>
              <span>{stats.redCount || 0}</span>
            </div>
            <div>
              <span className="circle circle--orange"></span>
              <span>{stats.orangeCount || 0}</span>
            </div>
            <div>
              <span className="circle circle--yellow"></span>
              <span>{stats.yellowCount || 0}</span>
            </div>
          </div>
          {isLoading && <div className="spinner spinner-box" />}
          <div className="box-footer box-footer-magnitudes">
            Magnitudes: Red 4.5+ | Orange 2.5+ | Yellow 1.0+
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-3">
          <div className="box-title">
            Strongest Earthquake
          </div>
          <div className="box-highest">
            <div className="box-highest-earthquake">
              {stats.strongest && (
                <>
                 <button 
        onClick={stats.onStrongestClick}
        className="link-button"
      >
        M {stats.strongest.magnitude}, {stats.strongest.place}
      </button>
                  <br />
                  <span className="box-footer">
                    Earthquake time: {stats.strongest.time}
                  </span>
                </>
              )}
            </div>
          </div>
          {isLoading && <div className="spinner spinner-box" />}
        </div>
      </div>
    </div>
  );
}

export default EarthquakeStats;