import React, { useState } from 'react'
import { Row, Col, Card, Avatar, Select, Tag, Badge, List } from 'antd';
import RegiondataWidget from 'components/shared-components/RegiondataWidget';
import DonutChartWidget from 'components/shared-components/DonutChartWidget'
import Flex from 'components/shared-components/Flex'
import ChartWidget from 'components/shared-components/ChartWidget';
import { apexSparklineChartDefultOption, COLORS } from 'constants/ChartConstant';
import { COLOR_1, COLOR_2, COLOR_4 } from 'constants/ChartConstant';


import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  YoutubeFilled,
  DribbbleSquareFilled,
} from '@ant-design/icons';
import {
  regionData,
  sessionData,
  sessionLabels,
  conbinedSessionData,
  sessionColor,
  uniqueVisitorsDataWeek,
  uniqueVisitorsDataDay,
  uniqueVisitorsDataMonth
} from './AnalyticDashboardData'
 

const socialMediaReferralIcon = [
  <FacebookFilled style={{ color: '#1774eb' }} />,
  <TwitterSquareFilled style={{ color: '#1c9deb' }} />,
  <YoutubeFilled style={{ color: '#f00' }} />,
  <LinkedinFilled style={{ color: '#0077b4' }} />,
  <DribbbleSquareFilled style={{ color: '#e44a85' }} />
]

const { Option } = Select;

const rederRegionTopEntrance = (
  <div className="mb-4">
    <div className="d-flex align-items-center">
      <Avatar size={20} src="/img/flags/us.png" />
      <h2 className="mb-0 ml-2 font-weight-bold">37.61%</h2>
    </div>
    <span className="text-muted">Top shipping region</span>
  </div>
)
 
export const AnalyticDashboard = () => {

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
				categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
					'01/05/2011 GMT', '01/06/2011 GMT'
				],
			},
			legend: {
				position: 'right',
				offsetY: 40
			},
			fill: {
				opacity: 1
			}
		
  }
  

  const [uniqueVisitorsData, setUniqueVisitorsData] = useState(uniqueVisitorsDataWeek)

  const handleVisitorsChartChange = value => {  
    console.log(value)
    switch (value) {
      case 'day':
        setUniqueVisitorsData(uniqueVisitorsDataDay)
        break;
      case 'week':
        setUniqueVisitorsData(uniqueVisitorsDataWeek)
        break;
      case 'month':
        setUniqueVisitorsData(uniqueVisitorsDataMonth)
        break;
      default:
        setUniqueVisitorsData(uniqueVisitorsDataWeek)
        break;
    }
  } 
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
          <RegiondataWidget
            title="Shipping by region"
            data={regionData}
            content={rederRegionTopEntrance}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xxl={7}>
          <DonutChartWidget
            series={sessionData}
            labels={sessionLabels}
            title="Delivered Within"
            customOptions={{ colors: sessionColor}}
            extra={
              <Row justify="center">
                <Col xs={20} sm={20} md={20} lg={24}>
                  <div className="mt-4 mx-auto" style={{ maxWidth: 200 }}>
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
        </Col>
        
        <Col xs={24} sm={24} md={24} lg={12} xxl={17}>
          <ChartWidget
            series={uniqueVisitorsData.series}
            xAxis={uniqueVisitorsData.categories}
            title="Orders"
            height={388}
            type="bar"
            customOptions={
              opitions
            }
          />
        </Col>
      </Row>
    </>
  )
}

export default AnalyticDashboard