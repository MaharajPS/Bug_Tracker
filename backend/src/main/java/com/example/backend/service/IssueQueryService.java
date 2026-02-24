package com.example.backend.service;

import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;

import java.util.List;

public interface IssueQueryService {

    List<Issue> getFilteredIssues(
            IssueStatus status,
            Long assignedToUserId,
            Long createdById
    );
}

