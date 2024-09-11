import { render } from 'react-dom';
import { useState, useMemo, useEffect } from 'react';
import { DATE_BASE } from './constants';
import './index.css';
import Timeline from './components/Timeline';
import timelineItems from './timelineItems';
import { formatDate } from './utils';
import { AppContextProvider } from './context/AppContext';

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

  return (
    <AppContextProvider>
      <Timeline events={events} onEventUpdate={handleEventUpdate} />
    </AppContextProvider>
  );
};

render(<App />, document.getElementById('root'));
