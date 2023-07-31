package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.Repository.UserRepository;
import com.example.demo.domain.User;

@SpringBootApplication
public class CvthequeApplication {

	@Autowired
	private UserRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(CvthequeApplication.class, args);
	}
	
	@Bean
	CommandLineRunner runner(){
		return args -> {
			repository.save(new User("user", "$2a$04$1.YhMIgNX/8TkCKGFUONWO1waedKhQ5KrnB30fl0Q01QKqmzLf.Zi", "USER"));
			repository.save(new User("admin", "admin", "ADMIN"));
		};
	}
}
