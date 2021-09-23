import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip } from 'antd';
import CalendarData from './CalendarData';
import moment from 'moment';
import { CalendarOutlined, DeleteOutlined} from '@ant-design/icons';
import { connect } from "react-redux";
import{getCalendar,addEvent,deleteEvent,getContacts} from "redux/actions"
import { values } from 'lodash';
const { Option } = Select;
const { TextArea } = Input;

const badgeColors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const initialFormValues = {
	title: '',
	start: moment('00:00:00', 'HH:mm:ss'),
	end: moment('00:00:00', 'HH:mm:ss'),
	bullet: badgeColors[0]
}

const dateFormat = 'YYYY DD MMMM'

const AgendaList = props => {
	const { list, onDelete,authUser } = props
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	const onSelect  = values => {
		var data=values
		authUser.users.map((elm)=>{
			if(elm.calendarID===values.assign){
				data.assign=elm.name
			}
		})
		setSelectedDate(data)
		setModalVisible(true);

	}
	const onAddEventCancel = () => {
		setModalVisible(false)
	}

	return (
		<div>
{selectedDate?(<Modal
      title="View Event"
			visible={modalVisible}
			footer={null}
			destroyOnClose={true}
	  onCancel={onAddEventCancel}
    >
			<Form				
        layout="vertical" 
				name="new-event"
				preserve={false}
				initialValues={{ title: selectedDate.title, description:selectedDate.description, assign:selectedDate.assign }}

				// onFinish={onSubmit}
      >
				<Form.Item name="title" label="Title">
					<Input autoComplete="off" disabled={true}/>
				</Form.Item>
				{authUser.user.isAdmin?(
					<Form.Item name="assign" label="Assign">
					<Input autoComplete="off" disabled={true}/>
					</Form.Item>
				):(
					null
				)
					
				}
				
				<Form.Item name="description" label="Description">
					<TextArea autoComplete="off" disabled={true}/>
				</Form.Item>
			
			</Form>
		</Modal>
		):(null)}


		{list.length==0?(<>
		<CalendarOutlined />
					<span className="ml-2">  No upcoming events</span>
					</>
					):list.map(list => (
			
			
			<div key={list.date} className="calendar-list">
					
				<h4>
					<CalendarOutlined />
					<span className="ml-2">{list.date}</span>
				</h4>
				{
					list.event.map((eventItem, i) => (
						<div key={`${eventItem.title}-${i}`} className="calendar-list-item">
							<div className="d-flex">
								<Badge color={eventItem.bullet}  />
								<div>
									<h5 className="mb-1" onClick={(e)=>{
										e.preventDefault()
										onSelect(eventItem)
									// setModalVisible(true)
								}}>{eventItem.title}</h5>
									<span className="text-muted">{eventItem.start} - {eventItem.end}</span>
								</div>
							</div>
							
									{eventItem.assign==="" && !authUser.user.isAdmin? (
										<div className="calendar-list-item-delete">
										<Tooltip title="Delete event">
												<DeleteOutlined onClick={() => onDelete(list.date, i)}/>
											</Tooltip>
											</div>
									):(
										null
									)
									}
									{authUser.user.isAdmin? (
										<div className="calendar-list-item-delete">
										<Tooltip title="Delete event">
												<DeleteOutlined onClick={() => onDelete(list.date, i)}/>
											</Tooltip>
											</div>
									):(
										null
									)
									}
								
							
						</div>
					))
				}
			</div>
			
		))}
		</div>
	)
}

