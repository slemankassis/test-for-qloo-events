import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const useZoom = () => {
  const { zoomLevel, setZoomLevel } = useAppContext();

  const handleZoomIn = () => setZoomLevel(zoomLevel * 1.2);
  const handleZoomOut = () => setZoomLevel(zoomLevel / 1.2);

  return {
    handleZoomIn,
    handleZoomOut,
  };
};

export default useZoom;
