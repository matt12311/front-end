import React, { useEffect } from "react";
import { Form, Input, Modal } from "antd";

const UpdateNameModal = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.data) {
      form.setFieldsValue({ newName: props.data.title });
    }
  }, [props.data]);

  return (
    <Modal
      getContainer={false}
      visible={props.visible}
      okButtonProps={{ title: "Submit" }}
      onOk={() => props.submit(form.getFieldValue("newName"))}
      onCancel={props.close}
      title="Update Room Name"
    >
      <Form form={form}>
        <Form.Item name="newName" rules={[{ required: true }]}>
          <Input placeholder="Please enter new name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateNameModal;
