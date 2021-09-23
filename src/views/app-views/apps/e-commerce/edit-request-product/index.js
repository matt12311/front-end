import React from 'react'
import RequestForm from '../RequestForm';

const EditRequestProduct = props => {
	return (
		<RequestForm mode="EDIT" param={props.match.params}/>
	)
}

export default EditRequestProduct
