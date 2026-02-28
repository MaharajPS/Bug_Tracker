package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.model.Issue;
import com.example.backend.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Issue Assignment Controller
 * Created by: Rajasabari (RS)
 * Endpoint: PUT /api/issues/{id}/assign
 */
@RestController
@RequestMapping("/api/issues")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    /**
     * Assign an issue to a developer
     * @param id Issue ID
     * @param requestData Assignment data containing assigneeUserId and assignedByUserId
     * @return Updated issue details
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<IssueDto>> assignIssue(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestData) {

        // Extract required fields
        Long assigneeUserId = requestData.get("assigneeUserId") != null ?
            ((Number) requestData.get("assigneeUserId")).longValue() : null;
        Long assignedByUserId = requestData.get("assignedByUserId") != null ?
            ((Number) requestData.get("assignedByUserId")).longValue() : null;

        // Validation
        if (assigneeUserId == null) {
            throw new IllegalArgumentException("Assignee user ID is required");
        }
        if (assignedByUserId == null) {
            throw new IllegalArgumentException("Assigned by user ID is required");
        }

        // Perform assignment
        Issue updatedIssue = assignmentService.assignIssue(
            id,
            assigneeUserId,
            assignedByUserId
        );

        // Convert to DTO and return
        IssueDto responseDto = convertToDto(updatedIssue);
        return ResponseEntity.ok(
            ApiResponse.success("Issue assigned successfully", responseDto)
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
            com.bugtracker.dto.UserDto createdByDto = new com.bugtracker.dto.UserDto();
            createdByDto.setId(issue.getCreatedBy().getId());
            createdByDto.setName(issue.getCreatedBy().getName());
            createdByDto.setRole(issue.getCreatedBy().getRole());
            dto.setCreatedBy(createdByDto);
        }

        if (issue.getAssignedTo() != null) {
            com.bugtracker.dto.UserDto assignedToDto = new com.bugtracker.dto.UserDto();
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
