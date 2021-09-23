import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import VariationField from './VariationField'
import ShippingField from './ShippingField'
import ProductListData from "assets/data/product-list.data.json"
import {addRequestProduct,getRequestProducts,updateRequestProduct} from 'redux/actions';
import { connect } from "react-redux";


const { TabPane } = Tabs;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const RequestProductForm = props => {

	const { mode = ADD, param, addRequestProduct, updateRequestProduct, requestProducts } = props

	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)

	useEffect(() => {
    	if(mode === EDIT) {
			console.log('props', props)
			const { id } = param
			const requestProductData = requestProducts.requestProducts.products.filter( requestProduct => requestProduct._id === id)
			const requestProduct = requestProductData[0]
			form.setFieldsValue({
				productName: requestProduct.productName,
				linkDescription: requestProduct.linkDescription,
				currentPrice: requestProduct.currentPrice,
				goalPrice: requestProduct.goalPrice,
				currentShippingTime:requestProduct.currentShippingTime,
				desiredShippingTime: requestProduct.desiredShippingTime
			});
		}
  	}, [form, mode, param, props]);

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
			/* values.images=imgPath */
		    if(mode===EDIT){
				updateRequestProduct(param.id,values)
			} 
			if(mode===ADD){
				values.createdBy=props.authUser.user.name
				if (props.shops.selectedShop===null){
					values.shopName= props.shops.shops.shops[0].name
				}
				else{
					values.shopName=props.shops.selectedShop.name
				}
				
				addRequestProduct(values)
			}
			setTimeout(() => {
				setSubmitLoading(false)
				
			}, 1500);
		}).catch(info => {
			setSubmitLoading(false)
			console.log('info', info)
			message.error('Please enter all required field ');
		});
	};


	return (
		<>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{
					price: 0,
					currentPrice: 0,
					currentShippingTime: 0,
					desiredShippingTime:0,
					goalPrice:0
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Add New Request Product' : `Edit Request Product`} </h2>
							<div className="mb-3">

							{mode === 'ADD'? (<><Button className="mr-2">Discard</Button>
								<Button type="primary" onClick={(e) => {e.preventDefault(); onFinish()}} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Add' : `Save`}
								</Button></>) : (null)
							}
								
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
								isWH={props.authUser.user.roles.includes("WAREHOUSE")}
								handleUploadChange={handleUploadChange}
							/>
						</TabPane>
					</Tabs>
				</div>
			</Form>
		</>
	)
}
const mapStateToProps = (state) => {
	return {
		authUser: state.authUser,
		requestProducts: state.requestProducts,
		shops:state.shops
	  };
  };
  
  const mapDispatchToProps = {
	addRequestProduct,
	updateRequestProduct,
	getRequestProducts
  }

export default connect(mapStateToProps,mapDispatchToProps)(RequestProductForm)
