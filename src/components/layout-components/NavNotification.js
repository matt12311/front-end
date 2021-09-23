import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Menu, Dropdown, Badge, Avatar, List, Button } from 'antd';
import {
  MailOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';
import notificationData from "assets/data/notification.data.json";
import Flex from 'components/shared-components/Flex'
import {
  loadUser,
  getHeadNotifications,
  getNotificationDetail
} from "../../redux/actions";
import { getCurrentTime } from "../../helpers/Utils";

const getIcon = icon => {
  switch (icon) {
    case 'mail':
      return <MailOutlined />;
    case 'alert':
      return <WarningOutlined />;
    case 'check':
      return <CheckCircleOutlined />
    case 'task':
      return <BulbOutlined />
    case 'taskExternal':
      return <BulbOutlined />
    default:
      return <WarningOutlined />;
  }
}
const notiHeaderItem = (item, getNotificationDetail, authUser) => {
  let url = `/app/admin-tools/notification-detail/${item._id}`;
  if (item.icon === "task")
    url = `/app/apps/project/scrumboard`;
  else if (item.icon === "taskExternal")
    url = `/app/apps/project/scrumboardExternal`;
  return <NavLink to={url} onClick={function () {
    if (item.icon === "task")
      getNotificationDetail(item._id, authUser.user._id);
    else if (item.icon === "taskExternal")
      getNotificationDetail(item._id, authUser.user._id);
  }}>
    <List.Item className="list-clickable">
      <Flex alignItems="center">
        <div className="pr-3">
          <Avatar
            className={`ant-avatar-${item.importanceLevel == "Normal" ? "success" : "warning"}`}
            icon={getIcon(item.icon)} />
        </div>
        <div className="mr-3">
          <span className="font-weight-bold text-dark">{item.title} </span>
          {/* <span className="text-gray-light">{item.desc}</span> */}
        </div>
        <small className="ml-auto">{getCurrentTime(item.dateCreate)}</small>
      </Flex>
    </List.Item>
  </NavLink>
}
const getNotificationBody = (list, getNotificationDetail, authUser) => {
  return list.length > 0 ?
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={item => (
        notiHeaderItem(item, getNotificationDetail, authUser)
      )}
    />
    :
    <div className="empty-notification">
      <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" alt="empty" />
      <p className="mt-3">You have viewed all notifications</p>
    </div>;
}

export const NavNotification = (props) => {

  const { authUser, getHeadNotifications, notifications, getNotificationDetail } = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([])

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  }
  useEffect(() => {
    if (!authUser.loading) {
      getHeadNotifications(authUser.user._id);
      if (!notifications.loading) {
        let headNotis = notifications.headNotifications;
        setData(headNotis)
      }
    }
  }, [authUser.user, notifications.loading]);

  const notificationList = (
    <div className="nav-dropdown nav-notification">
      <div className="nav-notification-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Notification</h4>
        {/* <Button type="link" onClick={() => setData([])} size="small">Clear </Button> */}
      </div>
      <div className="nav-notification-body">
        {getNotificationBody(data, getNotificationDetail, authUser)}
      </div>
      {/* {
        data.length > 0 ? 
        <div className="nav-notification-footer">
          <a className="d-block" href="#/">View all</a>
        </div>
        :
        null
      } */}
    </div>
  );

  return (
    <Dropdown
      placement="bottomRight"
      overlay={notificationList}
      onVisibleChange={handleVisibleChange}
      visible={visible}
      trigger={['click']}
    >
      <Menu mode="horizontal">
        <Menu.Item>
          <Badge count={data.length}>
            <BellOutlined className="nav-icon mx-auto" type="bell" />
          </Badge>
        </Menu.Item>
      </Menu>
    </Dropdown>
  )
}



const mapStateToProps = (state) => {
  return {
    authUser: state.authUser,
    notifications: state.notifications,

  };
};

const mapDispatchToProps = {
  getHeadNotifications: getHeadNotifications,
  loadUser: loadUser,
  getNotificationDetail: getNotificationDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(NavNotification)
