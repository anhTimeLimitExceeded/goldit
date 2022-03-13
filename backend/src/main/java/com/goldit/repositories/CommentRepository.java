package com.goldit.repositories;

import com.goldit.models.Entry;
import org.springframework.data.repository.CrudRepository;

public interface CommentRepository extends CrudRepository<Entry, Integer> {

	Entry findById(int id);

}
