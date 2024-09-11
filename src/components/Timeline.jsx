import { useMemo } from 'react';
import useZoom from '../hooks/useZoom';
import useEvents from '../hooks/useEvents';

const Timeline = ({ events }) => {
  const { zoomLevel, setZoomLevel, handleZoomIn, handleZoomOut } = useZoom(2);

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

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('id', id);
  };

  const handleDrop = (e) => {
    const id = e.dataTransfer.getData('id');
    const newStartDate = calculateNewDate(e.clientX, zoomLevel);
    updateItemDate(id, newStartDate);
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
  console.log('🚀 ~ sortedItems.forEach ~ sortedItems:', sortedItems);

  return (
    <div className="timeline-container">
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <div className="timeline" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {sortedItems.map((item) => (
          <div
            className="timeline-event"
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
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
                {item.name}
              </span>
            )}
            <div
              className="event-bar"
              style={{
                width: calculateWidth(item.start, item.end, zoomLevel),
                backgroundColor: getColor(item.id),
              }}
            >
              <div
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
