package com.chatroom.demo.dto;

import lombok.Data;

@Data
public class MessageDto {
    private String sender;
    private String content;
    private String roomId; // Hangi odaya atıldığı
    private String timestamp; // Frontend'e string olarak dönmek daha kolay olabilir
}