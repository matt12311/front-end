import React, {useEffect, useState} from "react";
import { Row, Col, Button, Card, Table, Tag, Select, Badge,Tooltip,  Statistic,  Input	,Modal, Result} from 'antd';
import Flex from 'components/shared-components/Flex'
import AvatarStatus from 'components/shared-components/AvatarStatus';
import DataDisplayWidget from 'components/shared-components/DataDisplayWidget';
import DonutChartWidget from 'components/shared-components/DonutChartWidget'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import { COLOR_1, COLOR_2, COLOR_4 } from 'constants/ChartConstant';
import { 
	CheckCircleOutlined,
	CloudDownloadOutlined, 
	ArrowUpOutlined,
	ArrowDownOutlined,
	UserSwitchOutlined,
	FileDoneOutlined,
	SyncOutlined,
	BarChartOutlined,
	DeleteOutlined,
	EyeOutlined
} from '@ant-design/icons';
import Loading from "components/shared-components/Loading";
import ChartWidget from 'components/shared-components/ChartWidget';
import { COLORS } from 'constants/ChartConstant';

import { 
	weeklyRevenueData, 
	topProductData, 
	customerChartData,
	sessionData, 
  sessionLabels, 
  conbinedSessionData,
	sessionColor,
	recentOrderData
} from './SalesDashboardData'
import moment from 'moment'; 
import { DATE_FORMAT_dd_MMM,DATE_FORMAT_DD_MM_YYYY_HH_mm} from 'constants/DateConstant'
import utils from 'utils'
import {
	loadUser,
	getShops,
  getInvoicesShop, getInvoice,
	getOrderMatrixes,
	getOrderMatrix,
	updateOrderMatrix,
	deleteOrderMatrix,
  } from "../../../../redux/actions";
const { Option } = Select;
const { confirm } = Modal;


const getPaymentStatus = status => {
	if(status === 'Paid') {
		return 'success'
	}
	if(status === 'Pending') {
		return 'warning'
	}
	if(status === 'Expired') {
		return 'error'
	}
	return ''
}

const getShippingStatus = status => {
	if(status === 'Ready') {
		return 'blue'
	}
	if(status === 'Shipped') {
		return 'cyan'
	}
	return ''
}

const WeeklyRevenue = (props) => (
	<Card>
		<Row gutter={16}>
			<Col xs={24} sm={24} md={24} lg={8}>
				<Flex className="h-100" flexDirection="column" justifyContent="between">
					<div>
						<h4 className="mb-0">Revenue</h4>
					</div>
					<div className="mb-4">
						<h1 className="font-weight-bold">100</h1>
						<p className="text-success">
							<span >
								<ArrowUpOutlined />
								<span> 100% </span>
							</span>
							<span>growth from last week</span>
						</p>
						<p>Total gross income figure based from the last 7 days.</p>
					</div>
				</Flex>
			</Col>
			<Col xs={24} sm={24} md={24} lg={16}>

				<ChartWidget 
					card={false}
					series={[{name: 'Earning',
          data:props.data.invoicesByshop.map(invoice=>{
            return Number(invoice.total_revenue).toFixed(2)
          })}]} 
					xAxis={props.data.invoicesByshop.map(invoice=>{
            return moment.unix(invoice.date).format(DATE_FORMAT_dd_MMM)
            
          })}
					title="Unique Visitors"
					height={305}
					type="bar"
					customOptions={props.options}
				/>
			</Col>
		</Row>
	</Card>
)

const DisplayDataSet = (props) => (
	<Row gutter={16}>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={<FileDoneOutlined />} 
				value={props.cal().quantity.toFixed(0)
        }
				title="Total order"	
				color="cyan"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={<BarChartOutlined />} 
				value={(props.cal().rev-props.cal().cost.toFixed(2))}
				title="Total profit"	
				color="gold"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={<SyncOutlined />} 
				value="0"
				title="Total Refunds"	
				color="blue"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={<UserSwitchOutlined />} 
				value={props.cal().quantity.toFixed(0)/props.cal().days}
				title="Daily Orders Avg"	
				color="volcano"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
	</Row>
)

