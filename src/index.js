import { render } from 'react-dom';
import timelineItems from './timelineItems';
import './index.css';
import Timeline from './components/Timeline';

const App = () => <Timeline events={timelineItems.slice(0, 4)} />;

render(<App />, document.getElementById('root'));
