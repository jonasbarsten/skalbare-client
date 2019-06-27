import React, { Component } from 'react';
import { API, Storage, Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import { Container, Row, Col, Button } from 'reactstrap';

import './Profile.css';

export default class Profile extends Component {
  state = {
    isLoading: null,
    isDeleting: null,
    profile: null,
    bio: "",
    profileImageURL: null,
    file: null,
    userInfo: null
  };

	async componentDidMount () {
	  try {

	  	let profileImageURL;
	  	const userInfo = await this.getUserInfo();
	    let profile = await this.getProfile(userInfo.username);

	    if (profile.error == "Item not found.") {
	    	profile = await this.createProfile({
	    	  profileId: userInfo.username,
	    	  bio: "We are not rich by what we possess but by what we can do without.",
	    	  profileImage: null
	    	});
	    };

	    const { bio, profileImage } = profile;

	    if (profileImage) {
	      profileImageURL = await Storage.vault.get(profileImage);
	    }

	    this.setState({
	      profile,
	      bio,
	      profileImageURL,
	      userInfo
	    });
	  } catch (e) {
	  	console.log(e);
	    alert(e);
	  }
	}

	getUserInfo () {
	  return Auth.currentUserInfo();
	}

	createProfile(profile) {
    return API.post("skalbare", "/profiles", {
      body: profile
    });
  }

	getProfile (username) {
    return API.get("skalbare", `/profiles/${username}`);
  }

 saveProfile (profile) {
    return API.put("skalbare", `/profiles/${this.state.userInfo.username}`, {
      body: profile
    });
  }

	profileImageClick () {
		this.refs.profileImage.click();
	}

	handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

	handleFileChange = event => {
    this.state.file = event.target.files[0];
  }

  updateProfile = async () => {
  	let profileImage;

  	if (this.state.file && this.state.file.size > config.MAX_ATTACHMENT_SIZE) {
  	  alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
  	  return;
  	}

  	this.setState({ isLoading: true });

  	try {
  	  if (this.state.file) {
  	    profileImage = await s3Upload(this.state.file);
  	  }

  	  const test = profileImage || this.state.profile.profileImage;

  	  await this.saveProfile({
  	    bio: this.state.bio,
  	    profileImage: profileImage || this.state.profile.profileImage
  	  });
  	  // this.props.history.push("/");
  	  this.setState({ isLoading: false });
  	} catch (e) {
  	  alert(e);
  	  this.setState({ isLoading: false });
  	}
  }

	render() {

		const profileImageURL = this.state.profileImageURL || "cat.jpg";

		return (
			<div className="Profile">
				<div className="row justify-content-center">
				  <div className="col-auto">
				    <img 
				    	src={profileImageURL}
				    	onClick={this.profileImageClick.bind(this)}
				    />
				    <input 
				    	type="file"
				    	ref="profileImage"
				    	style={{display: "none"}}
				    	onChange={this.handleFileChange}
				    />
				  </div>
				</div>
				<br />
				<Row>
					<Col>
						<h4>Hvem er jeg?</h4>
					</Col>
				</Row>
				<Row>
				  <Col>
			  	  <textarea
			  	  	id="bio"
			  	  	onChange={this.handleChange}
			  	    value={this.state.bio}
			  	  />
				  </Col>
				</Row>
				<LoaderButton
					block
					bsstyle="primary"
					bssize="large"
					onClick={this.updateProfile}
					// disabled={!this.validateForm()}
					// type="submit"
					isLoading={this.state.isLoading}
					text="Lagre"
					loadingText="Lagrer..."
				/>
			</div>
		);
	}
}