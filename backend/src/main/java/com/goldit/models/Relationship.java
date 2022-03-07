package com.goldit.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "relationship")
public class Relationship {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private int parent;

	private int child;

	public Relationship(int parent, int child) {
		this.parent = parent;
		this.child = child;
	}

	public Relationship() {
	}

	public int getId() {
		return id;
	}

	public int getParent() {
		return parent;
	}

	public void setParent(int parent) {
		this.parent = parent;
	}

	public int getChild() {
		return child;
	}

	public void setChild(int child) {
		this.child = child;
	}
}
