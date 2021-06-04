package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import dao.UserDAO;

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
}
