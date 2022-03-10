package com.goldit.controllers;

import com.goldit.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

@RestController
public class TopicController {

	@Autowired
	TopicRepository topicRepository;
	@Autowired
	TreeMap<String, Integer> topicsMap;


	@GetMapping(value="/topics", produces = MediaType.APPLICATION_JSON_VALUE)
	public SortedSet<String> getTopics() {
		return topicsMap.navigableKeySet();
	}

	@GetMapping(value="/topics/trending", produces = MediaType.APPLICATION_JSON_VALUE)
	public SortedSet<String> getTrendingTopics() {
		SortedSet<String> set = new TreeSet<>();
		set.add("econ");
		set.add("philosophy");
		set.add("computerscience");
		set.add("math");
		set.add("marketplace");
		return set;
	}

}
