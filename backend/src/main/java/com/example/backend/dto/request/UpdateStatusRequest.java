package com.example.backend.dto.request;

import com.example.backend.model.IssueStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {

    @NotNull(message = "New status is required")
    private IssueStatus newStatus;

    @NotNull(message = "User ID is required")
    private Long userId;
}