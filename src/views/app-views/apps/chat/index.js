import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import ChatAdmin from './chat-admin';
import ChatView from './chat-view';


const Project = ({ match }) => {
	return (
		<Switch>
			<Route path={`${match.url}/view`} component={ChatView} />
			<Route path={`${match.url}/admin`} component={ChatAdmin} />
		</Switch>
	)
}

export default Project
