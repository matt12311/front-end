import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Menu, notification } from 'antd';
import { EyeOutlined, SearchOutlined,SmileOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import utils from 'utils'
import { connect } from 'react-redux';
import {
	getRequestProducts
} from "../../../../../redux/actions";
import Moment from 'moment';
import Loading from 'components/shared-components/Loading';




const RequestProductList = props => {
	let history = useHistory();
	const [list, setList] = useState([])
	const [selected, setSelected] = useState([])

	const {requestProducts, getRequestProducts ,authUser,shops} = props;
	useEffect(() => {
		if (shops.selectedShop){
			getRequestProducts(1,shops.selectedShop.name,0)
			if (!requestProducts.loading) {
				setList(requestProducts.requestProducts.products)
			}
		}
		else {
			if (authUser.user.isAdmin || authUser.user.roles.includes("WAREHOUSE")){
				getRequestProducts(1,"noname",1)
				if (!requestProducts.loading) {
					setList(requestProducts.requestProducts.products)
				}
			}else {
				openNotification()
			}
			
		}
	}, [list.length!=0]);

	const openNotification = () => {
		notification.open({
		  message: 'Select a store',
		  description:
			'Please add a store in the setting tab  and come back to this page',
		  icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		});
	  };/* const updateUserActiveChange = (isActive, userId) => {
		updateUserActive(userId, { isActive: isActive }).then(() => {
			loadAllRequestProducts();
		});
	}; */
	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => viewDetails(row)}>
				<Flex alignItems="center">
					<EyeOutlined />
					<span className="ml-2">View Details</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const viewDetails = row => {
		history.push(`/app/apps/ecommerce/edit-request-product/${row._id}`)
	}


	const tableColumns = [
		{
			title: 'Product name',
			dataIndex: 'productName',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'productName')
		},
		{
			title: 'Created By',
			dataIndex: authUser.user.roles.includes("WAREHOUSE")?(null):"createdBy",
			sorter: (a, b) => utils.antdTableSorter(a, b, 'createdBy')
		},
		{
			title: 'Shop Name',
			dataIndex: authUser.user.roles.includes("WAREHOUSE")?(null):"shopName",
			sorter: (a, b) => utils.antdTableSorter(a, b, 'shopName')
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)} />
					
				</div>
			)
		}
	];

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : requestProducts
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
			</Flex>
			<div className="table-responsive">
				{requestProducts.loading?(
					<Loading/>
				):(
					<Table
						columns={tableColumns}
						dataSource={requestProducts.requestProducts.products}
						rowKey='id' 
					/>
				)}
			</div>
		</Card>
	)
}

const mapStateToProps = (state) => {
	return {
		requestProducts: state.requestProducts,
		authUser:state.authUser,
		shops:state.shops
	};
};

const mapDispatchToProps = {
	getRequestProducts:getRequestProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestProductList)