package beans;

public class Comment {
	
	private Integer id;

	private String customer;
	
	private Integer restaurant;
	
	private String text;
	
	// od 1 do 10
	private Integer grade;

	private boolean accepted;
	
	public Comment() {
		
	}
	

	public Comment(Integer id, String customer, Integer restaurant, String text, Integer grade, boolean accepted) {
		super();
		this.id = id;
		this.customer = customer;
		this.restaurant = restaurant;
		this.text = text;
		this.grade = grade;
		this.accepted = accepted;
	}



	public String getCustomer() {
		return customer;
	}

	public void setCustomer(String customer) {
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
	
	public boolean isAccepted() {
		return accepted;
	}

	public void setAccepted(boolean accepted) {
		this.accepted = accepted;
	}


	@Override
	public String toString() {
		return "Comment [id=" + id + ", customer=" + customer + ", restaurant=" + restaurant + ", text=" + text
				+ ", grade=" + grade + ", accepted=" + accepted + "]";
	}

	
}
