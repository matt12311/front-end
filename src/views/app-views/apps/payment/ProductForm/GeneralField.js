import React from 'react'
import { Input, Row, Col, Card, Form, Upload, InputNumber, message, Select,DatePicker } from 'antd';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import { LoadingOutlined } from '@ant-design/icons';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter product name',
		}
	],
	description: [
		{
			required: false,
			message: 'Please enter product description',
		}
	],
	whom: [
		{
			required: true,
			message: 'Select to whom you want to perform',
		}
	],
	methods: [		
		{
			required: true,
			message: 'Please enter method',
		}
	],
	operation: [		
		{
			message: 'Please enter operation',
		}
	]
}

const imageUploadProps = {
  name: 'file',
	multiple: true,
	listType: "picture-card",
	showUploadList: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
}

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']
const tags = ['Cotton', 'Nike', 'Sales', 'Sports', 'Outdoor', 'Toys', 'Hobbies' ]

const GeneralField = props => (
	<Row gutter={24}>
		<Col xs={24} sm={24} md={24}>
		<Card title="Pricing">
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="to" label="To" rules={rules.whom}>
							<Select defaultValue="Select a shop owner" onChange={e=>{
								props.getShops(e,1,22)
								props.getPayments(e)
							}
							}>
								{props.userlist()}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="date" label="Date" >
							<DatePicker/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="operation" label="Operation" rules={rules.operation}  >
							<Select defaultValue="Select an operation" onChange={e=>{
								console.log(e)
							}} >
							<Option value="Sale">Sale</Option>
							<Option value="Refund">Refund</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="payMethod" label="Payment Method" rules={rules.methods}>
						<Select defaultValue="Select a payment method" onChange={e=>{
								console.log(e)
							}
							}>
								{props.methodslist()}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Card>
			<Card title="Invoice Info">
				<Form.Item name="shopName" label="Shop Name" rules={rules.name}>
					<Select defaultValue="Shopify Name" onChange={e=>{
								console.log(e)
					}
					}>
						{props.shoplist()}
					
					</Select>
				</Form.Item>
				<Form.Item name="description" label="MEMO" rules={rules.description}>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Card>
		</Col>
	</Row>
)

export default (GeneralField)