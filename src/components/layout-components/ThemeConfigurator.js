import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { Radio, Switch, Button, message ,Avatar,Divider} from 'antd';
import Icon from 'components/util-components/Icon';
import { NavLink } from "react-router-dom";

import { 
	toggleCollapsedNav, 
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme
} from 'redux/actions/Theme';
import { LogoutOutlined,EditOutlined } from '@ant-design/icons';

import { 
	SIDE_NAV_LIGHT,
	NAV_TYPE_SIDE,
	NAV_TYPE_TOP,
	SIDE_NAV_DARK
} from 'constants/ThemeConstant';
import { useThemeSwitcher } from "react-css-theme-switcher";
import utils from 'utils/index';
import { signOut } from 'redux/actions/Auth';

const colorOptions = [
	'#3e82f7',
	'#24a772',
	'#de4436',
	'#924aca',
	'#193550'
]

const ListOption = ({name, selector, disabled, vertical}) => (
	<div className={`my-4 ${vertical? '' : 'd-flex align-items-center justify-content-between'}`}>
		<div className={`${disabled ? 'opacity-0-3' : ''} ${vertical? 'mb-3' : ''}`}>{name}</div>
		<div>{selector}</div>
	</div>
)
const menuItem = [
	{
		title: "Edit Profile",
		icon: EditOutlined ,
		path: "/app/pages/profile"
    }
]


export const ThemeConfigurator = ({ 
	navType, 
	sideNavTheme, 
	navCollapsed,
	topNavColor,
	headerNavColor,
	locale,
	currentTheme,
	toggleCollapsedNav, 
	onNavTypeChange, 
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	signOut,
	authUser
}) => {
	const isNavTop = navType === NAV_TYPE_TOP? true : false
	const isCollapse = navCollapsed 

	const { switcher, themes } = useThemeSwitcher();
	const [message, setMessage]=useState("")

	const toggleTheme = (isChecked) => {
		onHeaderNavColorChange('')
		const changedTheme = isChecked ? 'dark' : 'light'
		onSwitchTheme(changedTheme)
    switcher({ theme: themes[changedTheme] });
  };
  useEffect(() => {
	getMessage()

  }, message===""
  )

	const ontopNavColorClick = (value) => {
		onHeaderNavColorChange('')
		const { rgb } = value
		const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
		const hex = utils.rgbaToHex(rgba)
		onTopNavColorChange(hex)
	}
	const onHeaderNavColorClick = (value) => {
		const { rgb } = value
		const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
		const hex = utils.rgbaToHex(rgba)
		onHeaderNavColorChange(hex)
	}

	const onNavTypeClick = (value) => {
		onHeaderNavColorChange('')
		if(value === NAV_TYPE_TOP) {
			onTopNavColorChange(colorOptions[0])
			toggleCollapsedNav(false)
		}
		onNavTypeChange(value)
	}

	const genCopySettingJson = (configState) => JSON.stringify(configState, null, 2);
const getMessage=()=>{
	var today = new Date()
		var curHr = today.getHours()
		if (curHr < 12) {
			setMessage('Good Morning')
		} else if (curHr < 18) {
			setMessage('Good Afternoon')
		} else {
			setMessage('Good Evening')
		}
}
	return (
		<>
			<div className="mb-5">
			<div className="nav-profile-header">
					<div className="d-flex">
					<Avatar
        style={{
          backgroundColor: '#7265e6',
          verticalAlign: 'middle',
        }}
        size="large"
      >
        {!authUser.loading?authUser.user.firstName.charAt(0).toUpperCase():"U"}
      </Avatar>
					<div className="pl-3">
						<h4 className="mb-0">{!authUser.loading?authUser.user.firstName:""}</h4>
	<span className="text-muted">{message}</span>
          </div>
        </div>
		<Divider>Quick Links</Divider>

		{menuItem.map((el, i) => {
            return (
		<Button key={i} block >
			          <NavLink to="/app/pages/profile">

                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
				  </NavLink>
                </Button>            );
          })}

		<Button key={2} block onClick={e => signOut()}>
                  <Icon className="mr-3" type={LogoutOutlined} />
                  <span className="font-weight-normal">Sign Out</span>
                </Button> 

				<Divider>Theme Configuration</Divider>

				<ListOption 
					name="Side Nav Collapse:"
					selector={
						<Switch 
							disabled={isNavTop} 
							checked={isCollapse} 
							onChange={() => toggleCollapsedNav(!navCollapsed)} 
						/>
					}
					disabled={isNavTop}
				/>
				<ListOption 
					name="Dark Theme:"
					selector={
						<Switch checked={currentTheme === 'dark'} onChange={toggleTheme} />
					}
				/>
			</div>

				
			

							
			</div>
		</>
	)
}

const mapStateToProps = ({ theme, authUser }) => {
  const { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme } =  theme;
  return { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme,authUser }
};

const mapDispatchToProps = {
	toggleCollapsedNav,
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	signOut
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeConfigurator)
