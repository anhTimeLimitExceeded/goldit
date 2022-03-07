package com.goldit.controllers;

import com.goldit.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Set;

@RestController
public class TopicController {

	@Autowired
	TopicRepository topicRepository;
	@Autowired
	HashMap<String, Integer> topicsMap;


	@GetMapping(value="/topics", produces = MediaType.APPLICATION_JSON_VALUE)
	public Set<String> getTags() {
		return topicsMap.keySet();
	}

}
