package com.todolist.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")  // Allow all endpoints
            .allowedOrigins("http://localhost:3000")  // Allow the frontend URL
            .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific methods
            .allowedHeaders("*")  // Allow all headers
            .allowCredentials(true);  // Allow credentials
    }
}
