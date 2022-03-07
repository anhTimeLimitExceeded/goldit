package com.goldit.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vote")
public class Vote {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name="entry_1")
	private String entry1;

	@Column(name="entry_2")
	private String entry2;

	public Vote(String entry1, String entry2) {
		this.entry1 = entry1;
		this.entry2 = entry2;
	}

	public Vote() {
	}

	public int getId() {
		return id;
	}

	public String getEntry1() {
		return entry1;
	}

	public void setEntry1(String entry1) {
		this.entry1 = entry1;
	}

	public String getEntry2() {
		return entry2;
	}

	public void setEntry2(String entry2) {
		this.entry2 = entry2;
	}
}
