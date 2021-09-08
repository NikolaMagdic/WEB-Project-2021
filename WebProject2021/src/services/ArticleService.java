package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Article;
import beans.Restaurant;
import dao.ArticleDAO;
import dao.RestaurantDAO;
import dto.ArticleDTO;
import enumerations.ArticleType;

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
		}
		
		return articles;
	}
	
	//metoda koja trazi artikal preko njegovog ID
	@GET
	@Path("/Id/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArticleDTO getOneArticle(@PathParam("id") Integer id){
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		ArticleDTO dto = null;
		
		if(id != 0) {
			dto = convertToDTO(articleDAO.findArticle(id));
		}
		
		return dto;
		
	}
	
	
	@PUT
	@Path("/edit")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public ArticleDTO updateUser(ArticleDTO art, @Context HttpServletRequest request) {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		System.out.println("Id artikla koji editujemo: " + art.getId());
		Article articleForUpdate = articleDAO.findArticle(Integer.parseInt(art.getId().toString()));
		
		System.out.println(art.getName());
		System.out.println(art.getPrice());
		System.out.println(art.getType()); //tip ne menjamo
		System.out.println(art.getAmount());
		System.out.println(art.getDescription());
		System.out.println(art.getImage());
		
		articleForUpdate.setName(art.getName());
		articleForUpdate.setPrice(art.getPrice());
		articleForUpdate.setAmount(art.getAmount());
		articleForUpdate.setDescription(art.getDescription());
		articleForUpdate.setImage(art.getImage());
		
		articleDAO.updateArticle(articleForUpdate);
		
		String contextPath = ctx.getRealPath("");
		articleDAO.saveArticles(contextPath);
		
		return convertToDTO(articleForUpdate);
	}
	
	
	// Dodavanje novog artikla preko ID restorana
	@POST
	@Path("/add/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUser(ArticleDTO art, @PathParam("id") Integer id) {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		
		if(articleDAO.checkArticle(art.getName())) {
			return Response.status(400).build();
		}
		
		ArticleType type = null;
		if(art.getType().equals("DRINK")) {
			type = ArticleType.DRINK;
		} else {
			type = ArticleType.FOOD;
		}
		
		
		Integer length = articleDAO.findAllArticles().size() + 1;
		System.out.println("Duzina liste artikala je: " + length);
		Long articleId = length.longValue();
		System.out.println("ID novog artikla je: " + articleId);
		
		
		Article newArticle = new Article();
		newArticle.setId(articleId);
		newArticle.setName(art.getName());
		newArticle.setPrice(art.getPrice());
		newArticle.setArticleType(type);
		newArticle.setAmount(art.getAmount());
		newArticle.setDescription(art.getDescription());
		newArticle.setImage(art.getImage());
		newArticle.setDeleted(false);
		
		
		articleDAO.addArticle(newArticle);
		String contextPath = ctx.getRealPath("");
		articleDAO.saveArticles(contextPath);
		
		//moramo artikal dodati u listu artikala restorana
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		if (restaurant == null) {
			return Response.status(400).build();
		}
		restaurant.getArticles().add(length);
		restaurantDAO.updateRestaurant(restaurant);
		restaurantDAO.saveRestaurants(contextPath);
		
		return Response.status(200).entity(art).build();
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
	
	
	
	
	// Vraca artikal po njegovom id-ju
	@GET
	@Path("/one/{articleId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Article getArticle(@PathParam("articleId") Integer id) {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		Article article = articleDAO.findArticle(id);
		
		return article;
	}
}
