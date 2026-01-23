import React, { useState } from "react";
import { Card, Form, Input, InputNumber, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { roomApi } from "./api/roomApi";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async (values) => {
    setLoading(true);
    try {
      const response = await roomApi.create({
        name: values.name,
        durationHours: values.duration,
      });

      localStorage.setItem(`isAdmin_${response.data.roomId}`, "true");

      message.success("Oda oluşturuldu!");
      navigate(`/chat/${response.data.roomId}`);
    } catch (error) {
      console.error(error);
      message.error("Oda oluşturulurken hata çıktı!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card title="Geçici Chat Odası Kur" style={{ width: 400 }}>
        <Form onFinish={createRoom} layout="vertical">
          <Form.Item label="Oda Adı" name="name" rules={[{ required: true }]}>
            <Input placeholder="Örn: Proje Tartışması" />
          </Form.Item>

          <Form.Item label="Süre (Saat)" name="duration" initialValue={1}>
            <InputNumber min={1} max={24} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Odayı Başlat
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Home;
