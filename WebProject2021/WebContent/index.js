$(document).ready(function(){
	
	// Log-in na sistem
	$("#formLogin").submit(function(event){
		event.preventDefault();
		
		let username = $("#username").val();
		let password = $("#password").val();
		
		let data = {
			username: username,
			password: password,

		}
		
		$.post({
			url: 'rest/login',
			data: JSON.stringify(data),
			contentType: "application/json",
			success: function(message){
				console.log(message);
				if(message === "ADMIN"){
					window.location = "./html/admin.html";
					alert("Welcome!");
				} else if(message === "MENADZER"){
					
				} else if(message === "DOSTAVLJAC") {
					
				} else if(message === "KUPAC"){
					
				} else {
					alert(message)
				}
			},
			error: function(message){
				alert("Server error!");
			}
		})
		
	});
	
	// Show/hide login form
	$("#loginMenu").click(function(event){
		// Provera da li je login forma vidljiva, ako jeste uklanja je, ako nije otkriva je
		if($("#divLogin").css("display") == "none") {
			$("#divLogin").show();
		} else {
			$("#divLogin").hide();
		}
		
	});
	
	
});