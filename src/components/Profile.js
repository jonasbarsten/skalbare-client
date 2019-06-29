import React, { Component } from 'react';
import { API } from "aws-amplify";
import { s3UploadProtected } from "../libs/awsLib";
import config from "../config";
import { Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './Profile.css';

export default class Profile extends Component {
  state = {
    isLoading: null,
    bio: this.props.profile && this.props.profile.bio,
    profileImageFile: null,
    profileCoverFile: null,
    modal: false
  };

	toggle() {
	  this.setState(prevState => ({
	    modal: !prevState.modal
	  }));
	}

 	saveProfile (profile) {
    return API.put("skalbare", `/profiles/${this.props.userInfo.username}`, {
      body: profile
    });
  }

	profileImageClick () {
		this.refs.profileImage.click();
	}

	profileCoverClick () {
		this.refs.profileCover.click();
	}

	async handleProfileImageFileChange (event) {
    await this.setState({profileImageFile: event.target.files[0]});
    this.updateProfile();
  }

  async handleProfileCoverFileChange (event) {
    await this.setState({profileCoverFile: event.target.files[0]});
    this.updateProfile();
  }

	handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  updateProfile = async () => {
  	let profileImage = this.props.profile.profileImage;
  	let profileCover = this.props.profile.profileCover;

  	console.log(profileCover);

  	this.setState({modal: false});

  	if (this.state.profileImageFile && this.state.profileImageFile.size > config.MAX_ATTACHMENT_SIZE) {
  	  alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
  	  return;
  	};

  	if (this.state.profileCoverFile && this.state.profileCoverFile.size > config.MAX_ATTACHMENT_SIZE) {
  	  alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
  	  return;
  	};

  	this.setState({ isLoading: true });

  	try {
  	  if (this.state.profileImageFile) {
  	    profileImage = await s3UploadProtected(this.state.profileImageFile);
  	    this.setState({profileImageFile: null});
  	  };

  	  if (this.state.profileCoverFile) {
  	    profileCover = await s3UploadProtected(this.state.profileCoverFile);
  	    this.setState({profileCoverFile: null});
  	  };

  	  const newProfile = {
  	  	bio: this.state.bio,
  	  	profileImage: profileImage,
  	  	profileCover: profileCover
  	  }

  	  await this.saveProfile(newProfile);
  	  this.props.updateProfileState(newProfile);

  	  this.setState({ isLoading: false });
  	} catch (e) {
  	  alert(e);
  	  this.setState({ isLoading: false });
  	}
  }

	render() {

		const email = this.props.userInfo && this.props.userInfo.attributes && this.props.userInfo.attributes.email;
		const profileImageURL = this.props.profile && this.props.profile.profileImageURL;
		const profileCoverURL = this.props.profile && this.props.profile.profileCoverURL;

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
			<div className="Profile">
				<div className="row">
					<div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
						<div className="ui-block">
							<div className="top-header">
								<div className="top-header-thumb profile-cover-wrapper" onClick={this.profileCoverClick.bind(this)}>
									<img style={{width: "1920px", height: "640px"}} src={profileCoverURL} />
									<div className="cover-overlay">Endre</div>
									<input 
										type="file"
										ref="profileCover"
										style={{display: "none"}}
										onChange={this.handleProfileCoverFileChange.bind(this)}
									/>
								</div>
								<div className="profile-section"></div>
								<div className="top-header-author">
									<div className="author-thumb profile-image-wrapper" onClick={this.profileImageClick.bind(this)}>
										<img style={{width: "124px", height: "124px"}} src={profileImageURL} />
										<div className="image-overlay">Endre</div>
										<input 
											type="file"
											ref="profileImage"
											style={{display: "none"}}
											onChange={this.handleProfileImageFileChange.bind(this)}
										/>
									</div>
									<div className="author-content">
										<a href="02-ProfilePage.html" className="h4 author-name">{email}</a>
										<div className="country">Personlig assistent</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
						<div className="ui-block">
							<div className="row">
								<div className="ui-block-title">
									<div className="col">
										<h6 className="title">Bio:</h6>
									</div>
									<div className="col">
										<Button onClick={this.toggle.bind(this)}>Rediger</Button>
									</div>
								</div>
							</div>
							<div className="ui-block-content">
								<div className="row">
									<div className="col col-lg-12 col-md-12 col-sm-12 col-12">
										<span className="text">{this.state.bio}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)}>
	        <ModalHeader toggle={this.toggle}>Rediger bio:</ModalHeader>
	        <ModalBody>
	        	<textarea
	        		id="bio"
	        		onChange={this.handleChange}
	        		value={this.state.bio}
	        		style={{width: "100%"}}
	        	/>
	        </ModalBody>
	        <ModalFooter>
	          <Button color="primary" onClick={this.updateProfile}>Lagre</Button>{' '}
	          <Button color="secondary" onClick={this.toggle.bind(this)}>Avbryt</Button>
	        </ModalFooter>
	      </Modal>

			</div>
		);
	}
}