const TopProduct = () => (
	<Card 
		title="Top Product" 
		extra={
			<Select defaultValue="week" size="small" style={{minWidth: 110}}>
				<Option value="week">This Week</Option>
				<Option value="month">This Month</Option>
				<Option value="year">This Year</Option>
			</Select>
		}
	>
		{topProductData.map(elm => (
			<Flex className="w-100 py-3" justifyContent="between" alignItems="center" key={elm.name}>
				<AvatarStatus shape="square" src={elm.image} name={elm.name} subTitle={elm.category}/>
				<Flex>
					<div className="mr-3 text-right">
						<span className="text-muted">Sales</span>
						<div className="mb-0 h5 font-weight-bold">
							<NumberFormat prefix={'$'} value={elm.sales} thousandSeparator={true} displayType="text" />
							{elm.status === 'up' ? <ArrowUpOutlined className="text-success"/> : <ArrowDownOutlined className="text-danger"/>}
						</div>
					</div>
				</Flex>
			</Flex>
		))}
	</Card>
)

const SalesByCategory = () => (
	<DonutChartWidget 
		series={sessionData} 
		labels={sessionLabels} 
		title="Sales by Category"
		customOptions={{colors: sessionColor}}
		extra={
			<Row  justify="center">
				<Col xs={20} sm={20} md={20} lg={24}>
					<div className="mt-4 mx-auto" style={{maxWidth: 200}}>
						{conbinedSessionData.map(elm => (
							<Flex alignItems="center" justifyContent="between" className="mb-3" key={elm.label}>
								<div>
									<Badge color={elm.color} />
									<span className="text-gray-light">{elm.label}</span>
								</div>
								<span className="font-weight-bold text-dark">{elm.data}</span>
							</Flex>
						))}
					</div>
				</Col>
			</Row>
		}
	/>
)

const Customers = (props) => (
	<Card 
	>
		<Flex>
			<div className="mr-5">
				<h2 className="font-weight-bold mb-1">0</h2>
				<p><Badge color={COLORS[6]}/>Total Number of Customers</p>
			</div>
		</Flex>
		<div>
			<ChartWidget 
				card={false}
				series={[{
          name:"customers",
          data:props.data.invoicesByshop.map(invoice=>{
          var sum=0
          invoice.items.map(item=>{
            sum=sum+item.quantity
          })
          return sum.toFixed(0)
        })}]} 
				
        xAxis={props.data.invoicesByshop.map(invoice=>{
          return  moment(invoice.date,'YYYYMMDDHHmmss').format(DATE_FORMAT_dd_MMM)
        })}
				height={280}
				type="area"
				customOptions={
					{
						colors: [COLORS[0]],
						legend: {
							show: false
						},
						stroke: {
							width: 2.5,
							curve: 'smooth'
						},
						chart: {
							toolbar: {
								show: true
							},
							zoom: {
								enabled: true
							}
						},
						responsive: [{
							breakpoint: 480,
							options: {
								legend: {
									position: 'bottom',
									offsetX: -10,
									offsetY: 0
								}
							}
						}],
					
					}
				}
			/>
		</div>
	</Card>
)

