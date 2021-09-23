import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'; 
import FullfilmentRequestsList from './fullfilment-requests/sfullfilment-requests-list' 

const FullfilmentRequests = ({ match }) => (
    <Suspense fallback={<Loading cover="content" />}>
        <Switch> 
            <Route path={`${match.url}/fullfilment-requests-list`} component={FullfilmentRequestsList} /> 
            <Redirect from={`${match.url}`} to={`${match.url}/fullfilment-requests-list`} />
        </Switch>
    </Suspense>
);

export default FullfilmentRequests

