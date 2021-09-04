package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User updateUser(User user, @Context HttpServletRequest request) {
		
		UserDAO userDAO = (UserDAO)ctx.getAttribute("users");
		User userForUpdate = userDAO.findUser(user.getUsername());
		
		System.out.println(user.getUsername());
		System.out.println(user.getPassword());
		System.out.println(user.getFirstName());
		System.out.println(user.getLastName());
		
		userForUpdate.setPassword(user.getPassword());
		userForUpdate.setFirstName(user.getFirstName());
		userForUpdate.setLastName(user.getLastName());
		userForUpdate.setGender(user.isGender());
		userForUpdate.setBirthDate(user.getBirthDate());
		
		userDAO.updateUser(userForUpdate);
		
		String contextPath = ctx.getRealPath("");
		userDAO.saveUsers(contextPath);
		
		return userForUpdate;
	}
		
	
	/**Metoda koja vraca sve menadzere koji nisu povezani sa restoranom*/
	@GET
	@Path("/available-managers")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllAvailableManagers() {
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("users");
		Collection<User> allUsers = userDAO.findAllUsers();
		
		List<User> availableManagers = new ArrayList<User>();
		
		for (User user : allUsers) {
			if(user.getRole().equals(UserRole.MENADZER))
				if(user.getRestaurant() == null)
					availableManagers.add(user);
		}
		
		return Response.status(200).entity(availableManagers).build();
		
	}
	
	@GET
	@Path("/search")
	@Produces(MediaType.APPLICATION_JSON)
	public Response searchUser(@QueryParam("firstName") String firstName, @QueryParam("lastName") String lastName, @QueryParam("username") String username) {
		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("users");
		Collection<User> users = userDAO.getAllUsers(); 
		
		List<User> filteredUsers = new ArrayList<User>();
		
		System.out.println(firstName);
		System.out.println(lastName);
		System.out.println(username);
		
		for (User user : users) {
			if((firstName.equals("") || user.getFirstName().toLowerCase().contains(firstName.toLowerCase()))
				&& (lastName.equals("") || user.getLastName().toLowerCase().contains(lastName.toLowerCase()))
				&& (username.equals("") || user.getUsername().toLowerCase().contains(username.toLowerCase()))) {
					filteredUsers.add(user);
			}
		}
		
		
		return Response.status(200).entity(filteredUsers).build();
	}
	
	/**Pomocna funkcija za proveru prava pristupa */
	public UserRole getUserRole(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		
		if(loggedUser!= null) {
			return loggedUser.getRole();
		}	
		return null;
	}
	
	/**Vraca objekat ulogovanog korisnika.*/
	@GET
	@Path("/loggedIn")
	@Produces(MediaType.APPLICATION_JSON)
	public User getLoggedInUser(@Context HttpServletRequest request) {
		User loggedUser = (User) request.getSession().getAttribute("user");
	
		if(loggedUser == null) {
			return null;
		}
		
		return loggedUser;
	}
}
