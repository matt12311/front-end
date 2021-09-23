import React, { useState,useEffect, useRef} from 'react'
import { Card, Row, Col, Badge, Grid } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import ReactTooltip from 'react-tooltip'
import WorldMap from 'assets/maps/world-countries-sans-antarctica.json'
import utils from 'utils'
import * as d3 from 'd3';
import indexBy from "index-array-by";
import { csvParseRows } from "d3-dsv";

import Globe from "react-globe.gl";
const { useBreakpoint } = Grid;
const geoUrl = WorldMap;
const mapColor = '#F5F4F6';
const hoverPercentage = -10;

const getHighlightedRegion = (name, data) => {
	if(data.length > 0 || name) {
		for (let i = 0; i < data.length; i++) {
			const elm = data[i];
			if(name === elm.name) {
				return elm.color
			}
		}
		return mapColor
	}
	return mapColor
}

const getRegionHoverColor = (name, data) => {
	if(data.length > 0 || name) {
		for (let i = 0; i < data.length; i++) {
			const elm = data[i];
			if(name === elm.name) {
				return utils.shadeColor(elm.color, hoverPercentage)
			}
		}
		return utils.shadeColor(mapColor, hoverPercentage)
	}
	return utils.shadeColor(mapColor, hoverPercentage)
}

const getRegionValue = (name, data) => {
	if(data.length > 0 || name) {
		for (let i = 0; i < data.length; i++) {
			const elm = data[i];
			if(name === elm.name) {
				return `${elm.name} — ${elm.value}`
			}
		}
		return ''
	}
	return ''
}

const MapChart = ({ setTooltipContent, data, mapSource, mapType }) => {
  	return (
		<ComposableMap style={{transform: `${mapType === 'world' ? 'translateY(20px)' : 'none'}`}} data-tip="" height={380} projectionConfig={{ scale: 145 }}>
			<Geographies geography={mapSource}>
				{({ geographies }) =>
					geographies.map(geo => {
						const geoName = mapType === 'world' ? geo.properties.name : geo.properties.NAME_1 
						return (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								onMouseEnter={() => {
									setTooltipContent(getRegionValue(geoName, data));
								}}
								onMouseLeave={() => {
									setTooltipContent("");
								}}
								fill={getHighlightedRegion(geoName, data)}
								stroke="#D6D6DA"
								style={{
									hover: {
										fill: getRegionHoverColor(geoName, data),
										outline: "none"
									}
								}}
							/>
						)
					})
				}
			</Geographies>
		</ComposableMap>
    )
}

const COUNTRY = "United States";
const OPACITY = 0.05;


const airportParse = ([
	airportId,
	name,
	city,
	country,
	iata,
	icao,
	lat,
	lng,
	alt,
	timezone,
	dst,
	tz,
	type,
	source
  ]) => ({
	airportId,
	name,
	city,
	country,
	iata,
	icao,
	lat,
	lng,
	alt,
	timezone,
	dst,
	tz,
	type,
	source
  });
  const routeParse = ([
	airline,
	airlineId,
	srcIata,
	srcAirportId,
	dstIata,
	dstAirportId,
	codeshare,
	stops,
	equipment
  ]) => ({
	airline,
	airlineId,
	srcIata,
	srcAirportId,
	dstIata,
	dstAirportId,
	codeshare,
	stops,
	equipment
  });

export const RegiondataWidget = props => {
	const globeEl = useRef();
    const [airports, setAirports] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [hoverArc, setHoverArc] = useState();

	useEffect(() => {
		// load data
		Promise.all([
		  fetch(
			"https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
		  )
			.then(res => res.text())
			.then(d => csvParseRows(d, airportParse)),
		  fetch(
			"https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
		  )
			.then(res => res.text())
			.then(d => csvParseRows(d, routeParse))
		]).then(([airports, routes]) => {
		  const byIata = indexBy(airports, "iata", false);
	
		  const filteredRoutes = routes
			.filter(
			  d =>
				byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)
			) // exclude unknown airports
			.filter(d => d.stops === "0") // non-stop flights only
			.map(d =>
			  Object.assign(d, {
				srcAirport: byIata[d.srcIata],
				dstAirport: byIata[d.dstIata]
			  })
			)
			.filter(
			  d =>
				d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY
			); // international routes from country
	
		  setAirports(airports);
		  setRoutes(filteredRoutes);
		});
	  }, []);
	
	  useEffect(() => {
		// aim at continental US centroid
		globeEl.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 });
	  }, []);
	
	const { data, mapSource, mapType, title, content, list } = props
	
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	return (
		<Card bodyStyle={{padding: 0, alignItems:"center"}}>
			<Row>
				<Col xs={24} sm={24} md={24} lg={24}>
					<div className="justify-content-center" style={{minHeight: isMobile ? 200 : 435 }}>
						<div className="p-3 w-100" style={{ height: "100vh", /* Magic here */
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}>
						<Globe
						animateIn={true}
							backgroundColor={props.theme.currentTheme==="light"?("#FFFFFF"):("#212124")}
							width={"800"}
							height={"800"}
							
								ref={globeEl}
								globeImageUrl={props.theme.currentTheme==="light"?("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"):("//unpkg.com/three-globe/example/img/earth-night.jpg")} 
								showAtmosphere={false}
								arcsData={routes}
								arcLabel={d => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`}
								arcStartLat={d => +d.srcAirport.lat}
								arcStartLng={d => +d.srcAirport.lng}
								arcEndLat={d => +d.dstAirport.lat}
								arcEndLng={d => +d.dstAirport.lng}
								arcDashLength={0.4}
								arcDashGap={0.2}
								arcDashAnimateTime={1500}
								arcsTransitionDuration={0}
								arcColor={d => {
									const op = !hoverArc ? OPACITY : d === hoverArc ? 0.9 : OPACITY / 4;
									return [`rgba(108, 92, 185, ${op})`, `rgba(108, 92, 0, ${op})`];
								}}
								// onArcHover={setHoverArc}

								pointsData={airports}
								pointColor={() => 'orange'}
								pointAltitude={0}
								pointRadius={0.04}
								pointsMerge={true}
								/>
						</div>
					</div>
				</Col>
			</Row>
		</Card>
	)
}
RegiondataWidget.propTypes = {
	title: PropTypes.string,
	data: PropTypes.array,
	mapSource: PropTypes.object,
	mapType: PropTypes.string,
	content: PropTypes.element,
	list: PropTypes.element
}

RegiondataWidget.defaultProps = {
	data: [],
	mapSource: geoUrl,
	mapType: 'world'
};

const mapStateToProps = (state) => {
	return {
		theme: state.theme
	};
};

export default connect(mapStateToProps)(RegiondataWidget)