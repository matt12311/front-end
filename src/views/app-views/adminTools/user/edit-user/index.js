import React from 'react'
import UserForm from '../user-form';

const EditUser = props => {
	return (
		<UserForm mode="EDIT" param={props.match.params}/>
	)
}

export default EditUser
