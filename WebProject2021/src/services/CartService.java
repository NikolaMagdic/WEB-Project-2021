package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import beans.Cart;
import beans.CartItem;
import beans.Restaurant;
import beans.User;
import dao.ArticleDAO;
import dao.RestaurantDAO;
import dao.UserDAO;

@Path("cart")
public class CartService {
	
	@Context
	ServletContext context;
	
	private String contextPath;
	
	public CartService() {
		
	}
	
	@PostConstruct
	public void init() {
		this.contextPath = context.getRealPath("");
		ArticleDAO articleDAO = new ArticleDAO(contextPath);
		if (context.getAttribute("articles") == null) {
			context.setAttribute("articles", articleDAO);
		}
	}

	@POST
	@Path("/add-to-cart/{restaurantId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addToCart(CartItem cartItem, @PathParam("restaurantId") Integer restaurantId, @Context HttpServletRequest request) {
		
		Cart cart = getCart(request);
		
		// Provera da li je restoran otvoren
		RestaurantDAO restaurantDAO = (RestaurantDAO) context.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(restaurantId);
		if(!restaurant.isOpen()) {
			return Response.status(400).entity("Restoran je zatvoren. Kupovina nije moguca.").build();
		}
		
		System.out.println(cart);
		// Resenje problema dodavanja u cart iz razlicitih restorana
		if(cart.getRestaurant() == null) {
			cart.getCartItems().add(cartItem);
			cart.setRestaurant(restaurantId);
			System.out.println("PRVO DODAVANJE");
		} else {
			// ako pokusamo izbrisacemo sve CartIteme u cartu iz prethodnog restorana
			if(cart.getRestaurant() != restaurantId) {
				cart.getCartItems().clear();
				cart.getCartItems().add(cartItem);
				cart.setRestaurant(restaurantId);
				cart.setPrice(0.0);
				System.out.println("DODAVANJE U RAZLICIT RESTORAN");
			} else {
				cart.getCartItems().add(cartItem);
				System.out.println("DODAVANJE U ISTI RESTORAN");
			}
		}
		
		// Izmena ukupne cene cart-a
		ArticleDAO articleDAO = (ArticleDAO) context.getAttribute("articles");
		Article article = articleDAO.findArticle(cartItem.getArticle());
		cart.setPrice(cart.getPrice() +  article.getPrice() * cartItem.getAmount());
		
		saveCart(cart, request);
	
		return Response.status(200).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMyCart(@Context HttpServletRequest request) {
		Cart cart = getCart(request);

		User loggedUser = (User) getLoggedInUser(request);
		if (loggedUser == null)
			return Response.status(400).build();
		
		return Response.status(200).entity(cart).build();
	}
	

	// Ovo je metoda koju pozivamo kada se osvezava korpa prilikom promene kolicine artikala u korpi
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response refreshCart(Cart cart, @Context HttpServletRequest request) {
		
		ArticleDAO articleDAO = (ArticleDAO) context.getAttribute("articles");
		
		// Menjanje ukupne cene korpe
		Double price = 0.0;
		for (CartItem cartItem : cart.getCartItems()) {
			Article article = articleDAO.findArticle(cartItem.getArticle());
			price += article.getPrice() * cartItem.getAmount();
		}
		cart.setPrice(price);
		// Cuvanje korpe
		System.out.println(cart);
		saveCart(cart, request);
		
		return Response.status(200).entity(cart).build();
	}
	
	@DELETE
	@Path("/{articleId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeFromCart(@PathParam("articleId") Long id, @Context HttpServletRequest request) {
		Cart cart = getCart(request);
		
		ArticleDAO articleDAO = (ArticleDAO) context.getAttribute("articles");
		
		for (CartItem cartItem : cart.getCartItems()) {
			Article article = articleDAO.findArticle(cartItem.getArticle());
			if(article.getId() == id) {
				cart.getCartItems().remove(cartItem);
				// TODO: Proveriti jos da li ce moci da budu 2 ista artikla u 2 razlicita cartItema
				cart.setPrice(cart.getPrice() - article.getPrice() * cartItem.getAmount());
				break;
			}
		}
	
		saveCart(cart, request);
		
		return Response.status(200).entity(cart).build();
	}
	
	/** Metoda koja nalazi korpu trenutno prijavljenog korisnika u sesiji*/
	public Cart getCart(HttpServletRequest request) {
		Cart cart = (Cart) request.getSession().getAttribute("cart");
		if (cart == null) {
			User loggedUser = (User) getLoggedInUser(request);
			cart = loggedUser.getCart();
			request.getSession().setAttribute("cart", cart);
			
			//cart.setRestaurant();
		} 

		return cart;
	}
	
	/** Metoda koja cuva trenutni sadrzaj korpe u sesiji*/
	public void saveCart(Cart cart, HttpServletRequest request) {
		request.getSession().setAttribute("cart",  cart);
		User loggedUser = (User) request.getSession().getAttribute("user"); 
	
		loggedUser.setCart(cart);
		UserDAO userDAO = (UserDAO) context.getAttribute("users");
		userDAO.updateUser(loggedUser);
	}

	// Trenutno ulogovani korisnik
	public User getLoggedInUser(HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user"); 
	
		if(loggedUser == null) {
			return null;
		} else {
			return loggedUser;
		} 
	}
	
}
