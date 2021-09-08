package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Cart;
import beans.CartItem;
import beans.Order;
import beans.Restaurant;
import beans.User;
import dao.OrderDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.OrderDTO;
import enumerations.OrderStatus;

@Path("order")
public class OrderService {

	@Context
	ServletContext context;
	
	public OrderService() {
		
	}
	
	@PostConstruct
	public void init() {	
		
		String contextPath = context.getRealPath("");
		
		OrderDAO orderDAO = new OrderDAO(contextPath);
		if (context.getAttribute("orders") == null) {
			context.setAttribute("orders", orderDAO);
		}
		
		RestaurantDAO restaurantDAO = new RestaurantDAO(contextPath);
		if (context.getAttribute("restaurants") == null) {
			context.setAttribute("restaurants", restaurantDAO);
		}
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOrders(@Context HttpServletRequest request) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		
		User loggedInUser = (User) request.getSession().getAttribute("user");
		if (loggedInUser == null)
			return Response.status(400).build();
		List<Order> myOrders = new ArrayList<Order>();
		
		for (String orderId : loggedInUser.getMyOrders()) {
			Order order = orderDAO.getOrder(orderId);
			myOrders.add(order);
		}
		
		return Response.status(200).entity(myOrders).build();
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOneOrder(@PathParam("id") String id) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		
		Order order = orderDAO.getOrder(id);
		
		if (order == null) {
			System.out.println("Nije nasao order sa id: " + id);
			return Response.status(400).build();
		}
		
		return Response.status(200).entity(order).build();
	}	
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createOrder(Cart cart, @Context HttpServletRequest request) {
		List<CartItem> products = new ArrayList<CartItem>();
		products = cart.getCartItems();
		
		Integer restaurantId = cart.getRestaurant();
		
		Long millis = System.currentTimeMillis(); 
		
		User loggedInUser = (User) request.getSession().getAttribute("user");
		String usersNameAndSurname = loggedInUser.getFirstName() + " " + loggedInUser.getLastName();
		
		// TODO: Ovo izmeniti da bude id od 10 karaktera
		String orderId = millis.toString();
		
		Order order = new Order(orderId, products, restaurantId, new Date(millis), cart.getPrice(), usersNameAndSurname, OrderStatus.OBRADA);
	
		String contextPath = context.getRealPath("");
		// Sacuvaj porudzbinu
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		orderDAO.addOrder(order);
		orderDAO.saveOrders(contextPath);
		
		// Azururaj usera
		UserDAO userDAO = (UserDAO) context.getAttribute("users");
		loggedInUser.getMyOrders().add(order.getOrderId());
		// Dodaj mu bodove
		Double points = order.getPrice() / 1000 * 133;
		loggedInUser.setPoints(loggedInUser.getPoints() + points);
		
		
		// Azururaj restoran (posto sam dodao listu restaurantsOrders da bi mogao da izlistam sve ordere vezane za njega)
		RestaurantDAO restaurantDAO = (RestaurantDAO) context.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(restaurantId);
		restaurant.getRestaurantOrders().add(order.getOrderId());
		
		// Sacuvaj promene
		userDAO.updateUser(loggedInUser);
		userDAO.saveUsers(contextPath);
		restaurantDAO.updateRestaurant(restaurant);
		restaurantDAO.saveRestaurants(contextPath);
		
		return Response.status(201).build();
	
	}
	
	// Za menadzera promena iz OBRADA u U PRIPREMI 
	@PUT
	@Path("/edit")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void changeOrderStatus(OrderDTO order) {
		
		System.out.println(order.getOrderId());
		System.out.println(order.getDate());
		System.out.println(order.getOrderStatus());
		System.out.println(order.getPrice());
		System.out.println(order.getCustomer());
		
		String contextPath = context.getRealPath("");
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		Order oldOrder = orderDAO.getOrder(order.getOrderId());
		
		OrderStatus status = null;
		if(order.getOrderStatus().equals("U_PRIREMI")) {
			status = OrderStatus.U_PRIREMI;
		} else if(order.getOrderStatus().equals("CEKA_DOSTAVLJACA")) {
			status = OrderStatus.CEKA_DOSTAVLJACA;
		} else {
			status = OrderStatus.OBRADA;
		}
		
		oldOrder.setOrderStatus(status);
		
		orderDAO.updateOrder(oldOrder);
		orderDAO.saveOrders(contextPath);
	}

