package com.goldit.controllers;

import com.goldit.models.Vote;
import com.goldit.repositories.VoteRepository;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class VoteController {

	@Autowired
	VoteRepository voteRepository;

	@PostMapping(value="/vote")
	public void submitVote(@RequestAttribute("userRecord") UserRecord userRecord, @RequestBody Map<String, String> body) {
		String postId = body.get("postId");
		String type = body.get("type");
		if (!"up".equals(type) && !"down".equals(type)) return;
		boolean upvote = "up".equals(type);
		Vote vote = voteRepository.findVote(userRecord.getUid(), postId);
		if (vote != null) {
			boolean databaseUpvote = vote.getEntry1().equals(userRecord.getUid());
			if (upvote == databaseUpvote) {
				voteRepository.delete(vote);
			} else {
				String temp = vote.getEntry1();
				vote.setEntry1(vote.getEntry2());
				vote.setEntry2(temp);
				voteRepository.save(vote);
			}
		} else {
			if (upvote) {
				voteRepository.save(new Vote(userRecord.getUid(), postId));
			} else {
				voteRepository.save(new Vote(postId, userRecord.getUid()));
			}
		}
	}

	public int getVote(int postId) {
		String entryId = String.valueOf(postId);
		return voteRepository.getUpvote(entryId) - voteRepository.getDownvote(entryId);
	}

	public String getUserVote(int postId, String uid) {
		if (uid == null) return "neither";
		String entryId = String.valueOf(postId);
		Vote vote = voteRepository.findVote(uid, entryId);
		if (vote == null) {
			return "neither";
		} else {
			boolean databaseUpvote = vote.getEntry1().equals(uid);
			return databaseUpvote ? "up" : "down";
		}
	}
}
