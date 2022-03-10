package com.goldit.controllers;

import com.goldit.models.Entry;
import com.goldit.models.PostResponse;
import com.goldit.models.Relationship;
import com.goldit.repositories.PostRepository;
import com.goldit.repositories.RelationshipRepository;
import com.goldit.repositories.TopicRepository;
import com.goldit.repositories.UserRepository;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

@RestController
public class PostController {

	Logger logger = LoggerFactory.getLogger(PostController.class);
	@Autowired
	PostRepository postRepository;
	@Autowired
	TopicRepository topicRepository;
	@Autowired
	RelationshipRepository relationshipRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	VoteController voteController;
	@Autowired
	TreeMap<String, Integer> topicsMap;

	@PostMapping("/post")
	public String createPost(@RequestAttribute("userRecord") UserRecord userRecord, @RequestBody Map<String, Object> body) {
		Entry post = new Entry((String) body.get("title"), (String) body.get("contents"), userRecord.getUid(), new Date());
		postRepository.save(post);
		@SuppressWarnings("unchecked")
		List<String> topics = (List<String>) body.get("topics");
		for (String topic : topics) {
			relationshipRepository.save(new Relationship(topicsMap.get(topic), post.getId()));
		}

		String title = post.getTitle().length() > 10 ? post.getTitle().substring(0, 10) : post.getTitle();
		title = title.replaceAll(" ", "_");
		return post.getId() + "/" + title;
	}

	@GetMapping(value="/post/{id}/{title}", produces=MediaType.APPLICATION_JSON_VALUE)
	public PostResponse getPost(@RequestAttribute(value = "userRecord", required = false) UserRecord userRecord,
								@PathVariable int id, @PathVariable String title) {
		String uid = userRecord == null ? null : userRecord.getUid();
		String spacedTitle = title.replaceAll("_", " ");
		Entry post = postRepository.getPostByIdTitle(id, spacedTitle);
		ArrayList<String> topics = new ArrayList<>();
		for (Relationship relationship : relationshipRepository.findByChildEquals(post.getId())) {
			topics.add(topicRepository.findById(relationship.getParent()).getTitle());
		}
		return new PostResponse(post.getId(), post.getTitle(), post.getContents(), userRepository.findUserByUId(post.getAuthor()).getName(),
				post.getCreatedAt(), topics, post.getId() + "/" + title, voteController.getVote(post.getId()),
				voteController.getUserVote(post.getId(), uid));
	}

	@GetMapping(value="/topic/{topic}", produces=MediaType.APPLICATION_JSON_VALUE)
	public List<PostResponse> getPostFromTopic(@RequestAttribute(value = "userRecord", required = false) UserRecord userRecord,
											   @PathVariable String topic, @RequestParam(name = "sort")  String sort,
											   @RequestParam(name = "t")  String time) {
		if (sort == null || topic == null) {
			return null;
		}
		Integer topicId = topicsMap.get(topic);
		String uid = userRecord == null ? null : userRecord.getUid();
		List<PostResponse> postResponsesList = new ArrayList<>();
		List<Entry> posts = new ArrayList<>();
		switch (sort) {
			case "hot": {
				Date date = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(4));
				posts = topic.equals("all") ? postRepository.getAllPostsByDate(date) :
						postRepository.getPostsByTopicSortByDate(topicId, date);
				break;
			}
			case "new":
				posts = topic.equals("all") ? postRepository.getAllPostsSortByNew() :
						postRepository.getPostsByTopicSortByNew(topicId);
				break;
			case "top": {
				Date date;
				switch (time) {
					case "day":
						date = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(1));
						posts = topic.equals("all") ? postRepository.getAllPostsByDate(date) :
								postRepository.getPostsByTopicSortByDate(topicId, date);
						break;
					case "week":
						date = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(7));
						posts = topic.equals("all") ? postRepository.getAllPostsByDate(date) :
								postRepository.getPostsByTopicSortByDate(topicId, date);
						break;
					case "month":
						date = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(30));
						posts = topic.equals("all") ? postRepository.getAllPostsByDate(date) :
								postRepository.getPostsByTopicSortByDate(topicId, date);
						break;
					case "all":
						posts = topic.equals("all") ? postRepository.getAllPostsSortByNew() :
								postRepository.getPostsByTopicSortByNew(topicId);
						break;
					default:
						return null;
				}
				break;
			}
		}

		for (Entry post : posts) {
			ArrayList<String> topics = new ArrayList<>();
			for (Relationship relationship : relationshipRepository.findByChildEquals(post.getId())) {
				topics.add(topicRepository.findById(relationship.getParent()).getTitle());
			}
			String title = post.getTitle().length() > 10 ? post.getTitle().substring(0, 10) : post.getTitle();
			title = title.replaceAll(" ", "_");
				postResponsesList.add(new PostResponse(post.getId(), post.getTitle(), post.getContents(),
						userRepository.findUserByUId(post.getAuthor()).getName(), post.getCreatedAt(), topics,
						post.getId() + "/" + title, voteController.getVote(post.getId()),
						voteController.getUserVote(post.getId(), uid)));
		}

		if ("top".equals(sort)) {
			postResponsesList.sort(Comparator.comparingInt(post -> -post.getScore()));
		}

		if ("hot".equals(sort)) {
			postResponsesList.sort(Comparator.comparingInt(post -> -(post.getScore())));
		}

		return postResponsesList;
	}

}
