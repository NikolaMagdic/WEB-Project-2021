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

import beans.Article;


public class ArticleDAO {

	private Map<Integer, Article> articles = new HashMap<>();
	
	public ArticleDAO() {
		
	}
	
	public ArticleDAO(String contextPath) {
		loadArticles(contextPath);
	}
	
	public void loadArticles(String path) {
		BufferedReader in = null;
		try {
			File file = new File(path + "/data/articles.json");
			in = new BufferedReader(new FileReader(file));
			String line;
			StringBuilder sb = new StringBuilder();
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			ObjectMapper mapper = new ObjectMapper();
			this.articles = mapper.readValue(sb.toString(), new TypeReference<Map<Integer, Article>>(){});
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
	
	public void saveArticles(String path) {
		BufferedWriter out = null;
		try {
			File file = new File(path + "/data/articles.json");
			out = new BufferedWriter(new FileWriter(file));
			ObjectMapper mapper = new ObjectMapper();
			ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());
			String content = writer.writeValueAsString(this.articles);
			out.write(content);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (Exception e) {
					
				}
			}
		}
	}
	
	public Article findArticle(Integer id) {
		return this.articles.get(Integer.parseInt(id.toString()));
	}
	
	public Collection<Article> findAllArticles() {
		return this.articles.values();
	}
	
	public Article addArticle(Article article) {
		return this.articles.put(Integer.parseInt(article.getId().toString()), article);
	}
	
	public Article updateArticle(Article article) {
		return this.articles.replace(Integer.parseInt(article.getId().toString()), article);
	}
	
	// ne koristimo; za fizicko brisanje
	public Article removeArticle(Integer id) {
		return this.articles.remove(Integer.parseInt(id.toString()));
	}
}
