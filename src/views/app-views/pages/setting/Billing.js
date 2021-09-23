import React, { Component,useState } from 'react'
import { Table, Button, Tooltip, Form, Modal, Input, Row, Col, Select } from 'antd';
import { DeleteOutlined, CreditCardOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { connect } from "react-redux";
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
} from "../../../../redux/actions";
const { confirm } = Modal;
const { Option } = Select;

const { Column } = Table;

const AddNewCardForm = ({ visible, onCreate, onCancel}) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState("")
  const [code, setCode] = useState("")
  const handleChange=(value)=>{
    setCode(generateCode())
   setSelected(value)

  }
  function generateCode() {
    const passwordLength=8
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('')
  }

  const shuffleArray=(array)=> {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  return (
    <Modal
      title="Add new method"
      visible={visible}
      okText="Save method"
      onCancel={onCancel}
      onOk={() => {

        if (selected=="card"){
          form
          .validateFields()
          .then(values => {
            form.resetFields();
            values.type="card"
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
        } else if (selected=="wire"){
          let values={
            type:"wire",
            endings:code,
            ccExp:"wire"
          }
          onCreate(values)
        }
        
      }}
    >
      
        <div><Select
                     label="Select a payment method"
                      style={{ width: "100%" }}
                      placeholder="select a payment method"
                      defaultValue={[]}
                      onChange={handleChange}
                      optionLabelProp="label"
                    >
                      <Option value="card">Credit Card</Option>
                      <Option value="wire">Wire</Option>
                      </Select>
                      <br></br>
                      <br></br>
                      </div>
     
      {selected=="card"?( <Form
        form={form}
        name="addCardForm"
        layout="vertical"
      >
        
        <Form.Item
          label="Card holder name"
          name="cardHolderName"
          rules={
            [
              { 
                require: true,
                message: 'Please enter card holder name!' 
              }
            ]
          }
        >
          <Input suffix={<CreditCardOutlined />} placeholder="Card holder name" />
        </Form.Item>
        <Form.Item
          label="Card number"
          name="cardNumber"
          hasFeedback
          rules={
            [
              { 
                pattern: /(\d{4}[-. ]?){4}|\d{4}[-. ]?\d{6}[-. ]?\d{5}/g,
                message: 'Please enter a valid credit card number!' 
              }
            ]
          }
        >
          <Input suffix={<CreditCardOutlined />} placeholder="0000 0000 0000 00" />
        </Form.Item>
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Expiry date"
              name="exp"
              rules={
                [
                  { 
                    pattern: /^(0[1-9]|1[0-2])[- /.]\d{2}/,
                    message: 'Please enter a valid date format!' 
                  }
                ]
              }
            >
              <Input suffix={<CalendarOutlined />} placeholder="MM/YY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="CVV code"
              name="cvv"
              rules={
                [
                  { 
                    pattern: /^[0-9]{3,4}$/,
                    message: 'Please enter a CVV code format!' 
                  }
                ]
              }
            >
              <Input 
                suffix={
                  <Tooltip title="The last three digits printed on the back of the card">
                    <QuestionCircleOutlined className="cursor-pointer" />
                  </Tooltip>
                } 
                placeholder="000"
                />
            </Form.Item>
          </Col>
        </Row>
      </Form>):(selected=="wire"?(<Input label={"Wire Code"} value={code} disabled></Input>):(null))
      }
     
    </Modal>
  )
}

export class Billing extends Component {
  componentDidMount(){
    this.props.getPaymentMethods(this.props.authUser.user._id)
  }
	state = {
    selectedRowKeys: ["card-1"], // Check here to configure the default column
    creditCards : [
      {
        key: 'card-1',
        cardType: 'Visa',
        cardTypeImg: '/img/others/creditcard.png',
        cardNumber: '•••• •••• •••• 7260',
        exp: '06/22'
      },
      {
        key: 'card-2',
        cardType: 'Master',
        cardTypeImg: '/img/others/creditcard.png',
        cardNumber: '•••• •••• •••• 1272',
        exp: '04/21'
      }
    ],
    modalVisible: false,
    newCreditCardInfo: {
      cardHolderName: '',
      cardNumber: '',
      exp: '06/22'
    }
  };
   handleChange=(value)=> {
    console.log(`selected ${value}`);
  }
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

  addCard = values => {
    let body={}
    if (values.type=="wire"){
      body={
        "ccExp": "wire",
        "endings": values.endings,
        "userID":this.props.authUser.user._id,
        "ccType":"wire"
        
      }
    }
    else{
      body={
        "ccExp": values.exp.replace("/",""),
        "ccNumber": values.cardNumber,
        "ccCcv": values.cvv,
        "userId":this.props.authUser.user._id,
        "ccType":"credit"
      }
    }
    this.props
      .addPaymentMethod(body)
      .then(() => {
        this.props.getPaymentMethods(this.props.authUser.user._id);
        setTimeout(() => {
          this.setState({ modalVisible: false });
        }, 600);
      });
   
  };

  showDeleteConfirm(deletePaymentMethod,getPaymentMethods, ownerId,id,cctype) {
   
    confirm({
      title: "Are you sure to delete this payment method?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {

        return new Promise((resolve, reject) => {
          deletePaymentMethod(cctype,id);
          getPaymentMethods(ownerId);
          setTimeout(Math.random() > 0.5 ? resolve : reject, 600);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
        console.log("Cancel");
      },
    });

  }

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
          <h3 className="mt-3 font-weight-light">Please add a payment method!</h3>
        </div>
      )
    };

		return (
			<>
				<h2 className="mb-4">Billing</h2>
				<Table locale={locale} dataSource={this.props.methods.methods} rowSelection={rowSelection} pagination={false} rowKey={record=>record._id}>
					<Column 
            title="Card type" 
            key="cardType" 
            render={(text, record) => (
              // console.log(record)
              record.ccType=="credit"?(
                <>
                  <img src={"/img/others/creditcard.png"} />
                </>
                ):(  <>
                  <img src={"/img/others/wire.png"} />
                </>)
              // <>
              //   <img src={"/img/others/creditcard.png"} />
              // </>
            )}
          />
					<Column title="Card Number" dataIndex="endings" key="endings" render={(text,record)=>(
             record.ccType=="credit"?(
              <>
                 <span>•••• •••• •••• {record.endings}</span>
              </>
              ):(  <>
              <span>
              {record.endings}
              </span>
                
              </>)
          )} />
					<Column title="Expires on" dataIndex="ccExp" key="ccExp" />
          <Column title="CVV" dataIndex="ccCcv" key="ccCcv" />
          <Column 
            title="" 
            key="actions"
            className="text-right" 
            render={(text, record) => (
              <Tooltip title="Remove card">
                <Button 
                  type="link" 
                  shape="circle" 
                  icon={<DeleteOutlined />} 
                  onClick={() =>
                    this.showDeleteConfirm(
                      this.props.deletePaymentMethod,
                      this.props.getPaymentMethods,
                      this.props.authUser.user._id,
                      record._id,
                      record.ccType
                    )
                  }
                />
              </Tooltip>
            )}
          />
				</Table>
        <div className="mt-3 text-right">
          <Button type="primary" onClick={this.showModal}>Add new method</Button>
        </div>
          <AddNewCardForm visible={modalVisible} onCreate={this.addCard} onCancel={this.closeModal} handleChange={this.handleChange}/>
			</>
		)
	}
}


function mapStateToProps(state) {
  return {
    authUser: state.authUser,
    methods: state.methods,
  };
}

const matchDispatchToProps = {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod
};

export default connect(mapStateToProps, matchDispatchToProps)(Billing);