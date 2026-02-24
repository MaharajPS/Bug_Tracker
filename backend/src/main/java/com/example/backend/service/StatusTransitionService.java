package com.example.backend.service;

import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;

/**
 * Status Transition Service Interface
 * Created by: Priyanka (PK)
 */
public interface StatusTransitionService {

    /**
     * Update issue status with business rule validation
     * @param issueId Issue ID
     * @param newStatus New status to transition to
     * @param userId ID of user performing the transition
     * @return Updated issue entity
     */
    Issue updateIssueStatus(Long issueId, IssueStatus newStatus, Long userId);
}