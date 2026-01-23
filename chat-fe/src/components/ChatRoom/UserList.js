import React from "react";
import { Layout, List, Typography, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;
const { Title } = Typography;

const UserList = ({ users, currentUser }) => {
  const { t } = useTranslation();

  return (
    <Sider
      width={250}
      theme="light"
      style={{ borderLeft: "1px solid #e8e8e8" }}
    >
      <div style={{ padding: "20px" }}>
        <Title level={5}>
          <UserOutlined /> {t("chat.activeUsers")} ({users.length})
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: "#87d068" }}>
                    {user[0].toUpperCase()}
                  </Avatar>
                }
                title={user}
                description={
                  user === currentUser ? (
                    <Tag color="blue">{t("chat.you")}</Tag>
                  ) : (
                    <Tag color="green">{t("chat.onlineUser")}</Tag>
                  )
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Sider>
  );
};

export default UserList;
