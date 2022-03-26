package com.goldit.models;

public class SearchResponse {

	private final int id;

	private final String title;

	private final String contents;

	private final String link;

	public SearchResponse(int id, String title, String contents, String link) {
		this.id = id;
		this.title = title;
		this.contents = contents;
		this.link = link;
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

	public String getLink() {
		return link;
	}
}
