import React, { createContext, useState, useContext } from 'react';

export const AppContextContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  return <AppContextContext.Provider value={{ zoomLevel, setZoomLevel }}>{children}</AppContextContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContextContext);
};
