package beans;

public class Cart {
	
	private Long id;
	
	private CartItem cartItem;
	
	private Integer user;
	
	private Double price;
	
	
	
	public Cart() {
		
	}

	public Cart(Long id, CartItem cartItem, Integer user, Double price) {
		super();
		this.id = id;
		this.cartItem = cartItem;
		this.user = user;
		this.price = price;
	}



	public CartItem getCartItem() {
		return cartItem;
	}

	public void setCartItem(CartItem cartItem) {
		this.cartItem = cartItem;
	}

	public Integer getUser() {
		return user;
	}

	public void setUser(Integer user) {
		this.user = user;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "Cart [cartItem=" + cartItem + ", user=" + user + ", price=" + price + "]";
	}
	
	
	
}
