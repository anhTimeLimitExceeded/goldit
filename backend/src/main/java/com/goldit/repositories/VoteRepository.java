package com.goldit.repositories;

import com.goldit.models.Vote;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface VoteRepository extends CrudRepository<Vote, Integer> {

	@Query("SELECT v FROM Vote v WHERE (v.entry1 = ?1 and v.entry2 = ?2) OR (v.entry1 = ?2 and v.entry2 = ?1)")
	Vote findVote(String entry1, String entry2);

	@Query("SELECT COUNT(v) FROM Vote v WHERE v.entry2 = ?1")
	int getUpvote(String entry2);

	@Query("SELECT COUNT(v) FROM Vote v WHERE v.entry1 = ?1")
	int getDownvote(String entry1);

}
