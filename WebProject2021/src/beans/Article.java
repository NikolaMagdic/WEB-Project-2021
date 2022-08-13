package beans;

import enumerations.ArticleType;

public class Article {
	
	private Long id;

	private String name;
	
	private Double price;
	
	private ArticleType articleType;
	
	private Integer restaurant;
	
	private Double amount;
	
	private String description;
	
	private String image;
	
	private boolean deleted;

	


	public Article() {
		super();
	}
	
	

	public Article(Long id, String name, Double price, ArticleType articleType, Integer restaurant, Double amount,
			String description, String image, boolean deleted) {
		super();
		this.id = id;
		this.name = name;
		this.price = price;
		this.articleType = articleType;
		this.restaurant = restaurant;
		this.amount = amount;
		this.description = description;
		this.image = image;
		this.deleted = deleted;
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

	


	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public ArticleType getArticleType() {
		return articleType;
	}



	public void setArticleType(ArticleType articleType) {
		this.articleType = articleType;
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



	public boolean isDeleted() {
		return deleted;
	}



	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}



	@Override
	public String toString() {
		return "Article [id=" + id + ", name=" + name + ", price=" + price + ", articleType=" + articleType
				+ ", restaurant=" + restaurant + ", amount=" + amount + ", description=" + description + ", image="
				+ image + ", deleted=" + deleted + "]";
	}

	
	
}
