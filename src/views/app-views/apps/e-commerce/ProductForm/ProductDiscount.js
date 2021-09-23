import React from "react";
import { Input, Row, Col, Card, Form, Button, InputNumber, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductDiscount = (props) => (
  <Card title="Discounts">
    <p>Add a custome discount options for your product.</p>
    <Form.List name="discount">
      {(fields, { add, remove }) => {
        return (
          <div className="mt-3">
            {fields.map((field, index) => (
              <Row key={field.key} gutter={16}>
                <Col sm={24} md={7}>
                  <Form.Item
                    {...field}
                    label="Quantity"
                    name={[field.name, "quantity"]}
                    fieldKey={[field.fieldKey, "quantity"]}
                    rules={[
                      { required: true, message: "Please enter quantity" },
                    ]}
                    className="w-100"
                  >
                    <Input disabled={!(!props.isAdmin || !props.isWH)} />
                  </Form.Item>
                </Col>
                <Col sm={24} md={7}>
                  <Form.Item
                    name={[field.name, "condition"]}
                    label="Condition"
                    rules={[
                      {
                        required: true,
                        message: "Please select a condition",
                      },
                    ]}
                  >
                    <Select placeholder="Please select a condition">
                      <Option value="china">=</Option>
                      <Option value="usa">></Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={24} md={7}>
                  <Form.Item
                    name={[field.name, "price"]}
                    label="Discounted Amount"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={!(!props.isAdmin || !props.isWH)}
                      className="w-100"
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={2}>
                  <MinusCircleOutlined
                    className="mt-md-4 pt-md-3"
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Col>
                <Col span={24}>
                  <hr className="mt-2" />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                disabled={!(!props.isAdmin || !props.isWH)}
                onClick={() => {
                  add();
                }}
                className="w-100"
              >
                <PlusOutlined /> Add field
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  </Card>
);

export default ProductDiscount;
