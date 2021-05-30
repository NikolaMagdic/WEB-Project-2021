package beans;

import enumerations.ProductType;

public class Product {

	private String name;
	
	private Double price;
	
	private ProductType itemType;
	
	private Integer restaurant;
	
	private Double amount;
	
	private String description;
	
	private String image;

	public Product() {
		
	}
	
	public Product(String name, Double price, ProductType itemType, Integer restaurant, Double amount, String description,
			String image) {
		super();
		this.name = name;
		this.price = price;
		this.itemType = itemType;
		this.restaurant = restaurant;
		this.amount = amount;
		this.description = description;
		this.image = image;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public ProductType getItemType() {
		return itemType;
	}

	public void setItemType(ProductType itemType) {
		this.itemType = itemType;
	}

	public Integer getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Integer restaurant) {
		this.restaurant = restaurant;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Override
	public String toString() {
		return "Item [name=" + name + ", price=" + price + ", itemType=" + itemType + ", restaurant=" + restaurant
				+ ", amount=" + amount + ", description=" + description + ", image=" + image + "]";
	}
	
	
}
