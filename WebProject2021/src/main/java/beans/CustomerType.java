package beans;

import enumerations.CustomerTypeName;

public class CustomerType {
	
	private CustomerTypeName customerTypeName;
	
	private Integer discount;
	
	private Integer points;

	public CustomerType() {
		super();
	}

	public CustomerType(CustomerTypeName customerTypeName, Integer discount, Integer points) {
		super();
		this.customerTypeName = customerTypeName;
		this.discount = discount;
		this.points = points;
	}

	public CustomerTypeName getCustomerTypeName() {
		return customerTypeName;
	}

	public void setCustomerTypeName(CustomerTypeName customerTypeName) {
		this.customerTypeName = customerTypeName;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getPoints() {
		return points;
	}

	public void setPoints(Integer points) {
		this.points = points;
	}
	
	
	
	
}
