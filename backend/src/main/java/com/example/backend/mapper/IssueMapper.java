package com.example.backend.mapper;

import org.springframework.stereotype.Component;

import com.example.backend.dto.IssueDto;
import com.example.backend.dto.UserDto;
import com.example.backend.model.Issue;

@Component
public class IssueMapper {

    public IssueDto toDto(Issue issue) {
        IssueDto dto = new IssueDto();

        dto.setId(issue.getId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setStatus(issue.getStatus());
        dto.setPriority(issue.getPriority());
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());

        if (issue.getCreatedBy() != null) {
            UserDto createdByDto = new UserDto();
            createdByDto.setId(issue.getCreatedBy().getId());
            createdByDto.setName(issue.getCreatedBy().getName());
            createdByDto.setRole(issue.getCreatedBy().getRole());
            dto.setCreatedBy(createdByDto);
        }

        if (issue.getAssignedTo() != null) {
            UserDto assignedToDto = new UserDto();
            assignedToDto.setId(issue.getAssignedTo().getId());
            assignedToDto.setName(issue.getAssignedTo().getName());
            assignedToDto.setRole(issue.getAssignedTo().getRole());
            dto.setAssignedTo(assignedToDto);
        }

        return dto;
    }
}