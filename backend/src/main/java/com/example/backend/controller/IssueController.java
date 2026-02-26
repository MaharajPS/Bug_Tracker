package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.model.Issue;
import com.example.backend.model.Priority;
import com.example.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Issue Creation Controller
 * Created by: Kishore (KS)
 * Endpoint: POST /api/issues
 */
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    /**
     * Create a new issue
     * @param requestData Issue creation data
     * @return Created issue details
     */
    @PostMapping
    public ResponseEntity<ApiResponse<IssueDto>> createIssue(
            @RequestBody Map<String, Object> requestData) {

        // Extract and validate required fields
        String title = (String) requestData.get("title");
        String description = (String) requestData.get("description");
        String priorityStr = (String) requestData.get("priority");
        Long createdByUserId = requestData.get("createdByUserId") != null ?
            ((Number) requestData.get("createdByUserId")).longValue() : null;

        // Validation
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required and cannot be empty");
        }
        if (priorityStr == null) {
            throw new IllegalArgumentException("Priority is required");
        }
        if (createdByUserId == null) {
            throw new IllegalArgumentException("Created by user ID is required");
        }

        // Convert priority string to enum
        Priority priority;
        try {
            priority = Priority.valueOf(priorityStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority value. Must be one of: LOW, MEDIUM, HIGH, CRITICAL");
        }

        // Create issue
        Issue createdIssue = issueService.createIssue(
            title.trim(),
            description,
            priority,
            createdByUserId
        );

        // Convert to DTO and return
        IssueDto responseDto = convertToDto(createdIssue);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Issue created successfully", responseDto));
    }

    // Helper method to convert Issue entity to DTO
    private IssueDto convertToDto(Issue issue) {
        IssueDto dto = new IssueDto();
        dto.setId(issue.getId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setStatus(issue.getStatus());
        dto.setPriority(issue.getPriority());

        if (issue.getCreatedBy() != null) {
            com.example.backend.dto.UserDto createdByDto = new com.example.backend.dto.UserDto();
            createdByDto.setId(issue.getCreatedBy().getId());
            createdByDto.setName(issue.getCreatedBy().getName());
            createdByDto.setRole(issue.getCreatedBy().getRole());
            dto.setCreatedBy(createdByDto);
        }

        if (issue.getAssignedTo() != null) {
            com.example.backend.dto.UserDto assignedToDto = new com.example.backend.dto.UserDto();
            assignedToDto.setId(issue.getAssignedTo().getId());
            assignedToDto.setName(issue.getAssignedTo().getName());
            assignedToDto.setRole(issue.getAssignedTo().getRole());
            dto.setAssignedTo(assignedToDto);
        }

        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        return dto;
    }
}