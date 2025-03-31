import React, { useEffect, useRef } from 'react';
import * as Cesium from '@cesium/engine';
import { CESIUM_ACCESS_TOKEN } from '../utils/config';

Cesium.Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN;

function CesiumGlobe({ onViewerReady }) {
  const cesiumContainer = useRef(null);
  const viewer = useRef(null);

  useEffect(() => {
    if (cesiumContainer.current) {
      viewer.current = new Cesium.CesiumWidget(cesiumContainer.current, {
        terrainProvider: Cesium.createWorldTerrain(),
        baseLayerPicker: false,
        navigationHelpButton: false,
        homeButton: false,
        geocoder: false,
        sceneModePicker: false,
        animation: false,
        timeline: false,
        fullscreenButton: false
      });

      if (onViewerReady) {
        onViewerReady(viewer.current);
      }

      return () => {
        if (viewer.current) {
          viewer.current.destroy();
        }
      };
    }
  }, [onViewerReady]);

  return <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />;
}

export default CesiumGlobe;