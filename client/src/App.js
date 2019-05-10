import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/MainNavigation";
import AuthContext from "./context/auth-context";
import Drawer from "./components/Drawer";
import Backdrop from "./components/Backdrop";

import "./App.css";

class App extends React.Component {
  state = {
    token: null,
    userId: null,
    drawerOpen: false
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  drawerClickHandler = () => {
    this.setState(prevState => {
      return { drawerOpen: !prevState.drawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({drawerOpen: false});
  };

  render() {
    let backdrop;

    if (this.state.drawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <div className="content-section">
              <MainNavigation drawerClick={this.drawerClickHandler} />
              <Drawer drawerClick={this.drawerClickHandler} show={this.state.drawerOpen} />
              {backdrop}
              <main className="main-content">
                <Switch>
                  {this.state.token && <Redirect from="/" to="/events" exact />}
                  {this.state.token && (
                    <Redirect from="/auth" to="/events" exact />
                  )}
                  {!this.state.token && (
                    <Route path="/auth" component={AuthPage} />
                  )}
                  <Route path="/events" component={EventsPage} />
                  {this.state.token && (
                    <Route path="/bookings" component={BookingsPage} />
                  )}
                  {!this.state.token && <Redirect to="/auth" exact />}
                </Switch>
              </main>
            </div>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
