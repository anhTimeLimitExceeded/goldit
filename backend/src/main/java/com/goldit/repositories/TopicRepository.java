package com.goldit.repositories;

import com.goldit.models.Entry;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TopicRepository extends CrudRepository<Entry, Integer> {

	@Query("SELECT e FROM Entry e WHERE e.contents IS NULL")
	List<Entry> getAllTopics();

	Entry findById(int id);
}
