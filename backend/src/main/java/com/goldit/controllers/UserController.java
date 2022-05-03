package com.goldit.controllers;

import com.goldit.models.User;
import com.goldit.repositories.UserRepository;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

	Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	UserRepository userRepository;

	@PostMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
	public User login(@RequestAttribute("userRecord") UserRecord userRecord) {
		String uid = userRecord.getUid();
		User user = userRepository.findUserByUId(uid);
		if (user == null) {
			user = new User(uid, userRecord.getEmail().split("@")[0], userRecord.getEmail());
			userRepository.save(user);
			logger.info("New User Created " + user);
		}
		return user;
	}

	@PutMapping(value = "/user")
	public String edit(@RequestAttribute("userRecord") UserRecord userRecord, @RequestBody Map<String, Object> body) {
		String uid = userRecord.getUid();
		User user = userRepository.findUserByUId(uid);
		if (user != null) {
			String newName = (String) body.get("username");
			User existedUser = userRepository.findUserByUsername(newName);
			if (existedUser != null) {
				return "existed";
			} else {
				user.setName(newName);
				userRepository.save(user);
				return "ok";
			}
		}
		return "error";
	}
}
