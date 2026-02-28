package com.example.backend.service;

import com.example.backend.model.Issue;
import com.example.backend.model.Priority;

/**
 * Issue Service Interface
 * Created by: Kishore (KS)
 */
public interface IssueService {
    /**
     * Create a new issue
     * @param title Issue title
     * @param description Issue description
     * @param priority Issue priority
     * @param createdByUserId ID of user creating the issue
     * @return Created issue entity
     */
    Issue createIssue(String title, String description, Priority priority, Long createdByUserId);
}