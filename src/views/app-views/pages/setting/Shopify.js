import React, { Component } from 'react'
import { connect } from "react-redux";
import { Table, Button, Tooltip, Form, Modal, Input, Row, Col, Select } from 'antd';
import {
  getShops,
  addShop,
  updateShop,
  deleteShop,
} from "../../../../redux/actions";

import { DeleteOutlined, CreditCardOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
const { confirm } = Modal;

const { Option } = Select;

const { Column } = Table;

const AddNewCardForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title="Add new shop"
      visible={visible}
      okText="Save shop"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        name="addShopForm"
        layout="vertical"
      >
        <Form.Item
          label="Shop name"
          name="name"
          rules={
            [
              { 
                require: true,
                message: 'Please enter shop name!' 
              }
            ]
          }
        >
          <Input  placeholder="Shop name" />
        </Form.Item>
        <Form.Item
          label="API key"
          name="apiKey"
          hasFeedback
          rules={
            [
              { 
                message: 'Please enter a API Key of the shop!' 
              }
            ]
          }
        >
          <Input  placeholder="API Key" />
        </Form.Item>
        <Form.Item
          label="API secret"
          name="apiSecret"
          hasFeedback
          rules={
            [
              { 
                message: 'Please enter a API Secret of the shop!' 
              }
            ]
          }
        >
          <Input  placeholder="API secret" />
        </Form.Item>
        <Form.Item
          label="Starting Order"
          name="startingOrder"
          hasFeedback
          rules={
            [
              { 
                message: 'Please enter a starting order of the shop to fulfill!' 
              }
            ]
          }
        >
          <Input  placeholder="Starting Order" />
        </Form.Item>
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Auto Fill"
              name="automaticFulfillment"
            >
            <Select name="automaticFulfillment" defaultValue="Choose">
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
            </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export class Shops extends Component {

	state = {
    selectedRowKeys: ["card-1"], // Check here to configure the default column
    ShopDetails : [
    ],
    modalVisible: false,
    newCreditCardInfo: {
      cardHolderName: '',
      cardNumber: '',
      exp: '06/22'
    },
    tableData:[]
  };
  // componentDidMount(){
  //   this.props.getShops()
  // }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  }
  showDeleteConfirm(getShops, deleteShop,ownerId, id) {
   
    confirm({
      title: "Are you sure to delete this shop?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {

        return new Promise((resolve, reject) => {
          deleteShop(id);
          getShops(ownerId, 1, 0);
          setTimeout(Math.random() > 0.5 ? resolve : reject, 600);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
        console.log("Cancel");
      },
    });

  }
  makeData(){
    var data= []

    this.props.shops.shops.shops.map((item,index)=>{
      data.push(Object.assign(item[index],item))
    })
    console.log(data)
    console.log(data.length)
    return data
  }
  addCard = values => {
    console.log(values)
    this.props
      .addShop(
        this.props.authUser.user._id,
        values.name,
        values.apiKey,
        values.apiSecret,
        values.automaticFulfillment,
        values.startingOrder
      )
      .then(() => {
        this.props.getShops(this.props.authUser.user._id, 1, 0);
        setTimeout(() => {
          this.setState({ modalVisible: false });
        }, 600);
      });

  };

	render() {
		const { selectedRowKeys, ShopDetails, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    };

    const locale = {
      emptyText: (
        <div className="text-center my-4">
          <img src="/img/others/shopify.png" alt="Please add a shopify store !" style={{maxWidth: '90px'}}/>
          <h3 className="mt-3 font-weight-light">Please add a shopify store !</h3>
        </div>
      )
    };
 
		return (
			<>
				<h2 className="mb-4">Shopify</h2>
        {this.props.shops.loading?(console.log("loading")):(
          <Table locale={locale} dataSource={this.props.shops.shops.shops} pagination={true} rowKey={(record)=>record._id}>
					<Column 
            title="Shop Name" 
            key="name" 
            render={(text, record) => (
              <>
                <img src={"/img/others/shopify.png"}/>
                <span className="ml-2">{record.name}</span>
              </>
            )}
          />
  					<Column title="Auto Fill" dataIndex="automaticFulfillment" key="automaticFulfillment" />
          <Column 
            title="" 
            key="actions"
            className="text-right" 
            render={(text, record) => (
              <Tooltip title="Remove shop">
                <Button 
                  type="link" 
                  shape="circle" 
                  icon={<DeleteOutlined />} 
                  onClick={() =>
                    this.showDeleteConfirm(
                      this.props.getShops,
                      this.props.deleteShop,
                      this.props.authUser.user._id,
                      record._id
                    )
                  }
                />
              </Tooltip>
            )}
          />
				</Table>)}
			
        <div className="mt-3 text-right">
          <Button type="primary" onClick={this.showModal}>Add new shop</Button>
        </div>
          <AddNewCardForm visible={modalVisible} onCreate={this.addCard} onCancel={this.closeModal}/>
			</>
		)
	}
}

function mapStateToProps(state) {
  return {
    authUser: state.authUser,
    shops: state.shops,
    vaUsers: state.vaUsers,
  };
}

const matchDispatchToProps = {
  getShops,
  addShop,
  updateShop,
  deleteShop
};

export default connect(mapStateToProps, matchDispatchToProps)(Shops);
