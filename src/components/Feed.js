import React, { Component } from 'react';
import LoaderButton from "../components/LoaderButton";
import { Row, Col, Button } from 'reactstrap';

import './Feed.css';

export default class Feed extends Component {

	state = {
		postText: ""
	}

	addPost () {
		console.log('posting');
	}

	handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

	render() {

		return (
			<div className="Feed">
				<div className="row">
					<main className="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
						<div className="ui-block">
							<div className="news-feed-form">
								<div className="tab-content">
									<div className="tab-pane active" id="home-1" role="tabpanel" aria-expanded="true">
										<form>
											<div className="author-thumb">
												<img style={{width: "36px", height: "36px"}}src={this.props.profile && this.props.profile.profileImageURL} alt="author" />
											</div>
											<div className="form-group with-icon label-floating is-empty">
												<label className="control-label">Hva tenker du på nå?</label>
												<textarea className="form-control" placeholder=""></textarea>
											</div>
											<div className="add-options-message">
												<button className="btn btn-primary btn-md-2">Publiser</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}
}