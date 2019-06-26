import React, { Component } from "react";
import { Link } from "react-router-dom";

import Profile from "../components/Profile";
import Feed from "../components/Feed";

import "./Home.css";

export default class Home extends Component {

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <div>
            {this.props.isAuthenticated ? 
              <div>
                <Profile />
                <hr />
                <Feed />
              </div> : 
              <div className="no-auth">
                <h1>Skal Bare</h1>
                <p>Når du bare skal ...</p>
                <Link to="/login" className="btn btn-info btn-lg">
                  Login
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
