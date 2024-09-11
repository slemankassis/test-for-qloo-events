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

export const calculateNewDate = (dropPosition, zoomLevel) => {
  const baseDate = new Date(DATE_BASE);
  const daysPerPixel = 1 / (10 * zoomLevel);
  const daysFromBase = dropPosition * daysPerPixel;
  const newDate = new Date(baseDate);
  newDate.setDate(baseDate.getDate() + daysFromBase);
  return newDate.toISOString().split('T')[0];
};

const getRandomColor = (index) => {
  const hue = (index * 137.508) % 360; // Use golden angle approximation
  return `hsl(${hue}, 70%, 50%)`;
};

const colors = new Array(60).fill(null).map((_, i) => getRandomColor(i));

export const getColor = (id) => {
  return colors[id % colors.length];
};
