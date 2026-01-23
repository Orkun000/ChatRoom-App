import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, message, Form, Input, InputNumber, Button, Modal } from "antd";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { roomApi } from "../api/roomApi";

// Kendi oluşturduğumuz bileşenleri çağırıyoruz
import ChatHeader from "../components/ChatRoom/ChatHeader";
import UserList from "../components/ChatRoom/UserList";
import MessageList from "../components/ChatRoom/MessageList";
import ChatInput from "../components/ChatRoom/ChatInput";

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();
  const clientRef = useRef(null);
  const username = useRef(t("room.guest") + Math.floor(Math.random() * 1000));
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
  const handleUpdateRoom = async (values) => {
    setUpdateLoading(true);
    try {
      await roomApi.update(roomId, {
        name: values.name,
        durationHours: values.durationHours,
      });

      message.success("Oda güncellendi!");
      setIsUpdateModalOpen(false);

      setRoomInfo((prev) => ({
        ...prev,
        name: values.name,
      }));

      const res = await roomApi.getById(roomId);
      setRoomInfo(res.data);
    } catch (error) {
      console.error(error);
      message.error("Güncelleme başarısız oldu.");
    } finally {
      setUpdateLoading(false);
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
        onEdit={() => {
          form.setFieldsValue({
            name: roomInfo?.name,
            durationHours: 0,
          });
          setIsUpdateModalOpen(true);
        }}
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
        <Modal
          title="Oda Ayarlarını Düzenle"
          open={isUpdateModalOpen}
          onCancel={() => setIsUpdateModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdateRoom}>
            <Form.Item
              label="Oda İsmi"
              name="name"
              rules={[{ required: true, message: "İsim gerekli" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ekstra Süre Ekle (Saat)"
              name="durationHours"
              initialValue={0}
              help="Mevcut süreye kaç saat eklensin?"
            >
              <InputNumber min={0} max={24} style={{ width: "100%" }} />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: 20,
              }}
            >
              <Button onClick={() => setIsUpdateModalOpen(false)}>İptal</Button>
              <Button type="primary" htmlType="submit" loading={updateLoading}>
                Kaydet
              </Button>
            </div>
          </Form>
        </Modal>

        <UserList users={Array.from(users)} currentUser={username.current} />
      </Layout>
    </Layout>
  );
};

export default ChatRoom;
