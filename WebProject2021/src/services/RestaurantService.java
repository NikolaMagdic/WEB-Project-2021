package services;

import java.util.ArrayList;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Restaurant;
import beans.User;
import dao.RestaurantDAO;
import dao.UserDAO;
import enumerations.UserRole;
import filters.RestaurantFilter;

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
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", restaurantDAO);
		}

		UserDAO userDAO = new UserDAO(contextPath);
		if (ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", userDAO);
		}
	}

	/** Dodavanje novog restorana */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRestaurant(Restaurant restaurant, @HeaderParam("Manager-Username") String managerUsername) {

		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");

		String contextPath = ctx.getRealPath("");
		
		// System.out.println(restaurant.getImage());
		if(!restaurant.getImage().equals("")) {
			System.out.println("Ima slika");
			String base64Image = (restaurant.getImage()).split(",")[1];
			byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);

			String imagePath = contextPath + "images\\" + restaurant.getName() + ".jpg";
			//System.out.println(imagePath);
			BufferedImage img;
			try {
				img = ImageIO.read(new ByteArrayInputStream(imageBytes));
				File outputfile = new File(imagePath);
				ImageIO.write(img, "jpg", outputfile);
			} catch (IOException e) {
				e.printStackTrace();
			}
			restaurant.setImage("images/" + restaurant.getName() + ".jpg");
			System.out.println(restaurant.getImage());
		}

		// restaurant.setImage(imagePath);
		
		Integer maxId = 1;
		Collection<Restaurant> restaurants = restaurantDAO.findAllRestaurants();
		for (Restaurant res : restaurants) {
			if (res.getId() > maxId)
				maxId = res.getId();
		}
		restaurant.setId(++maxId);

		Restaurant addedRestaurant = restaurantDAO.addRestaurant(restaurant);

		UserDAO userDAO = (UserDAO) ctx.getAttribute("users");

		if (managerUsername != null) {
			User manager = userDAO.findUser(managerUsername);
			manager.setRestaurant(restaurant.getId());
		}

		restaurantDAO.saveRestaurants(contextPath);
		userDAO.saveUsers(contextPath);

		return Response.status(200).entity(addedRestaurant).build();
	}

	public UserRole getUserRole(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user");

		if (loggedUser != null) {
			return loggedUser.getRole();
		}
		return null;
	}
	
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRestaurant(@PathParam("id") Integer id) {

		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);

		if (restaurant == null) {
			return Response.status(400).build();
		}

		return Response.status(200).entity(restaurant).build();
	}
	
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response allRestaurants(@Context HttpServletRequest request) {
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		
		Collection<Restaurant> allRestaurants = restaurantDAO.findAllRestaurants();
		
		List<Restaurant> restaurants = new ArrayList<>();
		
		for(Restaurant res : allRestaurants) {
			restaurants.add(res);
		}
		
		return Response.status(200).entity(restaurants).build();
	}
	
	// Pretraga apartmana
	@POST
	@Path("/search")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public List<Restaurant> searchApartment(RestaurantFilter filter){
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Collection<Restaurant> restaurants = restaurantDAO.findAllRestaurants();
		
		List<Restaurant> filteredRestaurants = new ArrayList<>();
		
		for (Restaurant r : restaurants) {
			if ((filter.getCity() != null && r.getLocation().getAddress().getCity().toLowerCase().contains(filter.getCity().toLowerCase())) || filter.getCity() == null) {
				if ((filter.getName() != null && r.getName().toLowerCase().contains(filter.getName().toLowerCase())) || filter.getName() == null) {
					if ((filter.getRating() != null && (r.getRating() > filter.getRating())) || filter.getRating() == null) {
						if ((filter.getType() != null && r.getRestaurantType().toString().toLowerCase().contains(filter.getType().toLowerCase())) || filter.getType() == null) {
							//System.out.println(r.getRestaurantType().toString());
							filteredRestaurants.add(r);
						}
					}
				}
			}
		}
		
//		if (filter.getType() != null) {
//			if(!r.getRestaurantType().toString().toLowerCase().contains(filter.getType().toLowerCase()));
//				break;
//		}
		
		
		return filteredRestaurants;
	}
	
	//svi otvoreni restorani
	@GET
	@Path("/open")
	@Produces(MediaType.APPLICATION_JSON)
	public Response allOpenRestaurants(@Context HttpServletRequest request) {
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		
		Collection<Restaurant> allRestaurants = restaurantDAO.findAllRestaurants();
		
		List<Restaurant> dtoRestaurants = new ArrayList<>();
		
		for(Restaurant res : allRestaurants) {
			if(res.isOpen()) {
				dtoRestaurants.add(res);
			}
		}
		
		return Response.status(200).entity(dtoRestaurants).build();
	}
	


}
