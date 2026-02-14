package com.example.backend.dto;


import java.time.LocalDateTime;

import com.example.backend.model.IssueStatus;
import com.example.backend.model.Priority;

import lombok.Data;

@Data
public class IssueDto {
    private Long id;
    private String title;
    private String description;
    private IssueStatus status;
    private Priority priority;
    private UserDto createdBy;
    private UserDto assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
