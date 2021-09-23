import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import NotificationList from './notification-list'
import AddNotification from './add-notification'
import DetailNotification from './detail-notification'

const Notification = props => {
	const { match } = props
	return (
		<Switch>
			<Route path={`${match.url}/notification-list`} component={NotificationList} />
			<Route path={`${match.url}/add-notification`} component={AddNotification} />
			<Route path={`${match.url}/notification-detail/:id`} component={DetailNotification} />
			<Redirect exact from={`${match.url}`} to={`${match.url}/notification-list`} />
		</Switch>
	)
}

export default Notification

