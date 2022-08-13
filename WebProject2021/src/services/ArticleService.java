package services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
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
	public List<Article> getAllArticles() {
		
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
		System.out.println("USAO U GET ARTICLES ZA RESTORAN SA ID: " + id);
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		
		List<Integer> articlesId = restaurant.getArticles();
		List<Article> articles = new ArrayList<>();
		
		for (Integer articleId : articlesId) {
			if(!articleDAO.findArticle(articleId).isDeleted()) {
				System.out.println("Status artikla deleted u restoranu je: " + articleDAO.findArticle(articleId).isDeleted());
				articles.add(articleDAO.findArticle(articleId));
			}
		}
		
		return articles;
	}
	
	//metoda koja trazi artikal preko njegovog ID
	@GET
	@Path("/Id/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOneArticle(@PathParam("id") Integer id){
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		Article article = articleDAO.findArticle(id);
		
		
		if(id != 0) {
			return Response.status(200).entity(article).build();
		}
		
		return Response.status(404).build();
		
	}
	
	
	@PUT
	@Path("/edit")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Article updateArticle(Article art, @Context HttpServletRequest request) {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		System.out.println("Id artikla koji editujemo: " + art.getId());
		Article articleForUpdate = articleDAO.findArticle(Integer.parseInt(art.getId().toString()));
		
		System.out.println(art.getName());
		System.out.println(art.getPrice());
		System.out.println(art.getArticleType()); //tip ne menjamo
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
		
		return articleForUpdate;
	}
	
	
	// Dodavanje novog artikla preko ID restorana
	@POST
	@Path("/add/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addArticle(Article art, @PathParam("id") Integer id) {
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		
		if(articleDAO.checkArticle(art.getName())) {
			System.out.println("Null kod getName()");
			return Response.status(400).build();
		}
		
		ArticleType type = null;
		if(art.getArticleType().equals(ArticleType.DRINK)) {
			type = ArticleType.DRINK;
		} else {
			type = ArticleType.FOOD;
		}
		
		
		Integer length = articleDAO.findAllArticles().size() + 1;
		System.out.println("Duzina liste artikala je: " + length);
		Long articleId = length.longValue();
		System.out.println("ID novog artikla je: " + articleId);
		
		//############ Za SLIKU
		String base64Image = (art.getImage()).split(",")[1];
		byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);

		String imagePath = contextPath + "images\\" + art.getName() + ".jpg";
		//System.out.println(imagePath);
		BufferedImage img;
		try {
			img = ImageIO.read(new ByteArrayInputStream(imageBytes));
			File outputfile = new File(imagePath);
			ImageIO.write(img, "jpg", outputfile);
		} catch (IOException e) {
			e.printStackTrace();
		}
		art.setImage("images/" + art.getName() + ".jpg");
		System.out.println(art.getImage());
		//##########
		
		
		Article newArticle = new Article();
		newArticle.setId(articleId);
		newArticle.setName(art.getName());
		newArticle.setPrice(art.getPrice());
		newArticle.setArticleType(type);
		newArticle.setAmount(art.getAmount());
		newArticle.setDescription(art.getDescription());
		newArticle.setImage(art.getImage());
		newArticle.setDeleted(false);
		newArticle.setRestaurant(id);
		
		
		articleDAO.addArticle(newArticle);
		String contextPath = ctx.getRealPath("");
		articleDAO.saveArticles(contextPath);
		
		//moramo artikal dodati u listu artikala restorana
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		if (restaurant == null) {
			System.out.println("Null kod restorana");
			return Response.status(400).build();
		}
		restaurant.getArticles().add(length);
		restaurantDAO.updateRestaurant(restaurant);
		restaurantDAO.saveRestaurants(contextPath);
		
		return Response.status(200).entity(art).build();
	}
	
	
	// Za menadzera promena iz TAKEN_FOR_DELIVERY u REJECTED
	@PUT
	@Path("/deleteArticle/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteArticle(@PathParam("id") Integer id) {
		System.out.println("Usao je u brisanje articla");
		
		//String contextPath = ctx.getRealPath("");
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		Article article = articleDAO.findArticle(id);
		
		if(article == null) {
			return Response.status(400).build();
		}
		
		article.setDeleted(true);
		
		
		System.out.println("Sada je deleted status za artical: " + article.isDeleted());
		
		String contextPath = ctx.getRealPath("");
		articleDAO.updateArticle(article);
		articleDAO.saveArticles(contextPath);
		
		return Response.status(200).entity(article).build();
	}
	
	
	//metoda koja trazi artikal preko njegovog ID
	@GET
	@Path("/isDeleted/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean isArticleDeleted(@PathParam("id") Integer id){
		
		ArticleDAO articleDAO = (ArticleDAO) ctx.getAttribute("articles");
		Article article = articleDAO.findArticle(id);
		
		if(article.isDeleted()) {
			System.out.println("IsDeleted articla je: " + article.isDeleted());
			return true;
		}
		
		System.out.println("IsDeleted articla je: " + article.isDeleted());
		return false;
		
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
