import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, message } from "antd";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { roomApi } from "./api/roomApi";

// Kendi oluşturduğumuz bileşenleri çağırıyoruz
import ChatHeader from "./components/ChatHeader";
import UserList from "./components/UserList";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

const { Content } = Layout;

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State'ler
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(t("room.calculating"));

  const clientRef = useRef(null);
  const username = useRef("Misafir_" + Math.floor(Math.random() * 1000));
  const isAdmin = localStorage.getItem(`isAdmin_${roomId}`) === "true";

  // 1. Oda Bilgisini Çek ve Sayacı Başlat
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const res = await roomApi.getById(roomId);
        setRoomInfo(res.data);
      } catch (error) {
        message.error(t("room.notFound"));
        navigate("/");
      }
    };
    fetchRoomInfo();

    const timer = setInterval(() => {
      if (roomInfo?.expiryDate) {
        const now = new Date().getTime();
        const expiry = new Date(roomInfo.expiryDate).getTime();
        const distance = expiry - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft(t("room.expired"));
          setTimeout(() => navigate("/"), 3000);
        } else {
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}s ${minutes}dk ${seconds}sn`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [roomId, roomInfo?.expiryDate, navigate, t]);

  // 2. WebSocket Bağlantısı
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const receivedMsg = JSON.parse(msg.body);
          setMessages((prev) => [...prev, receivedMsg]);
          setUsers((prev) => new Set(prev).add(receivedMsg.sender));
        });
        setUsers((prev) => new Set(prev).add(username.current));
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [roomId]);

  // İşlemler
  const handleSendMessage = (content) => {
    if (clientRef.current && connected) {
      const msgData = {
        sender: username.current,
        content: content,
        roomId: roomId,
      };
      clientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(msgData),
      });
    }
  };

  const handleDeleteRoom = () => {
    roomApi
      .delete(roomId)
      .then(() => {
        message.success(t("room.deleteSuccess"));
        navigate("/");
      })
      .catch(() => message.error(t("room.deleteError")));
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <ChatHeader
        roomName={roomInfo?.name}
        timeLeft={timeLeft}
        connected={connected}
        isAdmin={isAdmin}
        onDelete={handleDeleteRoom}
      />

      <Layout>
        <Content
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            background: "#f0f2f5",
          }}
        >
          <MessageList messages={messages} currentUser={username.current} />
          <ChatInput onSendMessage={handleSendMessage} disabled={!connected} />
        </Content>

        <UserList users={Array.from(users)} currentUser={username.current} />
      </Layout>
    </Layout>
  );
};

export default ChatRoom;
