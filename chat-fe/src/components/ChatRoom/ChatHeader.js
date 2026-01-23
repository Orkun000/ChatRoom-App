import React from "react";
import { Button, Tooltip, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import {
  DeleteOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const ChatHeader = ({ roomName, timeLeft, onDelete, onEdit, isAdmin }) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        padding: "0 20px",
        height: "64px",
        background: "#121212",
        borderBottom: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <h2 style={{ color: "#e0e0e0", margin: 0, fontSize: "18px" }}>
          {roomName || t("room.loading")}
        </h2>
        {timeLeft && (
          <span
            style={{
              color: "#888",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ClockCircleOutlined /> {timeLeft}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {isAdmin && (
          <Tooltip title={t("room.editRoomSettings")}>
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              {t("room.edit")}
            </Button>
          </Tooltip>
        )}
        {isAdmin && (
          <Popconfirm
            title={t("room.delete")}
            description={t("room.destroyConfirmTitle")}
            onConfirm={onDelete}
            okText={t("room.yes")}
            cancelText={t("room.no")}
          >
            <Button danger>{t("room.delete")}</Button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
