package com.goldit.controllers;

import com.goldit.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeMap;

@RestController
public class TopicController {

	@Autowired
	TopicRepository topicRepository;
	@Autowired
	TreeMap<String, Integer> topicsMap;
	@Autowired
	LinkedHashMap<String, Integer> trendingTopicsMap;


	@GetMapping(value="/topics", produces = MediaType.APPLICATION_JSON_VALUE)
	public SortedSet<String> getTopics() {
		return topicsMap.navigableKeySet();
	}

	@GetMapping(value="/topics/trending", produces = MediaType.APPLICATION_JSON_VALUE)
	public LinkedHashMap<String, Integer> getTrendingTopics() {
		return trendingTopicsMap;
	}

	@PostMapping(value="/topics/new")
	public void requestTopic(@RequestBody Map<String, Object> body) {
		System.out.println("New Topic: " + body);
	}

}
