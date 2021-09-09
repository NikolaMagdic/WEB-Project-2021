package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import beans.Comment;

public class CommentDAO {

	private Map<Integer, Comment> commentsMap = new HashMap<>();
	
	public CommentDAO() {
		
	}
	
	public CommentDAO(String contextPath) {
		loadComments(contextPath);
	}
	
	public void loadComments(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "data/comments.json");
			
			in = new BufferedReader(new FileReader(file));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			ObjectMapper mapper = new ObjectMapper();
			this.commentsMap = mapper.readValue(sb.toString(),  new TypeReference<Map<Integer, Comment>>() {});
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {}
			}
		}
	}
	
	public void saveComments(String contextPath) {
		BufferedWriter out = null;
		try {
			File file = new File(contextPath + "/data/comments.json");
			out = new BufferedWriter(new FileWriter(file));
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());
			String content = writer.writeValueAsString(this.commentsMap);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public Collection<Comment> getAllComments() {
		return this.commentsMap.values();
	}
	
	public Comment getComment(Integer commentId) {
		return this.commentsMap.get(commentId);
	}
	
	public Comment addComment(Comment comment) {
		this.commentsMap.put(comment.getId(), comment);
		
		return comment;
	}
}
