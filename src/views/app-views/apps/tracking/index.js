import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Tag, Avatar, Divider, Row, Timeline, Col, Modal, Form, Input, notification, TimePicker, Button, Tooltip, Table } from 'antd';
import moment from 'moment';
import { connect } from "react-redux";
import { getTracking } from "redux/actions";
import { Scrollbars } from 'react-custom-scrollbars';

import {
	loadUser,
	getShops,
	getReportsByShop,
	getOrders,
} from "../../../../redux/actions";
import Loading from "components/shared-components/Loading";
import utils from "utils";
import DataDisplayWidget from 'components/shared-components/DataDisplayWidget';
import {
	HddOutlined,
	SendOutlined,
	ClockCircleOutlined,
	ArrowUpOutlined,
	CrownOutlined,
	RocketOutlined,
	LoadingOutlined,
	SmileOutlined
} from '@ant-design/icons';

const tableColumns = [
	{
		title: "Customer",
		dataIndex: "name",
		key: "name",
		render: (text, record) => (
			<div className="d-flex align-items-center">
				<Avatar
					size={30}
					className="font-size-sm"
					style={{ backgroundColor: record.avatarColor }}
				>
					{utils.getNameInitial(text)}
				</Avatar>
				<span className="ml-2">{text}</span>
			</div>
		),
	},
	{
		title: "Date",
		dataIndex: "date",
		key: "date",
	},
	{
		title: "Amount",
		dataIndex: "amount",
		key: "amount",
	},
	{
		title: () => <div className="text-right">Risk</div>,
		key: "status",
		render: (_, record) => (
			<div className="text-right">
				<Tag
					className="mr-0"
					color={
						record.status === "CANCEL"
							? "cyan"
							: record.status === "LOW"
								? "blue"
								: "green"
					}
				>
					{record.status}
				</Tag>
			</div>
		),
	},
];
const Tracking = (props) => {
	const [trackingNumber, settrackingNumber] = useState(''); 
	const [oldTrack, setOldTrack] = useState(''); 
	const [list, setList] = useState([])


	const { authUser, shops, reportOrders, getShops,getReportsByShop, orders } = props;
	useEffect(() => {
		if (shops.shops.length != 0 && reportOrders.length == null) {
			if (shops.shops.shops[0]) { 
				getOrders(shops.selectedShop.id,"closed");
			}
		}
		if (shops.shops.length != 0 && orders.orders.length === 0) {
			loadAllOrders();
		}
		
	}, [
		authUser.user === null,
		shops.shops.length === 0,
		reportOrders.length == null,
	])
	function callApi() {
		setOldTrack(trackingNumber)
		props.getTracking(trackingNumber)
	}
	useEffect(() => {
		if (orders.orders.length > 0) {
			setList(orders.orders.orders);
			console.log(orders.orders)
		} 
	}, [orders.orders.length === 0]);
	const dataTableColumns = [
		 
		{
			title: 'Order #',
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Customer',
			dataIndex: 'shipping_address.first_name',
			render: (_, elm) => (
				<div className="text-left">
					{elm.shipping_address.first_name} {elm.shipping_address.last_name}
				</div>
			)
		},
		{
			title: 'Country',
			dataIndex: 'shipping_address.country',
			render: (_, elm) => (
				<div className="text-left">
					{elm.shipping_address.country}
				</div>
			)
		},
		{
			title: 'Tracking #',
			dataIndex: 'fulfillment[0].tracking_number',
			render: (_, elm) => (
				
				<div className="text-left">
					
					{elm.fulfillments[0]?(elm.fulfillments[0].tracking_number):("no tracking")}
				</div>
			)
		},
		// {
		// 	title: 'Order Risks',
		// 	key: 'orderRisks',
		// 	dataIndex: 'orderRisks',
		// 	render: orderRisks => (
		// 		<span>
		// 			{orderRisks.map(orderRisk => {
		// 				let color = 'green';
		// 				let textName="LOW";
		// 				if (orderRisk.recommendation === 'investigate') {
		// 					color = 'geekblue';
		// 					textName="MEDIUM";
		// 				}
		// 				if (orderRisk.recommendation === 'cancel') {
		// 					color = 'volcano';
		// 					textName="HIGH";
		// 				}
		// 				return (
		// 					<Tag color={color} key={orderRisk.id}>
		// 						{textName}
		// 					</Tag>
		// 				);
		// 			})}
		// 		</span>
		// 	),
		// },
		{
			title: '',
			dataIndex: 'id',
			render: (_, elm) => (
				<div className="text-right">
					{/* <Button
							type="primary"
							icon={<RocketOutlined />}
							size={"small"}

							onClick={(e) => {
								e.preventDefault();
								settrackingNumber(elm.fulfillments[0].tracking_number)
								callApi()
							}}
						>
							Tracking
					</Button>
						  &nbsp;&nbsp; */}
					<Button type="primary" onClick={() => openInNewTab('https://'+props.selectedShop.name+'/admin/orders/'+elm.id)}>View in shopify</Button>
				</div>
			)
		}
	];
	const openInNewTab = (url) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}
	const loadAllOrders = (value) => {
		if (shops.selectedShop) {
			getOrders(shops.selectedShop.id,"closed"); 
		} 
	}
	const openNotification = () => {
		notification.open({
		  message: 'Select a store',
		  description:
			'Please add a store in the setting tab  and come back to this page',
		  icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		});
	  };
	return (

		<>
			<Row gutter={24}>
				<Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
					<DataDisplayWidget
						icon={<HddOutlined />}
						value="0"
						title="Fulfilled"
						color="pink"
						vertical={true}
						avatarSize={55}
					/>
				</Col>
				<Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
					<DataDisplayWidget
						icon={<SendOutlined />}
						value="0"
						title="Shipped"
						color="gold"
						vertical={true}
						avatarSize={55}
					/>
				</Col>
				<Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
					<DataDisplayWidget
						icon={<LoadingOutlined />}
						value="0"
						title="In transit"
						color="gold"
						vertical={true}
						avatarSize={55}
					/>
				</Col>
				<Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
					<DataDisplayWidget
						icon={<CrownOutlined />}
						value="0"
						title="Delivered"
						color="cyan"
						vertical={true}
						avatarSize={55}
					/>
				</Col>
			</Row>
			<Card title="Please Input a Tracking Number">
				<Input placeholder="Tracking Number" onChange={(e) => {
					e.preventDefault()
					settrackingNumber(e.target.value)
				}} />
				
				<div style={{ marginTop: 20 }}>
				<Button type="primary" block onClick={(e) => {
					e.preventDefault()
					callApi()
				}}>
					Get Status
    				</Button>
				</div>
	
				{/* <Divider>Status</Divider> */}

				<div style={{ marginTop: 40 }}>
				<Timeline mode={"left"}>
					{!props.tracking.loading && props.tracking.status != null && props.tracking.status.trackingNumber===oldTrack  ? (
						props.tracking.status.actions.map((item, index) => {
						return <Timeline.Item key={index} style={{fontWeight:"bold"}} dot={item.slice(20, item.length).includes("Out for Delivery")?(<ClockCircleOutlined style={{ fontSize: '16px', fontWeight:"bold" }} />):(<ArrowUpOutlined style={{ fontSize: '16px' }} />)} label={item.slice(0, 20)}> {item.charAt(21).toUpperCase()}{item.slice(22, item.length)}</Timeline.Item>
						})
					) : (
						oldTrack===''?(null):(<>
						<Divider>Please wait while retrieving the tracking data</Divider> 

						<Loading></Loading>

						</>)
							
						)}
				</Timeline>
				</div>

			</Card>
			{props.authUser.user.roles.includes("WAREHOUSE")?(null):(<Row gutter={24}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Latest Fulfillments">
						{reportOrders.length == null ? (
							<Loading />
						) : (
							
							<Table
							rowKey={record=>record.id}
							className="components-table-demo-nested"
							columns={dataTableColumns}
							dataSource={list}
							pagination={{ pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true }}
	
						/>
							)}
					</Card>
				</Col>
			</Row>)}
			
		</>
	)

}






const mapStateToProps = (state) => {
	return {
		reportOrders: state.orders.reportOrders,
		authUser: state.authUser,
		shops: state.shops, 
		selectedShop: state.shops.selectedShop, 
		tracking: state.tracking,
		orders: state.ourOrder,
		

	};
};

const mapDispatchToProps = {
	getReportsByShop,
	getShops,
	loadUser, 
	getTracking,
	getOrders
};


export default connect(mapStateToProps, mapDispatchToProps)(Tracking)

