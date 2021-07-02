package filters;

public class RestaurantFilter {
	
	private String name;
	
	private String type;
	
	private String city;
	
	private Double rating;

	
	
	public RestaurantFilter() {
		super();
	}
	
	

	public RestaurantFilter(String name, String type, String city, Double rating) {
		super();
		this.name = name;
		this.type = type;
		this.city = city;
		this.rating = rating;
	}



	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	
	
}
