import React, { useState, useEffect } from 'react'
import { message, Card, Table, Switch, Select, Input, Button, Descriptions, Tooltip, Modal, Tabs, Row, Col } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import utils from 'utils'
import { connect } from 'react-redux';
import Loading from "components/shared-components/Loading";
import { ZoomInOutlined, CloudDownloadOutlined,CopyOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv";
import Moment from "moment";
import {
	loadUser,
	getAllOurOrder,
	getOrder,
	getOrderForExport,
	draftOrder
} from "redux/actions";




const { TabPane } = Tabs;
const DraftOrdersList = props => {
	let history = useHistory();
	const [list, setList] = useState([])
	const [selected, setSelected] = useState({})
	const [selecteds, setSelecteds] = useState([])
	const [selectedOption, setSelectedOption] = useState({})
	const [orderExport, setOrderExport] = useState([])
	const [lastOrderExportId, setLastOrderExportId] = useState(0)
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
		getAllOrders,
		addOurOrder,
		getShops,
		getOrder,


		getAllOurOrder,
		getOrderForExport,
		ourOrders,
		ourOrder,
		draftOrder
	} = props;
	useEffect(() => {
		if (authUser.user != null) {
			getAllOurOrder();
		}
	}, [authUser.user === null, ourOrder.ourOrders === null]);
	useEffect(() => {
		setOrder(orders.order)
		if (orders.order != null) {
			setVisible(true)
			setOrderModalTitle(orders.order.id)
		}
	}, [orders.order]);
	useEffect(() => {
		if (ourOrder.ourOrders != null && ourOrder.ourOrders.orders.length > 0) {
			setList(ourOrder.ourOrders.orders)
		}
	}, [ourOrder.ourOrders === null]);
	useEffect(() => {
		if (orders.orderExport != null && lastOrderExportId != 0) {
			const orderExportLo = orderExport;
			orderExportLo[lastOrderExportId] = orders.orderExport;
			setOrderExport(orderExportLo);
		}
	}, [lastOrderExportId]);

	const dataTableColumns = [
		{
			title: 'User Name',
			dataIndex: 'userName',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'userName')
		},
		{
			title: 'Shop Name',
			dataIndex: 'shopName',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'shopName')
		},
		{
			title: 'Product Count',
			dataIndex: 'product.length',
			render: (_, elm) => (
				<div className="text-left">
					{elm.product.length}
				</div>
			)
		},
		{
			title: '',
			dataIndex: 'shopifyId',
			render: (_, elm) => (
				<div className="text-right">
					{
						<>
							<Button
								type="primary"
								icon={<ZoomInOutlined />}
								size={"small"}

								onClick={(e) => {
									e.preventDefault();
									getOrder(elm.product[0].shopifyOrderId, elm.shopId)
								}}
							>
								View Detail
						  </Button>
						  &nbsp;&nbsp; 

							{
								orderExport[elm.shopifyId] != null && orderExport[elm.shopifyId].length > 0
									?
									<CSVLink
										filename={`${Moment().format('YYYY-MM-DD_HH:mm:ss')}_orders.csv`}
										separator={";"}
										data={orderExport[elm.shopifyId]}
										asyncOnClick={false}

									>
										Export to CSV ⬇
							  </CSVLink>
									:
									<Tooltip title="No data yet. Click for data.">
										<Button
											type="primary"
											shape="circle"
											icon={<CloudDownloadOutlined />}
											id={"Tooltip-" + elm.shopifyId}
											onClick={(event) => {
												event.preventDefault();
												getOrderForExport(elm.shopifyId, elm.shopId, elm._id);
												setLastOrderExportId(elm.shopifyId)
											}}
										/>
									</Tooltip>

							}
						</>


					}
				</div>
			)
		}
	];


	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = ourOrder.ourOrders.orders
		const data = searchArray.filter(item => {
			return value === '' ? item : String(item.userName).includes(value)
		})
		// const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	const expandedRowRender = record => {
		const dataTableProductColumns = [
			{
				title: 'Sku',
				dataIndex: 'sku',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'sku')
			},
			{
				title: 'Title',
				dataIndex: 'title',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
			},
			{
				title: 'Variant',
				dataIndex: 'variant',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'variant')
			},
			{
				title: 'Price',
				dataIndex: 'price',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'price'),
				render: (_, elm) => (
							elm.price.toFixed(2)
							)
			},
			{
				title: 'Tracking',
				dataIndex: 'tracking',
				sorter: (a, b) => utils.antdTableSorter(a, b, 'tracking')
			}
			,{
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
								draftOrder({
									shopId:elm.shopId,
									shopifyOrderId:elm.shopifyOrderId,
									shopifyProductId:elm.shopifyProductId
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
		list.filter(x => x.key === record.key).map((dat) => {
			dat.product.map((y) => {
				data.push({ key: dat.id, ...y })
			})
		})
		return <Table columns={dataTableProductColumns} dataSource={data} pagination={false} />;
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
				</Flex>
				<div>
					{
						orderExport["all"] != null && orderExport["all"].length > 0
							?
							<CSVLink
								filename={`${Moment().format('YYYY-MM-DD_HH:mm:ss')}_orders.csv`}
								separator={";"}
								data={orderExport["all"]}
								asyncOnClick={false}

							>
								Export to CSV ⬇
                			</CSVLink>
							:
							<Tooltip title="No data yet. Click for data.">
								<Button
									type="primary"
									shape="circle"
									icon={<CloudDownloadOutlined />}
									id={"Tooltip-" + "all"}
									onClick={(event) => {
										event.preventDefault();
										getOrderForExport("all", "all", "all");
										setLastOrderExportId("all")
									}}
								/>
							</Tooltip>
					}
				</div>
			</Flex>
			<div className="table-responsive">
				{(ourOrder.loading) ?
					(<Loading />) :
					(<Table
						className="components-table-demo-nested"
						columns={dataTableColumns}
						expandable={{ expandedRowRender }}
						dataSource={list}
						pagination={{ pageSizeOptions: ['50', '100', '150', '200'], showSizeChanger: true }}

					/>)
				}

			</div>
		</Card>
	)
}

const mapStateToProps = (state) => {
	return {
		ourOrders: state.ourOrders,
		ourOrder: state.ourOrder,
		orders: state.orders,
		authUser: state.authUser
	};
};

const mapDispatchToProps = {
	loadUser: loadUser,
	getAllOurOrder: getAllOurOrder,
	getOrder: getOrder,
	getOrderForExport: getOrderForExport,
	draftOrder:draftOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftOrdersList)
