import React, { Component } from 'react'
import { PrinterOutlined } from '@ant-design/icons';
import { Card, Table, Button } from 'antd';
import { invoiceData } from './invoiceData';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import {getInvoices, getInvoice,refershProducts,getShops} from 'redux/actions';
import moment from 'moment'; 
import { DATE_FORMAT_DD_MM_YYYY_HH_mm } from 'constants/DateConstant'
const { Column } = Table;

export class Invoice extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.state = {
		  data:{}
		};
	  }
	  
	componentDidMount(){
		this.props.getInvoice(this.props.location.state.data.transaction_id)
	}

	total() {
		if (this.props.invoice){
			let total = 0;
		this.props.invoice.items.forEach((elm) => {
			total += elm.price*elm.quantity;
			
		})
		return total

	}else {
		return 0
	}
		
	}

	render() {
		return (
            <div className="container">
				<Card>
					<div className="d-md-flex justify-content-md-between">
						<div>
							<img src="/img/Logo_PNG.png" alt=""/>
							<address>
								<p>
									<span className="font-weight-semibold text-dark font-size-md">Fulfilling, Inc.</span><br />
									<span>499 Everina St Apt 329</span><br />
									<span>W Palm Beach, FL 33401</span><br />
									<abbr className="text-dark" title="Phone">Phone:</abbr>
									<span> +1 (561) 601-0348</span>
								</p>
							</address>
						</div>
						<div className="mt-3 text-right">
							<h2 className="mb-1 font-weight-semibold">Invoice #{this.props.location.state.data.transaction_id.substring(5)}</h2>
							<p>{moment(this.props.location.state.data.date,'YYYYMMDDHHmmss').format(DATE_FORMAT_DD_MM_YYYY_HH_mm)}</p>
							<address>
								<p>
									<span className="font-weight-semibold text-dark font-size-md">{this.props.location.state.data.first_name} {this.props.location.state.data.last_name} [{this.props.invoice?(this.props.invoice.shopName):(null)}]</span><br />
									<span>{this.props.location.state.data.address} </span><br />
									<span>{this.props.location.state.data.city}, {this.props.location.state.data.state}, {this.props.location.state.data.country}, {this.props.location.state.data.postal_code}</span>
								</p>
							</address>
						</div>
					</div>
											

					<div className="mt-4">
					{this.props.invoice?(<Table dataSource={this.props.invoice.items} pagination={false} className="mb-5" rowKey={obj => obj._id}>
							<Column title="Product" dataIndex="variant" key="variant"/>
							<Column title="Quantity" dataIndex="quantity" key="quantity"/>
							<Column title="Price" 
								render={(text) => (
									<NumberFormat 
										displayType={'text'} 
										value={(Math.round(text.price * 100) / 100).toFixed(2)} 
										prefix={'$'} 
										thousandSeparator={true}
									/>
								)} 
								key="price"
							/>
							<Column 
								title="Total" 
								render={(text) => (
									<NumberFormat 
										displayType={'text'} 
										value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)} 
										prefix={'$'} 
										thousandSeparator={true}
									/>
								)} 
								key="total"
							/>
						</Table>):(null)}
						
						<p className="mt-5">
							<small>
							This invoice for the transaction {this.props.location.state.data.transaction_id} which shows the status {this.props.location.state.data.condition}. The credit card used for this transcation is a {this.props.location.state.data.cc_type} with {this.props.location.state.data.cc_number} number and expiration date of {this.props.location.state.data.cc_exp}.
							{this.props.invoice?(` The products listed above are soled by the shopify store called ${this.props.invoice.shopName}.`):(null)}
							</small>
						</p>
						<div className="d-flex justify-content-end">
							<div className="text-right ">
								<div className="border-bottom">
									<p className="mb-2">
										<span>Sub - Total amount: </span>
										<NumberFormat 
											displayType={'text'} 
											value={(Math.round((this.total()) * 100) / 100).toFixed(2)} 
											prefix={'$'} 
											thousandSeparator={true}
										/>
									</p>
									<p>fees (3%) : {(Math.round(((this.total()/ 100) * 3 ) * 100) / 100).toFixed(2)}</p>
								</div>
								<h2 className="font-weight-semibold mt-3">
									<span className="mr-1">Grand Total: </span>
									<NumberFormat 
										displayType={'text'} 
										value={((Math.round((this.total()) * 100) / 100) + (this.total()/ 100) * 3).toFixed(2)} 
										prefix={'$'} 
										thousandSeparator={true}
									/>
								</h2>
							</div>
						</div>
						<p className="mt-5">
							<small>
							By paying this invoice, the client hereby accepts the terms and conditions outlined by Fulfilling Solutions
LLC. These terms and conditions supersede and take precedence over any and all verbal or written
arrangements in connection with this invoice. Unless otherwise specified, the price on this invoice
represents the completed cost of Fulfilling Solutions LLC’s service and is agreed by the buyer.
							</small>
						</p>
					</div>
					<hr className="d-print-none"/>
					<div className="text-right d-print-none">
						<Button type="primary" onClick={() => window.print()}>
							<PrinterOutlined  type="printer" />
							<span className="ml-1">Print</span>
						</Button>
					</div>
				</Card>
			</div>
        );
	}
}


const mapStateToProps = (state) => {
	return {
		invoice: state.invoices.invoice,
		shops:state.shops,
		selectedShop:state.shops.selectedShop,
		authUser:state.authUser,
		
	  };
  };
  
  const mapDispatchToProps = {
	getInvoice,refershProducts,
	getInvoices,getShops
}


export default connect(mapStateToProps,mapDispatchToProps)(Invoice)
