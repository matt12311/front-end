import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loading from "components/shared-components/Loading";
import NotificationList from "./notification/notification-list";
import AddNotification from "./notification/add-notification";
import DetailNotification from "./notification/detail-notification";
import UserList from "./user/user-list";
import EditUser from "./user/edit-user";

const Apps = ({ match }) => (
  <Suspense fallback={<Loading cover="content" />}>
    <Switch>
      <Route
        path={`${match.url}/add-notification`}
        component={AddNotification}
      />
      <Route
        path={`${match.url}/notificationList`}
        component={NotificationList}
      />
      <Route
        path={`${match.url}/notification-detail/:id`}
        component={DetailNotification}
      />
      <Route path={`${match.url}/userList`} component={UserList} />
      <Route path={`${match.url}/user-edit/:id`} component={EditUser} />
      <Redirect from={`${match.url}`} to={`${match.url}/notification-list`} />
    </Switch>
  </Suspense>
);

export default Apps;
