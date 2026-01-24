import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  Card,
  Switch,
  List,
  Modal,
  Tag,
  message,
  Typography,
  Col,
  Row,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next"; // ÇEVİRİ İÇİN EKLENDİ
import { roomApi } from "../api/roomApi";

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook'u başlattık
  const [publicRooms, setPublicRooms] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Şifreli Giriş State'leri
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [joinPassword, setJoinPassword] = useState("");

  // Oda oluşturma formu
  const [form] = Form.useForm();
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await roomApi.getPublicRooms();
      setPublicRooms(res.data);
    } catch (error) {
      console.error("Liste hatası", error);
    }
  };

  // --- ODA OLUŞTURMA İŞLEMLERİ ---
  const handleCreate = async (values) => {
    try {
      const payload = {
        name: values.name,
        durationHours: values.durationHours || 3,
        isListed: values.isListed,
        password: values.password,
      };

      const res = await roomApi.create(payload);

      localStorage.setItem(`isAdmin_${res.data.roomId}`, "true");
      message.success(t("home.createSuccess")); // Çeviri
      setIsCreateModalOpen(false);
      navigate(`/room/${res.data.roomId}`);
    } catch (error) {
      message.error(t("home.createError")); // Çeviri
    }
  };

  // --- ODAYA GİRİŞ İŞLEMLERİ ---
  const handleJoinClick = (room) => {
    if (!room.password) {
      navigate(`/room/${room.roomId}`);
    } else {
      setSelectedRoomId(room.roomId);
      setJoinPassword("");
      setIsJoinModalOpen(true);
    }
  };

  const confirmJoin = async () => {
    try {
      const res = await roomApi.verifyPassword(selectedRoomId, joinPassword);
      if (res.data === true) {
        navigate(`/room/${selectedRoomId}`);
      } else {
        message.error(t("home.wrongPassword")); // Çeviri
      }
    } catch (error) {
      message.error(t("home.verifyError")); // Çeviri
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Üst Başlık ve Buton */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {t("home.title")}
          </Title>
          <Text type="secondary">{t("home.subtitle")}</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t("home.newRoomBtn")}
        </Button>
      </div>

      {/* Oda Listesi */}
      <Title level={4}>{t("home.publicRoomsTitle")}</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
        dataSource={publicRooms}
        renderItem={(room) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => handleJoinClick(room)}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  {room.name}
                </Text>
                {room.password ? (
                  <Tag color="red">
                    <LockOutlined /> {t("room.encryptedTag")}
                  </Tag>
                ) : (
                  <Tag color="green">
                    <UnlockOutlined /> {t("room.publicTag")}
                  </Tag>
                )}
              </div>
              <div style={{ color: "#888" }}>
                <UsergroupAddOutlined /> {t("room.clickToJoin")}
              </div>
            </Card>
          </List.Item>
        )}
      />

      {/* --- MODAL: ODA OLUŞTURMA --- */}
      <Modal
        title={t("createRoom.modalTitle")}
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ isListed: true, durationHours: 3 }}
        >
          <Form.Item
            name="name"
            label={t("createRoom.roomNameLabel")}
            rules={[
              { required: true, message: t("createRoom.roomNameRequired") },
            ]}
          >
            <Input
              prefix={<UsergroupAddOutlined />}
              placeholder={t("createRoom.roomNamePlaceholder")}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isListed"
                valuePropName="checked"
                label={t("createRoom.isListedLabel")}
              >
                <Switch
                  checkedChildren={<GlobalOutlined />}
                  unCheckedChildren={t("createRoom.hiddenLabel")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("createRoom.isEncryptedLabel")}>
                <Switch
                  checked={isPasswordEnabled}
                  onChange={setIsPasswordEnabled}
                />
              </Form.Item>
            </Col>
          </Row>

          {isPasswordEnabled && (
            <Form.Item
              name="password"
              label={t("createRoom.passwordLabel")}
              rules={[
                { required: true, message: t("createRoom.passwordRequired") },
              ]}
            >
              <Input.Password
                placeholder={t("createRoom.passwordPlaceholder")}
              />
            </Form.Item>
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{ marginTop: 10 }}
          >
            {t("createRoom.submitBtn")}
          </Button>
        </Form>
      </Modal>

      {/* --- MODAL: ŞİFRELİ GİRİŞ --- */}
      <Modal
        title={t("joinRoom.modalTitle")}
        open={isJoinModalOpen}
        onOk={confirmJoin}
        onCancel={() => setIsJoinModalOpen(false)}
        okText={t("joinRoom.submitBtn")}
        cancelText={t("room.cancel")}
      >
        <Input.Password
          placeholder={t("joinRoom.placeholder")}
          value={joinPassword}
          onChange={(e) => setJoinPassword(e.target.value)}
          onPressEnter={confirmJoin}
        />
      </Modal>
    </div>
  );
};

export default Home;
