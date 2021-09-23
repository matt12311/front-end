import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout,Select } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';
import Logo from './Logo';
import NavNotification from './NavNotification';
import NavProfile from './NavProfile';
import NavLanguage from './NavLanguage';
import NavPanel from './NavPanel';
import NavSearch  from './NavSearch';
import SearchInput from './NavSearch/SearchInput.js'
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/actions/Theme';
import {
  getShops,
  setSelectedShop
} from "redux/actions";
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils'
import DelayLink from './DelayLink';

const { Header } = Layout;

export const HeaderNav = props => {
  const { navCollapsed, mobileNav, navType, headerNavColor, toggleCollapsedNav, onMobileNavToggle, isMobile, currentTheme,shops,authUser,getShops,setSelectedShop } = props;
  const [searchActive, setSearchActive] = useState(false)

  const onSearchActive = () => {
    setSearchActive(true)
  }

  const onSearchClose = () => {
    setSearchActive(false)
  }

  const onToggle = () => {
    if(!isMobile) {
      toggleCollapsedNav(!navCollapsed)
    } else {
      onMobileNavToggle(!mobileNav)
    }
  }

  const isNavTop = navType === NAV_TYPE_TOP ? true : false
  const mode = ()=> {
    if(!headerNavColor) {
      return utils.getColorContrast(currentTheme === 'dark' ? '#00000' : '#ffffff' )
    }
    return utils.getColorContrast(headerNavColor)
  }
  const navMode = mode()
  const getNavWidth = () => {
    if(isNavTop || isMobile) {
      return '0px'
    }
    if(navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`
    } else {
      return `${SIDE_NAV_WIDTH}px`
    }
  }
  useEffect(() => {
    if (authUser.user != null && shops.shops.length === 0) {
      if (authUser.user.isAdmin || authUser.user.roles.includes("ADMIN")|| authUser.user.roles.includes("WAREHOUSE")){
        getShops(0,1,1,1);
      }
      else {
        getShops(authUser.user.roles.includes("SHOP_VA")?(authUser.user.ownerId):(authUser.user._id));
      }
     
    }
  },[shops.shops.length !== 0])

  useEffect(() => {
    if(!isMobile) {
      onSearchClose()
    }
  })
  const selectedShop=(id)=>{
      var shopName = shops.shops.shops.filter((v)=>{
        return v._id === id
      })
    setSelectedShop(id,shopName[0].name,shopName[0].startingOrder,shopName[0].fetchedProducts)
  }
  return (
    <Header className={`app-header ${navMode}`} style={{backgroundColor: headerNavColor}}>
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Logo style={{alginItems:"centre"}} logoType={navMode}/>
        <div className="nav" style={{width: `calc(100% - ${getNavWidth()})`}}>
          <div className="nav-left">
            <ul className="ant-menu ant-menu-root ant-menu-horizontal">          
              {
                isNavTop && !isMobile ?
                null
                :
                <li className="ant-menu-item ant-menu-item-only-child" onClick={() => {onToggle()}}>
                  {navCollapsed || isMobile ? <MenuUnfoldOutlined className="nav-icon" /> : <MenuFoldOutlined className="nav-icon" />}
                </li>
              }
              {
                isMobile ?
                <li className="ant-menu-item ant-menu-item-only-child" >
                  {(shops.shops.length===0||!shops.shops.shops[0] || shops.loading)?"":
                  
                  <Select
                  defaultValue={"Choose store"}
                    style={{ width: 220 }}
                    options={shops.shops.shops.map((shop, i) => {
                      return { label: shop.name, value: shop._id, key: i };
                    })
                  
                  }
                  onChange={e=>{
                    selectedShop(e)
                    // console.log(e)
                  }}
                  />}
                </li>
                :
                <li className="ant-menu-item ant-menu-item-only-child" style={{cursor: 'auto'}}>
                   {(shops.shops.length===0||shops.loading||!shops.shops.shops[0])?"":
                  
                  <Select
                    defaultValue={shops.shops.shops[0]._id}
                    style={{ width: 220 }}
                    options={shops.shops.shops.map((shop, i) => {
                      return { label: shop.name, value: shop._id, key: i };
                    })}
                    onChange={e=>{
                      selectedShop(e)
                      console.log(window.location.pathname)
                    }}
                  />
                   
                  
                  }
                 
                </li>
              }
            </ul>
          </div>
          <div className="nav-right">
            <NavNotification />
            <NavProfile />
            <NavPanel />
          </div>
          <NavSearch active={searchActive} close={onSearchClose}/>
        </div>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ theme, shops,authUser}) => {
  const { navCollapsed, navType, headerNavColor, mobileNav, currentTheme } =  theme;
  return { navCollapsed, navType, headerNavColor, mobileNav, currentTheme,shops,authUser }
};

export default connect(mapStateToProps, {toggleCollapsedNav, onMobileNavToggle, getShops,setSelectedShop})(HeaderNav);