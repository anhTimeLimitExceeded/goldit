package com.goldit.controllers;

import com.goldit.models.CommentResponse;
import com.goldit.models.Entry;
import com.goldit.models.Relationship;
import com.goldit.repositories.CommentRepository;
import com.goldit.repositories.PostRepository;
import com.goldit.repositories.RelationshipRepository;
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

@RestController
public class CommentController {

	Logger logger = LoggerFactory.getLogger(CommentController.class);
	@Autowired
	PostRepository postRepository;
	@Autowired
	RelationshipRepository relationshipRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	CommentRepository commentRepository;
	@Autowired
	VoteController voteController;

	@PostMapping(value="/comment", produces= MediaType.APPLICATION_JSON_VALUE)
	public CommentResponse createComment(@RequestAttribute("userRecord") UserRecord userRecord, @RequestBody Map<String, Object> body) {
		Entry comment = new Entry(null, (String) body.get("contents"), userRecord.getUid(), new Date());
		commentRepository.save(comment);
		int parentId = Integer.parseInt((String) body.get("parentId"));
		relationshipRepository.save(new Relationship(parentId, comment.getId()));
		return new CommentResponse(comment.getId(), comment.getContents(),
				userRepository.findUserByUId(comment.getAuthor()).getName(), comment.getCreatedAt(),
				0, "neither", new ArrayList<>());
	}

	public int getPostCommentCount(int postId) {
		return getCommentCount(postId) - 1;
	}

	public int getCommentCount(int parentId) {
		int count = 1;
		List<Relationship> children = relationshipRepository.findByParentEquals(parentId);
		for (Relationship child : children) {
			count += getCommentCount(child.getChild());
		}
		return count;
	}

	@GetMapping(value="/comment/{parentId}", produces= MediaType.APPLICATION_JSON_VALUE)
	public List<CommentResponse> getComments(@PathVariable int parentId, @RequestParam(name = "sort") String sort,
											 @RequestAttribute(value = "userRecord", required = false) UserRecord userRecord) {
		String uid = userRecord == null ? null : userRecord.getUid();
		List<CommentResponse> comments = new ArrayList<>();
		List<Relationship> children = relationshipRepository.findByParentEquals(parentId);
		for (Relationship child : children) {
			Entry comment = commentRepository.findById(child.getChild());
			comments.add(new CommentResponse(comment.getId(), comment.getContents(),
					userRepository.findUserByUId(comment.getAuthor()).getName(), comment.getCreatedAt(),
					voteController.getVote(comment.getId()), voteController.getUserVote(comment.getId(), uid),
					getComments(comment.getId(), sort, userRecord)));
		}
		if ("top".equals(sort))
			comments.sort(Comparator.comparingInt(CommentResponse::getScore).reversed());
		else
			comments.sort(Comparator.comparing(CommentResponse::getCreatedAt).reversed());
		return comments;
	}
}
