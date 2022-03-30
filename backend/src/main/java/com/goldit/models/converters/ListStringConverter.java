package com.goldit.models.converters;

import javax.persistence.AttributeConverter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ListStringConverter implements AttributeConverter<List<String>, String> {

	private static final String SEPARATOR = "%";

	@Override
	public List<String> convertToEntityAttribute(String s) {
		if (s == null) return Collections.emptyList();
		return Arrays.asList(s.split(SEPARATOR));
	}

	@Override
	public String convertToDatabaseColumn(List<String> list) {
		if (list == null || list.isEmpty()) return null;
		return String.join(SEPARATOR, list);
	}

}
