package services;

import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Restaurant;
import beans.User;
import dao.RestaurantDAO;
import enumerations.UserRole;

@Path("restaurant")
public class RestaurantService {

	@Context
	ServletContext ctx;
	
	public RestaurantService() {
		
	}
	
	@PostConstruct
	public void init() {
		String contextPath = ctx.getRealPath("");

		RestaurantDAO restaurantDAO = new RestaurantDAO(contextPath);
		if(ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", restaurantDAO);
		}
	}
	
	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRestaurant(Restaurant restaurant) {
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant addedRestaurant = restaurantDAO.addRestaurant(restaurant);
		
		Integer maxId = 1;
		Collection<Restaurant> restaurants = restaurantDAO.findAllRestaurants();
		for (Restaurant res : restaurants) {
			System.out.println(res);
			if (res.getId() > maxId)
				maxId = res.getId();
		}
		restaurant.setId(++maxId);
		
		String contextPath = ctx.getRealPath("");
		restaurantDAO.saveRestaurants(contextPath);
		
		return Response.status(200).entity(addedRestaurant).build();
	}
	
	
	public UserRole getUserRole(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		
		if(loggedUser!= null) {
			return loggedUser.getRole();
		}	
		return null;
	}
	
}
