import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { editChat, getChats, addPerson, deleteChat } from "react-chat-engine";
import { useHistory } from "react-router-dom";
import { Button, Table, Typography, Space, notification } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import UpdateNameModal from "./UpdateNameModal";
import AddMemberModal from "./AddMemberModal";

const ChatAdmin = (props) => {
  const didMountRef = useRef(false);
  const history = useHistory();

  const [data, setData] = useState([]);
  const [showUpdateName, setShowUpdateName] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const { authUser } = useSelector((state) => state);

  useEffect(() => {
    // Check if component is mounted
    if (!didMountRef.current) {
      didMountRef.current = true;

      // If unauthorized go to the main route
      if (!authUser.user || authUser.user === null) {
        history.push("/");
        return;
      }

      // Get chats data and set state
      fetchChats();
    }
  }, [authUser.user, history]);

  const fetchChats = () =>
    getChats(
      {
        projectID: "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
        userName: authUser.user.email,
        userSecret: authUser.user._id,
      },
      (data) => {
        setData(
          data.map((chat) => ({
            key: chat.id,
            title: chat.title,
            created: chat.created,
            last_message: {
              sender: chat.last_message.sender_username,
              message: chat.last_message.text,
            },
            members: chat.people.map((person) => ({
              username: person.person.username,
              isAdmin: person.person.username === chat.admin.username,
            })),
          }))
        );
        notification.info({ message: "Data was successfully fetched" });
      }
    );

  const updateChatName = (chatId, newTitle, callback) => {
    editChat(
      {
        projectID: "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
        userName: authUser.user.email,
        userSecret: authUser.user._id,
      },
      chatId,
      {
        title: newTitle,
      },
      () => {
        notification.success({
          message: `Title for chat with id ${chatId} has been updated to: ${newTitle}`,
        });
        console.log(
          `Title for chat with id ${chatId} has been updated to: ${newTitle}`
        );
        fetchChats();
        callback && callback();
      }
    );
  };

  const addChatMember = (chatId, user, callback) => {
    addPerson(
      {
        projectID: "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
        userName: authUser.user.email,
        userSecret: authUser.user._id,
      },
      chatId,
      user,
      () => {
        notification.success({
          message: `User ${user} was added to chat with id ${chatId}`,
        });
        console.log(`${user} was added to  ${chatId}`);
        fetchChats();
        callback && callback();
      }
    );
  };

  const deleteChatRoom = (chatId, callback) => {
    deleteChat(
      {
        projectID: "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
        userName: authUser.user.email,
        userSecret: authUser.user._id,
      },
      chatId,
      () => {
        notification.success({
          message: `Chat with id ${chatId} was deleted`,
        });
        console.log(`Chat with id ${chatId} was deleted`);
        fetchChats();
        callback && callback();
      }
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setActiveChat(data.filter((item) => item.key === record.key)[0]);
              setShowUpdateName(true);
            }}
          />
          <Typography.Title className="my-auto" level={2}>
            {title}
          </Typography.Title>
        </Space>
      ),
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      render: (created) => new Date(created).toLocaleDateString(),
    },
    {
      title: "Last Message",
      dataIndex: "last_message",
      key: "last_message",
      render: (last_message) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {last_message.sender && (
            <Typography.Text>{last_message.sender}</Typography.Text>
          )}
          {last_message.message ? (
            <Typography.Text disabled>
              {removeTags(last_message.message).substring(0, 20)}
            </Typography.Text>
          ) : (
            <Typography.Text disabled>No message</Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members, record) => {
        const nonAdminMembers = members.filter((member) => !member.isAdmin);

        return (
          <Space>
            <Button
              type="primary"
              ghost
              size="small"
              icon={<PlusOutlined />}
              shape="circle"
              onClick={() => {
                setActiveChat(
                  data.filter((item) => item.key === record.key)[0]
                );
                setShowAddMember(true);
              }}
            />
            {nonAdminMembers.length > 0 && (
              <Typography.Text>{nonAdminMembers[0].username}</Typography.Text>
            )}

            {nonAdminMembers.length > 1 && (
              <Typography.Text>
                and {nonAdminMembers.length - 1} more
              </Typography.Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button
          size="small"
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteChatRoom(record.key)}
        />
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} />
      <UpdateNameModal
        data={activeChat}
        visible={showUpdateName}
        submit={(newTitle) => {
          updateChatName(activeChat.key, newTitle, () =>
            setShowUpdateName(false)
          );
        }}
        close={() => setShowUpdateName(false)}
      />
      <AddMemberModal
        data={activeChat}
        visible={showAddMember}
        authObject={{
          projectID: "1d7a0de3-28c9-49f5-b2a1-062de07205d9",
          userName: authUser.user.email,
          userSecret: authUser.user._id,
        }}
        submit={(user) => {
          addChatMember(activeChat.key, user, () => setShowAddMember(false));
        }}
        close={() => setShowAddMember(false)}
      />
    </>
  );
};

export default ChatAdmin;

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/(<([^>]+)>)/gi, "");
}
