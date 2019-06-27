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
				<Row>
					<Col>
						<h4>Si noe lurt</h4>
					</Col>
				</Row>
				<Row>
				  <Col>
			  	  <textarea
			  	  	id="postText"
			  	  	onChange={this.handleChange}
			  	    value={this.state.postText}
			  	  />
				  </Col>
				</Row>
				<LoaderButton
					block
					bsstyle="primary"
					bssize="small"
					onClick={this.addPost}
					// disabled={!this.validateForm()}
					// type="submit"
					isLoading={this.state.isLoading}
					text="Publisér"
					loadingText="Publiserer..."
				/>
				<hr />
			</div>
		);
	}
}