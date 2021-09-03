package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Cart;
import beans.CartItem;

@Path("cart")
public class CartService {
	
	@Context
	ServletContext context;
	
	public CartService() {
		
	}
	
	@PostConstruct
	public void init() {
		
	}

	@POST
	@Path("/add-to-cart")
	@Consumes(MediaType.APPLICATION_JSON)
	public void addToCart(CartItem cartItem, @Context HttpServletRequest request) {
		
		Cart cart = getCart(request);
		cart.getCartItems().add(cartItem);
		saveCart(cart, request);
	
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMyCart(@Context HttpServletRequest request) {
		Cart cart = getCart(request);
		return Response.status(200).entity(cart).build();
	}
	
	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeFromCart(CartItem cartItem, @Context HttpServletRequest request) {
		Cart cart = getCart(request);
		cart.getCartItems().remove(cartItem);
	
		saveCart(cart, request);
		
		return Response.status(200).build();
	}
	
	/** Metoda koja nalazi korpu trenutno prijavljenog korisnika u sesiji*/
	public Cart getCart(HttpServletRequest request) {
		Cart cart = (Cart) request.getSession().getAttribute("cart");
		if (cart == null) {
			cart = new Cart();
			request.getSession().setAttribute("cart", cart);
		} 

		return cart;
	}
	
	/** Metoda koja cuva trenutni sadrzaj korpe u sesiji*/
	public void saveCart(Cart cart, HttpServletRequest request) {
		request.getSession().setAttribute("cart",  cart);
	}

}
