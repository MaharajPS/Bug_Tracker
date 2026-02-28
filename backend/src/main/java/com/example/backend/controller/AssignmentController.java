package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.dto.request.AssignIssueRequest;
import com.example.backend.mapper.IssueMapper;
import com.example.backend.model.Issue;
import com.example.backend.service.AssignmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/issues")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final IssueMapper issueMapper;

    public AssignmentController(AssignmentService assignmentService,
                                IssueMapper issueMapper) {
        this.assignmentService = assignmentService;
        this.issueMapper = issueMapper;
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<IssueDto>> assignIssue(
            @PathVariable Long id,
            @Valid @RequestBody AssignIssueRequest request) {

        Issue updatedIssue = assignmentService.assignIssue(
                id,
                request.getAssigneeUserId(),
                request.getAssignedByUserId()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Issue assigned successfully",
                        issueMapper.toDto(updatedIssue))
        );
    }
}