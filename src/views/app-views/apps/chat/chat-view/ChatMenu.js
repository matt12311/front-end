import React, { useEffect, useState } from 'react'
import ChatData from "assets/data/chat.data.json"
import { Badge, Input,Avatar } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { COLOR_1 } from 'constants/ChartConstant';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {getContacts} from 'redux/actions'

import chat from 'redux/socketHandle/chat';

const ChatMenu = ({ match, location,chatApp,authUser, getContacts}) => {
	const [list, setList] = useState([]);
	let history = useHistory();

	useEffect(() => {
		let contactL =0
		if (authUser.user.isAdmin){
			contactL =1
		}
		getContacts(contactL,authUser.user._id)
		if (!chatApp.loadingContacts)
		setList(chatApp.allContacts.filter(x => x._id !== authUser.user._id))
	  },[list.length!==0]);
	const openChat = id => {
		const data = list.map( elm => {
			if(elm.id === id) {
				elm.unread = 0
			}
			return elm
		})
		setList(data)
		history.push(`${match.url}/${id}`)
	}

	const searchOnChange = e => {
		const query = e.target.value;
		const data = chatApp.allContacts.filter(item => {
			return query === '' ? item : item.name.toLowerCase().includes(query)
		})
		setList(data)
	}

	const id = parseInt(location.pathname.match(/\/([^/]+)\/?$/)[1])

	return (
		<div className="chat-menu">
			<div className="chat-menu-toolbar">
				<Input 
					placeholder="Search" 
					onChange={searchOnChange}
					prefix={
						<SearchOutlined className="font-size-lg mr-2"/>
					}
				/>
			</div>
			<div className="chat-menu-list">
				{
					list.map( (item, i) => (
						<div 
							key={`chat-item-${item._id}`} 
							onClick={() => openChat(item._id)} 
							className={`chat-menu-list-item ${i === (list.length - 1)? 'last' : ''} ${item.id === id? 'selected' : ''}`}
						>
							<AvatarStatus src={item.avatar} name={item.name} 
							//subTitle={item.msg[item.msg.length - 1].text}
							/>
							<div className="text-right">
								<div className="chat-menu-list-item-time">{item.time}</div>
								{item.unread === 0 ? <span></span> : <Badge count={item.unread} style={{backgroundColor: COLOR_1}}/>}
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
	return { chatApp: state.chatApp, authUser:state.authUser }
  };
  
  const mapDispatchToProps = {
	getContacts,
  }
  

export default connect(mapStateToProps, mapDispatchToProps) (ChatMenu)
