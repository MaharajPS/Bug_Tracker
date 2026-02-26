package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;
import com.example.backend.service.IssueQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/issues")
public class IssueQueryController {

    @Autowired
    private IssueQueryService queryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueDto>>> getFilteredIssues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) Long createdBy) {

        IssueStatus statusEnum = null;

        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = IssueStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                        "Invalid status value. Must be OPEN, IN_PROGRESS, RESOLVED, CLOSED"
                );
            }
        }

        List<Issue> issues = queryService.getFilteredIssues(
                statusEnum,
                assignedTo,
                createdBy
        );

        List<IssueDto> issueDtos = issues.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success("Issues retrieved successfully", issueDtos)
        );
    }

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

