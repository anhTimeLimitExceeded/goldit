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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import java.util.stream.Collectors;

@RestController
public class PostController {

	private static final int POSTS_PER_PAGE = 20;

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
	CommentController commentController;
	@Autowired
	TreeMap<String, Integer> topicsMap;
	@Autowired
	TreeMap<Integer, String> topicsIdMap;

	@PostMapping("/post")
	public String createPost(@RequestAttribute("userRecord") UserRecord userRecord, @RequestBody Map<String, Object> body) {
		@SuppressWarnings("unchecked")
		Entry post = new Entry((String) body.get("title"), (String) body.get("contents"),
				(List<String>) body.get("images"), userRecord.getUid(), new Date());

		postRepository.save(post);
		@SuppressWarnings("unchecked")
		List<String> topics = (List<String>) body.get("topics");
		for (String topic : topics) {
			relationshipRepository.save(new Relationship(topicsMap.get(topic), post.getId()));
		}

		return Entry.titleToLink(post);
	}

	@GetMapping(value="/post/{postId}/{title}", produces=MediaType.APPLICATION_JSON_VALUE)
	public PostResponse getPost(@RequestAttribute(value = "userRecord", required = false) UserRecord userRecord,
								@PathVariable int postId, @PathVariable String title) {
		String uid = userRecord == null ? null : userRecord.getUid();
		String spacedTitle = title.replaceAll("_", " ");
		Entry post = postRepository.getPostByIdTitle(postId, spacedTitle);
		ArrayList<String> topics = new ArrayList<>();
		for (Relationship relationship : relationshipRepository.findByChildEquals(post.getId())) {
			topics.add(topicsIdMap.get(relationship.getParent()));
		}
		return new PostResponse(post.getId(), post.getTitle(), post.getContents(), post.getImages(),
				userRepository.findUserByUId(post.getAuthor()).getUsername(), post.getAuthor().equals(uid),
				post.getCreatedAt(), topics, Entry.titleToLink(post), voteController.getVote(post.getId()),
				voteController.getUserVote(post.getId(), uid), commentController.getPostCommentCount(postId));
	}

	@DeleteMapping(value="/post/{postId}", produces=MediaType.APPLICATION_JSON_VALUE)
	public void deletePost(@RequestAttribute(value = "userRecord") UserRecord userRecord, @PathVariable int postId) {
		String uid = userRecord.getUid();
		Entry post = postRepository.getPostById(postId);
		if (!post.getAuthor().equals(uid)) return;
		if (post.isDeleted()) return;

		post.setDeleted(true);
		postRepository.save(post);
	}

	@PutMapping(value="/post/{postId}", produces=MediaType.APPLICATION_JSON_VALUE)
	public void editPost(@RequestAttribute(value = "userRecord") UserRecord userRecord, @PathVariable int postId,
						 @RequestBody Map<String, Object> body) {
		String uid = userRecord.getUid();
		Entry post = postRepository.getPostById(postId);
		if (!post.getAuthor().equals(uid)) return;
		if (post.isDeleted()) return;

		post.setContents((String) body.get("contents"));
		@SuppressWarnings("unchecked")
		List<String> images = (List<String>) body.get("images");
		post.setImages(images);
		@SuppressWarnings("unchecked")
		List<String> newTopics = (List<String>) body.get("topics");
		List<Integer> newTopicsIds = newTopics.stream().map((topic) -> topicsMap.get(topic)).collect(Collectors.toList());
		List<Relationship> oldTopics = relationshipRepository.findByChildEquals(post.getId());

		for (Integer topicId : newTopicsIds) {
			if (relationshipRepository.findByRelationship(topicId, post.getId()) == null)
				relationshipRepository.save(new Relationship(topicId, post.getId()));
		}
		for (Relationship oldTopicRelationship : oldTopics) {
			if (!newTopicsIds.contains(oldTopicRelationship.getParent()))
				relationshipRepository.delete(oldTopicRelationship);
		}
		postRepository.save(post);
	}

	@GetMapping(value="/topic/{topic}", produces=MediaType.APPLICATION_JSON_VALUE)
	public List<PostResponse> getPostFromTopic(@RequestAttribute(value = "userRecord", required = false) UserRecord userRecord,
											   @PathVariable String topic,
											   @RequestParam(name = "sort") String sort,
											   @RequestParam(name = "t") String time,
											   @RequestParam(name = "p") int page) {
		if (sort == null || topic == null) {
			return null;
		}
		Integer topicId = topicsMap.get(topic);
		String uid = userRecord == null ? null : userRecord.getUid();
		List<PostResponse> postResponsesList = new ArrayList<>();
		List<Entry> posts = new ArrayList<>();
		switch (sort) {
			case "hot": {
				Date date = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(10));
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
				topics.add(topicsIdMap.get(relationship.getParent()));
			}
				postResponsesList.add(new PostResponse(post.getId(), post.getTitle(), post.getContents(), post.getImages(),
						userRepository.findUserByUId(post.getAuthor()).getUsername(), post.getAuthor().equals(uid),
						post.getCreatedAt(), topics, Entry.titleToLink(post), voteController.getVote(post.getId()),
						voteController.getUserVote(post.getId(), uid), commentController.getPostCommentCount(post.getId())));
		}

		if ("top".equals(sort)) {
			postResponsesList.sort(Comparator.comparingInt(post -> -post.getScore()));
		}

		if ("hot".equals(sort)) {
			postResponsesList.sort(Comparator.comparingInt(post -> -(post.getScore()+post.getCommentCount())));
		}

		if (POSTS_PER_PAGE * page > postResponsesList.size()) return new ArrayList<>();
		return postResponsesList.subList(POSTS_PER_PAGE * page, Math.min(POSTS_PER_PAGE * (page + 1), postResponsesList.size()));
	}

}
