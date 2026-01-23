import React, { useState } from "react";
import { Input, Button, Popover } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText("");
      setOpen(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const content = (
    <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
  );

  return (
    <div
      style={{
        borderTop: "1px solid rgb(24, 144, 255)",
        padding: "10px",
        background: "rgb(24, 144, 255)",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="topLeft"
      >
        <Button
          shape="circle"
          icon={
            <SmileOutlined style={{ fontSize: "20px", color: "#ffd700" }} />
          }
          style={{ border: "none", background: "transparent" }}
        />
      </Popover>

      <Input
        placeholder={t("chat.placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSend}
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          color: "#e0e0e0",
          border: "1px solid #444",
          borderRadius: "20px",
        }}
      />

      <Button
        type="primary"
        shape="circle"
        icon={<SendOutlined />}
        onClick={handleSend}
      />
    </div>
  );
};

export default ChatInput;
