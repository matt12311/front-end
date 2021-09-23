import React, { useEffect, useState } from "react";
import { Form, Modal, Select } from "antd";
import { getOtherPeople } from "react-chat-engine";

const AddMemberModal = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  console.log(`member data ${form.getFieldValue("user")}`);
  useEffect(() => {
    if (props.data && props.visible) {
      getOtherPeople(
        props.authObject,
        props.data.key,
        (data, users) => {
          setData(users);
        },
        console.log
      );
    }
  }, [props.data, props.visible]);

  return (
    <Modal
      getContainer={false}
      visible={props.visible}
      okButtonProps={{ title: "Submit" }}
      onOk={() => {
        props.submit(form.getFieldValue("user"));
        form.resetFields();
      }}
      onCancel={props.close}
      title="Add User"
    >
      <Form form={form}>
        <Form.Item name="user" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select user">
            {data.map((user) => (
              <Select.Option key={user.username} value={user.username}>
                {user.username}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMemberModal;
