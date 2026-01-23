import React, { useRef, useEffect } from "react";
import { Typography } from "antd";

const { Text } = Typography;

const MessageList = ({ messages, currentUser }) => {
  // Otomatik scroll için referans
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        paddingRight: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {messages.map((item, index) => (
        <div
          key={index}
          style={{
            alignSelf: item.sender === currentUser ? "flex-end" : "flex-start",
            maxWidth: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: item.sender === currentUser ? "flex-end" : "flex-start",
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: "11px", marginBottom: "2px" }}
          >
            {item.sender}
          </Text>
          <div
            style={{
              background: item.sender === currentUser ? "#1890ff" : "white",
              color: item.sender === currentUser ? "white" : "black",
              padding: "10px 15px",
              borderRadius: "12px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              wordWrap: "break-word",
            }}
          >
            {item.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
