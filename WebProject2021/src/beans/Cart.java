package beans;

import java.util.ArrayList;
import java.util.List;

public class Cart {
	
	private Long id;
	
	private List<CartItem> cartItems = new ArrayList<CartItem>();
	
	private Double price;
	
	
	
	public Cart() {
		
	}

	public Cart(Long id, List<CartItem> cartItems, Double price) {
		super();
		this.id = id;
		this.cartItems = cartItems;
		this.price = price;
	}



	public List<CartItem> getCartItems() {
		return cartItems;
	}

	public void setCartItem(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	
	
	
}
