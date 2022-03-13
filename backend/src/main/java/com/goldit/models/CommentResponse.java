package com.goldit.models;

import java.util.Date;
import java.util.List;

public class CommentResponse {

	private final int id;

	private final String contents;

	private final String author;

	private final Date createdAt;

	private final int score;

	private final String vote;

	private List<CommentResponse> children;

	public CommentResponse(int id, String contents, String author, Date createdAt, int score, String vote, List<CommentResponse> children) {
		this.id = id;
		this.contents = contents;
		this.author = author;
		this.createdAt = createdAt;
		this.score = score;
		this.vote = vote;
		this.children = children;
	}

	public int getId() {
		return id;
	}

	public String getContents() {
		return contents;
	}

	public String getAuthor() {
		return author;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public int getScore() {
		return score;
	}

	public String getVote() {
		return vote;
	}

	public List<CommentResponse> getChildren() {
		return children;
	}

	public void setChildren(List<CommentResponse> children) {
		this.children = children;
	}

}