const EventModal = ({ visible, addEvent, cancel, authUser, allContacts, Case, data }) => {
	const [form] = Form.useForm();
	const onSubmit = values => {
		addEvent(values)
	}

	useEffect(() => {
		

	form.setFieldsValue(initialFormValues);
	});

	return (
		<Modal
      title="New Event"
			visible={visible}
			footer={null}
			destroyOnClose={true}
	  onCancel={cancel}

    >
			<Form
        form={form}
				
        layout="vertical" 
				name="new-event"
				preserve={false}
				onFinish={onSubmit}
      >
				<Form.Item name="title" label="Title">
					<Input autoComplete="off" />
				</Form.Item>
				{authUser.user.isAdmin?(
					<Form.Item name="assign" label="Assign">
					<Select>
						{
							allContacts.map(elm => (
								<Option value={elm.calendarID} key={elm.name}>
									<span className="text-capitalize font-weight-semibold">{elm.firstName} {elm.lastName} </span>
								</Option>
							))
						}
					</Select>
				</Form.Item>
				):(
					null
				)}
				
				<Form.Item name="description" label="Description">
					<TextArea autoComplete="off"/>
				</Form.Item>
				<Row gutter="16">
					<Col span={12} >
						<Form.Item name="start" label="Start">
							<TimePicker className="w-100" />
						</Form.Item>
					</Col>
					<Col span={12} >
						<Form.Item name="end" label="End">
							<TimePicker className="w-100" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="bullet" label="Label">
					<Select>
						{
							badgeColors.map(elm => (
								<Option value={elm} key={elm}>
									<Badge color={elm} />
									<span className="text-capitalize font-weight-semibold">{elm}</span>
								</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item className="text-right mb-0">
					<Button type="primary" htmlType="submit">
						Add Event
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}

const CalendarApp = (props) => {
	const [calendarList, setCalendarList] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	useEffect(()=>{
		let contactL =0
		if (props.authUser.user.isAdmin){
			contactL =1
		}
		props.getContacts(contactL,props.authUser.user._id)
		
		props.getCalendar(props.authUser.user.calendarID)
		if(!props.calendar.loading){
			setCalendarList(props.calendar.calendar.events)
			console.log("here")
		}
	},[calendarList===null,props.calendar.loading===false])
	const cellRender = value => {
		const listData = getListData(value.format((dateFormat)));
		return (
			<ul className="calendar-event">
				{listData.map((item, i) => (
					<li key={`${item.title}-${i}`}>
						<Badge color={item.bullet} text={item.title}/>
					</li>
				))}
			</ul>
		);
	}

	const getListData = (value) => {
		let listData = [];
		calendarList.forEach(elm => {
			if(elm.date === value) {
				listData = elm.event
			}
		})
		return listData;
	}

	const onSelect = value => {
		const selectedDate = value.format((dateFormat))
		setModalVisible(true);
		setSelectedDate(selectedDate)
	}

	const onDeleteEvent = (date, index) => {
		var event;
		const data = calendarList.map(calendarList => {
			if(calendarList.date === date) {
				event=calendarList.event[index]
				calendarList.event = calendarList.event.filter( (_, i) => i !== index)
			}
			return calendarList
		}).filter(elm => elm.event.length !== 0)
		props.deleteEvent(props.authUser.user.calendarID,event,date,event.assign)
		setCalendarList(data)
	}

	const onAddEvent = (values) => {
		const data = [{
			title: values.title? values.title : 'Untitled Event',
			description: values.description? values.description : 'No description',
			assign: values.assign? values.assign : '',
			bullet: values.bullet,
			start: values.start.format(('HH:mm A')),
			end: values.end.format(('HH:mm A')),
		}]
		const newCalendarArr = calendarList
		const isExistingDate = newCalendarArr.find(x => x.date === selectedDate)
		if (isExistingDate) {
			for (let elm of newCalendarArr) { 
				if (elm.date === selectedDate) {
					elm.event = [...elm.event, ...data]
				}
			}
		} else {
			newCalendarArr.push({date: selectedDate, event: data})
		}
		const sortedNewCalendarArr  = newCalendarArr.sort((a,b) => moment(a.date) - moment(b.date))
		props.addEvent(props.authUser.user.calendarID,data,selectedDate,values.assign)
		setModalVisible(false)
		setCalendarList(sortedNewCalendarArr)
	}

	const onAddEventCancel = () => {
		setModalVisible(false)
	}

	return (
		
		<>
				{!props.calendar.loading && calendarList!==null ? (
					<Card className="calendar mb-0">
						<Row>
						<Col xs={24} sm={24} md={9} lg={6}>
					<h2 className="mb-4">Agenda</h2>
					<AgendaList 
						authUser={props.authUser}
						list={calendarList} 
						onDelete={onDeleteEvent}
					/>
				</Col>
				<Col xs={24} sm={24} md={15} lg={18}>
					<Calendar 
						onSelect={val => onSelect(val)} 
						dateCellRender={cellRender}
					/>
				</Col>
			</Row>
			<EventModal 
				visible={modalVisible}
				addEvent={onAddEvent}
				cancel={onAddEventCancel}
				authUser={props.authUser}
				allContacts={props.chatApp.allContacts}
				Case={false}
			/>
		</Card>
				):(
					null
				)
				}
				</>
	)
	
}



const mapStateToProps = ({ authUser,calendar,chatApp}) => {

	return { authUser,calendar,chatApp}
  }
  
  const mapDispatchToProps = {
	getCalendar,
	addEvent,
	deleteEvent,
	getContacts
  }
  

export default connect(mapStateToProps, mapDispatchToProps) (CalendarApp)

