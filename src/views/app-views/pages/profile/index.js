import React, { Component, useState, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  loadUser,
  getShops,
  addShop,
  updateShop,
  deleteShop,
  createVaUser,
  loadVaUsers,
  deleteVaUser,
  updateVaUser,
  updateUser,
} from "../../../../redux/actions";
import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Tooltip,
  Tag,
  Table,
  Dropdown,
  Menu,
  Cascader,
  AutoComplete,
  Checkbox,
  Divider,
  InputNumber,
  Select,
  Switch,
} from "antd";
import { Icon } from "components/util-components/Icon";
import Loading from "components/shared-components/Loading";
import {
  employementList,
  interestedList,
  connectionList,
  groupList,
} from "./profileData";
import {
  GlobalOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
  PlusOutlined,
  StopOutlined,
  UserAddOutlined,
  ReloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  VisitorChartData,
  AnnualStatisticData,
  ActiveMembersData,
  NewMembersData,
  RecentTransactionData,
} from "../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { UploadOutlined, EllipsisOutlined } from "@ant-design/icons";
import moment from "moment";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import UserView from "../user-list/UserView";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { values } from "lodash";
import Mail from "views/app-views/apps/mail";
const { confirm } = Modal;

const shopsList = [
  {
    uid: "-1",
    name: "xxx.png",
    status: "done",
    url:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    thumbUrl:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    uid: "-2",
    name: "yyy.png",
    status: "error",
  },
];

const props2 = {
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  listType: "picture",
  defaultFileList: [...shopsList],
  className: "upload-list-inline",
};

const vaUserActionList = (
  <Menu>
    <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <ReloadOutlined />
          <span className="ml-2">Refresh</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <PrinterOutlined />
          <span className="ml-2">Print</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="12">
      <span>
        <div className="d-flex align-items-center">
          <FileExcelOutlined />
          <span className="ml-2">Export</span>
        </div>
      </span>
    </Menu.Item>
  </Menu>
);
const tailLayout = {
  wrapperCol: { offset: 2 },
};
const cardDropdown = (menu) => (
  <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
    <a
      href="/#"
      className="text-gray font-size-lg"
      onClick={(e) => e.preventDefault()}
    >
      <EllipsisOutlined />
    </a>
  </Dropdown>
);

