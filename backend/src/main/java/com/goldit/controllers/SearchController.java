package com.goldit.controllers;

import com.goldit.models.Entry;
import com.goldit.models.SearchResponse;
import com.goldit.repositories.PostRepository;
import org.apache.commons.text.similarity.FuzzyScore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@RestController
public class SearchController {

	@Autowired
	PostRepository postRepository;

	@GetMapping(value="/search", produces= MediaType.APPLICATION_JSON_VALUE)
	public List<SearchResponse> search(@RequestParam(name = "q") String query) {
		FuzzyScore score = new FuzzyScore(Locale.ENGLISH);
		List<Entry> allPosts = postRepository.getAllPosts();
		allPosts.sort(Comparator.comparingInt(o -> -score.fuzzyScore(o.getTitle() + " " + o.getContents(), query)));

		List<SearchResponse> searchResults = new ArrayList<>();
		for (Entry post : allPosts) {
			if (searchResults.size() == 5) break;
			searchResults.add(new SearchResponse(post.getId(), post.getTitle(), post.getContents(), Entry.titleToLink(post)));
		}
		return searchResults;
	}
}
