import React, { Component } from "react";
import "./style.css";
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import PostListPage from "../PostListPage";
import RegisterOrLogin from "../RegisterOrLogin"
import AddPostPage from "../AddPostPage";
import DetailPostPage from "../DetailPostPage";
import EditPost from "../EditPost";
import UserProfilePage from "../UserProfilePage";
import AboutPage from "../AboutPage";


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: Boolean(localStorage.getItem('user-jwt')) || false,
    }
  }

  toLoggedIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="nav-buttons">
            <div className="nav-always" >
              <Link to="/"><button className="nav-button">Home</button></Link>
              {/* <Link to="/about-page"><button className="nav-button">About</button></Link> */}
            </div>
            {!this.state.loggedIn && <Link to="/login"><button className="nav-button">Login/Register</button></Link>}
            {this.state.loggedIn && (
              <div className="button-for-loggedin-user">
                <Link to="/add-post"><button className="nav-button">Write Rant</button></Link>
                <Link to="/profile-page"><button className="nav-button">Profile Page</button></Link>
                <button onClick={this.logout} className="nav-button" >Logout</button>
              </div>
            )}
          </div>

          <Route
            exact path="/"
            render={(props) => <PostListPage {...props} loggedIn={this.state.loggedIn} />}
          />

          <Route
            exact path="/login"
            render={(props) => <RegisterOrLogin {...props} toLoggedIn={this.toLoggedIn} />}
          />

          <Route
            exact path="/add-post"
            render={(props) => <AddPostPage {...props} />}
          />

          <Route
            exact path="/detail-post/:id"
            render={(props) => <DetailPostPage {...props} loggedIn={this.state.loggedIn} />}
          />

          <Route
            exact path="/edit-post/:id"
            render={(props) => <EditPost {...props} />}
          />

          <Route
            exact path="/profile-page"
            render={(props) => <UserProfilePage {...props} />}
          />

          <Route
            exact path="/about-page"
            render={(props) => <AboutPage {...props} />}
          />

        </div>
      </Router>
    )
  }
}

export default App;
