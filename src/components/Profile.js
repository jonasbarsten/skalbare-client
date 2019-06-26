import React, { Component } from 'react';
import { API, Storage } from "aws-amplify";
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
    bio: "Heihei",
    profileImageURL: null,
    file: null
  };
	// async componentDidMount() {
	//   try {
	//     let profileImageURL;
	//     const profile = await this.getProfile();
	//     const { bio, profileImage } = profile;

	//     if (profileImage) {
	//       profileImageURL = await Storage.vault.get(profileImage);
	//     }

	//     this.setState({
	//       profile,
	//       bio,
	//       profileImageURL
	//     });
	//   } catch (e) {
	//     alert(e);
	//   }
	// }

	// getProfile() {
 //    return API.get("skalbare", `/profiles/${this.props.match.params.id}`);
 //  }

 saveProfile(profile) {
    return API.put("skalbare", `/profiles/${this.props.match.params.id}`, {
      body: profile
    });
  }

	profileImageClick () {
		console.log('Hey');
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

		console.log(this.state);

		return (
			<div className="Profile">
				<div className="row justify-content-center">
				  <div className="col-auto">
				    <img 
				    	src="https://jonasbarsten.com/images/profile.jpg"
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
				<div className="row justify-content-center">
				  <div className="col-auto">
			  	  <textarea
			  	  	id="bio"
			  	  	onChange={this.handleChange}
			  	    value={this.state.bio}
			  	  />
				  </div>
				</div>
				<LoaderButton
					block
					bsstyle="primary"
					bssize="large"
					onClick={this.updateProfile}
					// disabled={!this.validateForm()}
					// type="submit"
					isLoading={this.state.isLoading}
					text="Update"
					loadingText="Saving…"
				/>
			</div>
		);
	}
}