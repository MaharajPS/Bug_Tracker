package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.exception.BusinessException;
import com.example.backend.mapper.IssueMapper;
import com.example.backend.model.IssueStatus;
import com.example.backend.service.IssueQueryService;

@RestController
@RequestMapping("/api/issues")
public class IssueQueryController {

    private final IssueQueryService queryService;
    private final IssueMapper issueMapper;

    public IssueQueryController(IssueQueryService queryService,
                                IssueMapper issueMapper) {
        this.queryService = queryService;
        this.issueMapper = issueMapper;
    }

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
                throw new BusinessException(
                        "Invalid status value. Must be OPEN, IN_PROGRESS, RESOLVED, CLOSED"
                );
            }
        }

        List<IssueDto> issueDtos = queryService.getFilteredIssues(
                        statusEnum,
                        assignedTo,
                        createdBy
                )
                .stream()
                .map(issueMapper::toDto)
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success("Issues retrieved successfully", issueDtos)
        );
    }
}