const tableColumns = [
	{
		title: 'ID',
		dataIndex: 'id'
	},
	{
		title: 'Product',
		dataIndex: 'name',
		render: (_, record) => (
			<Flex>
				<AvatarStatus size={30} src={record.image} name={record.name}/>
			</Flex>
		),
		sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
	},
	{
		title: 'Date',
		dataIndex: 'date',
		render: (_, record) => (
			<span>{moment.unix(record.date).format(DATE_FORMAT_dd_MMM)}</span>
		),
		sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
	},
	{
		title: 'Order status',
		dataIndex: 'orderStatus',
		render: (_, record) => (
			<><Tag color={getShippingStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
		),
		sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
	},
	{
		title: 'Payment status',
		dataIndex: 'paymentStatus',
		render: (_, record) => (
			<><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
		),
		sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
	},
	{
		title: 'Total',
		dataIndex: 'amount',
		render: (_, record) => (
			<span className="font-weight-semibold">
				<NumberFormat
					displayType={'text'} 
					value={(Math.round(record.amount * 100) / 100).toFixed(2)} 
					prefix={'$'} 
					thousandSeparator={true} 
				/>
			</span>
		),
		sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
	}
]

const RecentOrder = () => (
	<Card title="Recent Order">
		<Table
			pagination={false}
			columns={tableColumns} 
			dataSource={recentOrderData} 
			rowKey='id'
		/>
	</Card>
)

const SalesDashboard = (props) => {
	const [visible,toggleVisible]=useState(false)
	const [loading, setLoading] = useState(true);
	const [revenueList, setRevenueList] = useState([]);
  const [totalOrderList, setTotalOrderList] = useState([]);
  const [target, setTarget] = useState(0);
  const [ads, setAds] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const [handlingFee, setHandlingFee] = useState(0);
  const [appFees, setAppFees] = useState(0);
  const [payroll, setPayroll] = useState(0);
  const [refunds, setRefunds] = useState(0.0);
  const [revenue, setRevenue] = useState(0.0);
  const [cogs, setCogs] = useState(0);
  const [netProfit, setNetProvit] = useState(0);
  const [oe, setOE] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [numberOfOrder, setnumberOfOrder] = useState(0);
  const [totalFunc, settotalFunc] = useState(0);
  const [taxes, setTaxes] = useState(0);
  
  const selectedMatrix =elm=>{
    setRefunds(elm.refundsNum*30)
    setRevenue(elm.total_revenue)
    var sum=0
    elm.items.map(item=>{
      sum=sum+item.quantity
    })
    setnumberOfOrder(sum.toFixed(0))
    setCogs(elm.totalAmout)
    
    setTaxes(0)
   
    calculateData()
  }
  const calculateData=()=>{
    setNetProvit(
      revenue -
      cogs -
      taxes -
      appFees -
      payroll -
      ads
    );
    setOE(
      revenue - cogs - appFees - payroll - ads
    );
  }
  const calculateNums=()=>{
    let rev =0 
    let cost =0 
    let quantity=0
    props.invoices.invoicesByshop.map(invoice=>{
      rev=rev + Number(invoice.total_revenue)
      cost=cost +Number(invoice.totalAmout)
      let sum=0
      invoice.items.map(item=>{
        sum=sum+item.quantity
      })
      quantity=quantity+sum
    })
    let days=props.invoices.invoicesByshop.length

    return {rev:rev,cost:cost,quantity:quantity,days:days}
  }
  const [showInput, setShowInput] = useState(false);
  const [showInputTransactionFee, setShowTransactionFee] = useState(false);
  const [showInputHandlingFee, setShowHandlingFee] = useState(false);
  const [showInputAppFees, setShowAppFees] = useState(false);
  const [showInputPayroll, setShowPayroll] = useState(false);
  const [showInputAdSpend, setShowAdSpend] = useState(false);

	// useEffect(() => {
	// 	if (props.authUser.user != null && props.shops.shops.length === 0) {
  //     if (props.authUser.user.isAdmin || props.authUser.user.roles.includes("ADMIN")|| props.authUser.user.roles.includes("WAREHOUSE")){
  //       getShops(0,1,1,1);
  //     }
  //     else {
  //       getShops(props.authUser.user.roles.includes("SHOP_VA")?(props.authUser.user.ownerId):(props.authUser.user._id));
  //     }
     
  //   }
	// 	props.getOrderMatrixes(1, 100);
	//   }, [
	// 	props.authUser.user === null,
	// 	props.shops.shops.length != 0,
	//   ]);

	  function handleOk() {
		setLoading(true);
		setTimeout(() => {
		  toggleVisible(false);
		  setLoading(false);
		}, 300);
	  }
  useEffect(() => {
		if (props.authUser.user != null && props.shops.selectedShop) {
			props.getInvoicesShop(props.shops.selectedShop.name)
		}
		

	},[props.invoices.loading]);

	function showDeleteConfirm(row, getOrderMatrixes, deleteOrderMatrix) {
		confirm({
		  title: "Are you sure to delete this order matrix?",
		  okText: "Yes",
		  okType: "danger",
		  cancelText: "No",
		  onOk() {
			deleteOrderMatrix(row._id);
			setTimeout(() => {
			  getOrderMatrixes(1, 100);
			}, 300);
		  },
		  onCancel() {
			console.log("Cancel");
		  },
		});
	  }
  const orderMatrixTableColumns = [
    {
      title: "Number of Orders",
      dataIndex: "items",
      render:(value, row, index) => {
        var sum=0
        value.map(item=>{
          sum=sum+item.quantity
        })
        return sum.toFixed(0)
      }

      /* sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      }, */
    },
    {
      title: "Revenue",
      dataIndex: "total_revenue",
      render:(value, row, index) => {
        return Number(value).toFixed(2)
      }
      /* sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      }, */
    },
    {
      title: "COGS",
      dataIndex: "totalAmout",
      render:(value)=>{
        return Number(value).toFixed(2)
      }
      /* sorter: {
        compare: (a, b) => a.role.length - b.role.length,
      }, */
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (

				// moment("record.date").format('YYYYMMDDHHMMSS')
				<span>{moment(record.date,'YYYYMMDDHHmmss').format(DATE_FORMAT_DD_MM_YYYY_HH_mm)}</span>
			),
 
		sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title="View">
			<Button icon={<EyeOutlined />}
			onClick={(e)=>{
        e.preventDefault()
        console.log(elm)
        selectedMatrix(elm)
        
				toggleVisible(!visible)

			}
			}>	
	
			</Button>
			</Tooltip>

        </div>
      ),
	},]
	
	const opitions={
		chart: {
			toolbar: {
				show: true
			},
			zoom: {
				enabled: true
			}
		},
		colors: [COLOR_1, COLOR_2, COLOR_4],
		responsive: [{
			breakpoint: 480,
			options: {
				legend: {
					position: 'bottom',
					offsetX: -10,
					offsetY: 0
				}
			}
		}],
		plotOptions: {
			bar: {
				horizontal: false,
			},
		},
		xaxis: {
			type: 'datetime',
			categories: props.invoices.invoicesByshop.map(invoices=>{
        return invoices.date
      })
		},
		legend: {
			position: 'right',
			offsetY: 40
		},
		fill: {
			opacity: 1
		}
	
}


	return (
    props.authUser.user != null && props.authUser.user.roles.includes("WAREHOUSE")?(<Result
    status="success"
    title="Successfully logged in"
    subTitle="Thank you warehouse team for your fast performance and service, hope you a wonderful day. "
  />):(<>

    <Modal
           visible={visible}
           title="Calculate"
           onOk={handleOk}
           onCancel={(e) => {
             e.preventDefault();
             toggleVisible(!visible);
           }}
           width={"80%"}
         >
           <div className="site-statistic-demo-card">
             <Row gutter={24}>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Number of Orders"
                     value={numberOfOrder}
                   /*             prefix={<ArrowUpOutlined />}
                    */
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Revenue"
                     value={revenue}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="COGS"
                     value={cogs}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Discounts"
                     value={discounts}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               
             </Row>

             <Row gutter={24}>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Gross Margin"
                     value={((revenue - cogs) / revenue) * 100}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="%"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Gross Profit"
                     value={(oe / revenue) * 100}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="%"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Taxes"
                     value={taxes}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Avg. Order Value"
                     value={revenue / numberOfOrder}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               
             </Row>

             <Row gutter={24}>
             <Col span={6}>
                 <Card>
                   <Statistic
                     title="Shipping Cost"
                     value={shippingCost}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Shipping Charged"
                     value={shippingCharges}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Avg. Order Profit"
                     value={netProfit / 11}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Ad Spend Per Order"
                     value={ads / numberOfOrder}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
             </Row>

             <Row gutter={24}>
               
             <Col span={8}>
                 <Card>
                   <Statistic
                     title="Refunds"
                     value={0}
                     precision={2}
                   />
                   
                 </Card>
               </Col>
               <Col span={8}>
                 <Card>
                   <Statistic
                     title="Net Margin"
                     value={(netProfit / revenue) * 100}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="%"
                   />
                 </Card>
               </Col>
               <Col span={8}>
                 <Card>
                   <Statistic
                     title="Net Profit"
                     value={netProfit}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                 </Card>
               </Col>
               
             </Row>

             <Row gutter={24}>

             <Col span={6}>
                 <Card>
                   <Statistic
                     title="Transaction Fee"
                     value={transactionFee}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="%"
                   />
                   {showInputTransactionFee ? (
                     <Input
                       onChange={(e) => {
                         setTransactionFee(e.target.value);
                         calculateData()
                       }}
                       addonAfter={
                         <CheckCircleOutlined
                           onClick={(e) => {
                             e.preventDefault();
                             setShowTransactionFee(!showInputTransactionFee);
                           }}
                         />
                       }
                     ></Input>
                   ) : (
                       <Button
                         type="primary"
                         onClick={(e) => {
                           e.preventDefault();
                           setShowTransactionFee(!showInput);
                         }}
                       >
                         Edit
                       </Button>
                     )}
                 </Card>
               </Col>
               {/* <Col span={4}>
                 <Card>
                   <Statistic
                     title="Handling Fee"
                     value={handlingFee}
                     precision={2}
                     suffix="$"
                   />
                   {showInputHandlingFee ? (
                     <Input
                       onChange={(e) => {
                         setHandlingFee(e.target.value);
                         setNetProvit(
                           revenueList -
                           cogs +
                           discounts -
                           shippingCost -
                           shippingCharges -
                           taxes -
                           transactionFee -
                           handlingFee -
                           refunds -
                           softwareFees -
                           payroll -
                           ads
                         );
                         setOE(
                           revenueList - cogs + discounts - softwareFees - payroll - ads
                         );
                       }}
                       addonAfter={
                         <CheckCircleOutlined
                           onClick={(e) => {
                             e.preventDefault();
                             setShowHandlingFee(!showInputHandlingFee);
                           }}
                         />
                       }
                     ></Input>
                   ) : (
                       <Button
                         type="primary"
                         onClick={(e) => {
                           e.preventDefault();
                           setShowHandlingFee(!showInputHandlingFee);
                         }}
                       >
                         Edit
                       </Button>
                     )}
                 </Card>
               </Col> */}

               <Col span={6}>
                 <Card>
                   <Statistic
                     title="App Fees"
                     value={appFees}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                   {showInputAppFees ? (
                     <Input
                       onChange={(e) => {
                         setAppFees(e.target.value);
                       calculateData()
                       }}
                       addonAfter={
                         <CheckCircleOutlined
                           onClick={(e) => {
                             e.preventDefault();
                             setShowAppFees(!showInputAppFees);
                           }}
                         />
                       }
                     ></Input>
                   ) : (
                       <Button
                         type="primary"
                         onClick={(e) => {
                           e.preventDefault();
                           setShowAppFees(!showInputAppFees);
                         }}
                       >
                         Edit
                       </Button>
                     )}
                 </Card>
               </Col>
               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Payroll"
                     value={payroll}
                     precision={2}
                 /*             prefix={<ArrowDownOutlined />}
                  */ suffix="$"
                   />
                   {showInputPayroll ? (
                     <Input
                       onChange={(e) => {
                         setPayroll(e.target.value);
                        calculateData()
                       }}
                       addonAfter={
                         <CheckCircleOutlined
                           onClick={(e) => {
                             e.preventDefault();
                             setShowPayroll(!showInputPayroll);
                           }}
                         />
                       }
                     ></Input>
                   ) : (
                       <Button
                         type="primary"
                         onClick={(e) => {
                           e.preventDefault();
                           setShowPayroll(!showInputPayroll);
                         }}
                       >
                         Edit
                       </Button>
                     )}
                 </Card>
               </Col>

               <Col span={6}>
                 <Card>
                   <Statistic
                     title="Ad Spend"
                     value={ads}
                     precision={2}
                 /*             prefix={<ArrowUpOutlined />}
                  */ suffix="$"
                   />
                   {showInputAdSpend ? (
                     <Input
                       onChange={(e) => {
                         setAds(e.target.value);
                         calculateData()
                       }}
                       addonAfter={
                         <CheckCircleOutlined
                           onClick={(e) => {
                             e.preventDefault();
                             setShowAdSpend(!showInputAdSpend);
                           }}
                         />
                       }
                     ></Input>
                   ) : (
                       <Button
                         type="primary"
                         onClick={(e) => {
                           e.preventDefault();
                           setShowAdSpend(!showInputAdSpend);
                         }}
                       >
                         Edit
                       </Button>
                     )}
                 </Card>
               </Col>

              
             </Row>
           </div>
           {/* <Row>
         <Col xs={24} sm={24} md={24} lg={24}>
           <Card
             title="Order Matrixes List"
             extra={
               <Button type="primary" onClick={saveMatrix}>
                 Save Matrix
               </Button>
             }
           >
             {props.orderMatrix.loading ? (
               <Loading></Loading>
             ) : (
               <Table
                 className="no-border-last"
                 columns={orderMatrixTableColumns}
                 dataSource={props.orderMatrix.orderMatrixes.orderMatrixes}
                 rowKey="id"
                 pagination={false}
               />
             )}
           </Card>
         </Col>
       </Row> */}
         </Modal>
     <Row gutter={16}>
       <Col xs={24} sm={24} md={24} lg={16} xl={15} xxl={14}>
         <WeeklyRevenue data={props.invoices} options={opitions} />
       </Col>
       <Col xs={24} sm={24} md={24} lg={8} xl={9} xxl={10}>
         <DisplayDataSet cal={calculateNums} />
       </Col>
     </Row>
     <Row gutter={16}>
       <Col xs={24} sm={24} md={24} lg={17} >
       <Card
             title="Store Performances"
           //   extra={
           //     <Button type="primary" >
           //       Save Matrix
           //     </Button>
           //   }
           >
             {props.invoices.loading ? (
               <Loading></Loading>
             ) : (
               <Table
                 className="no-border-last"
                 columns={orderMatrixTableColumns}
                 dataSource={props.invoices.invoicesByshop}
                 rowKey="id"
         pagination={false}
         scroll={{ y: 280 }}
               />
             )}
           </Card>
       </Col>
       <Col xs={24} sm={24} md={24} lg={7}>
         <Customers data={props.invoices}/>
       </Col>
     </Row>
   </>)
  
	)
}

const mapStateToProps = (state) => {
	return {
	  authUser: state.authUser,
	  shops: state.shops,
    invoices: state.invoices,
	};
  };
  
  const mapDispatchToProps = {
	getShops,
	loadUser,
	getOrderMatrixes,
	getOrderMatrix,
	updateOrderMatrix,
	deleteOrderMatrix,
  getInvoicesShop, getInvoice,
  };
export default connect(mapStateToProps, mapDispatchToProps) (SalesDashboard)

