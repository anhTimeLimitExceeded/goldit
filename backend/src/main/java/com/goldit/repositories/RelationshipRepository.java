package com.goldit.repositories;

import com.goldit.models.Relationship;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RelationshipRepository extends CrudRepository<Relationship, Integer> {

	List<Relationship> findByChildEquals(int child);

	List<Relationship> findByParentEquals(int parent);

	@Query("SELECT r FROM Relationship r WHERE r.parent = ?1 AND r.child = ?2")
	Relationship findByRelationship(int parent, int child);

}
