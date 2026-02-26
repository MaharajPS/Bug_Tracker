package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;
import com.example.backend.service.StatusTransitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
import java.util.Map;

/**
 * Status Transition Controller
 * Created by: Priyanka (PK)
 * Endpoint: PUT /api/issues/{id}/status
 */
@RestController
@RequestMapping("/api/issues")
public class StatusController {

    @Autowired
    private StatusTransitionService statusService;

    /**
     * Update issue status with validation
     * @param id Issue ID
     * @param requestData Contains newStatus and userId
     * @return Updated issue details
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<IssueDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestData) {

        // Extract required fields
        String newStatusStr = (String) requestData.get("newStatus");
        Long userId = requestData.get("userId") != null ?
            ((Number) requestData.get("userId")).longValue() : null;

        // Validation
        if (newStatusStr == null) {
            throw new IllegalArgumentException("New status is required");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        // Convert status string to enum
        IssueStatus newStatus;
        try {
            newStatus = IssueStatus.valueOf(newStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Invalid status value. Must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED"
            );
        }

        // Perform status transition
        Issue updatedIssue = statusService.updateIssueStatus(id, newStatus, userId);

        // Convert to DTO and return
        IssueDto responseDto = convertToDto(updatedIssue);
        return ResponseEntity.ok(
            ApiResponse.success("Status updated successfully", responseDto)
        );
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