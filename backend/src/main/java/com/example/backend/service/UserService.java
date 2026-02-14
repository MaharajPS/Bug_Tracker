package com.example.backend.service;

import java.util.List;

import com.example.backend.model.Role;
import com.example.backend.model.User;

/**
 * User Service Interface
 * Created by: Mythili (MY)
 */
public interface UserService {
    /**
     * Create a new user
     * @param name User name
     * @param role User role (ADMIN, DEVELOPER, TESTER)
     * @return Created user entity
     */
    User createUser(String name, Role role);

    /**
     * Get all users
     * @return List of all users
     */
    List<User> getAllUsers();
}