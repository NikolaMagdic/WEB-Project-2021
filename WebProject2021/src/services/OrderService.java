package services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Cart;
import beans.CartItem;
import beans.Order;
import beans.User;
import dao.OrderDAO;
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
	
		
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createOrder(Cart cart, @Context HttpServletRequest request) {
		List<CartItem> products = new ArrayList<CartItem>();
		products = cart.getCartItems();
		
		Integer restaurantId = cart.getRestaurant();
		
		long millis = System.currentTimeMillis(); 
		
		User loggedInUser = (User) request.getSession().getAttribute("user");
		String usersNameAndSurname = loggedInUser.getFirstName() + " " + loggedInUser.getLastName();
		
		Order order = new Order("", products, restaurantId, new Date(millis), cart.getPrice(), usersNameAndSurname, OrderStatus.OBRADA);
	
		String contextPath = context.getRealPath("");
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		orderDAO.addOrder(order);
		orderDAO.saveOrders(contextPath);
		
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
	@Path("/cancel")
	@Consumes(MediaType.APPLICATION_JSON)
	public void cancelOrder(Order order ) {
		if (order.getOrderStatus().equals(OrderStatus.OBRADA))
			order.setOrderStatus(OrderStatus.OTKAZANA);
		
		String contextPath = context.getRealPath("");
		OrderDAO orderDAO = (OrderDAO) context.getAttribute("orders");
		orderDAO.updateOrder(order);
		orderDAO.saveOrders(contextPath);
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
