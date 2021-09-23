import React, { createContext, useReducer } from "react";
import { scrumboardData } from './ScrumboardData';
import api from "utils/api"
import { notification,message } from 'antd';

const UPDATE_ORDERED = 'UPDATE_ORDERED'
const UPDATE_COLUMN = 'UPDATE_COLUMN'
const UPDATE_MODAL = 'UPDATE_MODAL'
const UPDATE_MODAL_MODE = 'UPDATE_MODAL_MODE'
const UPDATE_CURRENT_LIST_ID = 'UPDATE_CURRENT_LIST_ID'
const UPDATE_CARD_DATA = 'UPDATE_CARD_DATA'
const GET_DATA="GET_DATA"

export const scrumboardReducer = (state, action) => {
  switch (action.type) {
    case GET_DATA:
      console.log(action.payload)
			return {
        ...state,
        columns: action.payload,
				ordered: Object.keys(action.payload),
      }
		case UPDATE_ORDERED:
			return {
				...state,
				ordered: action.payload
      }
    case UPDATE_COLUMN: 
      return {
        ...state,
        columns: action.payload
      }
    case UPDATE_MODAL: 
      return {
        ...state,
        modal: action.payload
      }
    case UPDATE_MODAL_MODE: 
      return {
        ...state,
        modalMode: action.payload
      }
    case UPDATE_CURRENT_LIST_ID: 
      return {
        ...state,
        currentListId: action.payload
      }
    case UPDATE_CARD_DATA: 
      return {
        ...state,
        cardData: action.payload
      }
    default:
      return state;
  }
};

const initialState = {
	columns: [],
	ordered: Object.keys([]),
	modal: false,
	modalMode: '',
	currentListId: '',
	cardData: null
};

export const ScrumboardContext = createContext(initialState);

export const ScrumboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scrumboardReducer, initialState);

	const dispatcher = {
    getData: async function (id){
      console.log(id)
      try{
        const res= await api.get('/tasks/'+id)
        dispatch({
          type: GET_DATA,
          payload: res.data
        })

      }
      catch(err){
        notification.error({
          message:err
        })

      } 
    },
		updateOrdered: function (ordered) {
      dispatch({
				type: UPDATE_ORDERED,
				payload: ordered
			});
    },
    updateColumns:  function (columns,id) {
      console.log(columns)
      try { 
        const res=  api.patch('/tasks/'+id,columns)
        message.success(`Board updated`)
        dispatch({
          type: UPDATE_COLUMN,
          payload: columns
        });
      }
      catch(err){
        notification.error({
          message:err
        })
      }

    },
    updateModal: function (modal) {
      dispatch({
				type: UPDATE_MODAL,
				payload: modal
			});
    },
    updateModalMode: function (modalMode) {

      dispatch({
				type: UPDATE_MODAL_MODE,
				payload: modalMode
			});
    },
    updateCurrentListId: function (currentListId) {
      dispatch({
				type: UPDATE_CURRENT_LIST_ID,
				payload: currentListId
			});
    },
    updateCardData: function (cardData) {
      dispatch({
				type: UPDATE_CARD_DATA,
				payload: cardData
			});
    }
	}

  return (
    <ScrumboardContext.Provider
      value={{
        ...state,
        ...dispatcher
      }}
    >
      {children}
    </ScrumboardContext.Provider>
  );
};