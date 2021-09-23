/* eslint-disable no-unused-vars */
import React, {useState,useEffect} from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, notification } from 'antd';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined ,SmileOutlined} from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import moment from 'moment'; 
import { DATE_FORMAT_DD_MM_YYYY_HH_mm } from 'constants/DateConstant'
import {getInvoices, getInvoice,refershProducts,getShops} from 'redux/actions';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import utils from 'utils'

const { Option } = Select

const getPaymentStatus = status => {
	if(status === 'complete') {
		return 'success'
	}
	if(status === 'pendingsettlement') {
		return 'warning'
	}
	if(status === 'failed') {
		return 'error'
	}
	return ''
}

const getShippingStatus = status => {
	if(status === 'Ready') {
		return 'blue'
	}
	if(status === 'Shipped') {
		return 'cyan'
	}
	return ''
}

const paymentStatusList = ['Paid', 'Pending', 'Expired']

const Orders = props => {
	let history = useHistory();

	const [list, setList] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const { invoices } = props;

	useEffect(() => {
		if (props.authUser.user != null && !props.authUser.user.isAdmin && props.methods.methods ) {
			if(props.methods.methods.length>0)
			props.getInvoices(props.methods.methods[0].vaultID)
		}
		if (props.authUser.user.isAdmin || props.authUser.user.roles.includes("ADMIN")){
			props.getInvoices(1)
		}
		
		if (!invoices.loading){
			setList()
		}
		

	},[invoices.loading]);

	const handleShowStatus = value => {
		props.getInvoices(value)
	}
	const openNotification = () => {
		notification.open({
		  message: 'Select a store',
		  description:
			'Please add a store in the setting tab  and come back to this page',
		  icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		});
	  };

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => {
					viewDetails(row)
					

			}}>
				<Flex alignItems="center" >
					<EyeOutlined />
					<span className="ml-2">View Details</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const tableColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (_, record) => (
				<span>{record.first_name} {record.last_name}</span>
			)
		},
		{
			title: 'ID',
			dataIndex: 'transaction_id'
		},
		{
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (

				// moment("record.date").format('YYYYMMDDHHMMSS')
				<span>{moment(record.date,'YYYYMMDDHHmmss').format(DATE_FORMAT_DD_MM_YYYY_HH_mm)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
		},
		{
			title: 'Payment status',
			dataIndex: 'condition',
			render: (_, record) => (
				<><Badge status={getPaymentStatus(record.condition)} /><span>{record.condition}</span></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'condition')
		},
		{
			title: 'Total',
			dataIndex: 'amount',
			render: (_, record) => (
				<span className="font-weight-semibold">
					<NumberFormat
						displayType={'text'} 
						value={(Math.round(record.amount * 100) / 100).toFixed(2)} 
						prefix={'$'} 
						thousandSeparator={true} 
					/>
				</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
				</div>
			)
		}
	];

	const viewDetails = row => {
		
		history.push({pathname:`/app/pages/invoice/${row.transaction_id}`, state: {
			data: row,
		  },})
	}
	
	const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					{props.authUser.user.isAdmin ||  props.authUser.user.roles.includes("ADMIN")?(null):(<div className="mb-3">
						<Select 
							defaultValue="All" 
							className="w-100" 
							style={{ minWidth: 300 }} 
							onChange={handleShowStatus} 
							placeholder="Status"
						>
							<Option value="All">Select the payment method </Option>
							{props.methods.methods.map(elm => <Option key={elm._id} value={elm.vaultID}>{elm.endings}</Option>)}
						</Select>
					</div>)}
					
				</Flex>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={invoices.invoices.transactions?(invoices.invoices.transactions.filter(i =>  !['6487563232', "6487555608","6487553193" ].includes(i.transaction_id))):(null)} 
					rowKey={record=>record.transaction_id}
				/>
			</div>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		invoices: state.invoices,
		shops:state.shops,
		methods:state.methods,
		selectedShop:state.shops.selectedShop,
		authUser:state.authUser,
		
	  };
  };
  
  const mapDispatchToProps = {
	getInvoice,refershProducts,
	getInvoices,getShops
}


export default  connect(mapStateToProps,mapDispatchToProps) (Orders)
