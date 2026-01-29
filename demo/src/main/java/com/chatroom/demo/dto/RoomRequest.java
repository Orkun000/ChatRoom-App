package com.chatroom.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RoomRequest {
    private String name;
    private int durationHours;
    private String password;
    @JsonProperty("isListed")
    private boolean listedFlag;
}