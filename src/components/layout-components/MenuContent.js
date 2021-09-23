import React from "react";
import { Link } from "react-router-dom";
import { Menu, Grid } from "antd";
import IntlMessage from "../util-components/IntlMessage";
import Icon from "../util-components/Icon";
import navigationConfig from "configs/NavigationConfig";
import { connect } from "react-redux";
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from 'utils'
import { onMobileNavToggle } from "redux/actions/Theme";

const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = (props) => {
	const { sideNavTheme, routeInfo, hideGroupTitle, localization, onMobileNavToggle } = props;
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	const closeMobileNav = () => {
		if (isMobile) {
			onMobileNavToggle(false)
		}
	}
  function intersect_safe(a, b){
    let result=a.map(val=>{
      if (b.includes(val)){
        return true
      }

    })
    if(result[0]!==true){
      return false
    }

    return result[0];
  }
  return (
    <Menu
      theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
      mode="inline"
      style={{ height: "100%", borderRight: 0 }}
      defaultSelectedKeys={[routeInfo?.key]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      className={hideGroupTitle ? "hide-group-title" : ""}
    >
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          props.authUser.user&&intersect_safe(props.authUser.user.roles,menu.permission)? ( <Menu.ItemGroup
            key={menu.key}
            title={setLocale(localization, menu.title)}
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                props.authUser.user&&intersect_safe(props.authUser.user.roles,subMenuFirst.permission)? (<SubMenu
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  key={subMenuFirst.key}
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                      props.authUser.user&&intersect_safe(props.authUser.user.roles,subMenuSecond.permission)? (
                      <Menu.Item key={subMenuSecond.key}>
                      
                        {subMenuSecond.icon ? (
                          <Icon type={subMenuSecond?.icon} />
                        ) : null}
                        <span>
                          {setLocale(localization, subMenuSecond.title)}
                        </span>
                        <Link onClick={() => closeMobileNav()} to={subMenuSecond.path} />
                      </Menu.Item>
                      ):(null)                
                  ))}
                </SubMenu>):(null)

                
              ) : (
                props.authUser.user&&intersect_safe(props.authUser.user.roles,subMenuFirst.permission)? ( <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? <Icon type={subMenuFirst.icon} /> : null}
                  <span>{setLocale(localization, subMenuFirst.title)}</span>
                  <Link onClick={() => closeMobileNav()} to={subMenuFirst.path} />
                </Menu.Item>):(null)
               
              )
            )}
          </Menu.ItemGroup>):(null)
         
        ) : (
          props.authUser.user&&intersect_safe(props.authUser.user.roles,menu.permission)? (<Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.title)}</span>
            {menu.path ? <Link onClick={() => closeMobileNav()} to={menu.path} /> : null}
          </Menu.Item>):(null)
          
        )
      )}
    </Menu>
  );
};

const TopNavContent = (props) => {
  const { topNavColor, localization } = props;
  return (
    <Menu mode="horizontal" style={{ backgroundColor: topNavColor }}>
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName="top-nav-menu"
            title={
              <span>
                {menu.icon ? <Icon type={menu?.icon} /> : null}
                <span>{setLocale(localization, menu.title)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    
                    <Menu.Item key={subMenuSecond.key}>
                      <span>
                        {setLocale(localization, subMenuSecond.title)}
                      </span>
                      <Link to={subMenuSecond.path} />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? (
                    <Icon type={subMenuFirst?.icon} />
                  ) : null}
                  <span>{setLocale(localization, subMenuFirst.title)}</span>
                  <Link to={subMenuFirst.path} />
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.title)}</span>
            {menu.path ? <Link to={menu.path} /> : null}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
};

const mapStateToProps = ({ theme,authUser }) => {
  const { sideNavTheme, topNavColor } = theme;
  return { sideNavTheme, topNavColor,authUser };
};

export default connect(mapStateToProps, { onMobileNavToggle })(MenuContent);
