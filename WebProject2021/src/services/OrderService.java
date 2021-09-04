package services;

import java.util.ArrayList;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Cart;
import beans.CartItem;
import beans.Order;
import beans.User;
import dao.OrderDAO;
import dao.UserDAO;
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
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOrders(@Context HttpServletRequest request) {
		
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		
		User loggedInUser = (User) request.getSession().getAttribute("user");
		List<Order> myOrders = new ArrayList<Order>();
		
		for (String orderId : loggedInUser.getMyOrders()) {
			Order order = orderDAO.getOrder(orderId);
			myOrders.add(order);
		}
		
		return Response.status(200).entity(myOrders).build();
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
		// Sacuvaj promene
		userDAO.updateUser(loggedInUser);
		userDAO.saveUsers(contextPath);
		
		return Response.status(201).build();
	
	}
	
	// Za menadzera promena iz OBRADA u U PRIPREMI
	@PUT
	@Path("/in-preparation")
	@Consumes(MediaType.APPLICATION_JSON)
	public void changeOrderStatus(Order order) {
		
		if (order.getOrderStatus().equals(OrderStatus.OBRADA))
			order.setOrderStatus(OrderStatus.U_PRIREMI);
		
		String contextPath = context.getRealPath("");
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		orderDAO.updateOrder(order);
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
	
	// Za menadzera promena iz U PRIPREMI u CEKA DOSTAVLJACA
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
	
}
