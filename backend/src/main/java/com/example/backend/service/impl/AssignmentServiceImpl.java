package com.bugtracker.service.impl;

import com.bugtracker.exception.BusinessException;
import com.bugtracker.model.*;
import com.bugtracker.repository.IssueRepository;
import com.bugtracker.repository.UserRepository;
import com.bugtracker.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Assignment Service Implementation
 * Created by: Rajasabari (RS)
 */
@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Issue assignIssue(Long issueId, Long assigneeUserId, Long assignedByUserId) {
        // Validate issue exists
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new BusinessException("Issue not found with ID: " + issueId));

        // Validate assignee exists and is DEVELOPER
        User assignee = userRepository.findById(assigneeUserId)
                .orElseThrow(() -> new BusinessException("Assignee user not found with ID: " + assigneeUserId));

        if (assignee.getRole() != Role.DEVELOPER) {
            throw new BusinessException(
                String.format("Assignee must be a DEVELOPER. User '%s' has role: %s",
                assignee.getName(), assignee.getRole())
            );
        }

        // Validate assigner exists and has permission (ADMIN or TESTER)
        User assigner = userRepository.findById(assignedByUserId)
                .orElseThrow(() -> new BusinessException("Assigner user not found with ID: " + assignedByUserId));

        if (assigner.getRole() != Role.ADMIN && assigner.getRole() != Role.TESTER) {
            throw new BusinessException(
                String.format("Only ADMIN or TESTER can assign issues. User '%s' has role: %s",
                assigner.getName(), assigner.getRole())
            );
        }

        // Business Rule: Cannot assign CLOSED issues
        if (issue.getStatus() == IssueStatus.CLOSED) {
            throw new BusinessException("Cannot assign CLOSED issues. Current status: " + issue.getStatus());
        }

        // Business Rule: Cannot reassign RESOLVED issues without reopening first
        if (issue.getStatus() == IssueStatus.RESOLVED) {
            throw new BusinessException(
                "Cannot reassign RESOLVED issues. Reopen the issue first before reassigning."
            );
        }

        // Perform assignment
        issue.setAssignedTo(assignee);

        // If issue is OPEN, we don't change status yet (developer will move to IN_PROGRESS when starting work)
        return issueRepository.save(issue);
    }
}
