package services;

import java.util.ArrayList;
import java.util.Collection;

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

import beans.User;
import dao.UserDAO;
import enumerations.UserRole;

@Path("user")
public class UserService {
	
	@Context 
	ServletContext ctx;
	
	public UserService(){
		
	}
	
	@PostConstruct
	public void init() {
		String contextPath = ctx.getRealPath("");
		System.out.println(contextPath);
		
		UserDAO userDAO = new UserDAO(contextPath);
		if(ctx.getAttribute("users") == null) {
			ctx.setAttribute("users", userDAO);
		}	
		
	}
	
	// Vraća kolekciju svih korisnika u sistemu
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response allUsers(@Context HttpServletRequest request) {
		
		if(getUserRole(request) != UserRole.ADMIN)
			return Response.status(403).build();
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("users");
		
		Collection<User> allUsers = userDAO.getAllUsers();
		
		return Response.status(200).entity(allUsers).build();
	}
	
	// Dodavanje novog korisnika
	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUser(User user) {
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("users");
		
		if(user.getRole().equals(UserRole.DOSTAVLJAC))
			user.setDeliveryOrders(new ArrayList<Integer>());
		
		if(userDAO.findUser(user.getUsername()) != null) {
			return Response.status(400).build();
		}
		
		userDAO.addUser(user);
		String contextPath = ctx.getRealPath("");
		userDAO.saveUsers(contextPath);
		
		return Response.status(200).entity(user).build();
	}
	
	public UserRole getUserRole(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		
		if(loggedUser!= null) {
			return loggedUser.getRole();
		}	
		return null;
	}
}
