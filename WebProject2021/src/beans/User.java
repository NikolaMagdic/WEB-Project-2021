package beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import enumerations.UserRole;

public class User {
	
	private String username;
	
	private String password;
	
	private String firstName;
	
	private String lastName;
	
	// true if male, false if female
	private boolean gender;
	
	private Date birthDate;
	
	private UserRole role;
	
	//ako je kupac
	private List<Integer> myOrders = new ArrayList<Integer>();
	
	//ako je kupac
	private Cart cart; //ili Integer?

	//ako je menadzer
	private Integer restaurant;
	
	//ako je dostavljac
	private List<Integer> deliveryOrders = new ArrayList<Integer>();
	
	//ako je kupac
	private Integer points;
	
	//ako je kupac
	private CustomerType customerType;

	
	public User() {
		super();
	}


	public User(String username, String password, String firstName, String lastName, boolean gender, Date birthDate,
			UserRole role, List<Integer> myOrders, Cart cart, Integer restaurant, List<Integer> deliveryOrders,
			Integer points, CustomerType customerType) {
		super();
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthDate = birthDate;
		this.role = role;
		this.myOrders = myOrders;
		this.cart = cart;
		this.restaurant = restaurant;
		this.deliveryOrders = deliveryOrders;
		this.points = points;
		this.customerType = customerType;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getFirstName() {
		return firstName;
	}


	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getLastName() {
		return lastName;
	}


	public void setLastName(String lastName) {
		this.lastName = lastName;
	}


	public boolean isGender() {
		return gender;
	}


	public void setGender(boolean gender) {
		this.gender = gender;
	}


	public Date getBirthDate() {
		return birthDate;
	}


	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}


	public UserRole getRole() {
		return role;
	}


	public void setRole(UserRole role) {
		this.role = role;
	}


	public List<Integer> getMyOrders() {
		return myOrders;
	}


	public void setMyOrders(List<Integer> myOrders) {
		this.myOrders = myOrders;
	}


	public Cart getCart() {
		return cart;
	}


	public void setCart(Cart cart) {
		this.cart = cart;
	}


	public Integer getRestaurant() {
		return restaurant;
	}


	public void setRestaurant(Integer restaurant) {
		this.restaurant = restaurant;
	}


	public List<Integer> getDeliveryOrders() {
		return deliveryOrders;
	}


	public void setDeliveryOrders(List<Integer> deliveryOrders) {
		this.deliveryOrders = deliveryOrders;
	}


	public Integer getPoints() {
		return points;
	}


	public void setPoints(Integer points) {
		this.points = points;
	}


	public CustomerType getCustomerType() {
		return customerType;
	}


	public void setCustomerType(CustomerType customerType) {
		this.customerType = customerType;
	}


	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", firstName=" + firstName + ", lastName="
				+ lastName + ", gender=" + gender + ", birthDate=" + birthDate + ", role=" + role + ", myOrders="
				+ myOrders + ", cart=" + cart + ", restaurant=" + restaurant + ", deliveryOrders=" + deliveryOrders
				+ ", points=" + points + ", customerType=" + customerType + "]";
	}
	
	
}
