import React, { useState, useEffect } from 'react'
import { message, Card, Table, Switch, Select, Tag, Input, Button, Divider,Timeline, Modal, Tabs,notification, Spin, Alert } from 'antd';
import { SearchOutlined, PlusCircleOutlined,SmileOutlined,RocketOutlined,CopyOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import Enumerable from "linq";
import { connect } from 'react-redux';
import Loading from "components/shared-components/Loading";
import { ZoomInOutlined } from '@ant-design/icons';
import {
	loadUser,
	getOrders,
	addOurOrder,
	getShops,
	getOrder,
	getTracking,
	clearTracking,
	draftOrder


} from "../../../../../redux/actions";




const { TabPane } = Tabs;
const { confirm } = Modal;

const ShopifyOrdersList = props => {
	const [list, setList] = useState([])
	const [selected, setSelected] = useState({})
	const [selecteds, setSelecteds] = useState([])
	const [selectedOption, setSelectedOption] = useState({})
	const [order, setOrder] = useState({
		id: "",
		email: "",
		number: "",
		line_items: [],
		shipping_lines: [],
		shipping_address: {
			first_name: "",
			address1: "",
			phone: "",
			city: "",
			zip: "",
			province: "",
			country: "",
			last_name: "",
			address2: "",
			company: "",
			name: "",
			country_code: "",
			province_code: ""
		}
	})

	const {
		orders,
		authUser,
		shops,
		getOrders,
		draftOrder,
		getShops,
		clearTracking
	} = props;
	const [trackingModal, settrackingModal] = useState(false);
	const [date, setDate] = useState(new Date());
	const [timer, setTimer] = useState();
	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		  }, 500);
		  setTimer(timer);
		if (shops.shops.length != 0) {
			loadAllOrders();
		}
	  
		  return () => {
			clearInterval(timer);
		  };

		
	}, []); 
	// useEffect(() => {
	// 	setOrder(orders.order)
	// 	if (orders.order != null) {
	// 		setVisible(true)
	// 		setOrderModalTitle(orders.order.id)
	// 	}
	// }, [orders.order]); 
	useEffect(() => {
		if (orders.orders.length > 0) {
			setList(orders.orders.orders);
			
		} 
	}, [orders.orders]);

	const openNotification = () => {
		notification.open({
		  message: 'Select a store',
		  description:
			'Please add a store in the setting tab  and come back to this page',
		  icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		});
	  };

	const loadAllOrders = (value) => {
		setSelected({});
		setSelecteds([]);
		if (shops.selectedShop) {
			getOrders(shops.selectedShop.id,"closed"); 
		} else {
			openNotification()
		}
	}
	const openInNewTab = (url) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}
	const handleTOk = e => {
		settrackingModal(false)
		clearTracking()
	};

	const handleTCancel = e => {
		settrackingModal(false)
		clearTracking()
	};

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
					<Button
							type="primary"
							icon={<RocketOutlined />}
							size={"small"}

							onClick={(e) => {
								e.preventDefault();
								props.getTracking(elm.fulfillments[0].tracking_number)
								settrackingModal(true)
							}}
						>
							Tracking
					</Button>
						  &nbsp;&nbsp;
					<Button onClick={() => openInNewTab('https://'+props.selectedShop.name+'/admin/orders/'+elm.id)}>View in shopify</Button>
				</div>
			)
		}
	];
	

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = orders.orders.orders
		const data = searchArray.filter(item => {
			return value === '' ? item : String(item.order_number).includes(value)
		})
		// const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}
	const expandedRowRender = record => {
		const dataTableProductColumns = [
			{
				title: 'Title',
				dataIndex: 'title',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'quantity')
			},
			{
				title: 'Price',
				dataIndex: 'price',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'price'),
				render: (_, elm) => (
					elm.price
				)
			},
			, {
				title: '',
				dataIndex: 'shopifyOrderId',
				render: (_, elm) => (
					<div className="text-right">
						<Button
							type="primary"
							icon={<CopyOutlined />}
							size={"small"}

							onClick={(e) => {
								e.preventDefault();
								confirm({
									title: 'This will create a draft order to fulfill, please confirm?',
									okText: 'Yes',
									okType: 'danger',
									cancelText: 'No',
									onOk() {
										draftOrder({
											shopId: elm.shopId,
											shopifyOrderId: elm.shopifyOrderId,
											shopifyProductId: elm.shopifyProductId
										});
									},
									onCancel() {
									},
								});
							}}
						>
							Draft Order
						  </Button>
					</div>
				)
			}
		];

		let data = [];
		list.filter(x => x.name === record.name).map((dat) => {
			dat.line_items.map((y) => {
				data.push({ key: dat.id, ...y })
			})
		})
		return <Table columns={dataTableProductColumns} dataSource={data} pagination={false} rowKey={record=>record.name} />;
	};

	return (
		
		<Card>
			<Modal
				visible={trackingModal}
				width={600}
				onOk={handleTOk}
				onCancel={handleTCancel}
			>
				<Card title="Tracking Details">
		
		<Divider>Status</Divider>

		
	
		<Timeline mode={"left"}>
			{!props.tracking.loading && props.tracking.status!=null ?(
				props.tracking.status.actions.map((item,index)=>{
					return <Timeline.Item key={index} label={item.slice(0,20)}>{item.slice(20,item.length)}</Timeline.Item>
				})
			):(
				<Spin size="large">
				<Alert
				message="Retrieving Details"
				description="This process can take up to 20 seconds, thank you for your patience"
				/>
				</Spin>
			)}
      </Timeline>
    </Card>

			</Modal>
			
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
					</div>
					{/* <div className="mr-md-3 mb-3">
						{(shops.shops.length===0||!shops.shops.shops[0])?"":<Select
							defaultValue={shops.shops.shops[0]._id}
							style={{ width: 220 }}
							options={shops.shops.shops.map((shop, i) => {
								 return { label: shop.name, value: shop._id, key: i };
							})}
							onChange={loadAllOrders}
						/>}
						
					</div> */}
				</Flex>

			</Flex>
			<div className="table-responsive"> 
				{(orders.loading&&list.length!=0) ?
					(<Loading />) :
					(<Table
						rowKey={record=>record.id}
						className="components-table-demo-nested"
						columns={dataTableColumns}
						expandable={{ expandedRowRender }}
						dataSource={list}
						pagination={{ pageSizeOptions: ['50', '100', '150', '200'], showSizeChanger: true }}

					/>)
				}

			</div>
		</Card >
	)
}

const mapStateToProps = (state) => {
	return {
		orders: state.ourOrder,
		authUser: state.authUser,
		shops: state.shops,
		selectedShop: state.shops.selectedShop,
		tracking:state.tracking
	};
};

const mapDispatchToProps = {
	getOrders: getOrders,
	addOurOrder: addOurOrder,
	getShops: getShops,
	loadUser: loadUser,
	getOrder: getOrder,
	getTracking:getTracking,
	clearTracking:clearTracking,
	draftOrder:draftOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyOrdersList)
