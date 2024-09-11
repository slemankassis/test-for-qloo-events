import { useState } from 'react';

const useZoom = (initialZoomLevel) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);

  const handleZoomIn = () => setZoomLevel(zoomLevel * 1.2);
  const handleZoomOut = () => setZoomLevel(zoomLevel / 1.2);

  return {
    zoomLevel,
    setZoomLevel,
    handleZoomIn,
    handleZoomOut,
  };
};

export default useZoom;
