import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loading from "components/shared-components/Loading";
import ShopifyOrdersList from "./shopify-orders/shopify-orders-list";
import FullfilmentRequestsList from "./fullfilment-requests/fullfilment-requests-list";
import ShopifyOrdersInvoiceList from "./shopify-orders-invoice/shopify-orders-invoice-list";
import ShopifyOrdersInvoiceDetail from "./shopify-orders-invoice/shopify-orders-invoice-detail";
import DraftOrdersList from "./draft-orders/draft-orders-list";
import UserList from "./user/user-list";
import EditUser from "./user/edit-user";

const Apps = ({ match }) => (
  <Suspense fallback={<Loading cover="content" />}>
    <Switch>
      <Route
        path={`${match.url}/fullfilment-requests-list`}
        component={FullfilmentRequestsList}
      />
      <Route
        path={`${match.url}/shopify-orders-list`}
        component={ShopifyOrdersList}
      />
      <Route
        path={`${match.url}/draft-orders-list`}
        component={DraftOrdersList}
      />
      <Route
        path={`${match.url}/shopify-orders-invoice-list`}
        component={ShopifyOrdersInvoiceList}
      />
      <Route
        path={`${match.url}/shopify-orders-invoice-detail/:id`}
        component={ShopifyOrdersInvoiceDetail}
      />
      <Route path={`${match.url}/user/user-list`} component={UserList} />
      <Route path={`${match.url}/user/user-edit/:id`} component={EditUser} />
      <Redirect from={`${match.url}`} to={`${match.url}/shopify-orders-list`} />
    </Switch>
  </Suspense>
);

export default Apps;
