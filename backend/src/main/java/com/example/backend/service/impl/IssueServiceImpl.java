package com.example.backend.service.impl;

import com.example.backend.exception.BusinessException;
import com.example.backend.model.*;
import com.example.backend.repository.IssueRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Issue Service Implementation
 * Created by: Kishore (KS)
 */
@Service
@Transactional
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Issue createIssue(String title, String description, Priority priority, Long createdByUserId) {
        // Validate creator exists
        User creator = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new BusinessException("Creator user not found with ID: " + createdByUserId));

        // Business Rule: Only TESTER or ADMIN can create issues
        if (creator.getRole() != Role.TESTER && creator.getRole() != Role.ADMIN) {
            throw new BusinessException(
                String.format("Only TESTER or ADMIN can create issues. Current user '%s' has role: %s",
                creator.getName(), creator.getRole())
            );
        }

        // Create issue entity
        Issue issue = new Issue();
        issue.setTitle(title);
        issue.setDescription(description != null ? description.trim() : null);
        issue.setPriority(priority);
        issue.setStatus(IssueStatus.OPEN); // Always start as OPEN
        issue.setCreatedBy(creator);
        // assignedTo is null initially

        return issueRepository.save(issue);
    }
}