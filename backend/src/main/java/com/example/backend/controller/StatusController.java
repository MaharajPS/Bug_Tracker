package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.IssueDto;
import com.example.backend.dto.request.UpdateStatusRequest;
import com.example.backend.mapper.IssueMapper;
import com.example.backend.model.Issue;
import com.example.backend.service.StatusTransitionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/issues")
public class StatusController {

    private final StatusTransitionService statusService;
    private final IssueMapper issueMapper;

    public StatusController(StatusTransitionService statusService,
                            IssueMapper issueMapper) {
        this.statusService = statusService;
        this.issueMapper = issueMapper;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<IssueDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {

        Issue updatedIssue = statusService.updateIssueStatus(
                id,
                request.getNewStatus(),
                request.getUserId()
        );

        return ResponseEntity.ok(
                ApiResponse.success("Status updated successfully",
                        issueMapper.toDto(updatedIssue))
        );
    }
}