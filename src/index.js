import { render } from 'react-dom';
import { useState } from 'react';
import './index.css';
import Timeline from './components/Timeline';
import timelineItems from './timelineItems';
import { formatDate } from './utils';

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
