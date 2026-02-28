package com.example.backend.dto.request;

import com.example.backend.model.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    @NotBlank(message = "User name cannot be empty")
    private String name;

    @NotNull(message = "Role is required")
    private Role role;
}