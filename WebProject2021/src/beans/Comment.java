package beans;

public class Comment {
	
	private Integer id;

	private Integer customer;
	
	private Integer restaurant;
	
	private String text;
	
	// od 1 do 10
	private Integer grade;

	
	public Comment() {
		
	}
	

	public Comment(Integer id, Integer customer, Integer restaurant, String text, Integer grade) {
		super();
		this.id = id;
		this.customer = customer;
		this.restaurant = restaurant;
		this.text = text;
		this.grade = grade;
	}



	public Integer getCustomer() {
		return customer;
	}

	public void setCustomer(Integer customer) {
		this.customer = customer;
	}

	public Integer getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Integer restaurant) {
		this.restaurant = restaurant;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Integer getGrade() {
		return grade;
	}

	public void setGrade(Integer grade) {
		this.grade = grade;
	}

	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}


	@Override
	public String toString() {
		return "Comment [id=" + id + ", customer=" + customer + ", restaurant=" + restaurant + ", text=" + text
				+ ", grade=" + grade + "]";
	}

	
}
