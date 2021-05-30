package beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import enumerations.OrderStatus;

public class Order {

	// 10 karaktera
	private String orderId;
	
	private List<Integer> products = new ArrayList<Integer>();
	
	private Integer restaurant;
	
	private Date date;
	
	private Double price;
	
	// ime i prezime kupca
	private String customer;
	
	private OrderStatus orderStatus;

	
	public Order() {
		
	}
	
	public Order(String orderId, List<Integer> products, Integer restaurant, Date date, Double price, String customer,
			OrderStatus orderStatus) {
		super();
		this.orderId = orderId;
		this.products = products;
		this.restaurant = restaurant;
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

	public List<Integer> getProducts() {
		return products;
	}

	public void setProducts(List<Integer> products) {
		this.products = products;
	}

	public Integer getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Integer restaurant) {
		this.restaurant = restaurant;
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

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	@Override
	public String toString() {
		return "Order [orderId=" + orderId + ", products=" + products + ", restaurant=" + restaurant + ", date=" + date
				+ ", price=" + price + ", customer=" + customer + ", orderStatus=" + orderStatus + "]";
	}
	
	
	
}
