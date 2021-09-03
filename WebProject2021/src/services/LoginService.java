package services;

import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Cart;
import beans.CustomerType;
import beans.User;
import dao.UserDAO;
import enumerations.CustomerTypeName;
import enumerations.UserRole;

@Path("")
public class LoginService {
	
	@Context
	ServletContext context;
	
	public LoginService() {
		
	}
	
	@PostConstruct
	public void init() {
		String contextPath = context.getRealPath("");
		
		UserDAO userDAO = new UserDAO(contextPath);
		
		if(context.getAttribute("users") == null) {
			context.setAttribute("users", userDAO);
		}
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String login(User user, @Context HttpServletRequest request ) {
		
		UserDAO userDAO = (UserDAO)context.getAttribute("users");
		User loggedUser = userDAO.findUser(user.getUsername());
		
		if(loggedUser == null) {
			return "User with that username does not exist.";
		} else if(!loggedUser.getPassword().equals(user.getPassword())) {
			return "Password that you have entered is incorrect.";
		} else if (loggedUser.isBlocked()){
			return "Your account has been blocked.";
		} else {
			request.getSession().setAttribute("user", loggedUser);
			return loggedUser.getRole().toString();
		}
		
	}
	
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response registration(User user, @Context HttpServletRequest request) {
		
		System.out.println(user);
		// Dodavanje svih atributa da ne bi bili null
		user.setRole(UserRole.KUPAC);
		user.setMyOrders(new ArrayList<Integer>()); //sta cemo za cart, treba Int da se doda
		Cart newCart = new Cart();
		user.setCart(newCart);
		user.setPoints(0);
		CustomerType type = new CustomerType(CustomerTypeName.NONE, 0, 0);
		user.setCustomerType(type); //?????
		user.setBlocked(false);
		System.out.println(user);
		
		UserDAO userDAO = (UserDAO) context.getAttribute("users");
		
		// Ne mogu postojati 2 korisnika sa istim username
		if(userDAO.findUser(user.getUsername()) != null) {
			// Ovde bi verovatno trebalo vratiti nesto drugo, ali kako?
			return Response.status(400).build(); //da bacimo exception??? 
			//tipa duplicateUsernameException ili nesto tako
		}
		
		userDAO.addUser(user);
		
		String contextPath = context.getRealPath("");
		userDAO.saveUsers(contextPath);
		
		return Response.status(200).entity(user).build();
	}

	@GET
	@Path("/loggedIn")
	@Produces(MediaType.APPLICATION_JSON)
	public User getLoggedInUser(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user"); 
	
		if(loggedUser == null) {
			return null;
		} else {
			return loggedUser;
		} 
	}
	
	
	@GET
	@Path("/logout")
	public Response logout(@Context HttpServletRequest request) {
		request.getSession().invalidate();
		return Response.status(200).build();
	}
	
}
