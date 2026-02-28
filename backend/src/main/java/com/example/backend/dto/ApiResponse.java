package com.example.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private final LocalDateTime timestamp;
    private final String message;
    private final T data;

    public ApiResponse(String message, T data) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(message, null);
    }
}