import { render } from "react-dom";
import Timeline from "./components/Timeline";
import timelineItems from "./timelineItems";
import "./index.css";

const App = () => <Timeline events={timelineItems} />;

render(<App />, document.getElementById("root"));
