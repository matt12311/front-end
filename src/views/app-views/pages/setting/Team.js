import React, { Component } from 'react'
import { Table, Button, Tooltip, Form, Modal, Input, Row, Col, Select, Tag } from 'antd';
import { DeleteOutlined, UserAddOutlined, MailOutlined, SmallDashOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { connect } from "react-redux";
import {
  createVaUser,
  loadVaUsers,
  deleteVaUser,
  updateVaUser,
} from "../../../../redux/actions";
const { Option } = Select;

const { Column } = Table;

const AddNewCardForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title="Add new member"
      visible={visible}
      okText="Save member"
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
        name="addMemberForm"
        layout="vertical"
      >
      <Row gutter={ROW_GUTTER}>
      <Col xs={24} sm={24} md={12}>
        <Form.Item
          label="Member name"
          name="firstName"
          rules={
            [
              { 
                require: true,
                message: 'Please enter member name!' 
              }
            ]
          }
        >
          <Input suffix={<UserAddOutlined />} autoComplete="off" placeholder="Member name" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
        <Form.Item
          label="Email"
          name="email"
          hasFeedback
          rules={
            [
              { 
                message: 'Please enter an Email to the member!' 
              }
            ]
          }
        >
          <Input suffix={<MailOutlined />} autoComplete="off" placeholder="Email" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
        <Form.Item
          label="Password"
          name="password"
          hasFeedback
          rules={
            [
              { 
                message: 'Please enter a password of the member!' 
              }
            ]
          }
        >
          <Input suffix={<SmallDashOutlined />} autoComplete="off" placeholder="Password (at least 6 characters)" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Roles"
              name="roles"
            >
          <Select
          placeholder="Role/Roles" 
              mode="multiple"
              style={{ width: "100%" }}
              options={[
                { label: "Shop assistant", value: "SHOP_VA", key: 0 }
              ]}
            />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export class Team extends Component {
  constructor(props) {
    super(props);
	this.state = {
    selectedRowKeys: ["card-1"], // Check here to configure the default column
    creditCards : [
    ],
    modalVisible: false,
    newCreditCardInfo: {
      cardHolderName: '',
      cardNumber: '',
      exp: '06/22'
    }
    
  };
}

componentDidMount(){
  this.props.loadVaUsers(this.props.authUser.user._id)
}
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  showModal = () => {
    console.log(this.props.authUser)
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  addCard = values => {
    console.log(values)
    // console.log(this.props.authUser)
    this.props.createVaUser(this.props.authUser.user._id, values.firstName, values.email,values.password,['SHOP_VA']).then(() => {
      this.props.loadVaUsers(this.props.authUser.user._id, 1, 0);
      setTimeout(() => {
        this.setState({
          modalVisible: false
        })
      }, 300);})
    
  };

	render() {
		const { selectedRowKeys, creditCards, modalVisible } = this.state;
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    };

    const locale = {
      emptyText: (
        <div className="text-center my-4">
          <img src="/img/others/img-7.png" alt="Add credit card" style={{maxWidth: '90px'}}/>
          <h3 className="mt-3 font-weight-light">Please add a credit card!</h3>
        </div>
      )
    };

		return (
			<>
				<h2 className="mb-4">Shopify</h2>
				<Table dataSource={this.props.vaUsers.vaUsers?(this.props.vaUsers.vaUsers.vaUsers):([])} pagination={true}>
					<Column 
            title="Name" 
            key="firstName" 
            render={(text, record) => (
              <>
                <span className="ml-2">{record.firstName}</span>
              </>
            )}
          />
  					<Column title="Email" dataIndex="email" key="email" />
            <Column title="Roles" dataIndex="roles" key="roles"
            render={(text, record) => (
              
              record.roles.map((text=>
                <Tag>{text}</Tag>
               ))
    
            )}
            />
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
                  onClick={() => {
                    // const newCreditCards = [...creditCards];
                    // this.setState({
                    //   creditCards: newCreditCards.filter(item => item.key !== record.key),
                    // });
                    this.props.deleteVaUser(record._id).then(() => {
                      this.props.loadVaUsers(this.props.authUser.user._id, 1, 0);
                      setTimeout(() => {
                        this.setState({
                          modalVisible: false
                        })
                      }, 300);})
                  }} 
                />
              </Tooltip>
            )}
          />
				</Table>
        <div className="mt-3 text-right">
          <Button type="primary" onClick={this.showModal}>Add new member</Button>
        </div>
          <AddNewCardForm visible={modalVisible} onCreate={this.addCard} onCancel={this.closeModal}/>
			</>
		)
	}
}


function mapStateToProps(state) {
  return {
    authUser: state.authUser,
    vaUsers: state.vaUsers
  };
}
const matchDispatchToProps = {
  createVaUser,
  loadVaUsers,
  deleteVaUser,
  updateVaUser,
};
export default connect(mapStateToProps, matchDispatchToProps)(Team)
