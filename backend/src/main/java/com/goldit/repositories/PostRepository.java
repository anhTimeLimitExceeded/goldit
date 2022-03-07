package com.goldit.repositories;

import com.goldit.models.Entry;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PostRepository extends CrudRepository<Entry, Integer> {

	@Query("SELECT e FROM Entry e WHERE e.title IS NOT NULL AND e.contents IS NOT NULL ORDER BY e.id DESC")
	List<Entry> getAllPosts();

	@Query("SELECT e FROM Entry e WHERE e.id = ?1 AND e.title LIKE ?2%")
	Entry getPostByIdTitle(int id, String title);

	@Query("SELECT e FROM Entry e JOIN Relationship r ON e.id=r.child WHERE r.parent = ?1")
	List<Entry> getPostsByTopic(int topicId);

}