const Experiences = () => (
  <Card title="Experiences">
    <div className="mb-3">
      <Row>
        <Col sm={24} md={22}>
          {employementList.map((elm, i) => {
            return (
              <div
                className={`${i === employementList.length - 1 ? "" : "mb-4"}`}
                key={`eduction-${i}`}
              >
                <AvatarStatus
                  src={elm.img}
                  name={elm.title}
                  subTitle={elm.duration}
                />
                <p className="pl-5 mt-2 mb-0">{elm.desc}</p>
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  </Card>
);

const Interested = () => (
  <Card title="Interested">
    <Row gutter={30}>
      <Col sm={24} md={12}>
        {interestedList
          .filter((_, i) => i < 4)
          .map((elm, i) => {
            return (
              <div className="mb-3" key={`interested-${i}`}>
                <h4 className="font-weight-semibold">{elm.title}</h4>
                <p>{elm.desc}</p>
              </div>
            );
          })}
      </Col>
      <Col sm={24} md={12}>
        {interestedList
          .filter((_, i) => i >= 4)
          .map((elm, i) => {
            return (
              <div className="mb-3" key={`interested-${i}`}>
                <h4 className="font-weight-semibold">{elm.title}</h4>
                <p>{elm.desc}</p>
              </div>
            );
          })}
      </Col>
    </Row>
  </Card>
);

const Connection = () => (
  <Card title="Connection">
    {connectionList.map((elm, i) => {
      return (
        <div
          className={`${i === connectionList.length - 1 ? "" : "mb-4"}`}
          key={`connection-${i}`}
        >
          <AvatarStatus src={elm.img} name={elm.name} subTitle={elm.title} />
        </div>
      );
    })}
  </Card>
);

const Group = () => (
  <Card title="Group">
    {groupList.map((elm, i) => {
      return (
        <div
          className={`${i === groupList.length - 1 ? "" : "mb-4"}`}
          key={`connection-${i}`}
        >
          <AvatarStatus src={elm.img} name={elm.name} subTitle={elm.desc} />
        </div>
      );
    })}
  </Card>
);
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a validate email!",
    number: "Not a validate number!",
  },
  number: {
    range: "Must be between ${min} and ${max}",
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loading: false,
      visible: false,
      modalAdd: false,
      setList: [],
      shopsList: [],
      vaUsersList: [],
      shopToUpdate: {},
      userToUpdate: {},
      vaUserToUpdate: {},
      RecentTransactionData: RecentTransactionData,
      changePass: false,
      automaticFulfillment: false,
    };
    this.showModal = this.showModal.bind(this);
    this.showShopModal = this.showShopModal.bind(this);
    this.showVaUserModal = this.showVaUserModal.bind(this);
    this.setAutomatic = this.setAutomatic.bind(this);
  }

  componentDidMount() {
    /*     this.props.loadUser().then(() => {});
     */

    // if (!this.props.authUser.loading)
    //   this.props.getShops(this.props.authUser.user._id, 1, 0);
    if (!this.props.authUser.loading)
      this.props.loadVaUsers(this.props.authUser.user._id, 1, 0);
  }

  handleChange = (info) => {
    let shopsList = [...info.shopsList];
    console.log(this.state.shopsList);
    // 1. Limit the number of uploaded files
    // Only to show 1 recent uploaded files, and old ones will be replaced by the new
    shopsList = shopsList.slice(-1);

    // 2. Read from response and show file link
    shopsList = shopsList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        console.log(file.url);
      }
      return file;
    });

    this.setState({ shopsList });
  };

  showModal = (row) => {
    this.setState({
      //userToUpdate: row,
      visible: !this.state.visible,
    });
  };
  showVaUserModal = () => {
    this.setState({
      visibleVaUser: !this.state.visibleVaUser,
    });
  };

  showShopModal = () => {
    this.setState({
      visibleShop: !this.state.visibleShop,
    });
  };
  showShopEditModal = (row) => {
    this.setState({
      shopToUpdate: row,
      visibleEditShop: !this.state.visibleEditShop,
    });
  };
  showVaUserEditModal = (row) => {
    //console.log(row)
    this.setState({
      vaUserToUpdate: row,
      visibleEditVaUser: !this.state.visibleEditVaUser,
    });
  };

  showUserEditModal = (row) => {
    this.setState({
      userToUpdate: row,
      visibleEditUser: !this.state.visibleEditUser,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 300);
  };

  handleShopOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visibleShop: false });
    }, 300);
  };
  handleVaUserOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visibleVaUser: false });
    }, 300);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleShopCancel = () => {
    this.setState({ visibleShop: false });
  };
  handleVaUserCancel = () => {
    this.setState({ visibleVaUser: false });
  };
  addProduct = () => {
    console.log("Add");
  };
  handleAddVaUser = (values) => {
    //console.log(values)
    this.props
      .createVaUser(
        this.props.authUser.user._id,
        values.name,
        values.email,
        values.password,
        values.roles
      )
      .then(() => {
        this.props.loadVaUsers(this.props.authUser.user._id, 1, 0);
        setTimeout(() => {
          this.setState({ visibleVaUser: false });
        }, 1000);
      });
  };
  handleAddShop = () => {
    this.props
      .addShop(
        this.props.authUser.user._id,
        this.state.shopName,
        this.state.ApiKey,
        this.state.apiSecret,
        this.state.automaticFulfillment
      )
      .then(() => {
        this.props.getShops(this.props.authUser.user._id, 1, 0);
        setTimeout(() => {
          this.setState({ visibleShop: false });
        }, 1000);
      });
  };

  handleUpdateShop = (values) => {
    console.log(values);

    var body = {
      apiKey: values.apiKey,
      apiSecret: values.apiSecret,
      automaticFulfillment: values.automaticFulfillment
    };
    this.props.updateShop(this.state.shopToUpdate._id, body).then(() => {
      this.props.getShops(this.props.authUser.user._id, 1, 0);
      setTimeout(() => {
        this.setState({ visibleEditShop: !this.state.visibleEditShop });
      }, 500);
    });
  };

  handleUpdateVaUser = (values) => {
    console.log(values);
    var body = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.roles,
    };
    this.props.updateVaUser(this.state.vaUserToUpdate._id, body).then(() => {
      this.props.loadVaUsers(this.props.authUser.user._id, 1, 0);
      setTimeout(() => {
        this.setState({ visibleEditVaUser: !this.state.visibleEditVaUser });
      }, 500);
    });
  };
  handleUpdateUser = (values) => {
    var body = {
      name: values.name,
      email: values.email,
      password: values.password,
      /*       changePasswordCode: values.changePasswordCode,
       */ newPassword: values.newPassword,
      photoPath: values.photoPath,
    };
    this.props.updateUser(this.props.authUser.user._id, body).then(() => {
      setTimeout(() => {
        this.setState({ visibleEditUser: !this.state.visibleEditUser });
      }, 500);
    });
  };
  /*  viewDetails = (row) => {
    console.log("update");
  }; */
  showDeleteConfirm(getShops, deleteShop, row) {
    confirm({
      title: "Are you sure to delete this shop?",
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log(row);

        deleteShop(row._id);
        getShops(row.ownerId, 1, 0);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  showDeleteConfirmVaUser(row, loadVaUsers, deleteVaUser) {
    confirm({
      title: "Are you sure to delete this User?",
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteVaUser(row._id).then(() => {
          loadVaUsers(row.ownerId, 1, 0);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  vaUserdropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => this.showVaUserEditModal(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          this.showDeleteConfirm(
            this.props.loadVaUsers,
            this.props.deleteVaUser,
            row
          )
        }
      >
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );
  dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => this.showShopEditModal(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          this.showDeleteConfirm(
            this.props.getShops,
            this.props.deleteShop,
            row
          )
        }
      >
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );
  newShop = () => (
    <Button type="primary" shape="circle" onClick={this.showShopModal}>
      +
    </Button>
  );
  newVaUser = () => (
    <Button type="primary" shape="circle" onClick={this.showVaUserModal}>
      +
    </Button>
  );
  onFinish(values) {
    console.log("Success:", values);
    //createVaUser(values)
  }
  setAutomatic() {
    this.setState({
      automaticFulfillment: !this.state.automaticFulfillment,
    });
  }
  render() {
   
    const tableColumns = [
      {
        title: "Name",
        dataIndex: "name",

        /* sorter: {
          compare: (a, b) => {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        }, */
      },
      {
        title: "Email",
        dataIndex: "email",

        /* sorter: {
          compare: (a, b) => {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        }, */
      },
      {
        title: "Last Login",
        dataIndex: "lastLogin",
        // render: (date) => (
        //   <span>{moment.unix(date).format("MM/DD/YYYY")} </span>
        // ),
        sorter: (a, b) =>
          moment(a.lastLogin).unix() - moment(b.lastLogin).unix(),
      },
      {
        title: "Premissions",
        dataIndex: "role",
        /* sorter: {
          compare: (a, b) => a.roles.length - b.roles.length,
        }, */
      },
     /*  {
        title: "Status",
        dataIndex: "status",
      }, */
      {
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right">
            <Tooltip title="Edit">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  this.showVaUserEditModal(elm);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.showDeleteConfirmVaUser(
                    elm,
                    this.props.loadVaUsers,
                    this.props.deleteVaUser
                  );
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    const {
      users,
      userProfileVisible,
      selectedUser,
      shopsList,
      vaUsersList,
    } = this.state;

    const avatarSize = 150;
    const props = {
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange: this.handleChange,
      multiple: false,
      listType: "picture",
      defaultFileList: [...this.state.shopsList],
      className: "upload-list-inline",
    };

    return (
      <>
        <PageHeaderAlt
          background="/img/others/img-12.jpg"
          cssClass="bg-primary"
          overlap
        >
          <div className="container text-center">
            <div className="py-5 my-md-5"></div>
          </div>
        </PageHeaderAlt>
        <div className="container my-4">
          <Card>
            <Row justify="center">
              <Col sm={24} md={23}>
                {this.props.authUser.loading ? (
                  <Loading />
                ) : (
                  <div className="d-md-flex">
                    <div
                      className="rounded p-2 bg-white shadow-sm mx-auto"
                      style={{
                        marginTop: "-3.5rem",
                        maxWidth: `${avatarSize + 16}px`,
                      }}
                    >
                      <Avatar
                        shape="square"
                        size={avatarSize}
                        src="/img/avatars/thumb-15.jpg"
                      />
                    </div>
                    <div className="ml-md-4 w-100">
                      <Flex
                        alignItems="center"
                        mobileFlex={false}
                        className="mb-3 text-md-left text-center"
                      >
                        {/* <h2 className="mb-0">Ella Robinson</h2> */}
                        <span className="font-weight-semibold">
                          {this.props.authUser.user.firstName}
                        </span>
                        <div className="ml-md-3 mt-3 mt-md-0">
                          <Button
                            size="small"
                            type="primary"
                            onClick={this.showModal}
                          >
                            Edit
                          </Button>
                          <Modal
                            visible={this.state.visible}
                            title="Profile Edit Form"
                            /*                             onFinish={this.handleUpdateUser}
                             */ onOk={this.handleOk}
                            onCancel={(e) => {
                              e.preventDefault();
                              this.setState({
                                visible: !this.state.visible,
                              });
                            }}
                            width={600}
                            footer={null}
                          >
                            <Form
                              {...this.formItemLayout}
                              form={this.form}
                              name="user"
                              onFinish={this.handleUpdateUser}
                              initialValues={{
                                name: this.props.authUser.user.firstName,
                                email: this.props.authUser.user.email,
                                //password: this.state.userToUpdate.password,
                                changePass: this.state.changePass,
                              }}
                              scrollToFirstError
                            >
                              <div>
                                <Form.Item
                                  name="name"
                                  label="Name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input your name!",
                                    },
                                  ]}
                                >
                                  <Input
                                    addonBefore={this.prefixSelector}
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                </Form.Item>
                              </div>

                              <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                  {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                  },
                                  {
                                    required: true,
                                    message: "Please input your E-mail!",
                                  },
                                ]}
                              >
                                <Input disabled />
                              </Form.Item>

                              <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your password!",
                                  },
                                ]}
                                hasFeedback
                              >
                                <Input.Password />
                              </Form.Item>
                              <Form.Item
                                {...tailLayout}
                                name="changePass"
                                valuePropName="unchecked"
                              >
                                <Checkbox
                                  onClick={(e) => {
                                    this.setState({
                                      changePass: !this.state.changePass,
                                    });
                                  }}
                                >
                                  Change Password
                                </Checkbox>
                              </Form.Item>
                              {this.state.changePass ? (
                                <div>
                                  <Form.Item
                                    name="newPassword"
                                    label="New Password"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input your password!",
                                      },
                                    ]}
                                    hasFeedback
                                  >
                                    <Input.Password />
                                  </Form.Item>
                                  <Form.Item
                                    name="confirm"
                                    label="Confirm Password"
                                    dependencies={["newPassword"]}
                                    hasFeedback
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please confirm your password!",
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                          if (
                                            !value ||
                                            getFieldValue("newPassword") ===
                                              value
                                          ) {
                                            return Promise.resolve();
                                          }

                                          return Promise.reject(
                                            "The two passwords that you entered do not match!"
                                          );
                                        },
                                      }),
                                    ]}
                                  >
                                    <Input.Password />
                                  </Form.Item>
                                </div>
                              ) : (
                                {}

                                        )}

                              <Form.Item label="Photos" name="photos">
                                <Upload
                                  {...props}
                                  shopsList={this.state.shopsList}
                                >
                                  <Button>
                                    <UploadOutlined /> Upload
                                  </Button>
                                </Upload>
                              </Form.Item>
                              <Form.Item
                                wrapperCol={{
                                  ...layout.wrapperCol,
                                  offset: 17,
                                }}
                              >
                                <Button
                                  onClick={(e) => {
                                    this.setState({
                                      visible: !this.state.visible,
                                    });
                                  }}
                                  htmlType="button"
                                >
                                  Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                  Add
                                </Button>
                              </Form.Item>
                              {/*  <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                {...this.tailFormItemLayout}
                              >
                                <Checkbox>
                                  I have read the <a href="/#">agreement</a>
                                </Checkbox>
                              </Form.Item> */}
                              {/*  <Form.Item {...this.tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                  Register
                                </Button>
                              </Form.Item> */}
                            </Form>
                          </Modal>

                          {/* <Button size="small" className="ml-2">
                    Message
                  </Button> */}
                        </div>
                      </Flex>

                      <Modal
                        visible={this.state.visibleVaUser}
                        title="Staff Form"
                        onOk={this.handleVaUserOk}
                        validateMessages={validateMessages}
                        onCancel={this.handleVaUserCancel}
                        width={600}
                        footer={null}
                        /*                         footer={[
                          <Button key="back" onClick={this.handleVaUserCancel}>
                            Return
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            loading={this.state.loading}
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleAddVaUser();
                            }}
                          >
                            Submit
                          <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 16 }}
                          >
                            <Button
                              onClick={(e) => {
                                this.setState({
                                  visibleEditVaUser: !this.state
                                    .visibleEditVaUser,
                                });
                              }}
                              htmlType="button"
                            >
                              Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Submit
                            </Button>
                          </Form.Item>
                          </Button>,
                        ]} */
                      >
                        <Form
                          onFinish={this.handleAddVaUser}
                          name="vaUser"
                          initialValues={{
                            name: "",
                            email: "",
                            password: "",
                          }}
                          scrollToFirstError
                        >
                          <div>
                            <Form.Item
                              name="name"
                              label="Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the user name!",
                                },
                              ]}
                              onChange={(e) => {
                                this.setState({ name: e.target.value });
                              }}
                            >
                              <Input
                                addonBefore={this.prefixSelector}
                                style={{
                                  width: "100%",
                                }}
                              />
                            </Form.Item>
                          </div>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              {
                                type: "email",
                                required: true,
                                message: "Please input  email!",
                              },
                            ]}
                            onChange={(e) => {
                              this.setState({ email: e.target.value });
                            }}
                            hasFeedback
                          >
                            <Input
                              addonBefore={this.prefixSelector}
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="roles"
                            label="Role"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please select your Audience To Notify!",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              style={{ width: "100%" }}
                              options={[
                                { label: "Guest", value: "Guest", key: 0 },
                                { label: "Admin", value: "Admin", key: 1 },
                                {
                                  label: "Shop Owner",
                                  value: "Shop Owner",
                                  key: 2,
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                              {
                                required: true,
                                message: "Please input the password!",
                              },
                            ]}
                            onChange={(e) => {
                              this.setState({ password: e.target.value });
                            }}
                            hasFeedback
                          >
                            <Input.Password />
                          </Form.Item>
                          <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 17 }}
                          >
                            <Button
                              onClick={(e) => {
                                this.setState({
                                  visibleVaUser: !this.state.visibleVaUser,
                                });
                              }}
                              htmlType="button"
                            >
                              Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Add
                            </Button>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Modal
                        visible={this.state.visibleEditVaUser}
                        title="Edit Form"
                        onCancel={(e) => {
                          e.preventDefault();
                          this.setState({
                            visibleEditVaUser: !this.state.visibleEditVaUser,
                          });
                        }}
                        width={600}
                        footer={null}
                      >
                        <Form
                          {...layout}
                          name="nest-messages"
                          onFinish={this.handleUpdateVaUser}
                          validateMessages={validateMessages}
                          initialValues={{
                            name: this.state.vaUserToUpdate.name,
                            email: this.state.vaUserToUpdate.email,
                            password: this.state.password,
                            roles: this.state.roles,
                          }}
                        >
                          <Form.Item
                            name={"name"}
                            label="Name"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name={"email"}
                            label="Mail"
                            rules={[{ required: true, type: "email" }]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name="roles"
                            label="Role"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please select your Audience To Notify!",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              style={{ width: "100%" }}
                              options={[
                                { label: "Guest", value: "Guest", key: 0 },
                                { label: "Admin", value: "Admin", key: 1 },
                                {
                                  label: "Shop Owner",
                                  value: "Shop Owner",
                                  key: 2,
                                },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            name={"password"}
                            label="Password"
                            rules={[{ required: true }]}
                          >
                            <Input.Password />
                          </Form.Item>
                          <Divider></Divider>

                          <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 16 }}
                          >
                            <Button
                              onClick={(e) => {
                                this.setState({
                                  visibleEditVaUser: !this.state
                                    .visibleEditVaUser,
                                });
                              }}
                              htmlType="button"
                            >
                              Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Submit
                            </Button>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Modal
                        visible={this.state.visibleShop}
                        title="Shop Form"
                        onOk={this.handleShopOk}
                        onCancel={this.handleShopCancel}
                        width={600}
                        footer={[
                          <Button key="back" onClick={this.handleShopCancel}>
                            Return
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            loading={this.state.loading}
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleAddShop();
                            }}
                          >
                            Submit
                          </Button>,
                        ]}
                      >
                        <Form
                          name="shop"
                          /*                           onFinish={this.onFinish}
                           */ initialValues={{
                            name: "",
                            apiKey: "",
                            apiSecret: "",
                            /* residence: ["zhejiang", "hangzhou", "xihu"],
                            prefix: "86", */
                          }}
                          scrollToFirstError
                        >
                          <div>
                            <Form.Item
                              name="name"
                              label="Shop Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your shop name!",
                                },
                              ]}
                              onChange={(e) => {
                                this.setState({ shopName: e.target.value });
                              }}
                            >
                              <Input
                                addonBefore={this.prefixSelector}
                                style={{
                                  width: "100%",
                                }}
                              />
                            </Form.Item>
                          </div>

                          <Form.Item
                            name="apiKey"
                            label="Api Key"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Api Key!",
                              },
                            ]}
                            onChange={(e) => {
                              this.setState({ ApiKey: e.target.value });
                            }}
                            hasFeedback
                          >
                            <Input.Password />
                          </Form.Item>

                          <Form.Item
                            name="apiSecret"
                            label="Api Secret"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Api Secret!",
                              },
                            ]}
                            onChange={(e) => {
                              this.setState({ apiSecret: e.target.value });
                            }}
                            hasFeedback
                          >
                            <Input.Password />
                          </Form.Item>
                          <Form.Item
                            name="automaticFulfillment"
                          >
                            <Checkbox onChange={this.setAutomatic}>Allow Automatic Fulfillment</Checkbox>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Modal
                        visible={this.state.visibleEditShop}
                        title="Shop Edit Form"
                        /*                         onOk={this.handleShopOk}
                         */ onCancel={(e) => {
                          e.preventDefault();
                          this.setState({
                            visibleEditShop: !this.state.visibleEditShop,
                          });
                        }}
                        width={600}
                        footer={null}
                      >
                        <Form
                          {...layout}
                          name="nest-messages"
                          onFinish={this.handleUpdateShop}
                          validateMessages={validateMessages}
                          initialValues={{
                            name: this.state.shopToUpdate.name,
                            apiKey: this.state.shopToUpdate.apiKey,
                            apiSecret: this.state.shopToUpdate.apiSecret,
                            automaticFulfillment: this.state.shopToUpdate.automaticFulfillment
                            /* residence: ["zhejiang", "hangzhou", "xihu"],
                            prefix: "86", */
                          }}
                        >
                          <Form.Item
                            name={"name"}
                            label="Name"
                            rules={[{ required: true }]}
                          >
                            <Input disabled />
                          </Form.Item>
                          <Form.Item
                            name={"apiKey"}
                            label="Api Key"
                            rules={[{ required: true }]}
                          >
                            <Input.Password />
                          </Form.Item>
                          <Form.Item
                            name={"apiSecret"}
                            label="Api Secret"
                            rules={[{ required: true }]}
                          >
                            <Input.Password />
                          </Form.Item>

                          <Form.Item
                            name="automaticFulfillment"
                            valuePropName="checked"
                          >
                            <Checkbox name="automaticFulfillment">Allow Automatic Fulfillment</Checkbox>
                          </Form.Item>
                          <Divider></Divider>

                          <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 16 }}
                          >
                            <Button
                              onClick={(e) => {
                                this.setState({
                                  visibleEditShop: !this.state.visibleEditShop,
                                });
                              }}
                              htmlType="button"
                            >
                              Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Submit
                            </Button>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <Row gutter="16">
                        {/*  <Col sm={24} md={8}>
                          <p className="mt-0 mr-3 text-muted text-md-left text-center">
                            It is a long established fact that a reader will be
                            distracted.
                          </p>
                        </Col> */}
                        <Col xs={24} sm={24} md={8}>
                          <Row className="mb-2">
                            <Col xs={12} sm={12} md={9}>
                              <Icon
                                type={MailOutlined}
                                className="text-primary font-size-md"
                              />
                              <span className="text-muted ml-2">Email:</span>
                            </Col>
                            <Col xs={12} sm={12} md={15}>
                              <span className="font-weight-semibold">
                                {this.props.authUser.user.email}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={12} md={9}>
                              <Icon
                                type={PhoneOutlined}
                                className="text-primary font-size-md"
                              />
                              <span className="text-muted ml-2">Phone:</span>
                            </Col>
                            <Col xs={12} sm={12} md={15}>
                              <span className="font-weight-semibold">
                                {this.props.authUser.user.phone}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                          <Row className="mb-2 mt-2 mt-md-0 ">
                            <Col xs={12} sm={12} md={9}>
                              <Icon
                                type={HomeOutlined}
                                className="text-primary font-size-md"
                              />
                              <span className="text-muted ml-2">Address: </span>
                            </Col>
                            <Col xs={12} sm={12} md={15}>
                              <span className="font-weight-semibold">
                                {this.props.authUser.user.address.streetName},
                                {this.props.authUser.user.address.city}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col xs={12} sm={12} md={9}>
                              <Icon
                                type={GlobalOutlined}
                                className="text-primary font-size-md"
                              />
                              <span className="text-muted ml-2">
                                Shoppify Link:
                              </span>
                            </Col>
                            <Col xs={12} sm={12} md={15}>
                              <span className="font-weight-semibold">
                                {this.props.authUser.user.shopifyLink}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}{" "}
              </Col>
            </Row>
          </Card>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={7}>
              <Card
                title="Store List"
                extra={
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={this.showShopModal}
                  >
                    +
                  </Button>
                }
              >
                <div className="mt-3">
                  {this.props.shops.loading ? (
                    <Loading></Loading>
                  ) : (
                    this.props.shops.shops.shops.map((elm, i) => (
                      <div
                        key={elm._id}
                        className={`d-flex align-items-center justify-content-between mb-4`}
                      >
                        <AvatarStatus
                          id={elm._id}
                          name={elm.name}
                        />
                        <div>
                          <EllipsisDropdown menu={this.dropdownMenu(elm)} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={17}>
              <Card
                title="Staff Accounts"
                extra={
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={this.showVaUserModal}
                  >
                    +
                  </Button>
                }
                /*                 extra={cardDropdown(vaUserActionList)}
                 */
              >
                {this.props.vaUsers.loading ? (
                  <Loading></Loading>
                ) : (
                  <Table
                    className="no-border-last"
                    columns={tableColumns}
                    dataSource={this.props.vaUsers.vaUsers.vaUsers}
                    rowKey="id"
                    pagination={false}
                  />

                  /*              this.props.vaUsers.vaUsers.vaUsers.map((elm, i) => (
                      <div
                        key={elm._id}
                        className={`d-flex align-items-center justify-content-between mb-4`}
                      >
                        <AvatarStatus
                          id={elm._id}
                          src={elm.img}
                          name={elm.name}
                          subTitle={elm.title}
                        />
                        <div>
                          <EllipsisDropdown
                            menu={this.vaUserdropdownMenu(elm)}
                          />
                        </div>
                      </div>
                    )) */
                )}
              </Card>
            </Col>
          </Row>

          {/* <Card title="VA Users List" bodyStyle={{ padding: "0px" }}>
            <br/>
            <Table columns={tableColumns} dataSource={users} rowKey="id" />
            <UserView
              data={selectedUser}
              visible={userProfileVisible}
              close={() => {
                this.closeUserProfile();
              }}
            />
          </Card> */}
          {/*  <Row gutter="16">
            <Col xs={24} sm={24} md={8}>
              <Connection />
              <Group />
            </Col>
            <Col xs={24} sm={24} md={16}>
              <Experiences />
              <Interested />
            </Col>
          </Row> */}
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    authUser: state.authUser,
    shops: state.shops,
    vaUsers: state.vaUsers,
  };
}
const matchDispatchToProps = {
  loadUser,
  getShops,
  addShop,
  updateShop,
  deleteShop,
  createVaUser,
  loadVaUsers,
  deleteVaUser,
  updateVaUser,
  updateUser,
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
