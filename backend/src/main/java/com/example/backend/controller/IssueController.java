package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.dto.request.CreateIssueRequest;
import com.example.backend.mapper.IssueMapper;
import com.example.backend.model.Issue;
import com.example.backend.service.IssueService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;
    private final IssueMapper issueMapper;

    public IssueController(IssueService issueService, IssueMapper issueMapper) {
        this.issueService = issueService;
        this.issueMapper = issueMapper;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IssueDto>> createIssue(
            @Valid @RequestBody CreateIssueRequest request) {

        Issue createdIssue = issueService.createIssue(
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getCreatedByUserId()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Issue created successfully",
                        issueMapper.toDto(createdIssue)));
    }
}