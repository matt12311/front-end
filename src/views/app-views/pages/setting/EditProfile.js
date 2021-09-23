import React, { Component } from 'react';
import { Form, Avatar, Button, Input, DatePicker, Row, Col, message, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import Flex from 'components/shared-components/Flex';
import { connect } from "react-redux";
import {
	loadUser,
	getShops,
	addShop,
	updateShop,
	deleteShop,
	createVaUser,
	loadVaUsers,
	deleteVaUser,
	updateVaUser,
	updateUser,
  } from "../../../../redux/actions";
  import moment from 'moment';

  const dateFormat = 'YYYY/MM/DD';
export class EditProfile extends Component {

	avatarEndpoint = 'https://www.mocky.io/v2/5cc8019d300000980a055e76'

	state= {
		avatarUrl: '',
		name: '',
		email: '',
		userName: '',
		dateOfBirth: '',
		phoneNumber: '',
		website: '',
		address: '',
		city: '',
		postcode: ''
	}

	getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}
	render() {
		const onFinish = values => {
			const key = 'updatable';
			message.loading({ content: 'Updating...', key });
			setTimeout(() => {
				this.setState({
					name: values.name,
					email: values.email,
					userName: values.userName,
					dateOfBirth: values.dateOfBirth,
					phoneNumber: values.phoneNumber,
					website: values.website,
					address: values.address,
					city: values.city,
					postcode: values.postcode,
				})
				message.success({ content: 'Done!', key, duration: 2 });
			}, 1000);
		};
	
		const onFinishFailed = errorInfo => {
			console.log('Failed:', errorInfo);
		};

		const onUploadAavater = info => {
			const key = 'updatable';
			if (info.file.status === 'uploading') {
				message.loading({ content: 'Uploading...', key, duration: 1000 });
				return;
			}
			if (info.file.status === 'done') {
				this.getBase64(info.file.originFileObj, imageUrl =>
					this.setState({
						avatarUrl: imageUrl,
					}),
				);
				message.success({ content: 'Uploaded!', key,  duration: 1.5 });
			}
		};

		const onRemoveAvater = () => {
			this.setState({
				avatarUrl: ''
			})
		}

		const { firstName,lastName, email, userName, birthday, phone, address } = this.props.authUser.user;

		return (
			<>
				<Flex alignItems="center" mobileFlex={false} className="text-center text-md-left">
					{/* <Avatar size={90} src={""} icon={<UserOutlined />}/>
					<div className="ml-3 mt-md-0 mt-3">
						<Upload onChange={onUploadAavater} showUploadList={false} action={this.avatarEndpoint}>
							<Button type="primary">Change Avatar</Button>
						</Upload>
						<Button className="ml-2" onClick={onRemoveAvater}>Remove</Button>
					</div> */}
				</Flex>
				<div className="mt-4">
					<Form
						name="basicInformation"
						layout="vertical"
						initialValues={
							{ 
								'firstName': firstName ,
								'email': email,
								'lastName': lastName,
								'dateOfBirth': moment(birthday, dateFormat),
								'phoneNumber': phone,
								'country': address.country,
								'address': address.streetName,
								'city': address.city,
								'postcode': address.zipCode
							}
						}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
					>
						<Row>
							<Col xs={24} sm={24} md={24} lg={16}>
								<Row gutter={ROW_GUTTER}>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="First Name"
											name="firstName"
											rules={[
												{
													required: true,
													message: 'Please input your name!',
												},
											]}
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Last Name"
											name="lastName"
											rules={[
												{
													required: true,
													message: 'Please input your username!'
												},
											]}
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Email"
											name="email"
											rules={[{ 
												required: true,
												type: 'email',
												message: 'Please enter a valid email!' 
											}]}
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Date of Birth"
											name="dateOfBirth"
										>
											<DatePicker className="w-100" onChange={(e)=>{
												console.log(e)
											}}/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Phone Number"
											name="phoneNumber"
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Country"
											name="country"
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											label="Address"
											name="address"
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="City"
											name="city"
										>
											<Input />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											label="Post code"
											name="postcode"
										>
											<Input />
										</Form.Item>
									</Col>
								</Row>
								<Button type="primary" htmlType="submit">
									Save Change
								</Button>
							</Col>
						</Row>
					</Form>
				</div>
			</>
		)
	}
}

function mapStateToProps(state) {
	return {
	  authUser: state.authUser,
	  shops: state.shops,
	  vaUsers: state.vaUsers,
	};
  }

const matchDispatchToProps = {
	loadUser,
	getShops,
	addShop,
	updateShop,
	deleteShop,
	createVaUser,
	loadVaUsers,
	deleteVaUser,
	updateVaUser,
	updateUser,
  };

export default connect(mapStateToProps, matchDispatchToProps)(EditProfile)
