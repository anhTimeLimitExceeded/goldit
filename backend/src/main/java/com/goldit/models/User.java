package com.goldit.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	private String uid;

	private String username;

	private String email;

	public User(String uid, String username, String email) {
		this.uid = uid;
		this.username = username;
		this.email = email;
	}

	public User() {

	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getUsername() {
		return username;
	}

	public void setName(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "User{" +
				"uid='" + uid + '\'' +
				", username='" + username + '\'' +
				", email='" + email + '\'' +
				'}';
	}
}
