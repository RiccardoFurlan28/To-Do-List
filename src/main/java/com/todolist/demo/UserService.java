package com.todolist.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    public WebUser registerUser(WebUser user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return null;
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return userRepository.save(user);
    }

    public WebUser findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserSession createSession(Long userId, String sessionId) {
        userSessionRepository.findBySessionId(sessionId).ifPresent(userSession -> {
            userSessionRepository.deleteBySessionId(sessionId);
        });
        UserSession userSession = new UserSession(userId, sessionId);
        return userSessionRepository.save(userSession);
    }

    public WebUser findBySessionId(String sessionId) {
        return userSessionRepository.findBySessionId(sessionId)
                .map(userSession -> userRepository.findById(userSession.getUserId()).orElse(null))
                .orElse(null);
    }

    @Transactional
    public void deleteSession(String sessionId) {
        userSessionRepository.deleteBySessionId(sessionId);
    }

    @Transactional
    public void deleteAllSessionsForUser(Long userId) {
        userSessionRepository.deleteByUserId(userId);
    }
}