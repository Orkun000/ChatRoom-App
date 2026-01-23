package com.chatroom.demo.constant;

public class AppConstants {

    // Hata Mesajları
    public static final String ROOM_NOT_FOUND = "Oda bulunamadı!";
    public static final String ROOM_EXPIRED = "Oda süresi dolmuş veya mevcut değil.";
    public static final String MESSAGE_SAVE_ERROR = "Mesaj kaydedilemedi.";

    // Log Mesajları
    public static final String LOG_ROOM_CLEANUP = "Süresi dolan odalar temizlendi: {}";

    // Varsayılan Değerler
    public static final int MAX_ROOM_DURATION_HOURS = 24;
    public static final int MIN_ROOM_DURATION_HOURS = 1;


    private AppConstants() {
        throw new IllegalStateException("Utility class");
    }
}