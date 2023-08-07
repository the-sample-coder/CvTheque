package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.Repository.UserRepository;
import com.example.demo.domain.User;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            User existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser != null) {
                return "The username " + user.getUsername() + " already exists";
            }
            String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            userRepository.save(user);
            return "The user " + user.getUsername() + " has registered successfully";
        } catch (DataIntegrityViolationException ex) {
            // Catch the exception and handle the duplicate entry error
            return "Error: The username " + user.getUsername() + " already exists";
        }
    }

    @GetMapping
    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    @GetMapping("/findByUsername")
    @ResponseBody
    public User findUser(@RequestParam("username") String username) {
        if(userRepository.findByUsername(username) == null)
            return null;
        else
            return userRepository.findByUsername(username);
    }

    @PutMapping("/{id}")
    public String updateUser(@RequestBody User user, @PathVariable Long id) {
        
        if (userRepository.findById(id).isPresent()) {
            User existingUser = userRepository.findById(id).get();
            if (user.getFirstname() != null) {
                existingUser.setFirstname(user.getFirstname());
            }

            if (user.getLastname() != null) {
                existingUser.setLastname(user.getLastname());
            }

            if (user.getEmail() != null) {
                existingUser.setEmail(user.getEmail());
            }

            if (user.getUsername() != null) {
                existingUser.setUsername(user.getUsername());
            }

            if (user.getPassword() != null) {
                String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            if (user.getRole() != null) {
                existingUser.setRole(user.getRole());
            }

            userRepository.save(existingUser);
            return "User has been updated successfully";
        } else {
            return "User not found";
        }
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return "User has been deleted successfully";
        } else {
            return "User not found";
        }
    }

}
