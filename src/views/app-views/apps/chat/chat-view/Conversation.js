import React from 'react'
import ChatData from "assets/data/chat.data.json"
import { Avatar, Divider, Input, Form, Button, Menu } from 'antd';
import { 
	FileOutlined, 
	SendOutlined, 
	PaperClipOutlined, 
	SmileOutlined, 
	AudioMutedOutlined,
	UserOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import socket from "../../../../../utils/socket"
import { loadUser, getContacts, getConversations, createConversation } from "redux/actions"; 
import { connect } from "react-redux";
import { getCurrentTime } from "../../../../../helpers/Utils";
import Loading from "components/shared-components/Loading";

const	menu = () => (
	<Menu>
		<Menu.Item key="0">
			<UserOutlined />
			<span>User Info</span>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item key="3">
			<DeleteOutlined />
			<span>Delete Chat</span>
		</Menu.Item>
	</Menu>
);

export class Conversation extends React.Component {
	formRef = React.createRef();
	chatBodyRef = React.createRef()

	constructor(props) {
		super(props);
		this.state = {
			info: {},
			msgList: [],
		}
	}
	componentDidMount() {
		if (!this.props.authUser.loading){
			this.getConversation(this.props.authUser.user._id,this.getUserId())
			// this.setState({msgList:this.props.chatApp.conversations.msg})
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.getConversation(this.props.authUser.user._id,this.getUserId() )	
		
		}
		if(!prevProps.chatApp.loadingConversations){
			
			// console.log(prevProps.chatApp.conversations.msg.length)
			// console.log(this.props.chatApp.conversations.msg.length)
			// if(prevProps.chatApp.conversations.msg.length!==this.props.chatApp.conversations.msg.length)
			// {
			// 	this.setState({msgList:this.props.chatApp.conversations.msg})
			// }

			// if(this.props.chatApp.conversations.msg!==null&& prevProps.chatApp.conversations.msg!==null){
			// 	if (this.props.chatApp.conversation.msg.length !== prevProps.chatApp.conversation.msg.length) {
			// 		console.log("changed")
			// 	}
			// }
			
		}
	
		this.scrollToBottom()
		
	}
	
	getUserId() {
		const { id } = this.props.match.params
		return id
	}
	

	getConversation = ( fromID,toID) => {
		socket.emit("join private chat", {fromUserId: fromID, toUserId:toID})
		// const data = ChatData.filter(elm => elm.id === currentId)
		// this.setState({
		// 	info: data[0],
		// 	msgList: data[0].msg
		// })	
	}

	getMsgType = obj => {
		switch (obj.msgType) {
			case 'text':
				return <span>{obj.text}</span>
			case 'image':
				return <img src={obj.text} alt={obj.text} />
			case 'file':
				return (
				<Flex alignItems="center" className="msg-file">
					<FileOutlined className="font-size-md"/>
					<span className="ml-2 font-weight-semibold text-link pointer">
						<u>{obj.text}</u>
					</span>
				</Flex>
				)
			default:
				return null;
		}
	}

	scrollToBottom = () => {
		if(this.chatBodyRef.current!==null)
		this.chatBodyRef.current.scrollToBottom()
	}

	onSend = values => {
		var newMsgData = {}
		if (values.newMsg) {
			newMsgData = {
				avatar: this.props.authUser.user.photoPath,
				senderUserId: this.props.authUser.user._id,
				msgType: "text",
				text: values.newMsg,
				time: getCurrentTime(),
				isRead: false
			}
			this.formRef.current.setFieldsValue({
				newMsg: ''
			});
			// this.setState({
			// 	msgList: [... this.state.msgList, newMsgData]
			// })
		}

		// this.props.addMessageToConversation(newMsgData)
		socket.emit("send private message", {chat_id: this.props.chatApp.conversations._id ,updated:{msg: newMsgData,
			time: getCurrentTime(), receiverUser:this.getUserId()}})

	};
	
	emptyClick = (e) => {
    e.preventDefault();
	};
	
	chatContentHeader = name => (
		<div className="chat-content-header">
			<h4 className="mb-0">{name}</h4>
			<div>
				<EllipsisDropdown menu={menu}/>
			</div>
		</div>
	)

	chatContentBody = (props, id) => (
		<div className="chat-content-body">
			<Scrollbars ref={this.chatBodyRef} autoHide>
				{
					props.map((elm, i) => (
						<div 
							key={`msg-${id}-${i}`} 
							className={`msg ${elm.msgType === 'date' ? 'datetime' : ''} ${elm.senderUserId !== this.props.authUser.user._id ? 'msg-recipient' : 'msg-sent'}`}
							>
							{
								elm.avatar? 
								<div className="mr-2">
									<Avatar src={elm.avatar} />
								</div>
								:
								null
							}
							{
								elm.text?
								<div className={`bubble ${!elm.avatar? 'ml-5' : ''}`}>
									<div className="bubble-wrapper">
										{this.getMsgType(elm)}
									</div>
								</div>
								:
								null
							}
							{
								elm.msgType === 'date'?
								<Divider>{elm.time}</Divider>
								: 
								null
							}
						</div>
					))
				}
			</Scrollbars>
		</div>
	)

	chatContentFooter = () => (
		<div className="chat-content-footer">
			<Form name="msgInput" ref={this.formRef} onFinish={this.onSend} className="w-100">
				<Form.Item name="newMsg" className="mb-0">
					<Input 
						autoComplete="off" 
						placeholder="Type a message..."
						suffix={
							<div className="d-flex align-items-center">
								<Button shape="circle" type="primary" size="small" 
								htmlType="submit">
									<SendOutlined />
								</Button>
							</div>
						}
					/>
				</Form.Item>
			</Form>
		</div>
	)


	render() {
		const { id } = this.props.match.params
		const { info, msgList } = this.state
		return (
			<div className="chat-content">
				{this.chatContentHeader(info.name)}
				{this.props.chatApp.loadingConversations ? (
					<Loading></Loading>
				):(
					this.chatContentBody(this.props.chatApp.conversations.msg, id)

				)}
				{this.chatContentFooter()}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		authUser: state.authUser,
		chatApp: state.chatApp,
	};
}
const matchDispatchToProps = {
			loadUser,
			getConversations,

}

export default connect(mapStateToProps, matchDispatchToProps)(Conversation)
