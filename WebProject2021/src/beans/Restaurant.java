package beans;

import java.util.ArrayList;
import java.util.List;

import enumerations.RestaurantType;

public class Restaurant {
	
	private Long id;
	
	private String name;
	
	private RestaurantType restaurantType;
	
	private List<Integer> articals = new ArrayList<Integer>();
	
	//radi ako je true, ne radi ako je false
	private boolean open;
	
	private Location location;
	
	private String image;

	
	//KONSTRUKTORI
	public Restaurant() {
		super();
	}


	public Restaurant(Long id, String name, RestaurantType restaurantType, List<Integer> articals, boolean open,
			Location location, String image) {
		super();
		this.id = id;
		this.name = name;
		this.restaurantType = restaurantType;
		this.articals = articals;
		this.open = open;
		this.location = location;
		this.image = image;
	}






	//GETERI I SETERI
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public RestaurantType getRestaurantType() {
		return restaurantType;
	}


	public void setRestaurantType(RestaurantType restaurantType) {
		this.restaurantType = restaurantType;
	}


	public List<Integer> getArticals() {
		return articals;
	}


	public void setArticals(List<Integer> articals) {
		this.articals = articals;
	}


	public boolean isOpen() {
		return open;
	}


	public void setOpen(boolean open) {
		this.open = open;
	}


	public Location getLocation() {
		return location;
	}


	public void setLocation(Location location) {
		this.location = location;
	}


	public String getImage() {
		return image;
	}


	public void setImage(String image) {
		this.image = image;
	}
	
	
	
	
	
}
