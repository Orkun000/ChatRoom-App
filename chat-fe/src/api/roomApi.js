import axiosClient from "./axiosClient";

export const roomApi = {
  // Oda oluştur
  create: (data) => {
    return axiosClient.post("/rooms", data);
  },

  // Oda bilgisini getir
  getById: (roomId) => {
    return axiosClient.get(`/rooms/${roomId}`);
  },

  // Odayı sil
  delete: (roomId) => {
    return axiosClient.post(`/rooms/delete/${roomId}`);
  },

  update: (roomId, data) => {
    return axiosClient.post(`/rooms/update/${roomId}`, data);
  },
  getPublicRooms: () => axiosClient.get("/rooms/public"),
  verifyPassword: (roomId, password) =>
    axiosClient.post(`/rooms/verify/${roomId}`, password, {
      headers: { "Content-Type": "text/plain" },
    }),
};
