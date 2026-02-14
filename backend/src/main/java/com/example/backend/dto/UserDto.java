package com.example.backend.dto;

import com.example.backend.model.Role;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private Role role;
}
