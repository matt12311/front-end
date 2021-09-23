import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  loadUser,
  getShops,
  getReportsByShop,
  getOrderMatrixes,
  getOrderMatrix,
  addOrderMatrix,
  updateOrderMatrix,
  deleteOrderMatrix,
} from "../../../../redux/actions";
import moment from "moment";

import {
  Row,
  Col,
  Button,
  Card,
  Avatar,
  Dropdown,
  Table,
  Menu,
  Tag,
  Form,
  Input,
  Modal,
  Statistic,
  Divider,
  Tooltip,
} from "antd";
import StatisticWidget from "components/shared-components/StatisticWidget";
import ChartWidget from "components/shared-components/ChartWidget";
import AvatarStatus from "components/shared-components/AvatarStatus";
import GoalWidget from "components/shared-components/GoalWidget";
import {
  VisitorChartData,
  AnnualStatisticData,
  ActiveMembersData,
  NewMembersData,
  RecentTransactionData,
} from "./DefaultDashboardData";
import ApexChart from "react-apexcharts";
import {
  apexLineChartDefaultOption,
  COLOR_1,
  COLOR_2,
  COLOR_4,
  COLORS,
} from "constants/ChartConstant";
import {
  UserAddOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  PlusOutlined,
  EllipsisOutlined,
  StopOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import utils from "utils";
import exampleService from "services/ExampleService";
import Loading from "components/shared-components/Loading";
import { withRouter } from "react-router-dom";
import Moment from "moment";
import { now } from "lodash";
const { confirm } = Modal;

const MembersChart = (props) => <ApexChart {...props} />;

const memberChartOption = {
  ...apexLineChartDefaultOption,
  ...{
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors: [COLOR_2, COLOR_4],
  },
};

const pushRoute = () => {
  console.log("execute");
  exampleService.getPost().then((resp) => {
    console.log("resp", resp);
  });
};

const newJoinMemberOption = (
  <Menu>
    <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <PlusOutlined />
          <span className="ml-2">Add all</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <StopOutlined />
          <span className="ml-2">Disable all</span>
        </div>
      </span>
    </Menu.Item>
  </Menu>
);

const latestTransactionOption = (
  <Menu>
    <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <ReloadOutlined />
          <span className="ml-2">Refresh</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <PrinterOutlined />
          <span className="ml-2">Print</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="12">
      <span>
        <div className="d-flex align-items-center">
          <FileExcelOutlined />
          <span className="ml-2">Export</span>
        </div>
      </span>
    </Menu.Item>
  </Menu>
);

const cardDropdown = (menu) => (
  <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
    <a
      href="/#"
      className="text-gray font-size-lg"
      onClick={(e) => e.preventDefault()}
    >
      <EllipsisOutlined />
    </a>
  </Dropdown>
);

const tableColumns = [
  {
    title: "Customer",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar
          size={30}
          className="font-size-sm"
          style={{ backgroundColor: record.avatarColor }}
        >
          {utils.getNameInitial(text)}
        </Avatar>
        <span className="ml-2">{text}</span>
      </div>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
];
const tableColumnCountries = [
  {
    title: "",
    dataIndex: "name",
    key: "name",
    render: (x, i) => (
      <div className="d-flex align-items-center">
        <AvatarStatus
          id={i}
          src={`/img/flags/${x
            .split(" ")
            .map((y) => {
              return y.charAt(0).toLowerCase() + y.slice(1) + "-";
            })
            .toString()
            .replaceAll(",", "")
            .slice(0, -1)}.png`}
          name={x}
          subTitle={i.count}
        />
      </div>
    ),
  },
];
const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};
const DefaultDashboard = (props) => {
  const [visitorChartData] = useState(VisitorChartData);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [activeMembersData] = useState(ActiveMembersData);
  const [newMembersData] = useState(NewMembersData);
  const [recentTransactionData] = useState(RecentTransactionData);
  const [visible, toggleVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revenueList, setRevenueList] = useState([]);
  const [totalOrderList, setTotalOrderList] = useState([]);
  const [target, setTarget] = useState(0);
  const [ads, setAds] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const [handlingFee, setHandlingFee] = useState(0);
  const [appFees, setAppFees] = useState(0);
  const [payroll, setPayroll] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [netProfit, setNetProvit] = useState(0);
  const [oe, setOE] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [taxes, setTaxes] = useState(0);

  const [showInput, setShowInput] = useState(false);
  const [showInputTransactionFee, setShowTransactionFee] = useState(false);
  const [showInputHandlingFee, setShowHandlingFee] = useState(false);
  const [showInputAppFees, setShowAppFees] = useState(false);
  const [showInputPayroll, setShowPayroll] = useState(false);
  const [showInputAdSpend, setShowAdSpend] = useState(false);
  const [countryListData, setCountryList] = useState([]);
  const [countryCountData, setCountryCount] = useState([]);
  const [loaddata, setloaddata] = useState(true);
  const [finalData, setFinalData] = useState([]);
  const [finalTimes, setTimes] = useState([]);
  const [goal, setGoal] = useState(localStorage.getItem("goal"));

  function handleOk() {
    setLoading(true);
    setTimeout(() => {
      toggleVisible(false);
      setLoading(false);
    }, 300);
  }
  function saveMatrix() {
    let date = new Date();
    let body = {
      target: target,
      revenue: revenueList,
      numberOfOrders: reportOrders.length,
      COGS: revenueList * 0.1,
      shippingCost: 1000,
      taxes: revenueList * 0.15 * 0.13,
      discounts: 1000,
      transactionFee: transactionFee,
      handlingFee: handlingFee,
      appFees: appFees,
      refunds: 100,
      payroll: payroll,
      adSpend: ads,
      date: Moment(date).format("DD-MM-YYYY@HH:MM:SS"),
    };
    props.addOrderMatrix(body);
    setTimeout(() => {
      props.getOrderMatrixes(1, 4);
    }, 300);
  }
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

  const {
    authUser,
    shops,
    reportOrders,
    getShops,
    getReportsByShop,
    getOrderMatrixes,
  } = props;

  useEffect(() => {
    // if (authUser.user != null && shops.shops.length === 0) {
    //   getShops(authUser.user._id);
    //   getOrderMatrixes(1, 6);
    // }
    if (shops.shops.length != 0 && reportOrders.length == null) {
      if (shops.shops.shops[0]) {
        getReportsByShop(shops.selectedShop.id);
      }
      // getOrderMatrixes(1, 6);
    }

    if (reportOrders.length) {
      const byTwoHours = Array(24)
        .fill(0)
        .map((_, index) => `${String(index * 1).padStart(2, "0")}:00:00`);

      const byHoursLookup = byTwoHours.reduce(
        (acc, range) => ({ ...acc, [range]: [] }),
        {}
      );
      var dataF = [];
      var times = [];
      reportOrders.orders.forEach((date) => {
        // console.log(date.processed_at)
        const hour = moment(date.processed_at).format("HH:00:00");
        for (let i = 0; i < byTwoHours.length; i++) {
          if (!Number(byHoursLookup[byTwoHours[i]].amount)) {
            byHoursLookup[byTwoHours[i]].amount = 0;
            // console.log(Number(byHoursLookup[byTwoHours[i]].amount))
          }
          if (hour == byTwoHours[i]) {
            byHoursLookup[byTwoHours[i]].push(date);
            byHoursLookup[byTwoHours[i]].amount =
              Number(byHoursLookup[byTwoHours[i]].amount) +
              Number(date.total_price);
            // console.log(x.time)

            // console.log(time)
            byHoursLookup[byTwoHours[i]].time = hour;
            break;
          }
        }
      });
      for (let i = 0; i < byTwoHours.length; i++) {
        if (byHoursLookup[byTwoHours[i]].length != 0) {
          dataF.push(byHoursLookup[byTwoHours[i]]);
          let time = moment(
            byHoursLookup[byTwoHours[i]].time.split(":")[0],
            "HH"
          );
          times.push(time.format("HH").toString());
        }
      }
      setTimes(times);

      console.log(times);
      setFinalData(dataF);
    }

    // getOrderMatrixes(1, 6);

    // if (reportOrders.length) {
    //   let sum = 0;
    //   let sumOrder = 0;
    //   let countryList = [];
    //   let countryCount = [];
    //   let sumRev = 0;
    //   let tempCountry = reportOrders.list.edges[0].node.shippingAddress.country;
    //   countryList.push(tempCountry)
    //   countryCount.push(1)

    //   setDiscounts(1000);
    //   setShippingCost(3000);
    //   setShippingCharges(100);

    //   reportOrders.list.edges.map((x, index) => {
    //     sum = sum + Number(x.node.netPayment);
    //     sumOrder = sumOrder + 1;
    //     if (tempCountry != x.node.shippingAddress.country) {
    //       var index = countryList.indexOf(tempCountry)
    //       if (index != -1) {
    //         var counter = countryCount[index]
    //         countryCount[index] = counter + 1

    //       }
    //       else {
    //         countryList.push(tempCountry)
    //         countryCount.push(1)
    //       }
    //     }
    //     tempCountry = x.node.shippingAddress.country
    //   });

    //   setCountryCount(countryCount)
    //   setCountryList(countryList)
    //   setTotalOrderList(sumOrder);
    //   setRevenueList(sum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    //   setRevenue(sum.toFixed(2));
    // }
  }, [
    authUser.user === null,
    shops.shops.length === 0,
    reportOrders.length == null,
  ]);

  const orderMatrixTableColumns = [
    {
      title: "Number of Orders",
      dataIndex: "numberOfOrders",

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
      dataIndex: "revenue",

      /* sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      }, */
    },
    {
      title: "Cogs",
      dataIndex: "COGS",
      /* sorter: {
        compare: (a, b) => a.role.length - b.role.length,
      }, */
    },
    {
      title: "Net Margin",
      dataIndex: "status",
      /* sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      }, */
    },
    {
      title: "Net Profit",
      dataIndex: "status",
      /* sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      }, */
    },
    {
      title: "Date",
      dataIndex: "date",
      /* sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      }, */
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(
                  elm,
                  props.getOrderMatrixes,
                  props.deleteOrderMatrix
                );
              }}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const lineOpts = {
    dataLabels: {
      enabled: false,
    },
    colors: COLORS,
    stroke: {
      curve: "smooth",
    },
  };

  return (
    <>
      {shops.shops.length === 0 || shops.shops.shops.length === 0 ? (
        <Loading />
      ) : reportOrders.length == null ? (
        <Loading />
      ) : (
        <>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={16}>
                <Col span={24}>
                  {finalData.length == null ? (
                    <Loading />
                  ) : (
                    <ChartWidget
                      title="Revenue Per Hour"
                      customOptions={lineOpts}
                      type="area"
                      series={[
                        // {
                        //   name: "Session Duration",
                        //   data: [45, 52, 38, 24, 33, 26, 21]
                        // },
                        {
                          name: "Revenue",
                          data: finalData.map((x) => {
                            return x.amount.toPrecision(2);
                          }),
                        },
                      ]}
                      options={{
                        chart: {
                          zoom: {
                            enabled: false,
                          },
                        },
                        colors: [COLOR_1],
                        fill: {
                          type: "gradient",
                          gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                            stops: [0, 80, 100],
                          },
                        },
                        dataLabels: {
                          enabled: false,
                        },
                        stroke: {
                          curve: "smooth",
                          width: 3,
                        },
                        labels: [...finalTimes],
                        xaxis: {
                          type: "string",
                        },
                        yaxis: {
                          opposite: true,
                        },
                        legend: {
                          horizontalAlign: "left",
                        },
                      }}
                      height={625}
                    />
                  )}
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={6}>
              <GoalWidget
                title="Monthly Target"
                value={(
                  (finalData
                    .map((v) => v.amount)
                    .reduce((sum, current) => sum + current, 0)
                    .toPrecision(5) /
                    goal) *
                  100
                ).toPrecision(3)}
                subtitle="You need abit more effort to hit monthly target"
                extra={
                  <Button
                    type="primary"
                    onClick={(e) => {
                      toggleVisible(!visible);
                      console.log("clicked");
                    }}
                  >
                    Set Today's Goal
                  </Button>
                }
              />
              <StatisticWidget
                title="Revenue"
                value={`$ ${finalData
                  .map((v) => v.amount)
                  .reduce((sum, current) => sum + current, 0)
                  .toPrecision(5)}`}
                status=""
                subtitle={`Most Recent Data from Shopify`}
              />
              <StatisticWidget
                title="Orders"
                value={reportOrders.length}
                status=""
                subtitle={`Most Recent Data from Shopify`}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            {/* <Col xs={24} sm={24} md={24} lg={7}>
             
              <Card title="Countries">
                {reportOrders.length == null ? (
                  <Loading />
                ) : (
                    <Table
                      scroll={{ y: 320 }}
                      className="no-border-last"
                      columns={tableColumnCountries}
                      dataSource={reportOrders
                        .map((x, index) => {
                          return {
                            name: x.billing_address.country,
                            // count:countryCountData[index]
                          };
                        })}
                      rowKey="name"
                      pagination={false}
                    />
                  )}
              </Card>

            </Col> */}
            <Col xs={24} sm={24} md={24} lg={24}>
              <Card title="Today's Orders">
                {reportOrders.length == null ? (
                  <Loading />
                ) : (
                  <Table
                    scroll={{ y: 300 }}
                    className="no-border-last"
                    columns={tableColumns}
                    dataSource={[]}
                    dataSource={reportOrders.orders.map((x, index) => {
                      return {
                        id: x.id,
                        name: x.shipping_address.name,
                        date: Moment(x.processed_at).format("ll"),
                        amount: `$ ${Number(x.total_price)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`,
                        avatarColor: "#04d182",
                        country: x.billing_address.country,
                      };
                    })}
                    rowKey="id"
                    pagination={false}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Modal
            visible={visible}
            title="Calculate"
            onOk={handleOk}
            onCancel={(e) => {
              e.preventDefault();
              toggleVisible(!visible);
            }}
            width={"40%"}
          >
            <Input
              type="number"
              placeholder="write your goal in $"
              onChange={(e) => {
                setGoal(e.target.value);
                localStorage.setItem("goal", e.target.value);
              }}
            ></Input>
          </Modal>
        </>
      )}
      {/* <Modal
        visible={visible}
        title="Calculate"
        onOk={this.handleOk}
        onCancel={toggleVisible(!visible)}
        width={600}
        footer={[
          <Button key="back" onClick={toggleVisible(!visible)}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={false}
            onClick={this.handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        
      </Modal> */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    reportOrders: state.orders.reportOrders,
    authUser: state.authUser,
    shops: state.shops,
    orderMatrix: state.orderMatrix,
  };
};

const mapDispatchToProps = {
  getReportsByShop,
  getShops,
  loadUser,
  getOrderMatrixes,
  getOrderMatrix,
  addOrderMatrix,
  updateOrderMatrix,
  deleteOrderMatrix,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultDashboard);
