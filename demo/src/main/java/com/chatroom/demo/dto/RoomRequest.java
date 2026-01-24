package com.chatroom.demo.dto;

import lombok.Data;

@Data
public class RoomRequest {
    private String name;
    private int durationHours; // Kullanıcının seçtiği süre (saat)
    private boolean isListed;
    private String password;
}