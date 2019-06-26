import React, { Component } from 'react';
import { API, Auth } from "aws-amplify";
import queryString from 'query-string';
import LoaderButton from "../components/LoaderButton";

import './RegisterProduct.css';

export default class RegisterProduct extends Component {

  state = {
    isLoading: false,
    userInfo: null
  }

  componentDidMount() {
    const queryParams = queryString.parse(this.props.location.search);
    console.log(this.props.location.search);
    const test = this.props.location.search.substring(5);
    console.log(test);

    if (!queryParams.key) {
      this.props.history.push("/dashboard");
    };

    this.getUserInfo();
  }

  getUserInfo = async () => {
    try {
      const userInfo = await Auth.currentUserInfo();
      this.setState({userInfo: userInfo});
    } catch (e) {
      alert(e);
    }
  }

  registerProduct(details) {
    console.log(details);
    return API.post("edvardgig", "/licenses/register", {
      body: details
    });
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });

    const userInfo = await Auth.currentUserInfo();

    try {
      await this.registerProduct({
        // queryString treats "+" as spaces, so had to do it like this
        key: `${this.props.location.search.substring(5)}`,
        email: userInfo.attributes.email
      });

      alert("The product has been registered to your account!");
      this.props.history.push("/dashboard");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {

    const email = ((this.state.userInfo && this.state.userInfo.attributes.email) || '');

    // if (this.state.isLoading) {
    //  return (
    //    <div className="RegisterProduct">
    //      <div className="text-center" style={{marginTop: '100px'}}>
    //        <h3>Checking for registrations ...</h3>
    //        <br />
    //        <Spinner type="grow" color="dark" />
    //      </div>
    //    </div>
    //  );
    // }

    return (
      <div className="RegisterProduct">
        <div className="buttonContainer text-center">
          <p>{email}</p>
          <LoaderButton
            block
            isLoading={this.state.isLoading}
            text="Register with current account"
            loadingText="Registering…"
            onClick={this.handleSubmit}
            color="success"
          />
        </div>
      </div>
    );

  }
}