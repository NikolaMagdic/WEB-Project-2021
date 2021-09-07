package beans;

import java.util.ArrayList;
import java.util.List;

import enumerations.RestaurantType;

public class Restaurant {
	
	private Integer id;
	
	private String name;
	
	private RestaurantType restaurantType;
	
	private List<Integer> articles = new ArrayList<Integer>();
	
	//radi ako je true, ne radi ako je false
	private boolean open;
	
	private Location location;
	
	private String image;
	
	private Double rating = 0.0;

	private boolean deleted;
	
	//mi dodali, ne pise u specifikaciji ali treba da znamo koje ordere ima restoran
	private List<String> restaurantOrders = new ArrayList<String>();
	
	
	//KONSTRUKTORI
	public Restaurant() {
		super();
	}


	public Restaurant(Integer id, String name, RestaurantType restaurantType, List<Integer> articles, boolean open,
			Location location, String image, List<String> restaurantOrders) {
		super();
		this.id = id;
		this.name = name;
		this.restaurantType = restaurantType;
		this.articles = articles;
		this.open = open;
		this.location = location;
		this.image = image;
		this.restaurantOrders = restaurantOrders;
	}
	


	public Restaurant(Integer id, String name, RestaurantType restaurantType, List<Integer> articles, boolean open,
			Location location, String image, Double rating, boolean deleted, List<String> restaurantOrders) {
		super();
		this.id = id;
		this.name = name;
		this.restaurantType = restaurantType;
		this.articles = articles;
		this.open = open;
		this.location = location;
		this.image = image;
		this.rating = rating;
		this.deleted = deleted;
		this.restaurantOrders = restaurantOrders;
	}


	//GETERI I SETERI
	

	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}

	
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
	


	public Double getRating() {
		return rating;
	}


	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	


	public boolean isDeleted() {
		return deleted;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}


	public List<Integer> getArticles() {
		return articles;
	}


	public void setArticles(List<Integer> articles) {
		this.articles = articles;
	}


	public List<String> getRestaurantOrders() {
		return restaurantOrders;
	}


	public void setRestaurantOrders(List<String> restaurantOrders) {
		this.restaurantOrders = restaurantOrders;
	}


}
