import React, { useState, useEffect } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Modal } from 'antd'; 
import {  DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons'; 
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex' 
import { useHistory } from "react-router-dom";
import utils from 'utils'
import { connect } from 'react-redux';
import {
	loadUser,
	getUsers,
	getNotifications,
	addNotification,
	updateNotification,
	deleteNotification
} from "../../../../../redux/actions";

const { confirm } = Modal; 



const NotificationList = props => {
	let history = useHistory();
	const [list, setList] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const { notifications, getNotifications, deleteNotification } = props;
	useEffect(() => { 
		getNotifications(0) 
		if (!notifications.loading) {
			setList(notifications.notifications)
		} 
	}, [notifications.loading,notifications.notifications==null]);
	function showDeleteConfirm(row) {
		confirm({
			title: 'Are you sure to delete this notification?', 
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteRow(row);
			},
			onCancel() {
			},
		});
	}
	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => showDeleteConfirm(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const addNotification = () => {
		history.push(`/app/admin-tools/add-notification`)
	}

	const deleteRow = row => {
		const objKey = '_id'
		let data = list
		if (selectedRows.length > 1) {
			selectedRows.forEach(elm => {
				data = utils.deleteArrayRow(data, objKey, elm._id)
				deleteNotification(elm._id)
				setList(data)
				setSelectedRows([])
			})
		} else {
			data = utils.deleteArrayRow(data, objKey, row._id)
			deleteNotification(row._id)
			setList(data)
		}
	}

	const tableColumns = [
		{
			title: 'Title',
			dataIndex: 'title',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'title')
		},
		{
			title: 'Importance Level',
			dataIndex: 'importanceLevel',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'importanceLevel')
		},
		{
			title: 'Repetition Day',
			dataIndex: 'repetitionDay',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'repetitionDay')
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

	const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = notifications.notifications
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}


	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
					</div>
				</Flex>
				<div>
					<Button onClick={addNotification} type="primary" icon={<PlusCircleOutlined />} block>Add Notification</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table
					columns={tableColumns}
					dataSource={list}
					rowKey='id' 
				/>
			</div>
		</Card>
	)
}

const mapStateToProps = (state) => {
	return {
		authUser: state.authUser,
		notifications: state.notifications
	};
};

const mapDispatchToProps = {
	getNotifications: getNotifications,
	addNotification: addNotification,
	updateNotification: updateNotification,
	deleteNotification: deleteNotification,
	loadUser: loadUser,
	getUsers: getUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList)
