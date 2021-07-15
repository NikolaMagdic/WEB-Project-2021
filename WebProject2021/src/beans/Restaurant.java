package beans;

import java.util.ArrayList;
import java.util.List;

import enumerations.RestaurantType;

public class Restaurant {
	
	private Integer id;
	
	private String name;
	
	private RestaurantType restaurantType;
	
	private List<Integer> articals = new ArrayList<Integer>();
	
	//radi ako je true, ne radi ako je false
	private boolean open;
	
	private Location location;
	
	private String image;
	
	private Double rating = 0.0;
	
	private List<Integer> amenities = new ArrayList<Integer>();

	private boolean deleted;
	
	
	//KONSTRUKTORI
	public Restaurant() {
		super();
	}


	public Restaurant(Integer id, String name, RestaurantType restaurantType, List<Integer> articals, boolean open,
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
	


	public Restaurant(Integer id, String name, RestaurantType restaurantType, List<Integer> articals, boolean open,
			Location location, String image, Double rating, List<Integer> amenities, boolean deleted) {
		super();
		this.id = id;
		this.name = name;
		this.restaurantType = restaurantType;
		this.articals = articals;
		this.open = open;
		this.location = location;
		this.image = image;
		this.rating = rating;
		this.amenities = amenities;
		this.deleted = deleted;
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
	


	public Double getRating() {
		return rating;
	}


	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	


	public List<Integer> getAmenities() {
		return amenities;
	}


	public void setAmenities(List<Integer> amenities) {
		this.amenities = amenities;
	}


	public boolean isDeleted() {
		return deleted;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}


	@Override
	public String toString() {
		return "Restaurant [id=" + id + ", name=" + name + ", restaurantType=" + restaurantType + ", articals="
				+ articals + ", open=" + open + ", location=" + location + ", image=" + image + ", rating=" + rating
				+ ", amenities=" + amenities + ", deleted=" + deleted + "]";
	}



	
	
	
}
