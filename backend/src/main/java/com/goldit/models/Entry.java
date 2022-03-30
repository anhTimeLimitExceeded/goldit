package com.goldit.models;

import com.goldit.models.converters.ListStringConverter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "entry")
public class Entry {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String title;

	private String contents;

	@Convert(converter = ListStringConverter.class)
	private List<String> images;

	private String author;

	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at")
	private Date createdAt;

	public Entry(String title, String contents, List<String> images, String author, Date createdAt) {
		this.title = title;
		this.contents = contents;
		this.images = images;
		this.author = author;
		this.createdAt = createdAt;
	}

	public Entry() {
	}

	public Integer getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public static String titleToLink(Entry post) {
		String title = post.getTitle().length() > 10 ? post.getTitle().substring(0, 10) : post.getTitle();
		title = title.replaceAll(" ", "_");
//		title = title.replaceAll("/", "_");
//		title = title.replaceAll("#", "_");
		return post.getId() + "/" + title;
	}

}
