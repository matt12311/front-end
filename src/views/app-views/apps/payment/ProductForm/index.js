import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message, Select, Modal, Input} from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'
import ItemsField from './ItemsField'
import ProductListData from "assets/data/product-list.data.json"
import { connect } from "react-redux";
import {
	getShopsForPayment,
	getPaymentMethods,
	charge
  } from "redux/actions";

const { Option } = Select;

const { TabPane } = Tabs;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = props => {

	const { mode = ADD, param } = props

	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [transaction,setTranscation]=useState("")


	useEffect(() => {
    	if(mode === EDIT) {
			console.log('is edit')
			console.log('props', props)
			const { id } = param
			const produtId = parseInt(id)
			const productData = ProductListData.filter( product => product.id === produtId)
			const product = productData[0]
			form.setFieldsValue({
				comparePrice: 0.00,
				cost: 0.00,
				taxRate: 6,
				description: 'There are many variations of passages of Lorem Ipsum available.',
				category: product.category,
				name: product.name,
				price: product.price
			});
			setImage(product.image)
		}
  	}, [form, mode, param, props]);
	
	  const userlist =()=> {
		return props.contacts.map((user) =>
			<Option key={user._id} value={user._id}>{user.firstName} {user.lastName} </Option>
		)
	}

	const shoplist =()=> {
		if(props.shops.paymentShops){
			return props.shops.paymentShops.map((user) =>
			<Option key={user._id} value={user.name}>{user.name}</Option>
		)
		}else {
			<Option key={1} disabled value={1}>None</Option>
		}
		
	}
	const methodslist =()=> {
		if(props.methods.methods){
			return props.methods.methods.map((user) =>
			<Option key={user._id} value={user.vaultID}>•••• •••• •••• {user.endings}</Option>
		)
		}else {
			<Option key={1} disabled value={1}>None</Option>
		}
		
	}
	const handleUploadChange = info => {
		if (info.file.status === 'uploading') {
			setUploadLoading(true)
			return;
		}
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj, imageUrl =>{
				setImage(imageUrl)
				setUploadLoading(true)
			});
		}
	};

	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			let data={}
			data.invoice=values
			let sum=0
			data.invoice.items.map(item=>{
				sum= sum+ item.price*item.quantity
			})
			data.invoice.totalAmout=sum+sum*0.03
			data.amount=data.invoice.totalAmout
			data.vaultID=data.invoice.payMethod
			data.operation=data.invoice.operation
			setTranscation(data)
			setTimeout(() => {
				setSubmitLoading(false)
				if(mode === ADD) {
					setVisible(true)
					console.log(transaction)
					message.success(`Charging ${values.shopName} the amount ${transaction.amount}`);
				}
				if(mode === EDIT) {
					message.success(`Product saved`);
				}
			}, 1500);
		}).catch(info => {
			setSubmitLoading(false)
			console.log('info', info)
			message.error('Please enter all required field ');
		});
	};
	const oncancel=()=>{
		setVisible(false)
	}

	const onOk=()=> {
		console.log(transaction)
		props.charge(transaction)
		setVisible(false)
	  }

	return (
		<>
		<Modal
          title="Modal"
          visible={visible}
          onCancel={oncancel}
		  onOk={onOk}
		  
        //   okText="Agree"
        //   cancelText="Cancel"
        >
          <Form
        layout="horizontal"
        form={form}
        initialValues={{ amount: transaction.amount, extra:0 }}
      >
			<Form.Item  name="amount" label="Total Amount">
			<Input disabled placeholder="Amount" />
			</Form.Item>
			<Form.Item name="extra" label="Extra Fees">
			<Input placeholder="Fees" />
			</Form.Item>
		</Form>
        </Modal>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{
					heightUnit: 'cm',
					widthUnit: 'cm',
					weightUnit: 'kg'
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Create an invoice and charge' : `Edit Product`} </h2>
							<div className="mb-3">
								{/* <Button className="mr-2">Discard</Button> */}
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Charge' : `Save`}
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<div className="container">
					<Tabs defaultActiveKey="1" style={{marginTop: 30}}>
						<TabPane tab="General" key="1">
							<GeneralField 
								uploadedImg={uploadedImg} 
								uploadLoading={uploadLoading} 
								handleUploadChange={handleUploadChange}
								userlist={userlist}
								getShops={props.getShops}
								shoplist={shoplist}
								getPayments={props.getPaymentMethods}
								methodslist={methodslist}
							/>
						</TabPane>
						 <TabPane tab="Items" key="2">
							<ItemsField />
						</TabPane> 
						{/*
						<TabPane tab="Shipping" key="3">
							<ShippingField />
						</TabPane>*/}
					</Tabs>
				</div>
			</Form>
		</>
	)
}
const mapStateToProps = (state) => {
	return {
		contacts: state.chatApp.allContacts,
		authUser: state.authUser,
		shops: state.shops,
		selectedShop: state.shops.selectedShop,
		tracking:state.tracking,
		methods: state.methods,

	};
};

const mapDispatchToProps = {
	getShops:getShopsForPayment,
	getPaymentMethods: getPaymentMethods,
	charge:charge

}
export default connect(mapStateToProps, mapDispatchToProps)(ProductForm)

