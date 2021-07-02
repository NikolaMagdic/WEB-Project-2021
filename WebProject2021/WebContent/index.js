function initHide(){
	$("#divLogin").hide();
	$("#divRegister").hide();
	$("#divAllRestaurants").hide();
	$("#divSearchInfo").hide();

}

function initShowButtons(){
	initHide();
	{
		$("#loginMenu").click( function(){
			$("#divLogin").show();
			$("#divRegister").hide();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
		});	
		$("#registerMenu").click( function(){
			$("#divLogin").hide();
			$("#divRegister").show();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
		});	
		$("#restaurantsMenu").click( function(){
			console.log("Clicked restaurants menu");
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").show();
			$("#divSearchInfo").hide();
			$("#tableRestaurants tbody").empty();
			getAllRestaurants();
		});
		$("#openSearchBox").click( function(){
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").show();
			$("#divSearchInfo").show();
			$("#tableRestaurants tbody").empty();
			getAllRestaurants();
		});
	}
}

function getAllRestaurants(){
	$.get({
		url: "./rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			for(let restaurant of restaurants) {
				addRestaurantInTable(restaurant);
			}
			console.log("All restaurants method");
		}
	});
}

function addRestaurantInTable(restaurant) {
	let table = $("#tableRestaurants");

	let tr = "<tr id=\"trRestaurant\">" +
			"<td>" + restaurant.name + "</td>" +
			"<td>" + restaurant.type + "</td>" +
			"<td>" + restaurant.open + "</td>" +
			"<td>" + restaurant.city + "</td>" +
			"<td>" + restaurant.country + "</td>" +
			"<td>" + restaurant.rating + "</td>" +
			"</tr>";
	table.append(tr);

	$("#tableRestaurants").css("background-color", "aqua");

}

function search(){	
 	$( "#search").click(function() {
 		
 		event.preventDefault();
 		$("#tableRestaurants tbody").empty();

 		var name = $("#searchName");
 		var type = $("#searchType");
 		var city = $("#searchCity");
 		var rating = $("#searchRating");

 		//console.log(checkInTime.val());
 		var filter = new Object();
 		
 		if(name.val() == ""){
 			filter.name = null;
 		} else filter.name = name.val();
 		
 		if(type.val() == ""){
 			filter.type = null;
 		} else filter.type = type.val();
 		
 		if(city.val() == ""){
 			filter.city = null;
 		} else filter.city = city.val();
 		
 		if(rating.val() == ""){
 			filter.rating = null;
 		} else filter.rating = rating.val();
 		
 		
 		
 		console.log(filter);
 		$.ajax({
 			type: "POST",
 			url: 'rest/restaurant/search',
			data : JSON.stringify(filter),
 			contentType: 'application/json',
 			success: function(restaurants) {
 				console.log(restaurants);
 		    	for(let res of restaurants) {
 					addRestaurantInTable(res);
 				}
 			}
 		});
 		
	});
}



$(document).ready(function(){

	initShowButtons();
	
	//getAllRestaurants();
	
	search();
	
	// Log-in na sistem
	$("#formLogin").submit(function(event){
		event.preventDefault();
		
		let username = $("#usernameLogin").val();
		let password = $("#passwordLogin").val();
		
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
					window.location = "./userPage.html";
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
							window.location = "./userPage.html";
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