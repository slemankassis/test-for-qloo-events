import { useMemo } from 'react';
import useZoom from '../hooks/useZoom';
import useEvents from '../hooks/useEvents';

const Timeline = ({ events, onEventUpdate }) => {
  const { zoomLevel, setZoomLevel, handleZoomIn, handleZoomOut } = useZoom(1);

  const {
    items,
    setItems,
    editingId,
    editingName,
    handleNameClick,
    handleNameChange,
    handleNameBlur,
    handleResizeStart,
  } = useEvents(events, zoomLevel);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const calculateNewStartDate = (dropPosition) => {
    const baseDate = new Date(DATE_BASE);
    const daysFromBase = Math.floor(dropPosition / 10);
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    const dropPosition = e.clientX;
    console.log('🚀 ~ handleDrop ~ dropPosition:', dropPosition);
    const newStartDate = calculateNewStartDate(dropPosition);
    const newEndDate = calculateNewEndDate(newStartDate, item);
    onEventUpdate(item.id, newStartDate, newEndDate);
  };

  const handleEventUpdate = (id, newStartDate, newEndDate) => {
    setEvents((prevEvents) =>
      prevEvents.map((item) =>
        item.id === id
          ? {
              ...item,
              start: formatDate(newStartDate),
              end: formatDate(newEndDate),
            }
          : item
      )
    );
  };

  const updateItemDate = (id, newStartDate) => {
    setItems(items.map((item) => (item.id === id ? { ...item, start: newStartDate } : item)));
  };

  const sortedItems = useMemo(() => {
    const sortedItems = items.sort((a, b) => new Date(a.start) - new Date(b.start));
    const lanes = [];

    sortedItems.forEach((item) => {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        if (new Date(lanes[i].end) < new Date(item.start)) {
          lanes[i] = item;
          item.lane = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        item.lane = lanes.length;
        lanes.push(item);
      }
    });

    return sortedItems;
  }, [items]);

  const a = sortedItems.map((item) => {
    return `id: ${item.id}, lane: ${item.lane}`;
  });

  return (
    <div className="timeline-container">
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <div className="timeline" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {sortedItems.map((item) => {
          if (item.id === 5) console.log('🚀 ~ Timeline ~ item', item);
          return (
            <div
              className="timeline-event"
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              style={{
                gridRow: item.lane + 1,
                left: calculatePosition(item.start, zoomLevel),
                width: calculateWidth(item.start, item.end, zoomLevel),
              }}
            >
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={handleNameChange}
                  onBlur={() => handleNameBlur(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameBlur(item.id)}
                />
              ) : (
                <span className="event-name" onClick={() => handleNameClick(item.id, item.name)}>
                  {item.id}
                </span>
              )}
              <div
                className="event-bar"
                style={{
                  width: calculateWidth(item.start, item.end, zoomLevel),
                  backgroundColor: getColor(item.id),
                }}
              >
                {/* <div
                  title={item.start}
                  className="resize-handle start"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'start')}
                >
                  {item.start}
                </div>
                <div
                  title={item.end}
                  className="resize-handle end"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'end')}
                >
                  {item.end}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
