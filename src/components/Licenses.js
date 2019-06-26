import React, { Component } from 'react';
import { API } from "aws-amplify";
import { Table } from 'tabler-react';
import { Spinner } from 'reactstrap';
import config from '../config';

import LicenseItem from './LicenseItem';

const products = config.products;
const productArray = products.map((product) => {
  if (product.visible) {
    return product.name;
  } else {
  	return null;
  }
});

export default class Licenses extends Component {

	state = {
		isLoading: true,
	  userLicenses: []
	}

	async componentDidMount() {
	  try {
	    const userLicenses = await this.getLicenses();
	    this.setState({ userLicenses });
	  } catch (e) {
	    alert(e);
	  }
	  this.setState({ isLoading: false });
	}

	getLicenses() {
	  return API.get("edvardgig", "/licenses");
	}

	render () {

		if (this.state.isLoading) {
			return (
				<div>
					<Spinner type="grow" color="dark" />
				</div>
			);
		}

		const licenses = this.state.userLicenses;

		return (
			<Table
			  responsive
			  hasOutline
			  verticalAlign="center"
			  cards
			  className="text-nowrap"
			>
			  <Table.Header>
			    <Table.Row>
			      <Table.ColHeader alignContent="left">Product</Table.ColHeader>
			      <Table.ColHeader>Type</Table.ColHeader>
			      <Table.ColHeader>Status</Table.ColHeader>
			      <Table.ColHeader alignContent="center">Added</Table.ColHeader>
			      <Table.ColHeader alignContent="right">Actions</Table.ColHeader>
			    </Table.Row>
			  </Table.Header>
			  <Table.Body>

			  	{
			  		productArray.map((product, count) => {

			  			if (!product) {
			  				return null;
			  			}

			  			let type = "no";
			  			let daysLeft = 0;
			  			let currentNumberOfRegistrations = 0;
			  			let maxRegistrations = 0;
			  			let createdAt = null;

			  			for (var i = 0; i < licenses.length; i++) {
			  				if (licenses[i].product === product) {
			  					type = licenses[i].type;
			  					daysLeft = (licenses[i].daysLeft || 0);
			  					currentNumberOfRegistrations = (licenses[i].currentNumberOfRegistrations || 0);
			  					maxRegistrations = (licenses[i].maxRegistrations || 0);
			  					createdAt = (licenses[i].createdAt || null);
			  					break;
			  				}
			  			}

			  			return (
			  				<LicenseItem key={count} license={{product, type, daysLeft, currentNumberOfRegistrations, maxRegistrations, createdAt}} />
			  			);
			  		})
			  	}

			  </Table.Body>
			</Table>
		);
	}
}