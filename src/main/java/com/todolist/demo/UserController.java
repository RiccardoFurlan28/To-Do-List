package com.todolist.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody WebUser user, HttpSession session) {
        if(user.getUsername() == null || user.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(userService.registerUser(user) != null) {

            String sessionId = session.getId();
            userService.createSession(user.getId(), sessionId);

            session.setAttribute("sessionId", sessionId); 
            return new ResponseEntity<>(HttpStatus.CREATED);
        }

        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<Void> loginUser(@RequestBody WebUser user, HttpSession session) {
        WebUser foundUser = userService.findByUsername(user.getUsername());
        if (foundUser != null && new BCryptPasswordEncoder().matches(user.getPassword(), foundUser.getPassword())) {
            
            String sessionId = session.getId();
            userService.createSession(foundUser.getId(), sessionId);

            session.setAttribute("sessionId", sessionId); 
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpSession session) {
        String sessionId = (String) session.getAttribute("sessionId");
        if (sessionId != null) {
            
            userService.deleteSession(sessionId);
        }
        session.invalidate(); 
        return ResponseEntity.ok().build();
    }
}