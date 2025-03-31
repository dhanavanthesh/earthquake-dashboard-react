import React, { useState, useEffect , useCallback} from 'react';
import CesiumGlobe from './CesiumGlobe';
import EarthquakeStats from './EarthquakeStats';
import InfoPanel from './InfoPanel';
import { fetchEarthquakes } from '../utils/earthquakeData';
import { flyToContinent } from '../utils/cesiumUtils';

function Dashboard() {
  const [viewer, setViewer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [days, setDays] = useState(1);
  const [earthquakeStats, setEarthquakeStats] = useState({
    total: 0,
    daysToFetch: 1,
    redCount: 0,
    orangeCount: 0,
    yellowCount: 0,
    strongest: null,
    lastUpdate: null
  });

 

  const loadEarthquakeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchEarthquakes(viewer, days);
      setEarthquakeStats(data);
    } catch (error) {
      console.error('Error loading earthquake data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [viewer, days]);

  useEffect(() => {
    if (viewer) {
      loadEarthquakeData();
    }
  }, [viewer, days, loadEarthquakeData]);

  const handleContinentSelect = (continent) => {
    if (viewer) {
      flyToContinent(viewer, continent);
    }
  };

  return (
    <div className="content">
      <EarthquakeStats 
        stats={earthquakeStats}
        isLoading={isLoading}
      />
      
      <div className="flex-right">
        <CesiumGlobe 
          onViewerReady={setViewer}
        />
        
        <InfoPanel 
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onDaysChange={setDays}
          onFetchData={loadEarthquakeData}
          onContinentSelect={handleContinentSelect}
        />
      </div>
    </div>
  );
}

export default Dashboard;