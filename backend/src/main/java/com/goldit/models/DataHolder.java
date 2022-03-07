package com.goldit.models;

import com.goldit.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class DataHolder {

	@Autowired
	TopicRepository topicRepository;

	@Bean
	public HashMap<String, Integer> topicsMap() {
		HashMap<String, Integer> map = new HashMap<>();
		for (Entry e : topicRepository.getAllTopics()) {
			map.put(e.getTitle(), e.getId());
		}
		return map;
	}
}
