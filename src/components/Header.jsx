import React from 'react';

function Header({ onMenuClick }) {
  return (
    <div className="title">
      <div className="icon-container">
        <a href="https://tjdatavisualisation.netlify.app/" target="_blank" rel="noopener noreferrer">
          <svg className="icon-logo" xmlns="http://www.w3.org/2000/svg" version="1.0" preserveAspectRatio="xMidYMid meet" viewBox="119.9 155 272.2 202">
            <g className="icon-logo" fill="currentColor" stroke="none">
              <path d="M3570 2933 c0 -692 -3 -737 -55 -814 -13 -21 -46 -51 -72 -66 -41 -24 -59 -28 -124 -28 -67 0 -81 4 -125 30 -39 25 -56 44 -83 97 -29 58 -34 79 -39 162 l-5 96 -172 0 -173 0 5 -82 c12 -219 68 -367 181 -477 112 -110 225 -151 417 -151 63 0 137 7 174 15 148 35 271 135 341 278 74 151 73 139 77 900 l4 677 -176 0 -175 0 0 -637z"/>
            </g>
          </svg>
        </a>
      </div>
      
      <div className="title--text">
        Real-Time Earthquake Dashboard
      </div>
      
      <button className="icon-container" onClick={onMenuClick}>
        <svg className="icon-menu" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>
    </div>
  );
}

export default Header;