	// Otkazivanje narudzbine od strane kupca
	@PUT
	@Path("/cancel/{orderId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String cancelOrder(@PathParam("orderId") String orderId, @Context HttpServletRequest request) {
	
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		Order order = orderDAO.getOrder(orderId);
		
		if (order.getOrderStatus().equals(OrderStatus.OBRADA))
			order.setOrderStatus(OrderStatus.OTKAZANA);
		
		String contextPath = context.getRealPath("");
		orderDAO.updateOrder(order);
		orderDAO.saveOrders(contextPath);
		
		// Azuriranje ordera u korisniku
		User loggedInUser = (User) request.getSession().getAttribute("user");
		loggedInUser.getMyOrders().remove(orderId);
		// Smanjivanje bodova korisniku
		Double points = order.getPrice() / 1000 * 133 * 4;
		loggedInUser.setPoints(loggedInUser.getPoints() - points);
		// Cuvanje promena
		UserDAO userDAO = (UserDAO) context.getAttribute("users");
		userDAO.updateUser(loggedInUser);
		userDAO.saveUsers(contextPath);
		
		return "OTKAZANA";
	}
	
	// Za menadzera promena iz U PRIPREMI u CEKA DOSTAVLJACA ??????????????????
	@PUT
	@Path("/wait")
	@Consumes(MediaType.APPLICATION_JSON)
	public void changeOrderStatusToWaiting(Order order) {
		
		if (order.getOrderStatus().equals(OrderStatus.U_PRIREMI))
			order.setOrderStatus(OrderStatus.CEKA_DOSTAVLJACA);
		
		String contextPath = context.getRealPath("");
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		orderDAO.updateOrder(order);
		orderDAO.saveOrders(contextPath);
	}
	
	
	// Pretraga porudzbina za kupca (samo njegove porudzbine)
	@GET
	@Path("/search")
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchOrders (@QueryParam("restaurant") String restaurant,
			@QueryParam("minPrice") String minPrice, @QueryParam("maxPrice") String maxPrice,
			@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate,
			@Context HttpServletRequest request) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		RestaurantDAO restaurantDAO = (RestaurantDAO) context.getAttribute("restaurants");
		
		System.out.println("Query PARAMS: restaurant-" + restaurant + "/minPrice-" + minPrice + "/maxPrice-" + maxPrice + "/startDate-" + 
				startDate + "/endDate-" + endDate );
		
		User loggedInUser = (User) request.getSession().getAttribute("user");
		List<Order> myOrders = new ArrayList<Order>();
		
		for (String orderId : loggedInUser.getMyOrders()) {
			Order order = orderDAO.getOrder(orderId);
			myOrders.add(order);
		}
		
		List<Order> filteredOrders = new ArrayList<Order>();
		List<Restaurant> filteredRestaurants = new ArrayList<Restaurant>();
		
		Collection<Restaurant> restaurants = restaurantDAO.findAllRestaurants();
		if(!restaurant.trim().isEmpty()) {
			for (Restaurant res : restaurants) {
				if(res.getName().toLowerCase().contains(restaurant.toLowerCase())) {
					filteredRestaurants.add(res);
				}
			}
		} else {
			List<Restaurant> list = new ArrayList<Restaurant>(restaurants);
			filteredRestaurants = list;
		}
		
		Double minimumPrice = 0.0;
		Double maximumPrice = 0.0;
		if(!minPrice.trim().isEmpty())
			 minimumPrice = Double.parseDouble(minPrice);
		if(!maxPrice.trim().isEmpty())
			 maximumPrice = Double.parseDouble(maxPrice);
		Long millisStart = 0L;
		Long millisEnd = 0L;
		if(!startDate.trim().isEmpty()) {
			millisStart = Long.parseLong(startDate);
		}
		if(!endDate.trim().isEmpty()) {	
			millisEnd = Long.parseLong(endDate);
		}
		Date startingDate = new Date(millisStart);
		Date endingDate = new Date(millisEnd);
		
