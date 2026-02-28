package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignIssueRequest {

    @NotNull(message = "Assignee user ID is required")
    private Long assigneeUserId;

    @NotNull(message = "Assigned by user ID is required")
    private Long assignedByUserId;
}