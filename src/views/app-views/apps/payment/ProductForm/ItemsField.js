import React from 'react'
import { Input, Row, Col, Card, Form, Button, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const ItemsField = props => (
	<Card title="Items">
		<p>Add a custome variat options for your invoices.</p>
		<Form.List name="items">
			{(fields, { add, remove }) => {
				return (
					<div className="mt-3">
						{fields.map((field, index) => (
							<Row key={field.key} gutter={16}> 
								<Col sm={24} md={7}>
									<Form.Item
										{...field}
										label="Description"
										name={[field.name, 'variant']}
										fieldKey={[field.fieldKey, 'items']}
										rules={[{ required: true, message: 'Please enter incoice description' }]}
										className="w-100"
									>
										<Input />
									</Form.Item>
								</Col>
								<Col sm={24} md={7}>
									<Form.Item
										{...field}
										label="Unit Price"
										name={[field.name, 'price']}
										fieldKey={[field.fieldKey, 'price']}
										rules={[{ required: true, message: 'Please enter invoice price' }]}
										className="w-100"
									>
										<InputNumber
											className="w-100"
											formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={value => value.replace(/\$\s?|(,*)/g, '')}
										/>
									</Form.Item>
								</Col>
								<Col sm={24} md={7}>
									<Form.Item
										{...field}
										label="Quantity"
										name={[field.name, 'quantity']}
										fieldKey={[field.fieldKey, 'quantity']}
										rules={[{ required: true, message: 'Please enter the quantity' }]}
										className="w-100"
									>
										<InputNumber
											className="w-100"
											formatter={value => `# ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										/>
									</Form.Item>
								</Col>
                                {/* <Col sm={24} md={5}>
									<Form.Item
										{...field}
										label="Amount"
										name={[field.name, 'amount']}
										fieldKey={[field.fieldKey, 'amount']}
										rules={[{ required: true, message: 'Please enter invoice amount' }]}
										className="w-100"
									>
										<InputNumber
											disabled
											className="w-100"
											value={21}
										/>
									</Form.Item>
								</Col> */}
								<Col sm={24} md={2}>
									<MinusCircleOutlined className="mt-md-4 pt-md-3" onClick={() => { remove(field.name)}} />
								</Col>

							</Row>
						))}
						<Form.Item>
							<Button type="dashed" onClick={() => { add()}} className="w-100">
								<PlusOutlined /> Add field
							</Button>
						</Form.Item>
					</div>
				);
			}}
		</Form.List>
	</Card>
)

export default ItemsField
