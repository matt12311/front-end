import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'; 
import FullfilmentRequestsList from './draft-orders/draft-orders-list' 

const DraftOrdersList = ({ match }) => (
    <Suspense fallback={<Loading cover="content" />}>
        <Switch> 
            <Route path={`${match.url}/draft-orders-list`} component={FullfilmentRequestsList} /> 
            <Redirect from={`${match.url}`} to={`${match.url}/draft-orders-list`} />
        </Switch>
    </Suspense>
);

export default DraftOrdersList

