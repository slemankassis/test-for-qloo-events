import { DATE_BASE } from './constants';

export const calculatePosition = (startDate, zoomLevel) => {
  const baseDate = new Date(DATE_BASE);
  const eventStartDate = new Date(startDate);
  // No necessary to use Math.floor here
  const diffInDays = Math.floor((eventStartDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  return `${diffInDays * 10 * zoomLevel}px`;
};

export const calculateWidth = (startDate, endDate, zoomLevel) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // No necessary to use Math.floor here
  const diffInDays = Math.floor(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return `${diffInDays * 10 * zoomLevel}px`;
};

const getRandomColor = (index) => {
  const hue = (index * 137.508) % 360; // Use golden angle approximation
  return `hsl(${hue}, 70%, 50%)`;
};

const colors = new Array(60).fill(null).map((_, i) => getRandomColor(i));

export const getColor = (id) => colors[id % colors.length];

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
