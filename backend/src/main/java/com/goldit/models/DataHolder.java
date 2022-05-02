package com.goldit.models;

import com.goldit.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.TreeMap;

@Component
public class DataHolder {

	@Autowired
	TopicRepository topicRepository;

	@Bean
	public TreeMap<String, Integer> topicsMap() {
		TreeMap<String, Integer> map = new TreeMap<>();
		for (Entry e : topicRepository.getAllTopics()) {
			map.put(e.getTitle(), e.getId());
		}
		return map;
	}

	@Bean
	public TreeMap<Integer, String> topicsIdMap() {
		TreeMap<Integer, String> map = new TreeMap<>();
		for (Entry e : topicRepository.getAllTopics()) {
			map.put(e.getId(), e.getTitle());
		}
		return map;
	}

	@Bean
	public LinkedHashMap<String, Integer> trendingTopicsMap() {
		return new LinkedHashMap<>();
	}
}
