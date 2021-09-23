import React, { useContext, useEffect,useState } from 'react'
import { ScrumboardProvider, ScrumboardContext } from './ScrumboardContext'
import Board from './Board';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import reorder, { reorderQuoteMap } from './reoreder'
import { memberIds } from './ScrumboardData';
import ModalForm from './ModalForm';
import { modalModeTypes, createCardObject, AssigneeAvatar } from './utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";
import { Select } from 'antd';
import {
	getContacts,
	addNotification,
} from "redux/actions";

const { Option } = Select;
const ScrumboardWrapper = props => {
	const {
		ordered,
		columns,
		modal,
		cardData,
		currentListId,
		modalMode,
		updateOrdered,
		updateColumns,
		updateModal,
		getData,
		updateCurrentListId
	} = useContext(ScrumboardContext)
	const [boardID, setBoardID] = useState("")
	useEffect(() => {
		let contactL =0
		if (props.authUser.user.isAdmin){
			contactL =1
		}
		setBoardID(props.authUser.user.externalBoard)
		getData(props.authUser.user.externalBoard)
		props.getContacts(contactL,props.authUser.user._id)

	}, [columns === null])
	const onDragEnd = result => {
		// let draggableTaskModel = (columns[result.source.droppableId]).filter(x => x.id == result.draggableId)[0];
		// let adminUsersNoti = props.authUser.users.filter(x => x.isAdmin);
		// if (draggableTaskModel && adminUsersNoti && adminUsersNoti.length > 0) {//noti burda  
		// 	let body = {
		// 		title: draggableTaskModel.name + "  Task Updated.",
		// 		description: "",
		// 		startingDate: Date.now,
		// 		repetitionHour: Date.now,
		// 		endingDate: Date.now,
		// 		importanceLevel: "Normal",
		// 		repetitionDay: "No Repeat",
		// 		type: "systemAder",
		// 		userIds: adminUsersNoti.map(x=> x._id),
		// 		icon: "taskExternal"
		// 	};
		// 	props.addNotification(body);
		// }
		if (result.combine) {
			if (result.type === 'COLUMN') {
				const shallow = [...ordered];
				shallow.splice(result.source.index, 1);
				updateOrdered(shallow)
				return;
			}

			const column = columns[result.source.droppableId];
			const withQuoteRemoved = [...column];
			withQuoteRemoved.splice(result.source.index, 1);
			const newColumns = {
				...columns,
				[result.source.droppableId]: withQuoteRemoved,
			};
			updateColumns(newColumns, boardID)
			return;
		}

		if (!result.destination) {
			return;
		}

		const source = result.source;
		const destination = result.destination;

		if (
			source.droppableId === destination.droppableId && source.index === destination.index
		) {
			return;
		}

		if (result.type === 'COLUMN') {
			const newOrdered = reorder(
				ordered,
				source.index,
				destination.index,
			);
			updateOrdered(newOrdered)
			return;
		}
		const data = reorderQuoteMap({
			quoteMap: columns,
			source,
			destination,
		});
		updateColumns(data.quoteMap, boardID)
	}

	const onCloseModal = () => {
		updateModal(false)
	}

	const onModalSubmit = (values, mode) => {
		const data = columns
		if (mode === modalModeTypes(0)) {
			let newCard = createCardObject()
			newCard.name = values.cardTitle ? values.cardTitle : 'Untitled Card'
			data[currentListId].push(newCard)
			updateColumns(data, boardID)
			updateModal(false)
			updateCurrentListId('')
		}

		if (mode === modalModeTypes(1)) {
			const updatadedCard = data[currentListId].map(elm => {
				if (values.id === elm.id) {
					elm = values
				}
				return elm
			})
			data[currentListId] = updatadedCard
			updateColumns(data, boardID)
			updateModal(false)
		}

		if (mode === modalModeTypes(2)) {
			data[values.boardTitle ? values.boardTitle : 'Untitled Board'] = [];
			const newOrdered = [...ordered, ...[values.boardTitle ? values.boardTitle : 'Untitled Board']]
			let newColumns = {}
			newOrdered.forEach(elm => {
				newColumns[elm] = data[elm]
			});
			updateColumns(newColumns, boardID)
			updateOrdered(Object.keys(newColumns))
			updateModal(false)
		}
	}
	function onChange(value) {
		setBoardID(value)
		getData(value)
	}

	function onBlur() {
		console.log('blur');
	}

	function onFocus() {
		console.log('focus');
	}

	function onSearch(val) {
		console.log('search:', val);
	}
	function userlist() {
		return props.chatApp.allContacts.map((user) =>
			<Option key={user._id} value={user.externalBoard}>{user.firstName} {user.lastName} </Option>
		)
	}
	return (
		<>
			{props.authUser.user.isAdmin || props.authUser.user.roles.includes("ADMIN") ? (
				<Select
				showSearch
				style={{ width: 200 }}
				placeholder="Select a person"
				optionFilterProp="children"
				onChange={onChange}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			>
				{userlist()}
				</Select>
			) : (null)

			}




			<DragDropContext onDragEnd={result => onDragEnd(result)}>
				{props.containerHeight ? (
					<div className="scrumboard">
						<BoardWrapper board_id={boardID} {...props} />
					</div>
				) : (
						<BoardWrapper board_id={boardID} {...props} />
					)}
			</DragDropContext>
			<ModalForm
				board_id={boardID}
				visible={modal}
				onClose={() => onCloseModal()}
				onModalSubmit={(values, modalMode) => onModalSubmit(values, modalMode)}
				modalMode={modalMode}
				cardData={cardData}
				user={props.authUser.user}
				listId={currentListId}
				addNotification={props.addNotification}
				adminUsersNoti={props.authUser.users.filter(x => x.isAdmin)}
			/>
		</>
	)
}

const BoardWrapper = ({ board_id, containerHeight, useClone, isCombineEnabled, withScrollableColumns }) => {
	const { ordered, columns, updateModal, updateModalMode } = useContext(ScrumboardContext)

	const onAddBoardModal = () => {
		updateModal(true)
		updateModalMode(modalModeTypes(2))
	}
	return (
		<Droppable
			droppableId="board"
			type="COLUMN"
			direction="horizontal"
			ignoreContainerClipping={containerHeight}
			isCombineEnabled={isCombineEnabled}
		>
			{(provided) => (
				<div className="scrumboard" ref={provided.innerRef} {...provided.droppableProps}>
	
					<Scrollbars className="scrumboard-body">
						{ordered.map((key, index) => (
							<Board
								board_id={board_id}
								key={key}
								index={index}
								title={key}
								contents={columns[key]}
								isScrollable={withScrollableColumns}
								isCombineEnabled={isCombineEnabled}
								useClone={useClone}
							/>
						))}
						{provided.placeholder}
						<div className="board-column add">
							<div className="board-title" onClick={() => onAddBoardModal()}>
								<h4 className="mb-0">
									<PlusOutlined />
									<span>Add List</span>
								</h4>
							</div>
						</div>
					</Scrollbars>
				</div>
			)}
		</Droppable>
	)
}

const Scrumboard = props => {
	return (
		<ScrumboardProvider>
			<ScrumboardWrapper {...props} />
		</ScrumboardProvider>
	)
}


const mapStateToProps = ({ authUser, chatApp }) => {

	return { authUser, chatApp}
}

const mapDispatchToProps = {
	getContacts: getContacts,
	addNotification: addNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(Scrumboard)
