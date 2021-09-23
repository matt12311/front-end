import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UserList from "./user-list";
import EditUser from "./edit-user";

const Notification = (props) => {
  const { match } = props;
  return (
    <Switch>
      <Route path={`${match.url}/user-list`} component={UserList} />
      <Route path={`${match.url}/user-edit/:id`} component={EditUser} />
      <Redirect exact from={`${match.url}`} to={`${match.url}/user-list`} />
    </Switch>
  );
};

export default Notification;
