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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Comment;
import beans.Restaurant;
import beans.User;
import dao.CommentDAO;
import dao.RestaurantDAO;

@Path("comment")
public class CommentService {

	@Context 
	ServletContext ctx;
	
	public CommentService() {
		
	}
	
	@PostConstruct
	public void init() {
		String contextPath = ctx.getRealPath("");
		
		CommentDAO commentDAO = new CommentDAO(contextPath);
		if(ctx.getAttribute("comments") == null) {
			ctx.setAttribute("comments", commentDAO);
		}
		
	}
	
	// Svi komentari za restoran
	@GET
	@Path("/{restaurantId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getComments(@PathParam("restaurantId") Integer restaurantId) {
		
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("comments");
		Collection<Comment> allComments = commentDAO.getAllComments();
		
		List<Comment> myComments = new ArrayList<Comment>();
		
		for (Comment comment : allComments) {
			if(comment.getRestaurant() == restaurantId) {
				myComments.add(comment);
			}
		}
		
		return Response.status(200).entity(myComments).build();
	}
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addComment(Comment comment, @Context HttpServletRequest request) {
		
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("comments");
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		
		Integer maxId = 1;
		Collection<Comment> comments = commentDAO.getAllComments();
		for (Comment com : comments) {
			if (com.getId() > maxId)
				maxId = com.getId();
		}
		comment.setId(++maxId);
		
		User loggedUser = getLoggedInUser(request);
		comment.setCustomer(loggedUser.getUsername());
		
		// Azuriranje prosecne ocene restorana na osnovu trenutne
		Restaurant res = restaurantDAO.findRestaurant(comment.getRestaurant());
		res.setRating((comment.getGrade() + res.getRating()) / 2);
		
		commentDAO.addComment(comment);
		String contextPath = ctx.getRealPath("");
		commentDAO.saveComments(contextPath);
		
		return Response.status(200).build();
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
