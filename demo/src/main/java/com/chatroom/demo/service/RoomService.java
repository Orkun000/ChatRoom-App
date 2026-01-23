package com.chatroom.demo.service;

import com.chatroom.demo.dto.RoomRequest;
import com.chatroom.demo.entity.ChatRoom;

public interface RoomService {
    ChatRoom createRoom(RoomRequest request);
    ChatRoom getRoomByUuid(String uuid);
    void deleteExpiredRooms();
    void deleteRoom(String roomId);
    ChatRoom updateRoom(String roomId,RoomRequest request);
}