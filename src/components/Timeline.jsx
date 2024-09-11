import { useState } from "react";

const Timeline = ({ events }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [items, setItems] = useState(events);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleZoomIn = () => setZoomLevel(zoomLevel * 1.2);
  const handleZoomOut = () => setZoomLevel(zoomLevel / 1.2);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDrop = (e) => {
    const id = e.dataTransfer.getData("id");
    const newStartDate = calculateNewDate(e.clientX, zoomLevel);
    updateItemDate(id, newStartDate);
  };

  const updateItemDate = (id, newStartDate) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, start: newStartDate } : item
      )
    );
  };

  const handleNameClick = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleNameChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleNameBlur = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name: editingName } : item
      )
    );
    setEditingId(null);
  };

  const handleResizeStart = (e, id, type) => {
    e.preventDefault();
    const initialX = e.clientX;
    const item = items.find((item) => item.id === id);
    const initialDate =
      type === "start" ? new Date(item.start) : new Date(item.end);

    const onMouseMove = (e) => {
      const diffInPixels = e.clientX - initialX;
      const diffInDays = diffInPixels / (10 * zoomLevel);
      const newDate = new Date(initialDate);
      newDate.setDate(initialDate.getDate() + diffInDays);

      setItems(
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                [type]: newDate.toISOString().split("T")[0],
              }
            : item
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const sortedItems = [...items].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );
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

  return (
    <div className="timeline-container">
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <div
        className="timeline"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
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
                onKeyDown={(e) => e.key === "Enter" && handleNameBlur(item.id)}
              />
            ) : (
              <span
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
              }}
            >
              <div
                className="resize-handle start"
                onMouseDown={(e) => handleResizeStart(e, item.id, "start")}
              ></div>
              <div
                className="resize-handle end"
                onMouseDown={(e) => handleResizeStart(e, item.id, "end")}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const calculatePosition = (startDate, zoomLevel) => {
  const baseDate = new Date("2021-01-01");
  const eventStartDate = new Date(startDate);
  const diffInDays = Math.floor(
    (eventStartDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${diffInDays * 10 * zoomLevel}px`;
};

const calculateWidth = (startDate, endDate, zoomLevel) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${diffInDays * 10 * zoomLevel}px`;
};

const calculateNewDate = (dropPosition, zoomLevel) => {
  const baseDate = new Date("2021-01-01");
  const daysPerPixel = 1 / (10 * zoomLevel);
  const daysFromBase = dropPosition * daysPerPixel;
  const newDate = new Date(baseDate);
  newDate.setDate(baseDate.getDate() + daysFromBase);
  return newDate.toISOString().split("T")[0];
};

export default Timeline;
