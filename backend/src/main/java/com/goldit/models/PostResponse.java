package com.goldit.models;

import java.util.Date;
import java.util.List;

public class PostResponse {

	private final int id;

	private final String title;

	private final String contents;

	private final String author;

	private final Date createdAt;

	private final List<String> topics;

	private final String link;

	private final int score;

	private final String vote;

	public PostResponse(int id, String title, String contents, String author, Date createdAt, List<String> topics, String link,
						int score, String vote) {
		this.id = id;
		this.title = title;
		this.contents = contents;
		this.author = author;
		this.createdAt = createdAt;
		this.topics = topics;
		this.link = link;
		this.score = score;
		this.vote = vote;
	}

	public int getId() {
		return id;
	}

	public String getTitle() {
		return title;
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

	public List<String> getTopics() {
		return topics;
	}

	public String getLink() {
		return link;
	}

	public int getScore() {
		return score;
	}

	public String getVote() {
		return vote;
	}

	@Override
	public String toString() {
		return "PostResponse{" +
				"title='" + title + '\'' +
				", contents='" + contents + '\'' +
				", author='" + author + '\'' +
				", createdAt=" + createdAt +
				", topics=" + topics +
				'}';
	}
}