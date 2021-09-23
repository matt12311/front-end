import React, { useState, useEffect } from 'react'
import { message, Card, Table, Switch, Select, Tag, Input, Button, Descriptions, Modal, Tabs, Row, Col,notification } from 'antd';
import { SearchOutlined, PlusCircleOutlined,SmileOutlined } from '@ant-design/icons';
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
	getTracking
} from "../../../../../redux/actions";




const { TabPane } = Tabs;
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
	const [visible, setVisible] = useState(false);

	const [orderModalTitle, setOrderModalTitle] = useState("")
	const {
		orders,
		authUser,
		shops,
		getOrders,
		addOurOrder,
		getShops,
		getOrder
	} = props;
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
		setOrder(orders.order)
		if (orders.order != null) {
			setOrderModalTitle(orders.order.id)
		}
	}, [orders.order]); 
	useEffect(() => {
		if (orders.orders.length > 0) {
			setList(orders.orders.orders);
			console.log(orders.orders)
		} 
	}, [orders.orders.length === 0]);



	const saveProducts = () => {

		if (selecteds.length <= 0) {
			message.error('you must choose at least one order.');

			return;
		}

		setList([]);
		loadAllOrders();
		selecteds.map((selected, i) => {
			let shopifyOrder = Enumerable.from(orders.orders).where(i => i.id == selected.id).toArray();
			if (shopifyOrder.length > 0) {
				shopifyOrder = shopifyOrder[0];
				let postProducts = [];
				shopifyOrder.line_items.map((lineItem, indexLineItems) => {
					let selectedProduct = postProducts.filter(x => x.name == lineItem.name)[0];
					if (selectedProduct) {
						selectedProduct.quantity = selectedProduct.quantity + lineItem.quantity;
					} else {
						postProducts.push({
							name: lineItem.name,
							sku: lineItem.sku,
							quantity: lineItem.quantity,
							shopifyId: lineItem.product_id,
							price: lineItem.price,
							title: lineItem.title,
							variant: lineItem.variant_title,
							tracking: "not shipped",
							shopId: shopifyOrder.shopId,
							shopifyOrderId: String(shopifyOrder.id),
							shopifyProductId: String(lineItem.id)
						})
					}
					if (indexLineItems + 1 === shopifyOrder.line_items.length) {
						addOurOrder({
							shopifyId: String(shopifyOrder.id),
							shopId: shopifyOrder.shopId,
							ownerId: authUser.user._id,
							paymentStatus: "not paid",
							product: postProducts
						});
					}
				});


			}
		});
	}
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
			getOrders(shops.selectedShop.id,"unshipped",shops.selectedShop.startingOrder); 
		} else {
			openNotification()
		}
	}
	const openInNewTab = (url) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}
	const dataTableColumns = [
		 
		{
			title: 'Order #',
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
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
			title: '# of Items',
			dataIndex: 'line_items.length',
			render: (_, elm) => (
				<div className="text-left">
					{elm.line_items.length}
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
					<Button onClick={() => openInNewTab('https://'+props.selectedShop.name+'/admin/orders/'+elm.id)}>View in shopify</Button>
				</div>
			)
		}
	];
	

	const onSearch = e => {
		const value = e.currentTarget.value
		if(value.length==1){
			const searchArray = orders.orders.orders
			if (list.length==0){
				console.log("sasda")
				setList(searchArray)
			}
			

		}
		if(value.length==0){
			orders.orders.orders=list
		}
		console.log(value)
		orders.orders.orders = orders.orders.orders.filter(item => {
			return value === '' ? item : String(item.order_number).includes(value)
		})
		// const data = utils.wildCardSearch(searchArray, value)
	}

	const expandedRowRender = record => {
		const dataTableProductColumns = [
			{
				title: 'Sku',
				dataIndex: 'sku',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'sku')
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'quantity')
			},
			{
				title: 'Price',
				dataIndex: 'price',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
			},
			{
				title: '',
				dataIndex: 'shopifyOrderId',
				render: (_, elm) => (
					<div className="text-right">
						<Button
							type="primary"
							icon={<ZoomInOutlined />}
							size={"small"}

							onClick={(e) => {
								e.preventDefault(); 
								setVisible(true) 
								getOrder(elm.shopifyOrderId, props.selectedShop.id) 
							}}
						>
							View Detail
						  </Button>
						 
					</div>
				)
			}
		];
		let data = [];
		list.filter(x => x.name === record.name).map((dat) => {
			dat.line_items.map((y) => {
				data.push({ key: dat.id, shopifyOrderId: dat.id, shopId: dat.shopId, ...y })
			})
		})
		return <Table rowKey={record=>record.name} columns={dataTableProductColumns} dataSource={data} pagination={false} />;
	};

	const handleOk = e => {
		setVisible(false)
	};

	const handleCancel = e => {
		setVisible(false)
	};
	return (
		<Card>
			<Modal
				title={` Order : ${orderModalTitle}`}
				visible={visible}
				width={1200}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Tabs defaultActiveKey="1">
					<TabPane tab="General & Shipping Address" key="1">

						{
							(order === null) ? (<></>) : (
								<>
									<Card className="d-flex flex-row mb-3">
										<Descriptions>
											<Descriptions.Item label="Email ">{order.email}</Descriptions.Item>
											<Descriptions.Item label="Number ">{order.number}</Descriptions.Item>
											<Descriptions.Item label="Code ">{order.code}</Descriptions.Item>
										</Descriptions>
									</Card>
									<Card className="d-flex flex-row mb-3">
										<Descriptions title="Shipping Address">
											<Descriptions.Item label="Name ">{order.shipping_address.name}</Descriptions.Item>
											<Descriptions.Item label="First Name ">{order.shipping_address.first_name}</Descriptions.Item>
											<Descriptions.Item label="Last Name ">{order.shipping_address.last_name}</Descriptions.Item>
											<Descriptions.Item label="Phone ">{order.shipping_address.phone}</Descriptions.Item>
											<Descriptions.Item label="Company ">{order.shipping_address.company}</Descriptions.Item>
											<Descriptions.Item label="Address 1  ">{order.shipping_address.address1}</Descriptions.Item>
											<Descriptions.Item label="Address 2 ">{order.shipping_address.address2}</Descriptions.Item>
											<Descriptions.Item label="Country ">{order.shipping_address.country}</Descriptions.Item>
											<Descriptions.Item label="City ">{order.shipping_address.city}</Descriptions.Item>
											<Descriptions.Item label="Province ">{order.shipping_address.province}</Descriptions.Item>
											<Descriptions.Item label="Zip ">{order.shipping_address.zip}</Descriptions.Item>
											<Descriptions.Item label="Country Code ">{order.shipping_address.country_code}</Descriptions.Item>
											<Descriptions.Item label="Province Code ">{order.shipping_address.province_code}</Descriptions.Item>
										</Descriptions>
									</Card>
								</>
							)
						}
					</TabPane>
					<TabPane tab="Line Items" key="2">

						{
							(order === null) ? (<></>) : (
								<Row>
									<Col span={24}>
										{
											order.line_items.map((item) => {
												return (
													<Card className="d-flex flex-row mb-3">
														<Descriptions>
															<Descriptions.Item label="Title ">{item.title}</Descriptions.Item>
															<Descriptions.Item label="Quantity ">{item.quantity}</Descriptions.Item>
															<Descriptions.Item label="Sku ">{item.sku}</Descriptions.Item>
															<Descriptions.Item label="Variant Title ">{item.variant_title}</Descriptions.Item>
															<Descriptions.Item label="Vendor "> {item.vendor} </Descriptions.Item>
															<Descriptions.Item label="Fulfillment Service "> {item.fulfillment_service} </Descriptions.Item>
															<Descriptions.Item label="Name "> {item.name} </Descriptions.Item>
															<Descriptions.Item label="Variant Title "> {item.variant_title} </Descriptions.Item>
															<Descriptions.Item label="Fulfillable Quantity "> {item.fulfillable_quantity} </Descriptions.Item>
															<Descriptions.Item label="Grams "> {item.grams} </Descriptions.Item>
														</Descriptions>
													</Card>
												)
											})
										}
									</Col>
								</Row>

							)

						}

					</TabPane>
					<TabPane tab="Shipping Lines" key="3">
						<Row>
							<Col span={24}>
								{
									(order === null) ? (<></>) : (
										order.shipping_lines.map((item) => {
											return (
												<Card className="d-flex flex-row mb-3">
													<Descriptions>
														<Descriptions.Item label="Title ">{item.title}</Descriptions.Item>
														<Descriptions.Item label="Price ">{item.price}</Descriptions.Item>
														<Descriptions.Item label="Code ">{item.code}</Descriptions.Item>
													</Descriptions>
												</Card>
											)
										})
									)
								}
							</Col>
						</Row>

					</TabPane>
				</Tabs>
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
						dataSource={orders.orders.orders}
						pagination={{ pageSizeOptions: ['50', '100', '150', '200'], showSizeChanger: true }}

					/>)
				}

			</div>
		</Card >
	)
}

const mapStateToProps = (state) => {
	return {
		orders: state.orders,
		ourOrders: state.safeOrders,
		ourOrder: state.ourOrder,
		authUser: state.authUser,
		shops: state.shops,
		selectedShop: state.shops.selectedShop
	};
};

const mapDispatchToProps = {
	getOrders: getOrders,
	addOurOrder: addOurOrder,
	getShops: getShops,
	loadUser: loadUser,
	getOrder: getOrder,
	getTracking:getTracking
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyOrdersList)
