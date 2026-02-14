package com.example.backend.service.impl;

import com.example.backend.exception.BusinessException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * User Service Implementation
 * Created by: Mythili (MY)
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(String name, Role role) {
        // Validation
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException("User name cannot be empty");
        }

        if (role == null) {
            throw new BusinessException("Role is required");
        }

        // Prevent duplicate names (case-insensitive)
        String trimmedName = name.trim();
        userRepository.findByName(trimmedName).ifPresent(existing -> {
            throw new BusinessException("User with name '" + trimmedName + "' already exists");
        });

        // Create and save user
        User user = new User(trimmedName, role);
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}