package com.example.backend.service.impl;

import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;
import com.example.backend.repository.IssueRepository;
import com.example.backend.service.IssueQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class IssueQueryServiceImpl implements IssueQueryService {

    @Autowired
    private IssueRepository issueRepository;

    @Override
    public List<Issue> getFilteredIssues(
            IssueStatus status,
            Long assignedToUserId,
            Long createdById
    ) {

        return issueRepository.findFiltered(
                status,
                assignedToUserId,
                createdById
        );
    }
}

