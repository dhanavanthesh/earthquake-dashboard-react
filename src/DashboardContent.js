import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as Cesium from '@cesium/engine';
import { Viewer } from '@cesium/widgets';
import '@cesium/widgets/Source/widgets.css';

Cesium.Ion.defaultAccessToken = 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyM2RjZmYxYi1mMTI4LTQwMDUtODU1ZC0yZjM2NjdmMDgyZTgiLCJpZCI6Mjg5MTY2LCJpYXQiOjE3NDMzMzg0OTN9.56cuFHN7jUXVRX39j0fXtwzLk5d45dotioYhVQ9ALmU';

const DashboardContent = ({ menuOpen, setMenuOpen }) => {
  const [earthquakeData, setEarthquakeData] = useState({
    total: 0,
    magnitudes: { red: 0, orange: 0, yellow: 0 },
    strongest: null
  });
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(1);
  const [viewerInitialized, setViewerInitialized] = useState(false);
  const viewerRef = useRef(null);

  const continentViews = useMemo(() => ({
    "North America": { lon: -100, lat: 40, zoom: 20000000 },
    "South America": { lon: -58, lat: -15, zoom: 28000000 },
    "Europe": { lon: 10, lat: 50, zoom: 18000000 },
    "Africa": { lon: 20, lat: 0, zoom: 25000000 },
    "Asia": { lon: 100, lat: 40, zoom: 28000000 },
    "Oceania": { lon: 135, lat: -25, zoom: 20000000 }
  }), []);

const initCesium = useCallback(() => {
  if (viewerRef.current) return true;

  try {
    const container = document.getElementById('cesiumContainer');
    if (!container) {
      console.error('Cesium container not found');
      return false;
    }

    const viewer = new Viewer('cesiumContainer', {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(), 
      imageryProvider: new Cesium.IonImageryProvider({
        assetId: 3845 
      })
    });

viewer.scene.globe.show = true;
viewer.scene.globe.enableLighting = false; // Disable artificial lighting for more natural appearance
viewer.scene.globe.translucency.enabled = false;
viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1B3F8B'); // Realistic ocean blue color
viewer.scene.globe.depthTestAgainstTerrain = true;

viewer.scene.skyAtmosphere.show = true;
viewer.scene.skyAtmosphere.atmosphereLightIntensity = 0.5; 

viewer.scene.globe.showGroundAtmosphere = false;
viewer.scene.globe.atmosphereLightIntensity = 0.3;
viewer.scene.globe.atmosphereHueShift = 0.0;
viewer.scene.globe.atmosphereSaturationShift = 0.0;
viewer.scene.globe.atmosphereBrightnessShift = 0.0;

viewer.imageryProvider = new Cesium.IonImageryProvider({
    assetId: 3812 
});

viewer.scene.backgroundColor = Cesium.Color.BLACK;

viewer.scene.fog.enabled = true;
viewer.scene.fog.density = 0.0001; 
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000)
    });

    viewerRef.current = viewer;
    setViewerInitialized(true);
    return true;
  } catch (error) {
    console.error('Error initializing Cesium:', error);
    return false;
  }
}, []);

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          if (viewerRef.current.entities) {
            viewerRef.current.entities.removeAll();
          }
          viewerRef.current.destroy();
          viewerRef.current = null;
          setViewerInitialized(false);
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, []);

  const addEarthquakeToMap = useCallback((quake) => {
    if (!viewerRef.current || !viewerRef.current.entities || !viewerInitialized) {
      console.warn('Viewer or entities not initialized, skipping earthquake addition');
      return;
    }

    try {
      const { coordinates } = quake.geometry;
      const { mag, place, time } = quake.properties;
      
      const color = mag >= 4.5 ? Cesium.Color.fromCssColorString('#ff3b30') : 
                  mag >= 2.5 ? Cesium.Color.fromCssColorString('#ff9500') : 
                  Cesium.Color.fromCssColorString('#ffcc00');
      
      const size = Math.max(8, Math.min(18, 6 + mag * 1.5));
      
      const heightOffset = 5000 + mag * 1000;

      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          coordinates[0],
          coordinates[1],
          (coordinates[2] * 1000) + heightOffset
        ),
        point: {
          pixelSize: size,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: 5000,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.7)
        },
        description: `
          <h3>${place}</h3>
          <p>Magnitude: ${mag}</p>
          <p>Time: ${new Date(time).toUTCString()}</p>
          <p>Depth: ${coordinates[2].toFixed(2)} km</p>
        `
      });
    } catch (error) {
      console.error('Error adding earthquake to map:', error);
    }
  }, [viewerInitialized]);

  const processEarthquakeData = useCallback((data) => {
    const magnitudes = { red: 0, orange: 0, yellow: 0 };
    let strongest = null;

    if (!viewerInitialized) {
      console.warn('Viewer not initialized, skipping data processing');
      return;
    }

    if (viewerRef.current?.entities) {
      try {
        viewerRef.current.entities.removeAll();
      } catch (error) {
        console.error('Error removing entities:', error);
      }
    }

    data.features.forEach(quake => {
      const mag = quake.properties.mag;
      
      if (mag >= 4.5) magnitudes.red++;
      else if (mag >= 2.5) magnitudes.orange++;
      else if (mag >= 1.0) magnitudes.yellow++;

      if (!strongest || mag > strongest.magnitude) {
        strongest = {
          magnitude: mag,
          place: quake.properties.place,
          time: quake.properties.time,
          coordinates: quake.geometry.coordinates
        };
      }

      addEarthquakeToMap(quake);
    });

    setEarthquakeData({
      total: data.features.length,
      magnitudes,
      strongest
    });
  }, [addEarthquakeToMap, viewerInitialized]);

  const fetchEarthquakeData = useCallback(async () => {
    if (!viewerInitialized) {
      console.warn('Viewer not initialized, skipping data fetch');
      return;
    }

    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - selectedDays);
      
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=1&orderby=time&starttime=${daysAgo.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      processEarthquakeData(data);
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDays, processEarthquakeData, viewerInitialized]);

  const flyToContinent = useCallback((continent) => {
    if (!viewerRef.current || !viewerInitialized) {
      console.warn('Viewer not initialized, cannot fly to continent');
      return;
    }

    const view = continentViews[continent];
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(view.lon, view.lat, view.zoom)
    });
    setMenuOpen(false);
  }, [continentViews, setMenuOpen, viewerInitialized]);

  useEffect(() => {
    let mounted = true;

    const setupViewer = async () => {
      const container = document.getElementById('cesiumContainer');
      if (container) {
        container.style.height = '100%';
        container.style.width = '100%';
        container.style.position = 'relative';
      }

      const success = initCesium();
      if (success && mounted) {
        setTimeout(() => {
          if (mounted && viewerRef.current) {
            setViewerInitialized(true);
          }
        }, 1500);
      }
    };

    setupViewer();

    return () => {
      mounted = false;
    };
  }, [initCesium]);

  useEffect(() => {
    if (viewerInitialized) {
      fetchEarthquakeData();
    }
  }, [selectedDays, viewerInitialized, fetchEarthquakeData]);

  return (
    <div className="dashboard-content">
      <div className="flex-container">
        <div className="stats-panel">
          <div className="stat-box">
            <h3>Earthquakes in Last {selectedDays} {selectedDays === 1 ? 'Day' : 'Days'}</h3>
            <div className="stat-value">{loading ? '...' : earthquakeData.total}</div>
          </div>

          <div className="stat-box">
            <h3>By Magnitude</h3>
            <div className="magnitude-list">
              <div className="magnitude-item">
                <span className="circle red"></span>
                <span>{loading ? '...' : earthquakeData.magnitudes.red} (4.5+)</span>
              </div>
              <div className="magnitude-item">
                <span className="circle orange"></span>
                <span>{loading ? '...' : earthquakeData.magnitudes.orange} (2.5+)</span>
              </div>
              <div className="magnitude-item">
                <span className="circle yellow"></span>
                <span>{loading ? '...' : earthquakeData.magnitudes.yellow} (1.0+)</span>
              </div>
            </div>
          </div>

          <div className="stat-box">
            <h3>Strongest Earthquake</h3>
            {earthquakeData.strongest && (
              <div className="strongest-info">
                <p>M {earthquakeData.strongest.magnitude.toFixed(1)}</p>
                <p>{earthquakeData.strongest.place}</p>
                <p className="time">{new Date(earthquakeData.strongest.time).toUTCString()}</p>
              </div>
            )}
          </div>
        </div>

        <div id="cesiumContainer" className="cesium-container"></div>

        <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <h2>Controls</h2>
          <div className="sidebar-content">
            <div className="control-section">
              <h3>Time Range</h3>
              <div className="time-buttons">
                {[1, 2, 3, 7, 14, 21, 28].map(days => (
                  <button
                    key={days}
                    className={selectedDays === days ? 'active' : ''}
                    onClick={() => setSelectedDays(days)}
                  >
                    {days} {days === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-section">
              <h3>Zoom to Continent</h3>
              <div className="continent-buttons">
                {Object.keys(continentViews).map(continent => (
                  <button
                    key={continent}
                    onClick={() => flyToContinent(continent)}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>

            <button className="refresh-button" onClick={fetchEarthquakeData}>
              Refresh Data
            </button>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default DashboardContent;