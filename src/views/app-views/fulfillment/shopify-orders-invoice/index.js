import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'; 
import ShopifyOrdersInvoiceList from './shopify-orders/shopify-orders-invoice-list' 
import ShopifyOrdersInvoiceDetail from './shopify-orders/shopify-orders-invoice-detail' 

const ShopifyOrdersInvoice = ({ match }) => (
    <Suspense fallback={<Loading cover="content" />}>
        <Switch>  
            <Route path={`${match.url}/shopify-orders-invoice-list`} component={ShopifyOrdersInvoiceList} /> 
            <Route path={`${match.url}/shopify-orders-invoice-detail/:id`} component={ShopifyOrdersInvoiceDetail} /> 
            <Redirect from={`${match.url}`} to={`${match.url}/shopify-orders-invoice-list`} />
        </Switch>
    </Suspense>
);

export default ShopifyOrdersInvoice

