import React from 'react'
import InvoiceDetailContext from '../shopify-orders-invoice-detail-context';

const InvoiceDetail = props => {
	return (
		<InvoiceDetailContext mode="EDIT" param={props.match.params}/>
	)
}

export default InvoiceDetail
