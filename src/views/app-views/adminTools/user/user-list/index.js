import React, { useState, useEffect } from "react";
import { Card, Table, Switch, Input, Menu } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import { useHistory } from "react-router-dom";
import utils from "utils";
import { connect } from "react-redux";
import {
  loadUser,
  getUsers,
  updateUserActive,
} from "../../../../../redux/actions";
import Moment from "moment";

const UserList = (props) => {
  let history = useHistory();
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  const { authUser, getUsers, updateUserActive } = props;
  useEffect(() => {
    loadAllUsers();
    if (!authUser.loading) {
      authUser.users.map((user, index) => {
        selected[user._id] = user.isActive;
        setSelected(selected);
      });
      setList(authUser.users.filter((x) => x.email != "tnc@tnc.com")); //user cikti
    }
  }, [authUser.user, authUser.loading, authUser.users.length === 0]);

  const loadAllUsers = () => {
    getUsers().then(() => {
      authUser.users.map((user, index) => {
        selected[user._id] = user.isActive;
        setSelected(selected);
      });
    });
  };
  const updateUserActiveChange = (isActive, userId) => {
    updateUserActive(userId, { isActive: isActive }).then(() => {
      loadAllUsers();
    });
  };
  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const viewDetails = (row) => {
    // history.push(`/app/admin-tools/user-edit/${row._id}`);
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => utils.antdTableSorter(a, b, "email"),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      sorter: (a, b) => utils.antdTableSorter(a, b, "createdAt"),
      render: (_, elm) => (
        <p className="list-item-heading">
          {Moment(elm.createdAt).format("LLL")}
        </p>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      sorter: (a, b) => utils.antdTableSorter(a, b, "lastLogin"),
      render: (_, elm) => (
        <p className="list-item-heading">
          {elm.lastLogin != undefined || elm.lastLogin != null
            ? Moment(elm.lastLogin).format("LLL")
            : "-"}
        </p>
      ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      sorter: (a, b) => utils.antdTableSorter(a, b, "isActive"),
      render: (_, user) => (
        <Switch
          key={user._id}
          className="custom-switch custom-switch-primary"
          checked={selected[user._id]}
          onChange={(e) => {
            selected[user._id] = e;
            setSelected(selected);
            console.log(selected);
            updateUserActiveChange(e, user._id);
          }}
          name={user._id}
          id={user._id}
        />
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const onSearch = (e) => {
    authUser.users.map((user, index) => {
      selected[user._id] = user.isActive;
      setSelected(selected);
    });

    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value
      ? list
      : authUser.users.filter((x) => x.email != "tnc@tnc.com"); //user cikti
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  return (
    <Card>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex>
      </Flex>
      <div className="table-responsive">
        <Table columns={tableColumns} dataSource={list} />
      </div>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    authUser: state.authUser,
  };
};

const mapDispatchToProps = {
  loadUser: loadUser,
  getUsers: getUsers,
  updateUserActive: updateUserActive,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
