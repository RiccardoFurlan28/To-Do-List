package com.todolist.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCategory(String category);
    List<Task> findByPriority(String priority);
    List<Task> findByUser(WebUser user);
}