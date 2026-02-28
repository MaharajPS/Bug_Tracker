package com.example.backend.service;

import com.example.backend.model.Issue;

/**
 * Assignment Service Interface
 * Created by: Rajasabari (RS)
 */
public interface AssignmentService {
    /**
     * Assign an issue to a developer
     * @param issueId Issue ID
     * @param assigneeUserId ID of user to assign issue to
     * @param assignedByUserId ID of user performing the assignment
     * @return Updated issue entity
     */
    Issue assignIssue(Long issueId, Long assigneeUserId, Long assignedByUserId);
}
