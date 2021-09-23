import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Form, Input, Button, Row, Col, Card, message, Select, Upload } from "antd";
import Flex from "components/shared-components/Flex";
import { connect } from "react-redux";
import { getUsers, updateUserAdmin } from "../../../../../redux/actions";
import { LoadingOutlined } from "@ant-design/icons";
import CustomIcon from "components/util-components/CustomIcon";
import { ImageSvg } from "assets/svg/icon";

const { Dragger } = Upload;
const { Option } = Select;


const imageUploadProps = {
  name: "file",
  multiple: true,
  listType: "picture-card",
  showUploadList: false,
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const UserForm = (props) => {
  let history = useHistory();
  const { param, getUsers, authUser, updateUserAdmin } = props;

  const formRef = React.createRef();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const { id } = param;
    const userData = authUser.users.filter((user) => user._id === id);
    const user = userData[0];
    setUser(userData[0]);
    if (user == undefined) {
      history.push(`/app/admin-tools/user-list`);
    } else {
      console.log(user);
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        email: user.email,
        gender: user.gender,
        birthday: user.birthday,
        streetName: user.address.streetName,
        city: user.address.city,
        province: user.address.province,
        zipCode: user.address.zipCode,
        country: user.address.country,
        phone: user.phone,
        companyName: user.companyName,
        //introduction: user.introduction,
        shopifyLink: user.shopifyLink,
        officialId: user.officialId
      });
    }
  }, [form, param, props]);

  const onFinish = () => {
    setSubmitLoading(true);
    form
      .validateFields()
      .then((values) => {
        let body = {
          name: values.name,
          roles: values.roles,
          email: values.email,
          gender: values.gender,
          birthday: values.birthday,
          address: {
            streetName: values.streetName,
            city: values.city,
            province: values.province,
            zipCode: values.zipCode,
            country: values.country,
          },
          phone: values.phone,
          companyName: values.companyName,
          shopifyLink: values.shopifyLink,
          newPassword: values.newPassword,
        };
        const { id } = param;
        updateUserAdmin(id, body).then(() => {
          getUsers();
          history.push(`/app/admin-tools/user-list`);
          setSubmitLoading(false);
        });
      })
      .catch((info) => {
        setSubmitLoading(false);
        message.error("Please enter all required field ");
      });
  };

  function onGenderChange(value) {
    formRef.current.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  }
  return (
    <>
      <Form
        ref={formRef}
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{}}
        scrollToFirstError
      >
        <PageHeaderAlt className="border-bottom mb-3" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center"
            >
              <h2 className="mb-3">Update User </h2>
              <div className="mb-3">
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  Update
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <Card>
          <Row>
            <Col span={11}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a option and change input text above"
                  onChange={onGenderChange}
                  allowClear
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="birthday"
                label="Birthday"
                rules={[
                  {
                    required: true,
                    message: "Please input your birthday!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <Form.Item
                name="streetName"
                label="Street Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Street Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Form.Item
                name="city"
                label="City"
                rules={[
                  {
                    required: true,
                    message: "Please input your city!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Form.Item
                name="province"
                label="Province"
                rules={[
                  {
                    required: true,
                    message: "Please input your province!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
              <Form.Item
                name="country"
                label="Country"
                hasFeedback
                rules={[
                  { required: true, message: "Please select your country!" },
                ]}
              >
                <Select placeholder="Please select a country">
                  <Option value="china">China</Option>
                  <Option value="usa">U.S.A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={2}>
              <Form.Item
                name="zipCode"
                label="ZipCode"
                rules={[
                  {
                    required: true,
                    message: "Please input your zipCode!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your company name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="shopifyLink"
                label="Shopify Link"
                rules={[
                  {
                    required: true,
                    message: "Please input your shopifyLink!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="roles"
                label="Roles"
                rules={[
                  {
                    required: true,
                    message: "Please select your Audience To Notify!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  options={[
                    { label: "Guest", value: "Guest", key: 0 },
                    { label: "Admin", value: "Admin", key: 1 },
                    { label: "Shop Owner", value: "Shop Owner", key: 2 },
                    { label: "Warehouse", value: "Warehouse", key: 3 },
                    { label: "Admin VA", value: "Admin VA", key: 3 },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Form.Item
                name="newPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
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
              <Form.Item>
                <img src={user.officialId}></img>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authUser: state.authUser,
  };
};

const mapDispatchToProps = {
  getUsers: getUsers,
  updateUserAdmin: updateUserAdmin,
};
export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
