import InnerAppLayout from "layouts/inner-app-layout";
import ChatContent from "./ChatContent";
import ChatMenu from "./ChatMenu";
import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { getContacts } from "redux/actions";
import { ChatList } from "react-chat-engine";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  ChatEngine,
  getOrCreateChat,
  Socket,
  ChatEngineContext,
} from "react-chat-engine";
import { Avatar, Divider, Input, Form, Button, Menu, Select } from "antd";
import ReactHelmet from "react-helmet";

const { Option } = Select;

const Chat = (props) => {
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const history = useHistory();
  useEffect(() => {
    {
      localStorage.getItem("theme") === "dark"
        ? require("./dark.css")
        : require("./light.css");
    }
    let contactL = 0;
    if (props.authUser.user.isAdmin) {
      contactL = 1;
    }
    props.getContacts(contactL, props.authUser.user._id);
    if (!didMountRef.current) {
      didMountRef.current = true;
      let newP = true;
      if (!props.authUser.user || props.authUser.user === null) {
        history.push("/");
        return;
      }

      // Get-or-Create should be in a Firebase Function

      axios
        .get("https://api.chatengine.io/users/me/", {
          headers: {
            "project-id": "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
            "user-name": props.authUser.user.email,
            "user-secret": props.authUser.user._id,
          },
        })

        .then(() => setLoading(false))
        .catch((e) => {
          newP = true;
        });

      if (newP) {
        let formdata = new FormData();
        formdata.append("email", props.authUser.user.email);
        formdata.append("username", props.authUser.user.email);
        formdata.append("secret", props.authUser.user._id);
        axios
          .post("https://api.chatengine.io/users/", formdata, {
            headers: { "private-key": "a7753a3b-7eb7-46a8-9d79-0bb6802eb894" },
          })
          .then((r) => console.log(r))
          .catch((e) => console.log("e", e));
      }
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
  }, [props.authUser.user, history]);

  function createDirectChat(user, creds) {
    getOrCreateChat(
      creds,
      { is_direct_chat: false, usernames: [user.email], title: `Support` },
      () => setUsername("")
    );
  }
  function onChange(value) {
    console.log(`selected ${value}`);
    // setUsername(e.target.value)
    // createDirectChat(creds)
  }
  function userlist() {
    return props.chatApp.allContacts.map((user) => (
      <Option key={user._id} value={user._id}>
        {user.firstName} {user.lastName}{" "}
      </Option>
    ));
  }

  function renderChatForm(creds) {
    return (
      <div>
        {props.authUser.user.isAdmin ? (
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={(value) => {
              let result = props.chatApp.allContacts.find(
                (x) => x._id === value
              );
              // onChange(e.)
              createDirectChat(result, creds);
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {userlist()}
          </Select>
        ) : null}
      </div>
    );
  }
  return (
    <div className="chat">
      <ChatEngine
        backgroundColor="red"
        height="calc(90vh - 80px)"
        projectID="1d7a0de3-28c9-49f5-b2a1-062de07205d9"
        userName={props.authUser.user.email}
        userSecret={props.authUser.user._id}
        privateKey="a7753a3b-7eb7-46a8-9d79-0bb6802eb894"
        renderNewChatForm={(creds) => renderChatForm(creds)}
      ></ChatEngine>
      {/* <InnerAppLayout 
				sideContent={<ChatMenu {...props}/>}
				mainContent={<ChatContent {...props}/>}
				sideContentWidth={450}
				sideContentGutter={false}
				border
			/> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { chatApp: state.chatApp, authUser: state.authUser };
};

const mapDispatchToProps = {
  getContacts,
  getContacts,
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
