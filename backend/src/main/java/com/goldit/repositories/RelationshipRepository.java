package com.goldit.repositories;

import com.goldit.models.Relationship;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RelationshipRepository extends CrudRepository<Relationship, Integer> {

	List<Relationship> findByChildEquals(int child);

	List<Relationship> getAllByParentEquals(int parent);

}
