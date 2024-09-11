import { useState } from 'react';
import { DATE_BASE } from '../constants';
import { useAppContext } from '../context/AppContext';

export default function useDraggable(onEventUpdate) {
  const { zoomLevel } = useAppContext();
  const [relativeX, setRelativeX] = useState(0);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    const draggableDiv = event.target;
    setRelativeX(event.clientX - draggableDiv.offsetLeft);
  };

  const calculateNewStartDate = (dropPosition, zoomLevel) => {
    const baseDate = new Date(DATE_BASE);
    const daysFromBase = Math.floor(dropPosition / (10 * zoomLevel));
    const newStartDate = new Date(baseDate);
    newStartDate.setDate(baseDate.getDate() + daysFromBase);
    return newStartDate;
  };

  const calculateNewEndDate = (newStartDate, item) => {
    const start = new Date(item.start);
    const end = new Date(item.end);

    const diffInDays = Math.floor(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + diffInDays);
    return newEndDate;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    const dropPosition = e.clientX - relativeX;
    const newStartDate = calculateNewStartDate(dropPosition, zoomLevel);
    const newEndDate = calculateNewEndDate(newStartDate, item);
    onEventUpdate(item.id, newStartDate, newEndDate);
  };

  return { handleDragStart, handleDrop };
}
