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
					//window.location = "./admin.html";
					alert("Welcome!");
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
	
	// Show/hide register form
	$("#registerMenu").click(function(event){
		if($("#divRegister").css("display") == "none") {
			$("#divRegister").show();
		} else {
			$("#divRegister").hide();
		}
		
	});
	
	
	$("#formRegister").submit(function(event){
		console.log("#######1");
		event.preventDefault();

		let username = $("#usernameRegister").val();
		let password = $("#passwordRegister").val();
		console.log(password);
		let firstName = $("#nameRegister").val();
		let lastName = $("#lastNameRegister").val();
		let male = $("#male:checked").val();
		let confirm_password = $("#confirm-password").val();
		console.log(confirm_password);
		let gender;
		
		console.log("#######2");
		
		if(male){
			gender = "True";
			//alert("Musko");
		}else {
			gender = "False";
			//alert("Zensko");
		}
		
		console.log("#######3");
		if (password === confirm_password){
					$.post({
						url : "rest/register",
						data : JSON.stringify({username, password, firstName, lastName, gender}),
						contentType: "application/json",
						success : function(){
							alert("You are registred");
							console.log("success");
							window.location = "./index.html";
						},
						error : function(){
							console.log("error");
							alert("Username already exists.");
						}
					});
		} else {
			alert("Passwords do not match");
		}
	

	});
	
	
});