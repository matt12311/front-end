import React, { Component } from 'react'
import { PrinterOutlined } from '@ant-design/icons';
import { Card, Table, Button,InputNumber,DatePicker, Select, Input,Col} from 'antd';
import { connect } from "react-redux";

import NumberFormat from 'react-number-format'; 
import Loading from "components/shared-components/Loading";
import {
	getInvoice,
	getContacts
} from "../../../../../redux/actions";

const { Column } = Table;
const { Option } = Select;

export class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = {
		 selectedPerson:null,
		 products:[]
		};
		this.selectShopOwner = this.selectShopOwner.bind(this);
	  }
	componentDidMount() {
		if (this.props.invoices.invoice == null) { 
			this.props.getInvoice(this.props.param.id);
		}		
	}


  
	total() {
		let total = 0;
		this.props.invoices.invoice.products.forEach((elm) => {
			total += elm.price;
		})
		console.log(this.props.invoices.invoice.products)
		return total
	}
	selectDate(date, dateString) {
		
		console.log(date, dateString);
	}
	selectShopOwner(e){
		this.props.shopOwners.map(elm=>{
			if (elm._id===e){
				this.setState({selectedPerson:elm})
			}
		})
		console.log(this.state.selectedPerson)
	}
	
	render() {
		return (
			<div className="container">
				{(this.props.invoices.invoice == null) ?
					(<Loading />) :
					(<Card>
						<div className="d-md-flex justify-content-md-between">
							<div>
								<img src="/img/Logo_PNG.png" alt="" />
								<address>
									<p>
										<span className="font-weight-semibold text-dark font-size-md">Fulfilling, co.</span><br />
										<span>9498 Harvard Street</span><br />
										<span>Fairfield, Chicago Town 06824</span><br />
										<abbr className="text-dark" title="Phone">Phone:</abbr>
										<span>(123) 456-7890</span><br /><br />
										<abbr className="text-dark" title="Phone">Memo:</abbr><br />
										<span>This is with regards to </span>
									</p>
								</address>
							</div>
							<div className="mt-3 text-right">
								<h2 className="mb-1 font-weight-semibold">Invoice # <InputNumber></InputNumber></h2>
								<p>Date:     <DatePicker onChange={this.selectDate} /></p>
								<address>
								{this.props.authUser.user.isAdmin?(
									<Select     placeholder="Select a shop owner"
									onChange={this.selectShopOwner}
									>
										{
											this.props.shopOwners.map(elm => (
												<Option value={elm._id} key={elm._id}>
													<span className="text-capitalize font-weight-semibold">{elm.name}</span>
												</Option>
											))
										}
									</Select>
								):(
									null
								)}
									{this.state.selectedPerson?(
											<p>
											<span>{this.state.selectedPerson.address.streetName}</span><br />
											<span>{this.state.selectedPerson.address.city}, {this.state.selectedPerson.address.province} {this.state.selectedPerson.address.zipCode}</span><br />
											<span>{this.state.selectedPerson.address.country}</span>
										</p>
									):(null)}
								
								</address>
							</div>
						</div>
						<div className="mt-4">
							<Table dataSource={this.state.products} pagination={false} className="mb-5" footer={() => <>
								<Input.Group>
									<Col span={2} style={{
											marginLeft:"16%"
										}}>
								<Input placeholder="Name" onChange={e=>{
									console.log(e.target.value)
									this.setState({nameNew:e.target.value})
								}} ></Input>
		          				</Col>
								<InputNumber placeholder="Quantity" onChange={e=>{
									this.setState({quantityNew:e})
								}} style={{
										marginLeft:"12%"
										}}></InputNumber>
								<InputNumber placeholder="Price" onChange={e=>{
									this.setState({priceNew:e})
								}}style={{
									marginLeft:"18%"
								}}></InputNumber>
		  <Button style={{	
							marginLeft:"10%"
						}} onClick={e=>{
							e.preventDefault()
							var data=[]
							data.push({name:this.state.nameNew,
										quantity:this.state.quantityNew,
										price:this.state.priceNew,
										index:this.state.products.length
									})
							this.setState({products:this.state.products.concat(data)})
						}}> Add</Button>
		</Input.Group>
		  					
								
								</>
							}>
								<Column title="No." dataIndex="index" key="index" />
								<Column title="Name" dataIndex="name" key="name" />
								<Column title="Quantity" dataIndex="quantity" key="quantity" />
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
								>
									</Column>
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
								
							</Table>
							<div className="d-flex justify-content-end">
								<div className="text-right ">
									<div className="border-bottom">
										<p className="mb-2">
											<span>Sub - Total amount: </span>
											<NumberFormat
												displayType={'text'}
												value={100}
												prefix={'$'}
												thousandSeparator={true}
											/>
										</p>
										<p>vat (10%) : 10</p>
									</div>
									<h2 className="font-weight-semibold mt-3">
										<span className="mr-1">Grand Total: </span>
										<NumberFormat
											displayType={'text'}
											value={110}
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
						<hr className="d-print-none" />
						<div className="text-right d-print-none">
						<Button type="primary" onClick={() => window.print()}>
								<PrinterOutlined type="printer" />
								<span className="ml-1">Save</span>
							</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={() => window.print()}>
								<PrinterOutlined type="printer" />
								<span className="ml-1">Charge</span>
							</Button> &nbsp;&nbsp;
							<Button type="primary" onClick={() => window.print()}>
								<PrinterOutlined type="printer" />
								<span className="ml-1">Print</span>
							</Button>
							
						</div>
					</Card>
					)
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		invoices: state.invoices,
		authUser:state.authUser,
		shopOwners:state.chatApp.allContacts
	};
}
const matchDispatchToProps = {
	getInvoice: getInvoice,
	getContacts:getContacts,
};

export default connect(mapStateToProps, matchDispatchToProps)(Invoice)
