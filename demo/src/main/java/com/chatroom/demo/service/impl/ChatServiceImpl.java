package com.chatroom.demo.service.impl;

import com.chatroom.demo.constant.AppConstants;
import com.chatroom.demo.dto.MessageDto;
import com.chatroom.demo.entity.ChatMessage;
import com.chatroom.demo.entity.ChatRoom;
import com.chatroom.demo.repository.ChatMessageRepository;
import com.chatroom.demo.repository.ChatRoomRepository;
import com.chatroom.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository roomRepository;
    private final ChatMessageRepository messageRepository;

    @Override
    @Transactional
    public MessageDto saveMessage(String roomId, MessageDto messageDto) {
        ChatRoom room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException(AppConstants.ROOM_NOT_FOUND));

        ChatMessage message = new ChatMessage();
        message.setChatRoom(room);
        message.setSender(messageDto.getSender());
        message.setContent(messageDto.getContent());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        messageDto.setTimestamp(LocalDateTime.now().toString());
        return messageDto;
    }
}