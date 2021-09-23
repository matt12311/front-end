import React from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Upload,
  InputNumber,
  message,
  Select,
} from "antd";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import { LoadingOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],
  sku: [
    {
      required: false,
      message: "Please enter sku",
    },
  ],
  price: [
    {
      required: true,
      message: "Please enter price",
    },
  ],
  quantity: [
    {
      required: false,
      message: "Please enter quantity",
    },
  ],
  description: [
    {
      required: false,
      message: "Please enter product description",
    },
  ],
  comparePrice: [],
  taxRate: [
    {
      required: false,
      message: "Please enter tax rate",
    },
  ],
  cost: [
    {
      required: false,
      message: "Please enter item cost",
    },
  ],
};

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

/* const categories = ["Cloths", "Bags", "Shoes", "Watches", "Devices"];
const tags = [
  "Cotton",
  "Nike",
  "Sales",
  "Sports",
  "Outdoor",
  "Toys",
  "Hobbies",
]; */

const GeneralField = (props) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={17}>
      <Card title="Product Info">
        <Form.Item name="name" label="Product name" rules={rules.name}>
          <Input placeholder="Product Name" disabled={true} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={rules.description}
        >
          <Input.TextArea rows={4} disabled={!(!props.isAdmin || !props.isWH)} />
        </Form.Item>
      </Card>
      <Card title="Pricing">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name={props.isWH?("whPrice"):("price")} label="Price" rules={rules.price}>
              <InputNumber
                className="w-100"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                disabled={!(!props.isAdmin || !props.isWH)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="sku" label="Sku" rules={rules.sku}>
              <Input
                className="w-100"
                type="text"
                disabled={!(!props.isAdmin || !props.isWH)}
                /* formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */
                /* parser={value => value.replace(/\$\s?|(,*)/g, '')} */
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="quantity" label="Quantity" rules={rules.quantity}>
              <InputNumber
                className="w-100"
                disabled={!(!props.isAdmin || !props.isWH)}
                /* formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')} */
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="status"
              label="Product Status"
              hasFeedback
              rules={[
                { required: false, message: "Please select product status!" },
              ]}
            >
              <Select disabled={!(!props.isAdmin || !props.isWH)} placeholder="Please select a product status">
                <Option value="In Stock">In Stock</Option>
                <Option value="Out of Stock">Out of Stock</Option>
                <Option value="Limited Stock">Limited Stock</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={24} md={12}>
						<Form.Item name="comparePrice" label="Compare price" rules={rules.comparePrice}>
							<InputNumber
								className="w-100"
								value={0}
								formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col> */}
          {/* <Col xs={24} sm={24} md={12}>
						<Form.Item name="cost" label="Cost per item" rules={rules.cost}>
							<InputNumber
								className="w-100"
								formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col> */}
          {/* 	<Col xs={24} sm={24} md={12}>
						<Form.Item name="taxRate" label="Tax rate" rules={rules.taxRate}>
							<InputNumber
								className="w-100"
								min={0}
								max={100}
								formatter={value => `${value}%`}
								parser={value => value.replace('%', '')}
							/>
						</Form.Item>
					</Col> */}
        </Row>
      </Card>
    </Col>
   
  </Row>
);

export default GeneralField;
