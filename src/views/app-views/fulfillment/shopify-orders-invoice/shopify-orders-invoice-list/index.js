import React, { useState, useEffect } from 'react'
import { message, Card, Table, Switch, Select, Input, Button, Tooltip, Modal, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import utils from 'utils'
import Enumerable from "linq";
import { connect } from 'react-redux';
import Loading from "components/shared-components/Loading";
import { ZoomInOutlined, FileDoneOutlined } from '@ant-design/icons';
import {
	loadUser,
	getInvoices,
	getInvoice,
	generateInvoices
} from "../../../../../redux/actions";




const ShopifyOrdersInvoiceList = props => {
	let history = useHistory();
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	const [invoice, setInvoice] = useState({
		_id: "",
		dateCreate: "",
		ownerId: "",
		shopifyId: "",
		ourOrderId: "",
		products: []
	})
	const {
		invoices,
		authUser,
		getInvoices,
		getInvoice,
		generateInvoices
	} = props;
	useEffect(() => {
		if (authUser.user != null) {
			getInvoices(authUser.user._id);
		}
	}, [authUser.user === null, invoices.invoices.length === 0]);
	// useEffect(() => {
	// 	setInvoice(invoices.invoice)
	// 	if (invoices.invoice != null) {
	// 		history.push(`/app/fulfillment/shopify-orders-invoice-detail/${invoices.invoice._id}`)
	// 	}
	// }, [invoices.invoice]);
	useEffect(() => {
		if (invoices.invoices.length > 0) {
			setList(invoices.invoices)
		}
	}, [invoices.invoices.length === 0]);


	const dataTableColumns = [
		{
			title: 'Invoice No',
			dataIndex: 'index',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'index')
		},
		{
			title: 'Created Date',
			dataIndex: 'dateCreate',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'dateCreate')
		},
		{
			title: '',
			dataIndex: '_id',
			render: (_, elm) => (
				<div className="text-right">
					<Button
						type="primary"
						icon={<ZoomInOutlined />}
						size={"small"}

						onClick={(e) => {
							e.preventDefault();

							getInvoice(elm._id).then(() => { 
								history.push(`/app/fulfillment/shopify-orders-invoice-detail/${elm._id}`)
							})

						}}
					>
						View Detail
						  </Button>
				</div>
			)
		}
	];


	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : invoices.invoices
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
	}

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
					</div>
				</Flex>
				<Tooltip title="Generate Invoice.">
					<Button
						type="primary"
						icon={<FileDoneOutlined />}
						id={"Tooltip-" + "all"}
						loading={loading}
						onClick={(event) => {
							event.preventDefault();
							setLoading(true);
							generateInvoices().then(() => {
								getInvoices(authUser.user._id).then(() => {
									setLoading(false)
								});
							});
						}}
					>
						Generate Invoice
								</Button>
				</Tooltip>
			</Flex>
			<div className="table-responsive">
				{(invoices.loading) ?
					(<Loading />) :
					(<Table
						className="components-table-demo-nested"
						columns={dataTableColumns}
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
		invoices: state.invoices,
		authUser: state.authUser,
	};
};

const mapDispatchToProps = {
	getInvoices: getInvoices,
	getInvoice: getInvoice,
	loadUser: loadUser,
	generateInvoices: generateInvoices
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyOrdersInvoiceList)
