import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const useEvents = (initialItems) => {
  const { zoomLevel } = useAppContext();

  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleNameClick = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleNameChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleNameBlur = (id) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name: editingName } : item)));
    setEditingId(null);
  };

  const handleResizeStart = (e, id, type) => {
    e.preventDefault();
    const initialX = e.clientX;
    const item = items.find((item) => item.id === id);
    const initialDate = type === 'start' ? new Date(item.start) : new Date(item.end);

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
                [type]: newDate.toISOString().split('T')[0],
              }
            : item
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    items,
    setItems,
    editingId,
    editingName,
    handleNameClick,
    handleNameChange,
    handleNameBlur,
    handleResizeStart,
  };
};

export default useEvents;
