package com.goldit.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	private String uid;

	private String name;

	private String email;

	public User(String uid, String name, String email) {
		this.uid = uid;
		this.name = name;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
				", name='" + name + '\'' +
				", email='" + email + '\'' +
				'}';
	}
}
