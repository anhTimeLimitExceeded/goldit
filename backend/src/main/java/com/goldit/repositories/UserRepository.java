package com.goldit.repositories;

import com.goldit.models.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {

	@Query("SELECT u FROM User u WHERE u.uid = ?1")
	User findUserByUId(String uid);

}
