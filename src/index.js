import { render } from 'react-dom';
import './index.css';
import { useState } from 'react';
import Timeline from './components/Timeline';
import timelineItems from './timelineItems';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App = () => {
  const [events, setEvents] = useState(timelineItems);

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

  return <Timeline events={events} onEventUpdate={handleEventUpdate} />;
};

render(<App />, document.getElementById('root'));
