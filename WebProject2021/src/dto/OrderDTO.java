package dto;

import java.util.Date;

public class OrderDTO {
	
	private String orderId;
	
	private Date date;
	
	private Double price;
	
	// ime i prezime kupca
	private String customer;
	
	private String orderStatus;

	
	
	public OrderDTO() {
		super();
	}


	public OrderDTO(String orderId, Date date, Double price, String customer, String orderStatus) {
		super();
		this.orderId = orderId;
		this.date = date;
		this.price = price;
		this.customer = customer;
		this.orderStatus = orderStatus;
	}


	public String getOrderId() {
		return orderId;
	}


	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}


	public Date getDate() {
		return date;
	}


	public void setDate(Date date) {
		this.date = date;
	}


	public Double getPrice() {
		return price;
	}


	public void setPrice(Double price) {
		this.price = price;
	}


	public String getCustomer() {
		return customer;
	}


	public void setCustomer(String customer) {
		this.customer = customer;
	}


	public String getOrderStatus() {
		return orderStatus;
	}


	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}
	
	
}
