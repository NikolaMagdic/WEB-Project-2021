package services;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import dao.CommentDAO;

@Path("comment")
public class CommentService {

	@Context 
	ServletContext ctx;
	
	public CommentService() {
		
	}
	
	@PostConstruct
	public void init() {
		String contextPath = ctx.getRealPath("");
		
		CommentDAO commentDAO = new CommentDAO(contextPath);
		if(ctx.getAttribute("comments") == null) {
			ctx.setAttribute("comments", commentDAO);
		}
		
	}
	
	
	
}
