package dto;


public class ArticleDTO {
	
	private Long id;

	private String name;
	
	private Double price;
	
	private String type;
	
	private Double amount;
	
	private String description;
	
	private String image;
	
	

	public ArticleDTO() {
		super();
	}

	

	public ArticleDTO(Long id, String name, Double price, String type, Double amount,
			String description, String image) {
		super();
		this.id = id;
		this.name = name;
		this.price = price;
		this.type = type;
		this.amount = amount;
		this.description = description;
		this.image = image;
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
	
	
	
}
