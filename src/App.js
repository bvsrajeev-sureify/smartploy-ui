import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrimaryAppBar from "./components/PrimaryAppBar";
import ProjectsList from "./pages/ProjectList";
import TaskList from "./pages/TaskList";

function App() {

  return (
    <Router>
      <PrimaryAppBar />
      <Switch>
        <Redirect exact from="/" to="/projects" />
        <Route path="/projects">
          <ProjectsList />
        </Route>
        <Route path="/tasks">
            <TaskList />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
