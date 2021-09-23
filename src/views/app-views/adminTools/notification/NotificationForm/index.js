import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
	Form,
	Input,
	Button,
	Row,
	Col,
	Card,
	message,
	Select,
	DatePicker,
	TimePicker
} from 'antd';
import Flex from 'components/shared-components/Flex'
import { connect } from "react-redux";
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from "../../../../../helpers/EditorToolbar";
import {
	getUsers,
	addNotification,
	getNotifications
} from "../../../../../redux/actions"; 



const { Option } = Select;

const NotificationForm = props => {

	let history = useHistory();
	const { param, addNotification, getUsers, authUser } = props

	const [form] = Form.useForm();
	const [submitLoading, setSubmitLoading] = useState(false)
	const [description, setDescription] = useState("")

	useEffect(() => {
		getUsers();
	}, [form, param, props]);

	const handleChange = html => {
		setDescription(html);
	}
	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			let userIdsModel = [];
			if (values.audienceToNotify.find((x) => x == -1)) {
				authUser.users.map(function (item, index) {
					userIdsModel.push(item._id);
				})
			} else {
				values.audienceToNotify.map(function (item, index) {
					userIdsModel.push(item)
				})
			}
			let body = {
				title: values.title,
				description: description,
				startingDate: values.startingDate,
				repetitionHour: values.repetitionHour,
				endingDate: values.endingDate,
				importanceLevel: values.importanceLevel,
				repetitionDay: values.repetitionDay,
				type: "userAdder",
				userIds: userIdsModel
			}
			addNotification(body).then(() => {
				getNotifications(0) 
				history.push(`/app/admin-tools/notification-list`)
				setSubmitLoading(false)
			}); 
		}).catch(info => {
			setSubmitLoading(false)
			message.error('Please enter all required field ');
		});
	};
	let optionUsersArry = []
	optionUsersArry.push({ label: "All User", value: -1, key: -1 });
	authUser.users.map(function (item, index) {
		optionUsersArry.push({ label: item.name, value: item._id, key: index });
	})
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline'],
			['image', 'code-block']
		],
	}
	return (
		<>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{

				}}
				scrollToFirstError
			>
				<PageHeaderAlt className="border-bottom mb-3" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
							<h2 className="mb-3">Add New Notification </h2>
							<div className="mb-3">
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									Add
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<Card>
					<Row>
						<Col span={11}>
							<Form.Item
								name="title"
								label="Title"
								rules={[
									{
										required: true,
										message: 'Please input your Title!',
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={11}>
							<Form.Item
								name="importanceLevel"
								label="Importance Level"
								rules={[
									{
										required: true,
										message: 'Please input your Importance Level!',
									},
								]}
							>
								<Select>
									<Option value="Normal">Normal</Option>
									<Option value="Important">Important</Option>
								</Select>
							</Form.Item>

						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item
								name="audienceToNotify"
								label="Audience To Notify"
								rules={[
									{
										required: true,
										message: 'Please select your Audience To Notify!',
									},
								]}
							>
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									options={optionUsersArry}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={11}>
							<Form.Item
								name="startingDate"
								label="Starting Date"
								rules={[
									{
										required: true,
										message: 'Please input your Starting Date!',
									},
								]}
							>
								<DatePicker
									style={{ width: '100%' }}
									showTime
									format="YYYY-MM-DD HH:mm:ss"
								/>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={11}>
							<Form.Item
								name="endingDate"
								label="Ending Date"
								rules={[
									{
										required: true,
										message: 'Please input your Ending Date!',
									},
								]}
							>
								<DatePicker
									style={{ width: '100%' }}
									showTime
									format="YYYY-MM-DD HH:mm:ss"
								/>
							</Form.Item>

						</Col>
					</Row>
					<Row>
						<Col span={11}>
							<Form.Item
								name="repetitionDay"
								label="Repetition Day"
								rules={[
									{
										required: true,
										message: 'Please input your Repetition Day!',
									},
								]}
							>
								<Select
									style={{ width: '100%' }}
									options={[
										{ label: "No Repeat", value: "No Repeat", key: 0 },
										{ label: "Monday", value: "Monday", key: 1 },
										{ label: "Tuesday", value: "Tuesday", key: 2 },
										{ label: "Wednesday", value: "Wednesday", key: 3 },
										{ label: "Thursday", value: "Thursday", key: 4 },
										{ label: "Friday", value: "Friday", key: 5 },
										{ label: "Saturday", value: "Saturday", key: 6 },
										{ label: "Sunday", value: "Sunday", key: 7 },
										{ label: "Allday", value: "Allday", key: 8 }
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={11}>
							<Form.Item
								name="repetitionHour"
								label="Repetition Hour"
								rules={[
									{
										required: true,
										message: 'Please input your Repetition Hour!',
									},
								]}
							>
								<TimePicker
									style={{ width: '100%' }}
								/>
							</Form.Item>

						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item
								name="description"
								label="Description"
							>
								<EditorToolbar />
								<ReactQuill
									theme="snow"
									placeholder={"Write something awesome..."}
									modules={modules}
									formats={formats}
									onChange={handleChange}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Card>
			</Form>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		authUser: state.authUser,
		notifications: state.notifications
	};
};

const mapDispatchToProps = {
	addNotification: addNotification,
	getUsers: getUsers,
	getNotifications: getNotifications
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationForm)
