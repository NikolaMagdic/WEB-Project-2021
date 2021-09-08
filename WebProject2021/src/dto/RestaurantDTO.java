package dto;

import java.util.ArrayList;
import java.util.List;

public class RestaurantDTO {
	
	private Integer id;
	
	private String name;
	
	private String type;
	
	private String open;
	
	private String city;
	
	private String country;
	
	private String address;
	
	private Double rating;
	
	private List<Integer> articles = new ArrayList<Integer>();

	private String image;
	
	
	public RestaurantDTO() {
		super();
	}



	public RestaurantDTO(Integer id, String name, String type, String open, String city, String country, String address,
			Double rating, List<Integer> articles, String image) {
		super();
		this.id = id;
		this.name = name;
		this.type = type;
		this.open = open;
		this.city = city;
		this.country = country;
		this.address = address;
		this.rating = rating;
		this.articles = articles;
		this.image = image;
	}




	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public String getOpen() {
		return open;
	}


	public void setOpen(String open) {
		this.open = open;
	}


	public String getCity() {
		return city;
	}


	public void setCity(String city) {
		this.city = city;
	}


	public Double getRating() {
		return rating;
	}


	public void setRating(Double rating) {
		this.rating = rating;
	}



	public String getCountry() {
		return country;
	}



	public void setCountry(String country) {
		this.country = country;
	}



	public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}



	public List<Integer> getArticles() {
		return articles;
	}



	public void setArticles(List<Integer> articles) {
		this.articles = articles;
	}



	public String getImage() {
		return image;
	}



	public void setImage(String image) {
		this.image = image;
	}
	
	
	
	
	
	
}
