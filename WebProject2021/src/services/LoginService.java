package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.User;
import dao.UserDAO;

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
		} else {
			request.getSession().setAttribute("user", loggedUser);
			return loggedUser.getRole().toString();
		}
		
	}
	
}
