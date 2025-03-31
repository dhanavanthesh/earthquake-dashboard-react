import React from 'react';

function InfoPanel({ isOpen, onClose, onDaysChange, onFetchData, onContinentSelect }) {
  const continents = [
    'North America',
    'South America',
    'Europe',
    'Africa',
    'Asia',
    'Oceania'
  ];

  const dayOptions = [1, 2, 3, 7, 14, 21, 28];

  return (
    <div className={`dropdown ${isOpen ? 'dropdown-open' : ''}`}>
      <div className="dropdown-content">
        <h1>Welcome to the Real-Time Earthquake Dashboard</h1>
        <br /><br />

        <p>
          This dashboard presents <span style={{ color: 'var(--colour-hover)' }}>earthquake</span> data 
          from the <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php" 
                     target="_blank" 
                     rel="noopener noreferrer">
            <span style={{ color: 'var(--colour-hover)' }}>United States Geological Survey API</span>
          </a>
        </p>

        <br /><br />
        
        <h2>Zoom to Continent</h2>
        <div className="btn-continent-zoom">
          {continents.map(continent => (
            <button 
              key={continent}
              type="button" 
              className={`btn btn-${continent.toLowerCase().replace(' ', '-')}`}
              onClick={() => onContinentSelect(continent)}
            >
              {continent}
            </button>
          ))}
        </div>

        <br /><br />
        <h2>Days to Retrieve Earthquake Data</h2>

        <div className="slider">
          {dayOptions.map(day => (
            <label key={day}>
              <input
                type="radio"
                name="day-slider"
                value={day}
                defaultChecked={day === 1}
                onChange={(e) => onDaysChange(Number(e.target.value))}
              />
              <span>{day}</span>
            </label>
          ))}
          <div className="selection"></div>
        </div>
        
        <br />
        <button type="button" className="btn" onClick={onFetchData}>
          Reload Map
          <div className="spinner spinner-dropdown"></div>
        </button>

        <br /><br /><br />
        <p>Dashboard: Tom Jenkins</p>
        <p>
          Website: <a href="https://tjdatavisualisation.netlify.app/" 
                     target="_blank"
                     rel="noopener noreferrer"
                     style={{ textDecoration: 'none', color: 'var(--colour-hover)' }}>
            Tom Jenkins Data Visualisation
          </a>
        </p>

        <br />
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default InfoPanel;