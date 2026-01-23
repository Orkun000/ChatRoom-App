package com.chatroom.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "chat_rooms")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomId; // URL için UUID (örn: 550e8400...)

    private String name;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Oda silinince mesajlar da silinsin (Cascade)
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages;
}