import React, { Component } from "react";
import { API, Storage, Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

import Profile from "../components/Profile";
import Feed from "../components/Feed";

import "./Dashboard.css";

export default class Dashboard extends Component {

  state = {
    isLoading: false,
    profile: null,
    userInfo: null,
  }

  async componentDidMount () {

    this.setState({isLoading: true});

    try {

      const userInfo = await this.getUserInfo();
      let profile = await this.getProfile(userInfo.username);

      console.log(userInfo.attributes.email);

      if (profile.error == "Item not found.") {
        profile = await this.createProfile({
          profileId: userInfo.username,
          displayName: userInfo.attributes.email,
          bio: "We are not rich by what we possess but by what we can do without.",
          profileImage: null,
          profileCover: null
        });
      };

      if (profile.profileImage) {
        profile.profileImageURL = await Storage.get(profile.profileImage, { level: 'protected' });
      }

      if (profile.profileCover) {
        profile.profileCoverURL = await Storage.get(profile.profileCover, { level: 'protected' });
      }

      this.setState({
        profile,
        userInfo,
        isLoading: false
      });

    } catch (e) {
      console.log(e);
      alert(e);
      this.setState({isLoading: false});
    }
  }

  getUserInfo () {
    return Auth.currentUserInfo();
  }

  createProfile (profile) {
    return API.post("skalbare", "/profiles", {
      body: profile
    });
  }

  getProfile (username) {
    return API.get("skalbare", `/profiles/${username}`);
  }

  async updateProfileState (profile) {

    let newProfile = profile;

    newProfile.profileImageURL = this.state.profile.profileImageURL;
    newProfile.profileCoverURL = this.state.profile.profileCoverURL;

    if (newProfile.profileImage !== this.state.profile.profileImage) {
      newProfile.profileImageURL = await Storage.get(newProfile.profileImage, { level: 'protected' });
    };

    if (newProfile.profileCover !== this.state.profile.profileCover) {
      newProfile.profileCoverURL = await Storage.get(newProfile.profileCover, { level: 'protected' });
    };

    this.setState({profile: newProfile});

  }

  render() {

    if (this.state.isLoading) {
      return (
        <div 
          className="row justify-content-center"
          style={{marginTop: "40px"}}
        >
          <div className="col-auto">
            <Spinner type="grow" color="dark" />
          </div>
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <Profile userInfo={this.state.userInfo} profile={this.state.profile} updateProfileState={profile => this.updateProfileState(profile, this)} />
        <Feed profile={this.state.profile} />
      </div>
    );
  }
}
