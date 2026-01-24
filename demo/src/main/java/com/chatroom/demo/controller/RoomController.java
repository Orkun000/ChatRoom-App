package com.chatroom.demo.controller;

import com.chatroom.demo.dto.RoomRequest;
import com.chatroom.demo.entity.ChatRoom;
import com.chatroom.demo.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<ChatRoom> createRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    // Odaya girerken var mı yok mu kontrolü için
    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoom> getRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(roomService.getRoomByUuid(roomId));
    }

    @PostMapping("delete/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("update/{roomId}")
    public ResponseEntity<Void> updateRoom(@PathVariable String roomId,@RequestBody RoomRequest request) {
        roomService.updateRoom(roomId,request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<ChatRoom>> getPublicRooms() {
        return ResponseEntity.ok(roomService.getPublicRooms());
    }

    @PostMapping("/verify/{roomId}")
    public ResponseEntity<Boolean> verifyRoomPassword(@PathVariable String roomId, @RequestBody String password) {
        boolean isValid = roomService.verifyPassword(roomId, password.replace("\"", ""));
        return ResponseEntity.ok(isValid);
    }
}