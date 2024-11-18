package com.todolist.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findBySessionId(String sessionId);
    @Transactional
    void deleteBySessionId(String sessionId);
    void deleteByUserId(Long userId);
}
