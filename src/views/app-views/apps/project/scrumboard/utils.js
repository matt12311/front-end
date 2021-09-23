import React from 'react'
import { Avatar, Tooltip } from 'antd';
import { labels, membersDetail } from './ScrumboardData';

const createUID = len => {
	const buf = [],
		chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		charlen = chars.length,
		length = len || 32;
			
	for (let i = 0; i < length; i++) {
		buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
	}
	return buf.join('');
}

export const modalModeTypes = number => {
	switch (number) {
		case 0:
			return 'ADD_CARD';
		case 1:
			return 'EDIT_CARD';
		case 2:
			return 'ADD_BOARD';
		default:
			return '';
	}
}

export const getLabelsColor = label => {
	if(label) {
		const color = labels.filter(elm => label === elm.label)[0].color
		return color
	}
	return
}

export const getMember = id => {
	if(id) {
		const member = membersDetail.filter(elm => id === elm.id)[0]
		if(member) {
			return <Avatar src={member.img}></Avatar>
		}
	}
	return
}

export const getCover = (id, attachments) => {
	if(id) {
		const cover = attachments.filter(elm => id === elm.id)[0].src
		return cover
	}
	return
}

export const AssigneeAvatar = ({id, size = 20, name, chain, img}) => {
	if(id) {
		// const member = membersDetail.filter(elm => id === elm.id)[0]
			return (
				<div className={`d-flex ${chain? 'ml-n2': ''}`}> 
					<Tooltip title={name? '' : name}>
						<Avatar 
							className="cursor-pointer" 
							size={size} 
							src={img}
							style={chain?{border: '2px solid #fff'}: {}}
						>
						</Avatar>
					</Tooltip>
					{name? <span className="mb-0 ml-2 font-weight-semibold">{name}</span> : null}
				</div>
			)
	}
	return null
}

export const createCardObject = () => {
	return {
		id: createUID(10),
		name: '',
		description: '',
		cover: '',
		members: [],
		labels: [],
		attachments: [],
		checklists: [],
		comments: [],
		'dueDate': null
	}
}

export const createCommentObject = (name,src) => {
	return {
		id: createUID(10),
		name: name,
		src: src,
		message: '',
		date: new Date()
	}
}