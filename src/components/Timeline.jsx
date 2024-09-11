import { useMemo } from 'react';
import useZoom from '../hooks/useZoom';
import useEvents from '../hooks/useEvents';
import { calculatePosition, calculateWidth, getColor } from '../utils';
import useDraggable from '../hooks/useDraggable';
import { useAppContext } from '../context/AppContext';

const Timeline = ({ events, onEventUpdate }) => {
  const { zoomLevel } = useAppContext();
  const { handleZoomIn, handleZoomOut } = useZoom(1);

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

  const { handleDragStart, handleDrop } = useDraggable(onEventUpdate);

  return (
    <div className="timeline-container">
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <div className="timeline" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {sortedItems.map((item) => {
          return (
            <div
              className="timeline-event grabbable"
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
                <span
                  title={`ID: ${item.id}`}
                  className="event-name"
                  onClick={() => handleNameClick(item.id, item.name)}
                >
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
                  className="resize-handle start tooltip"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'start')}
                >
                  <span className="tooltip-text">{item.start}</span>
                </div>
                <div
                  title={item.end}
                  className="resize-handle end tooltip"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'end')}
                >
                  <span className="tooltip-text">{item.end}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
