package com.example.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Issue;
import com.example.backend.model.IssueStatus;
import com.example.backend.model.User;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    List<Issue> findByStatus(IssueStatus status);
    List<Issue> findByAssignedTo(User user);
    List<Issue> findByCreatedBy(User user);
    
    @Query("SELECT i FROM Issue i WHERE " +
           "(COALESCE(:status, null) IS NULL OR i.status = :status) AND " +
           "(COALESCE(:assignedUserId, null) IS NULL OR i.assignedTo.id = :assignedUserId) AND " +
           "(COALESCE(:createdUserId, null) IS NULL OR i.createdBy.id = :createdUserId)")
    List<Issue> findFiltered(
        IssueStatus status, 
        Long assignedUserId, 
        Long createdUserId
    );
}
