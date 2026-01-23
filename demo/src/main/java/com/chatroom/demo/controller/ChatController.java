package com.chatroom.demo.controller;

import com.chatroom.demo.dto.MessageDto;
import com.chatroom.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    // Burada da Interface kullanıyoruz
    private final ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public MessageDto sendMessage(@DestinationVariable String roomId, @Payload MessageDto messageDto) {
        // Tüm iş mantığı ServiceImpl içinde, Controller temiz kaldı.
        return chatService.saveMessage(roomId, messageDto);
    }
}