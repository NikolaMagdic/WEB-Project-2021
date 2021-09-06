package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Article;
import beans.Restaurant;
import dao.ArticleDAO;
import dao.RestaurantDAO;
import dto.ArticleDTO;
import dto.RestaurantDTO;

@Path("article")
public class ArticleService {

	@Context
	ServletContext ctx;
	
	private String contextPath;
	
	public ArticleService() {
		
	}
	
	@PostConstruct
	public void init() {
		this.contextPath = ctx.getRealPath("");
		
		ArticleDAO articleDAO = new ArticleDAO(contextPath);
		if (ctx.getAttribute("articles") == null) {
			ctx.setAttribute("articles", articleDAO);
		}
		
		RestaurantDAO restaurantDAO = new RestaurantDAO(contextPath);
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", restaurantDAO);
		}
		
	}
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Article> getAllAmenities() {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		Collection<Article> articles = articleDAO.findAllArticles();
		
		List<Article> articlesList = new ArrayList<>();
		
		for (Article article : articles) {
			if(!article.isDeleted())
				articlesList.add(article);
		}
		
		return articlesList;
	
	}
	
	//metoda koja po ID restorana dobavlja sve njegove artikle
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Article> getMyArticles(@PathParam("id") Integer id){
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		
		List<Integer> articlesId = restaurant.getArticles();
		List<Article> articles = new ArrayList<>();
		
		for (Integer articleId : articlesId) {
			articles.add(articleDAO.findArticle(articleId));
			System.out.println("Id artikla u restoranu je: " + articleId);
		}
		
		return articles;
	}
	
	//metoda koja trazi artikal preko njegovog ID
	@GET
	@Path("/Id/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArticleDTO getOneArticle(@PathParam("id") Integer id){
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		System.out.println("Id artikla " + id);
		ArticleDTO dto = null;
		
		if(id != 0) {
			dto = convertToDTO(articleDAO.findArticle(id));
		}
		
		return dto;
		
	}
	
	
	public ArticleDTO convertToDTO(Article art) {
		ArticleDTO dto = new ArticleDTO();
		dto.setId(art.getId());
		dto.setName(art.getName());
		dto.setPrice(art.getPrice());
		dto.setType(art.getArticleType().toString());
		dto.setAmount(art.getAmount());
		dto.setDescription(art.getDescription());
		dto.setImage("IMAGE");
		
		return dto;
	}
}
