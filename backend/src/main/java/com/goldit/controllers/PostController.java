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
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	HashMap<String, Integer> topicsMap;

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
	public List<PostResponse> getPostFromTopic(@RequestAttribute(value = "userRecord", required = false) UserRecord userRecord, @PathVariable String topic) {
		Integer topicId = topicsMap.get(topic);
		String uid = userRecord == null ? null : userRecord.getUid();
		List<PostResponse> postResponsesList = new ArrayList<>();
		List<Entry> posts = topic.equals("all")? postRepository.getAllPosts() : postRepository.getPostsByTopic(topicId);
		for (Entry post : posts) {
			ArrayList<String> topics = new ArrayList<>();
			for (Relationship relationship : relationshipRepository.findByChildEquals(post.getId())) {
				topics.add(topicRepository.findById(relationship.getParent()).getTitle());
			}
			String title = post.getTitle().length() > 10 ? post.getTitle().substring(0, 10) : post.getTitle();
			title = title.replaceAll(" ", "_");
//			for (int i = 0; i < 20; i++) {
				postResponsesList.add(new PostResponse(post.getId(), post.getTitle(), post.getContents(),
						userRepository.findUserByUId(post.getAuthor()).getName(), post.getCreatedAt(), topics,
						post.getId() + "/" + title, voteController.getVote(post.getId()),
						voteController.getUserVote(post.getId(), uid)));
//			}
		}
		return postResponsesList;
	}

}
