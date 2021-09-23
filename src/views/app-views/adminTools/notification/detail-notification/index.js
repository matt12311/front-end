import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadUser, getNotificationDetail } from "../../../../../redux/actions";

class NotificationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentDidMount() {
    let notiId = this.props.location.pathname.split("/");
    this.props.loadUser().then(() => {
      this.props.getNotificationDetail(notiId[notiId.length - 1], this.props.authUser.user._id);
    })
  }

  render() {

    return (
      <Fragment>
        {
          (!this.props.notifications.notification) ? <div className="loading"></div> : 
            <div dangerouslySetInnerHTML={{__html: this.props.notifications.notification.description }} />
        }
      </Fragment>
    )
  }
}


function mapStateToProps(state) {
  return {
    authUser: state.authUser,
    notifications: state.notifications
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getNotificationDetail: getNotificationDetail,
    loadUser: loadUser
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(NotificationDetail);
