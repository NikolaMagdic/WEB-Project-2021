package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import beans.User;

public class UserDAO {
	
	private Map<String, User> usersMap = new HashMap<>();
	
	public UserDAO() {
		
	}
	
	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	public void loadUsers(String path) {
		BufferedReader in = null;
		try {

			File file = new File(path + "data/users.json");

			in = new BufferedReader(new FileReader(file));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			ObjectMapper mapper = new ObjectMapper();
			this.usersMap = mapper.readValue(sb.toString(), new TypeReference<Map<String, User>>(){});
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
	
	public void saveUsers(String path) {
		BufferedWriter out = null;
		try {
			File file = new File(path + "/data/users.json");
			out = new BufferedWriter(new FileWriter(file));
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());  
			String content = writer.writeValueAsString(this.usersMap);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {}
			}
		}
	}
	
	public User findUser(String username) {
		User user = this.usersMap.get(username);
		if(user != null)
			return user;
		else 
			return null;
	}
	
	public User addUser(User user) {
		
		this.usersMap.put(user.getUsername(), user);
		
		return user;
	}
}
