import * as Cesium from '@cesium/engine';
import { calcMagnitudeColour, createEntityDescription, formatDateTime } from './cesiumUtils';

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export async function fetchEarthquakes(viewer, days = 1) {
  // Clear existing entities
  viewer.entities.removeAll();

  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - days);

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime.toISOString(),
    endtime: endTime.toISOString(),
    minmagnitude: 1.0,
    orderby: 'time'
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    let magYellowCount = 0;
    let magOrangeCount = 0;
    let magRedCount = 0;
    let strongestEarthquake = null;

    data.features.forEach(feature => {
      const {
        coordinates: [lon, lat, depth],
      } = feature.geometry;
      
      const {
        mag,
        place,
        time,
        url
      } = feature.properties;

      // Add entity to viewer
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, depth),
        point: {
          pixelSize: 12,
          color: Cesium.Color.fromCssColorString(calcMagnitudeColour(mag)),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 0.5,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
        },
        description: createEntityDescription(mag, depth, lon, lat, time, place, url)
      });

      // Update magnitude counts
      const magCategory = calcMagnitudeColour(mag, true);
      if (magCategory === 'yellow') magYellowCount++;
      else if (magCategory === 'orange') magOrangeCount++;
      else if (magCategory === 'red') magRedCount++;

      // Update strongest earthquake
      if (!strongestEarthquake || mag > strongestEarthquake.magnitude) {
        strongestEarthquake = {
          magnitude: mag,
          place,
          time: formatDateTime(time),
          coordinates: [lon, lat]
        };
      }
    });

    return {
      total: data.features.length,
      daysToFetch: days,
      redCount: magRedCount,
      orangeCount: magOrangeCount,
      yellowCount: magYellowCount,
      strongest: strongestEarthquake,
      lastUpdate: formatDateTime(new Date())
    };

  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw error;
  }
}