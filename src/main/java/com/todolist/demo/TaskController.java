package com.todolist.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    // Helper method to validate session and retrieve user
    private WebUser validateSession(HttpSession session) {
        String sessionId = (String) session.getAttribute("sessionId");
        if (sessionId == null) {
            logger.warn("No session ID found in session");
            return null;
        }

        WebUser user = userService.findBySessionId(sessionId);
        if (user == null) {
            logger.warn("Invalid session ID: {}", sessionId);
        }
        return user;
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, HttpSession session) {
        WebUser user = validateSession(session);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        task.setUser(user); // Assign the task to the logged-in user
        logger.info("Creating task for user {}: {}", user.getUsername(), task);
        return ResponseEntity.ok(taskService.createTask(task));
    }

    // Get all tasks for the logged-in user
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(HttpSession session) {
        WebUser user = validateSession(session);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        logger.info("Fetching all tasks for user {}", user.getUsername());
        return ResponseEntity.ok(taskService.getAllTasksByUser(user));
    }

    // Get a specific task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, HttpSession session) {
        WebUser user = validateSession(session);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Task task = taskService.getTaskById(id).orElse(null);
        if (task == null || !task.getUser().getId().equals(user.getId())) {
            logger.warn("Unauthorized access to task {} by user {}", id, user.getUsername());
            return ResponseEntity.status(403).build(); // Forbidden
        }

        logger.info("Fetching task {} for user {}", id, user.getUsername());
        return ResponseEntity.ok(task);
    }

    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskData, HttpSession session) {
        WebUser user = validateSession(session);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Task existingTask = taskService.getTaskById(id).orElse(null);
        if (existingTask == null || !existingTask.getUser().getId().equals(user.getId())) {
            logger.warn("Unauthorized update attempt for task {} by user {}", id, user.getUsername());
            return ResponseEntity.status(403).build(); // Forbidden
        }

        existingTask.setTitle(taskData.getTitle());
        existingTask.setDescription(taskData.getDescription());
        existingTask.setCompleted(taskData.isCompleted());
        existingTask.setDueDate(taskData.getDueDate());
        existingTask.setPriority(taskData.getPriority());
        existingTask.setCategory(taskData.getCategory());
        logger.info("Updating task {} for user {}", id, user.getUsername());
        return ResponseEntity.ok(taskService.updateTask(id, existingTask));
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, HttpSession session) {
        WebUser user = validateSession(session);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Task task = taskService.getTaskById(id).orElse(null);
        if (task == null || !task.getUser().getId().equals(user.getId())) {
            logger.warn("Unauthorized delete attempt for task {} by user {}", id, user.getUsername());
            return ResponseEntity.status(403).build(); // Forbidden
        }

        logger.info("Deleting task {} for user {}", id, user.getUsername());
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
