package com.example.backend.service.impl;

import com.example.backend.exception.BusinessException;
import com.example.backend.model.*;
import com.example.backend.repository.IssueRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.StatusTransitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.Set;

/**
 * Status Transition Service Implementation
 * Created by: Priyanka (PK)
 */
@Service
@Transactional
public class StatusTransitionServiceImpl implements StatusTransitionService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    // Valid transitions mapping
    private static final java.util.Map<IssueStatus, Set<IssueStatus>> VALID_TRANSITIONS;
    static {
        java.util.Map<IssueStatus, Set<IssueStatus>> transitions = new java.util.HashMap<>();
        transitions.put(IssueStatus.OPEN, EnumSet.of(IssueStatus.IN_PROGRESS));
        transitions.put(IssueStatus.IN_PROGRESS, EnumSet.of(IssueStatus.RESOLVED));
        transitions.put(IssueStatus.RESOLVED, EnumSet.of(IssueStatus.CLOSED, IssueStatus.OPEN));
        transitions.put(IssueStatus.CLOSED, EnumSet.noneOf(IssueStatus.class));
        VALID_TRANSITIONS = java.util.Collections.unmodifiableMap(transitions);
    }

    @Override
    public Issue updateIssueStatus(Long issueId, IssueStatus newStatus, Long userId) {

        // (// Validate issue exists
        // Issue issue = issueRepository.findWithUsersById(issueId)
        //         .orElseThrow(() -> new BusinessException("Issue not found with ID: " + issueId));)gven by maharaj the down line for this part alone os edited by priyanka ad this line shows error
        Issue issue = issueRepository.findById(issueId)
        .orElseThrow(() -> new BusinessException("Issue not found with ID: " + issueId));

        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found with ID: " + userId));

        IssueStatus currentStatus = issue.getStatus();

        // Check if transition is valid
        if (!VALID_TRANSITIONS.getOrDefault(currentStatus, java.util.Set.of()).contains(newStatus)) {
            throw new BusinessException(String.format(
                "Invalid status transition: %s → %s. Valid transitions from %s: %s",
                currentStatus,
                newStatus,
                currentStatus,
                VALID_TRANSITIONS.get(currentStatus) != null ?
                        VALID_TRANSITIONS.get(currentStatus).toString() : "NONE"
            ));
        }

        // Business Rule: Only assigned DEVELOPER can move OPEN → IN_PROGRESS
        if (currentStatus == IssueStatus.OPEN && newStatus == IssueStatus.IN_PROGRESS) {
            if (issue.getAssignedTo() == null) {
                throw new BusinessException("Issue must be assigned to a developer before moving to IN_PROGRESS");
            }
            if (!issue.getAssignedTo().getId().equals(userId)) {
                throw new BusinessException(
                        String.format("Only the assigned developer (%s) can start working on this issue",
                                issue.getAssignedTo().getName())
                );
            }
            if (user.getRole() != Role.DEVELOPER) {
                throw new BusinessException("Only DEVELOPERS can move issues to IN_PROGRESS");
            }
        }

        // Business Rule: Only assigned DEVELOPER can move IN_PROGRESS → RESOLVED
        if (currentStatus == IssueStatus.IN_PROGRESS && newStatus == IssueStatus.RESOLVED) {
            if (!issue.getAssignedTo().getId().equals(userId)) {
                throw new BusinessException(
                        String.format("Only the assigned developer (%s) can resolve this issue",
                                issue.getAssignedTo().getName())
                );
            }
            if (user.getRole() != Role.DEVELOPER) {
                throw new BusinessException("Only DEVELOPERS can resolve issues");
            }
        }

        // Business Rule: Only ADMIN/TESTER can close RESOLVED issues
        if (currentStatus == IssueStatus.RESOLVED && newStatus == IssueStatus.CLOSED) {
            if (user.getRole() != Role.ADMIN && user.getRole() != Role.TESTER) {
                throw new BusinessException("Only ADMIN or TESTER can close resolved issues");
            }
        }

        // Business Rule: Only ADMIN/TESTER can reopen RESOLVED issues
        if (currentStatus == IssueStatus.RESOLVED && newStatus == IssueStatus.OPEN) {
            if (user.getRole() != Role.ADMIN && user.getRole() != Role.TESTER) {
                throw new BusinessException("Only ADMIN or TESTER can reopen resolved issues");
            }
        }

        // Perform status update
        issue.setStatus(newStatus);
        return issueRepository.save(issue);
    }
}


