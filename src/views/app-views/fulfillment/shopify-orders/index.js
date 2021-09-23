import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'; 
import ShopifyOrdersList from './shopify-orders/shopify-orders-list' 

const ShopifyOrders = ({ match }) => (
    <Suspense fallback={<Loading cover="content" />}>
        <Switch>  
            <Route path={`${match.url}/shopify-orders-list`} component={ShopifyOrdersList} /> 
            <Redirect from={`${match.url}`} to={`${match.url}/shopify-orders-list`} />
        </Switch>
    </Suspense>
);

export default ShopifyOrders

