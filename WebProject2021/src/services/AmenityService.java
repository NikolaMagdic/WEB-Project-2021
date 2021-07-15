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

import beans.Amenity;
import beans.Restaurant;
import dao.AmenityDAO;
import dao.RestaurantDAO;

@Path("amenity")
public class AmenityService {

	@Context
	ServletContext ctx;
	
	private String contextPath;
	
	public AmenityService() {
		
	}
	
	@PostConstruct
	public void init() {
		this.contextPath = ctx.getRealPath("");
		
		AmenityDAO amenityDAO = new AmenityDAO(contextPath);
		if (ctx.getAttribute("amenities") == null) {
			ctx.setAttribute("amenities", amenityDAO);
		}
		
		RestaurantDAO restaurantDAO = new RestaurantDAO(contextPath);
		if (ctx.getAttribute("restaurants") == null) {
			ctx.setAttribute("restaurants", restaurantDAO);
		}
		
	}
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Amenity> getAllAmenities() {
		
		AmenityDAO amenityDAO = (AmenityDAO) ctx.getAttribute("amenities");
		Collection<Amenity> amenities = amenityDAO.findAllAmenities();
		
		List<Amenity> amenitiesList = new ArrayList<>();
		
		for (Amenity amenity : amenities) {
			if(!amenity.isDeleted())
				amenitiesList.add(amenity);
		}
		
		return amenitiesList;
	
	}
	
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Amenity> getMyAmenities(@PathParam("id") Integer id){
		
		RestaurantDAO restaurantDAO = (RestaurantDAO) ctx.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		AmenityDAO amenityDAO = (AmenityDAO) ctx.getAttribute("amenities");
		
		List<Integer> amenitiesId = restaurant.getAmenities();
		List<Amenity> amenities = new ArrayList<>();
		
		for (Integer amenityId : amenitiesId) {
			amenities.add(amenityDAO.findAmenity(amenityId));
		}
		
		return amenities;
	}
}
