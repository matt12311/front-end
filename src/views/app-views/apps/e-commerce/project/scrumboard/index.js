import React, { useContext,useEffect } from 'react'
import { ScrumboardProvider, ScrumboardContext } from './ScrumboardContext'
import Board from './Board';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar  } from 'antd';
import reorder, { reorderQuoteMap } from './reoreder'
import { memberIds } from './ScrumboardData';
import ModalForm from './ModalForm';
import { modalModeTypes, createCardObject, AssigneeAvatar } from './utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";

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
	
useEffect(()=>{
		getData(props.authUser.user.internalBoard)

},[columns===null])
	const onDragEnd = result => {
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
			updateColumns(newColumns,props.authUser.user.internalBoard)
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
		updateColumns(data.quoteMap,props.authUser.user.internalBoard)
	}
	
	const onCloseModal = () => {
		updateModal(false)
	}

	const onModalSubmit = (values, mode) => {
		const data = columns
    if(mode === modalModeTypes(0)) {
			let newCard = createCardObject()
			newCard.name = values.cardTitle ? values.cardTitle : 'Untitled Card'
			data[currentListId].push(newCard)
			updateColumns(data,props.authUser.user.internalBoard)
			updateModal(false)
			updateCurrentListId('')
    }

    if(mode === modalModeTypes(1)) {
      const updatadedCard = data[currentListId].map(elm => {
        if(values.id === elm.id) {
          elm = values
        }
        return elm
			})
	  	data[currentListId] = updatadedCard
			updateColumns(data,props.authUser.user.internalBoard)
			updateModal(false)
    }

    if(mode === modalModeTypes(2)) {
			data[values.boardTitle? values.boardTitle : 'Untitled Board'] = [];
			const newOrdered = [...ordered, ...[values.boardTitle? values.boardTitle : 'Untitled Board']]
			let newColumns = {}
			newOrdered.forEach(elm => {
				newColumns[elm] = data[elm]
			});
			updateColumns(newColumns,props.authUser.user.internalBoard)
			updateOrdered(Object.keys(newColumns))
			updateModal(false)
		}
	}

	return (
		<>
			<DragDropContext onDragEnd={result => onDragEnd(result)}>
				{props.containerHeight ? (
					<div className="scrumboard">
						<BoardWrapper board_id={props.authUser.user.internalBoard} {...props}/>
					</div>
				) : (
					<BoardWrapper board_id={props.authUser.user.internalBoard} {...props}/>
				)}
			</DragDropContext>
			<ModalForm 
			board_id={props.authUser.user.internalBoard}
				visible={modal} 
				onClose={() => onCloseModal()} 
				onModalSubmit={(values, modalMode) => onModalSubmit(values, modalMode)}
				modalMode={modalMode}
				cardData={cardData}
				listId={currentListId}
			/>
		</>
	)
}

const BoardWrapper = ({ board_id,containerHeight, useClone, isCombineEnabled, withScrollableColumns }) => {
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
					<div className="scrumboard-header">
						<div>
							<h3>Backlog</h3>
						</div>
						<div className="text-right">
							<div className="d-flex align-items-center">
								{memberIds.map((member, i) => i < 4 ? <AssigneeAvatar key={member} id={member} size={30} chain/> : null)}
								<Avatar className="ml-n2" size={30}>
									<span className="text-gray font-weight-semibold font-size-base">+9</span>
								</Avatar>
							</div>
						</div>
					</div>
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


const mapStateToProps = ({ authUser}) => {

	return { authUser }
  }
  
  const mapDispatchToProps = {
  }
  
export default connect(mapStateToProps, mapDispatchToProps) (Scrumboard)
