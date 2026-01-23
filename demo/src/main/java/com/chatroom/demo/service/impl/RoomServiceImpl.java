package com.chatroom.demo.service.impl;

import com.chatroom.demo.constant.AppConstants;
import com.chatroom.demo.dto.RoomRequest;
import com.chatroom.demo.entity.ChatRoom;
import com.chatroom.demo.repository.ChatRoomRepository;
import com.chatroom.demo.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final ChatRoomRepository roomRepository;

    @Override
    public ChatRoom createRoom(RoomRequest request) {
        ChatRoom room = new ChatRoom();
        room.setName(request.getName());
        room.setRoomId(UUID.randomUUID().toString());
        room.setCreatedAt(LocalDateTime.now());

        // Max 24 saat kontrolü
        int duration = Math.min(request.getDurationHours(), AppConstants.MAX_ROOM_DURATION_HOURS);
        room.setExpiryDate(LocalDateTime.now().plusHours(duration));

        return roomRepository.save(room);
    }

    @Override
    public ChatRoom getRoomByUuid(String uuid) {
        return roomRepository.findByRoomId(uuid)
                .orElseThrow(() -> new RuntimeException(AppConstants.ROOM_NOT_FOUND));
    }

    // Zamanlanmış görev Implementation sınıfında olur
    @Override
    @Scheduled(fixedRate = 60000) // Her 60 saniyede bir
    @Transactional
    public void deleteExpiredRooms() {
        LocalDateTime now = LocalDateTime.now();
        roomRepository.deleteByExpiryDateBefore(now);
        log.info(AppConstants.LOG_ROOM_CLEANUP, now);
    }
    @Override
    public void deleteRoom(String roomId) {
        ChatRoom room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException(AppConstants.ROOM_NOT_FOUND));
        roomRepository.delete(room);
    }

    @Override
    public ChatRoom updateRoom(String roomId,RoomRequest request) {
        ChatRoom room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException(AppConstants.ROOM_NOT_FOUND));
        room.setName(request.getName());
        room.setExpiryDate(room.getExpiryDate().plusHours(request.getDurationHours()));
        return roomRepository.save(room);
    }
}