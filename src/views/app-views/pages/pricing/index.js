import React from 'react'
import { Row, Col, Card, Grid, Button, Badge,Table, Divider, Tag } from 'antd';
import { pricingData } from './pricingData';
import utils from 'utils'


const { useBreakpoint } = Grid;

const columns = [
  {
    title: 'Date Billed',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Transaction ID',
    dataIndex: 'trans_id',
    key: 'trans_id',
  },
  {
    title: 'Invoice ID',
    dataIndex: 'invoice_id',
    key: 'invoice_id',
	render: id => (
		<a herf="#">{id}</a>
	)
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'Failed') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
		  <Button type="primary" size="small">
		  Notify
    	</Button>
        <Divider type="vertical" />
		<Button size="small" type="dashed" danger>
		  Refund
    	</Button>
      </span>
    ),
  },
];
const data = [
  {
    key: '1',
    date: 'April 12, 2021',
    trans_id: 112345,
    invoice_id: '123456789',
	amount: '112',
    status: ['Paied'],
  },
  {
    key: '2',
    date: 'April 12, 2021',
    trans_id: 112343,
    invoice_id: '123456789',
	amount: '1232',
    status: ['Paied'],
  },
  {
    key: '3',
    date: 'April 12, 2021',
    trans_id: 112349,
    invoice_id: '123456789',
	amount: '213',
    status: ['Failed'],
  },
  {
    key: '4',
    date: 'April 14, 2021',
    trans_id: 112341,
    invoice_id: '123456789',
	amount: '112',
    status: ['Paied'],
  },
  {
    key: '5',
    date: 'April 14, 2021',
    trans_id: 112342,
    invoice_id: '123456789',
	amount: '1232',
    status: ['Paied'],
  },
  {
    key: '6',
    date: 'April 14, 2021',
    trans_id: 112323,
    invoice_id: '123456789',
	amount: '213',
    status: ['Failed'],
  },
  {
    key: '7',
    date: 'April 14, 2021',
    trans_id: 112322,
    invoice_id: '123456789',
	amount: '112',
    status: ['Paied'],
  },
  {
    key: '8',
    date: 'April 14, 2021',
    trans_id: 112312,
    invoice_id: '123456789',
	amount: '1232',
    status: ['Paied'],
  },
  {
    key: '9',
    date: 'April 14, 2021',
    trans_id: 112321,
    invoice_id: '123456789',
	amount: '213',
    status: ['Failed'],
  },
];
const Pricing = () => {
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	const colCount = pricingData.length
	console.log('isMobile', isMobile)
	return (
		<Card>
			<Table columns={columns} dataSource={data} />
		</Card>
	)
}

export default Pricing

