package com.goldit.controllers;

import com.goldit.models.User;
import com.goldit.repositories.UserRepository;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	UserRepository userRepository;

	@PostMapping("/auth")
	public void login(@RequestAttribute("userRecord") UserRecord userRecord) {
		String uid = userRecord.getUid();
		User user = userRepository.findUserByUId(uid);
		if (user == null) {
			user = new User(uid, userRecord.getDisplayName(), userRecord.getEmail());
			System.out.println(user);
			userRepository.save(user);
			logger.info("New User Created " + user);
		}
	}
}
