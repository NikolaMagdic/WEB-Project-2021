package beans;

import java.util.ArrayList;
import java.util.List;

public class Cart {
	
	private List<CartItem> cartItems = new ArrayList<CartItem>();

	private String customer;
	
	private Double price;
		
	// Mi dodali (nije u specifikaciji) da znamo iz kog restorana je korisnik narucio
	private Integer restaurant;
	
	public Cart() {
		
	}

	public Cart(List<CartItem> cartItems, String customer, Double price, Integer restaurant) {
		super();
		this.cartItems = cartItems;
		this.customer = customer;
		this.price = price;
		this.restaurant = restaurant;
	}


	public List<CartItem> getCartItems() {
		return cartItems;
	}

	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}

	public String getCustomer() {
		return customer;
	}

	public void setCustomer(String customer) {
		this.customer = customer;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Integer restaurant) {
		this.restaurant = restaurant;
	}

	
	
}
