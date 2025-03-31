import * as Cesium from '@cesium/engine';

// Constants for magnitude colors
export const MAGNITUDE_COLORS = {
  yellow: '#ffc107', // M1+
  orange: '#ff9800', // M2.5+
  red: '#dc3545',    // M4.5+
};

export function calcMagnitudeColour(magnitude, returnCategory = false) {
  if (!returnCategory) {
    if (magnitude >= 4.5) return MAGNITUDE_COLORS.red;
    if (magnitude >= 2.5) return MAGNITUDE_COLORS.orange;
    if (magnitude >= 1.0) return MAGNITUDE_COLORS.yellow;
    return 'black';
  }
  
  if (magnitude >= 4.5) return 'red';
  if (magnitude >= 2.5) return 'orange';
  if (magnitude >= 1.0) return 'yellow';
  return 'black';
}

export function formatDateTime(datetime) {
  return new Date(datetime).toUTCString();
}

export function flyToContinent(viewer, continent) {
  const continentViews = {
    'North America': { lon: -100, lat: 40, zoom: 20000000 },
    'South America': { lon: -58, lat: -15, zoom: 28000000 },
    'Europe': { lon: 10, lat: 50, zoom: 18000000 },
    'Africa': { lon: 20, lat: 0, zoom: 25000000 },
    'Asia': { lon: 100, lat: 40, zoom: 28000000 },
    'Oceania': { lon: 135, lat: -25, zoom: 20000000 },
  };

  const view = continentViews[continent];
  if (view) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(view.lon, view.lat, view.zoom)
    });
  }
}

export function createEntityDescription(magnitude, depth, lon, lat, time, place, usgsUrl) {
  return `
    <div>
      <p>Magnitude: ${magnitude}</p>
      <p>Depth: ${depth.toFixed(0)} km</p>
      <p>Origin: <a class="usgs-link" data-url="${usgsUrl}" style="color: #aef; text-decoration: none; cursor: pointer;">${place}&nbsp;
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
          <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
        </svg>
      </a></p>
      <p>Coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)} (Lat, Lon)</p>
      <p>Datetime: ${formatDateTime(time)}</p>
    </div>
  `;
}