		for (Order o : myOrders) {
			boolean flag = false;
			for (Restaurant r : filteredRestaurants) {
				if (o.getRestaurant() == r.getId()) {
					flag = true;
				}
			}
			if((((o.getPrice() <= maximumPrice) && (o.getPrice() >= minimumPrice)) || ((minPrice.trim().isEmpty()) && (o.getPrice() <= maximumPrice)) || ((maxPrice.trim().isEmpty()) && (o.getPrice() >= minimumPrice)) || ((minPrice.trim().isEmpty()) && (maxPrice.trim().isEmpty())))
					&& ((o.getDate().after(startingDate) && o.getDate().before(endingDate)) || ((startDate.trim().isEmpty()) && o.getDate().before(endingDate)) || ((endDate.trim().isEmpty()) && o.getDate().after(startingDate)) || ((startDate.trim().isEmpty()) && (endDate.trim().isEmpty())))) {
					if(flag == true) {	
						filteredOrders.add(o);
					}
			}
		}
		
		return Response.status(200).entity(filteredOrders).build();
	}
	
	
	// Pretraga porudzbina za restoran preko njegovog Id (samo njegove porudzbine)
	@GET
	@Path("/search/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchOrdersForRestaurant (@PathParam("id") Integer id,
			@QueryParam("minPrice") String minPrice, @QueryParam("maxPrice") String maxPrice,
			@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate,
			@Context HttpServletRequest request) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		RestaurantDAO restaurantDAO = (RestaurantDAO) context.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		
		if (restaurant == null) {
			System.out.println("Nije nasao restoran sa id: " + id);
			return Response.status(400).build();
		}

		List<Order> restaurantOrders = new ArrayList<Order>();
		
		System.out.println("Query PARAMS: " + "/minPrice-" + minPrice + "/maxPrice-" + maxPrice + "/startDate-" + 
				startDate + "/endDate-" + endDate );
		
		
		
		for (String orderId : restaurant.getRestaurantOrders()) {
			Order order = orderDAO.getOrder(orderId);
			restaurantOrders.add(order);
		}
		
		List<Order> filteredOrders = new ArrayList<Order>();
		
		
		Double minimumPrice = 0.0;
		Double maximumPrice = 0.0;
		if(!minPrice.trim().isEmpty()) {
			 minimumPrice = Double.parseDouble(minPrice);
		}
		if(!maxPrice.trim().isEmpty()) {
			 maximumPrice = Double.parseDouble(maxPrice);
		}
		
		Long millisStart = 0L;
		Long millisEnd = 0L;
		if(!startDate.trim().isEmpty()) {
			millisStart = Long.parseLong(startDate);
		}
		if(!endDate.trim().isEmpty()) {	
			millisEnd = Long.parseLong(endDate);
		}
		Date startingDate = new Date(millisStart);
		Date endingDate = new Date(millisEnd);
		
		for (Order o : restaurantOrders) {
			if((((o.getPrice() <= maximumPrice) && (o.getPrice() >= minimumPrice)) || ((minPrice.trim().isEmpty()) && (o.getPrice() <= maximumPrice)) || ((maxPrice.trim().isEmpty()) && (o.getPrice() >= minimumPrice)) || ((minPrice.trim().isEmpty()) && (maxPrice.trim().isEmpty())))
					&& ((o.getDate().after(startingDate) && o.getDate().before(endingDate)) || ((startDate.trim().isEmpty()) && o.getDate().before(endingDate)) || ((endDate.trim().isEmpty()) && o.getDate().after(startingDate)) || ((startDate.trim().isEmpty()) && (endDate.trim().isEmpty())))) {
						filteredOrders.add(o);
			}
		}
		
		return Response.status(200).entity(filteredOrders).build();
	}
	
	//funkcija dobavlja sve ordere za jedan restoran
	@GET
	@Path("/restaurant/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRestaurantOrders(@PathParam("id") Integer id) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		RestaurantDAO restaurantDAO = (RestaurantDAO) context.getAttribute("restaurants");
		Restaurant restaurant = restaurantDAO.findRestaurant(id);
		
		if (restaurant == null) {
			System.out.println("Nije nasao restoran sa id: " + id);
			return Response.status(400).build();
		}

		List<Order> restaurantOrders = new ArrayList<Order>();
		
		for (String orderId : restaurant.getRestaurantOrders()) {
			Order order = orderDAO.getOrder(orderId);
			restaurantOrders.add(order);
			System.out.println("Restaurant order sa id: " + orderId);
		}
		
		return Response.status(200).entity(restaurantOrders).build();
	}	
	
}
