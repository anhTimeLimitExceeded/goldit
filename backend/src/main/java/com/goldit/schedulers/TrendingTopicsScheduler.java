package com.goldit.schedulers;

import com.goldit.models.Entry;
import com.goldit.models.Relationship;
import com.goldit.repositories.PostRepository;
import com.goldit.repositories.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

@Component
public class TrendingTopicsScheduler {

	@Autowired
	TreeMap<String, Integer> topicsMap;
	@Autowired
	TreeMap<Integer, String> topicsIdMap;
	@Autowired
	LinkedHashMap<String, Integer> trendingTopicsMap;
	@Autowired
	PostRepository postRepository;
	@Autowired
	RelationshipRepository relationshipRepository;

	@Scheduled(fixedDelay = 1000 * 60 * 60, initialDelay = 1000)
	public void scheduleFixedDelayTask() {
		Date today = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(1));
		List<Entry> todayPosts = postRepository.getAllPostsByDate(today);
		HashMap<Integer, Integer> topicIdCount = new HashMap<>();
		for (Entry post : todayPosts) {
			List<Relationship> topics = relationshipRepository.findByChildEquals(post.getId());
			for (Relationship topic : topics) {
				int topicId = topic.getParent();
				topicIdCount.putIfAbsent(topicId, 0);
				topicIdCount.put(topicId, topicIdCount.get(topicId) + 1);
			}
		}
		trendingTopicsMap.clear();
		topicIdCount.entrySet().stream().sorted(Comparator.comparingInt(es -> -es.getValue())) // Decreasing; neg. sizes.
				.forEach(es -> trendingTopicsMap.put(topicsIdMap.get(es.getKey()), es.getValue()));
	}

}
