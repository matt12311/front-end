import React from 'react'
import { Input, Row, Col, Card, Form, Upload, InputNumber, message, Select } from 'antd';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import { LoadingOutlined } from '@ant-design/icons';

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
			required: true,
			message: 'Please enter product description or a link',
		}
	],
	price: [
		{
			required: false,
			message: 'Please enter current price',
		}
	],
	comparePrice: [		
	],
	taxRate: [		
		{
			required: false,
			message: 'Please enter desired shipping time',
		}
	],
	cost: [		
		{
			required: false,
			message: 'Please enter current shipping time',
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
	<Row gutter={25}>
		<Col xs={24} sm={24} md={24}>
			<Card title="Basic Info">
				<Form.Item name="productName" label="Product name" rules={rules.productName}>
					<Input placeholder="Product Name" />
				</Form.Item>
				<Form.Item name="linkDescription" label="Links & Description" rules={rules.linkDescription}>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Card>
			{props.isWH?(null):(<Card title="Pricing">
				<Row gutter={25}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="currentPrice" label="Current Price" rules={rules.currentPrice}>
						<InputNumber
						   
							className="w-100"
							formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={value => value.replace(/\$\s?|(,*)/g, '')}
						/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="goalPrice" label="Goal price" rules={rules.goalPrice}>
							<InputNumber
							   
								className="w-100"
								value={0}
								formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="currentShippingTime" label="Current Shipping Time" rules={rules.currentShippingTime}>
							<InputNumber
							   
								className="w-100"
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="desiredShippingTime" label="Desired Shipping Time" rules={rules.desiredShippingTime}>
							<InputNumber
							   
								className="w-100"
								formatter={value => `${value}`}
								parser={value => value.replace('%', '')}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Card>)}
			
		</Col>

	</Row>
)

export default GeneralField
