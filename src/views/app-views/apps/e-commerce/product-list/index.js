import React, {useState, useEffect} from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Modal, notification } from 'antd';
import ProductListData from "assets/data/product-list.data.json"
import { EyeOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined,SmileOutlined} from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import { useHistory } from "react-router-dom";
import utils from 'utils'
import {getProducts, deleteProduct,refershProducts,getShops} from 'redux/actions';
import { connect } from 'react-redux';
import Loading from 'components/shared-components/Loading';

const { confirm } = Modal;
const { Option } = Select

const getStockStatus = stockCount => {
	if(stockCount >= 50) {
		return <><Badge status="success" /><span>In Stock</span></>
	}
	if(stockCount < 50 && stockCount > 0) {
		return <><Badge status="warning" /><span>Limited Stock</span></>
	}
	if(stockCount === 0) {
		return <><Badge status="error" /><span>Out of Stock</span></>
	}
	return null
}

const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']

const ProductList = props => {
	let history = useHistory();
	const [list, setList] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const { products, getProducts, deleteProduct } = props;
	
	useEffect(() => {

		if (props.selectedShop){
			getProducts(props.selectedShop.id)
		}
		else {
			if (props.authUser.user.isAdmin || props.authUser.user.roles.includes("WAREHOUSE")){
				getProducts(1)
			}else{
				openNotification()
			}
			
		}
		if (!products.loading){
			setList(products.products.products)
		}
		

	  },[products.loading]);
const openNotification = () => {
		notification.open({
		  message: 'Select a store',
		  description:
			'Please add a store in the setting tab  and come back to this page',
		  icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		});
	  };
function showDeleteConfirm(row) {
		console.log(row)
		confirm({
		  title: 'Are you sure to delete this product?',
		  content: 'Some descriptions',
		  okText: 'Yes',
		  okType: 'danger',
		  cancelText: 'No',
		  onOk() {
			deleteRow(row)
		  },
		  onCancel() {
			console.log('Cancel');
		  },
		});
	  }
	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => viewDetails(row)}>
				<Flex alignItems="center">
					<EyeOutlined />
					<span className="ml-2">View Details</span>
				</Flex>
			</Menu.Item>
			{/* <Menu.Item onClick={() => showDeleteConfirm(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
				</Flex>
			</Menu.Item> */}
		</Menu>
	);
	
	const addProduct = () => {
		props.refershProducts(props.shops.selectedShop.id).then(()=>{
			getProducts(props.shops.selectedShop.id)
		})
	}
	
	const viewDetails = row => {
		history.push(`/app/apps/ecommerce/edit-product/${row._id}`)
	}
	
	const deleteRow = row => {
		const objKey = '_id'
		let data = list
		if(selectedRows.length > 1) {
			selectedRows.forEach(elm => {
				data = utils.deleteArrayRow(data, objKey, elm._id)
				deleteProduct(elm._id)
				setList(data)
				setSelectedRows([])
			})
		} else {
			data = utils.deleteArrayRow(data, objKey, row._id)
			deleteProduct(row._id)
			setList(data)
		}
	}

	const tableColumns = [
		{
			title: 'Product',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={60} type="square" src={record.images} name={record.name}/>
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Price',
			dataIndex: props.authUser.user.roles.includes("WAREHOUSE")?("whPrice"):("price"),
			render: price => (
				<div>
					<NumberFormat
						displayType={'text'} 
						value={(Math.round(price * 100) / 100).toFixed(2)} 
						prefix={'$'} 
						thousandSeparator={true} 
					/>
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
		},
		{
			title: 'Stock',
			dataIndex: 'quantity',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'quantity')
		},
		{
			title: 'Status',
			dataIndex: 'quantity',
			render: stock => (
				<Flex alignItems="center">{getStockStatus(stock)}</Flex>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
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
	
	const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : ProductListData
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}

	const handleShowCategory = value => {
		if(value !== 'All') {
			const key = 'category'
			const data = utils.filterArray(ProductListData, key, value)
			setList(data)
		} else {
			setList(ProductListData)
		}
	}

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
				</Flex>
				<div>
					{props.authUser.user.roles.includes("WAREHOUSE")?(null):(props.authUser.user.isAdmin  || props.selectedShop.fetchedProducts==="yes"?(null):(
					<Button onClick={addProduct} type="primary" icon={<PlusCircleOutlined />} block>Referesh Products</Button>))}
					
				</div>
			</Flex>
			<div className="table-responsive">
				
					<Table 
					columns={tableColumns} 
					dataSource={products.products.products} 
					rowKey='id'
					pagination={{ pageSize: 50 }}
				
				/>
				
				
			</div>
		</Card>
	)
}

const mapStateToProps = (state) => {
	return {
		products: state.products,
		shops:state.shops,
		selectedShop:state.shops.selectedShop,
		authUser:state.authUser,
		
	  };
  };
  
  const mapDispatchToProps = {
	getProducts,refershProducts,
	deleteProduct,getShops
}

export default connect(mapStateToProps,mapDispatchToProps) (ProductList)
