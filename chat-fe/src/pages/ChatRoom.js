import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
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

const ChatRoom = observer(() => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { chatStore } = useStore();

  const [form] = Form.useForm();
  const clientRef = useRef(null);
  const username = useRef(t("room.guest") + Math.floor(Math.random() * 1000));
  const isAdmin = localStorage.getItem(`isAdmin_${roomId}`) === "true";

  // 1. Oda Bilgisini Çek ve Sayacı Başlat
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const res = await roomApi.getById(roomId);
        chatStore.setRoomInfo(res.data);
      } catch (error) {
        message.error(t("room.notFound"));
        navigate("/");
      }
    };
    fetchRoomInfo();

    const timer = setInterval(() => {
      if (chatStore.roomInfo?.expiryDate) {
        const now = new Date().getTime();
        const expiry = new Date(chatStore.roomInfo.expiryDate).getTime();
        const distance = expiry - now;

        if (distance < 0) {
          clearInterval(timer);
          chatStore.setTimeLeft(t("room.expired"));
          setTimeout(() => navigate("/"), 3000);
        } else {
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          chatStore.setTimeLeft(`${hours}s ${minutes}dk ${seconds}sn`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [roomId, chatStore.roomInfo?.expiryDate, navigate, t]);

  // 2. WebSocket Bağlantısı
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        chatStore.setConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const receivedMsg = JSON.parse(msg.body);
          chatStore.addMessage(receivedMsg);
          chatStore.addUser(receivedMsg.sender);
        });
        chatStore.addUser(username.current);
      },
      onDisconnect: () => chatStore.setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [roomId]);

  // İşlemler
  const handleSendMessage = (content) => {
    if (clientRef.current && chatStore.connected) {
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
    chatStore.setUpdateLoading(true);
    try {
      await roomApi.update(roomId, {
        name: values.name,
        durationHours: values.durationHours,
      });

      message.success("Oda güncellendi!");
      chatStore.setUpdateModalOpen(false);

      const res = await roomApi.getById(roomId);
      chatStore.setRoomInfo(res.data);
    } catch (error) {
      console.error(error);
      message.error("Güncelleme başarısız oldu.");
    } finally {
      chatStore.setUpdateLoading(false);
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
        roomName={chatStore.roomInfo?.name}
        timeLeft={chatStore.timeLeft}
        connected={chatStore.connected}
        isAdmin={isAdmin}
        onDelete={handleDeleteRoom}
        onEdit={() => {
          form.setFieldsValue({
            name: chatStore.roomInfo?.name,
            durationHours: 0,
          });
          chatStore.setUpdateModalOpen(true);
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
          <MessageList
            messages={chatStore.messages}
            currentUser={username.current}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!chatStore.connected}
          />
        </Content>
        <Modal
          title="Oda Ayarlarını Düzenle"
          open={chatStore.isUpdateModalOpen}
          onCancel={() => chatStore.setUpdateModalOpen(false)}
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
              <Button onClick={() => chatStore.setUpdateModalOpen(false)}>
                İptal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={chatStore.updateLoading}
              >
                Kaydet
              </Button>
            </div>
          </Form>
        </Modal>

        <UserList
          users={Array.from(chatStore.users)}
          currentUser={username.current}
        />
      </Layout>
    </Layout>
  );
});

export default ChatRoom;
