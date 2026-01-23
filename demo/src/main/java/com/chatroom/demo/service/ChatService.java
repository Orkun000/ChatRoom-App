package com.chatroom.demo.service;

import com.chatroom.demo.dto.MessageDto;

public interface ChatService {
    MessageDto saveMessage(String roomId, MessageDto messageDto);
}