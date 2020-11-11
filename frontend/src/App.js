import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from './Login'
import Logout from './Logout'
import Register from './Register'
import Account from './Account'
import Projects from './Projects'
import Tasks from './Tasks'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/logout" exact>
          <Logout />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/">
          <Account>
            <Switch>
              <Route path="/projects" exact>
                <Projects />
              </Route>
              <Route path="/projects/:projectId/tasks" exact>
                <Tasks />
              </Route>
              <Redirect to="/projects" />
            </Switch>
          </Account>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
