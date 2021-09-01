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
					$( "#detaljiRestorana" + restaurant.id).click(function() {
						getRestaurantById(restaurant.id);
					});
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
			" <td> <button id='detaljiRestorana" + restaurant.id + "' class='btn-edit'> Details </button></td>" +
			"</tr>";
	table.append(tr);

	$("#tableRestaurants").css("background-color", "aqua");

}

function getRestaurantById(id){
	$('#tableSadrzaj tbody').empty();
	$.ajax({
		
		type: "GET",
		url: './rest/amenity/' + id,
		contentType: 'application/json',
		success: function(amenities) {
	    	for(let amenity of amenities) {
				dodajSadrzajRestorana(amenity);
				}
		}
	});	
	
	$.ajax({
		
		type: "GET",
		url: './rest/restaurant/' + id,
		contentType: 'application/json',
		success: function(res) {
			$('#txtIdRestorana').val(res.id);
			$('#txtNameRestorana').val(res.name);
			$('#txtCityRestorana').val(res.city);
			$('#txtAddressRestorana').val(res.address);
			$('#txtCountryRestorana').val(res.country);
			$('#txtTypeRestorana').val(res.type);
			$('#txtStatusRestorana').val(res.open);
			$('#txtRatingRestorana').val(res.rating);
	
		}
	});	

}

function dodajSadrzajRestorana(amenity){
	let c = "<tr align='center'> " +
	" <td>" + amenity.name + "</td> "
	$("#tableSadrzaj").append(c);
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
	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
 				}
 			}
 		});
 		
	});
}

function filterByType(){
 	$("#typeZaFiltraciju").change(function() {
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: 'rest/restaurant/open',
 			contentType: 'application/json',
 			success: function(restaurants) {
 		    	for(let res of restaurants) {
 		    		if($("#typeZaFiltraciju").val() == '' || res.type.toLowerCase().includes($("#typeZaFiltraciju").val().toLowerCase())){
 	 					addRestaurantInTable(res);
 	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
 		    		}

 				}
 			}
 		});	
 		
	});
}


function sortRestaurantsByRating(){

 	$( "#sortRestaurantsByRating").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: './rest/restaurant/all',
 			contentType: 'application/json',
 			success: function(restaurants) {
				console.log("Usao u sortByRating");
 				for(let i=0; i<restaurants.length; i++){
 					for(let j = i+1; j < restaurants.length; j++){
 	 					if(restaurants[i].rating < restaurants[j].rating){
 	 						temp = restaurants[i];
 	 						restaurants[i] = restaurants[j];
 	 						restaurants[j] = temp;
 	 					}
 					}
 				}
 				
 			    for(let res of restaurants) {
 	 				addRestaurantInTable(res);
 	 				$( "#detaljiRestorana" + res.id).click(function() {
						getRestaurantById(res.id);
					});
 				}

 			}
 		});
	});
}

function strcmp(a, b)
{   
    return (a<b?-1:(a>b?1:0));  
}

function sortRestaurantsByName(){

 	$( "#sortRestaurantsByName").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: './rest/restaurant/all',
 			contentType: 'application/json',
 			success: function(restaurants) {
				console.log("Usao u sortByName");
				
 			    restaurants.sort(function(a, b){
				    if(a.name < b.name) { return -1; }
				    if(a.name > b.name) { return 1; }
				    return 0;
				})
 				
 				
 				for(let res of restaurants) {
 					addRestaurantInTable(res);
 					$( "#detaljiRestorana" + res.id).click(function() {
						getRestaurantById(res.id);
					});
 				}
 				

 			}
 		});
	});
}


function sortRestaurantsByCity(){

 	$( "#sortRestaurantsByCity").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: './rest/restaurant/all',
 			contentType: 'application/json',
 			success: function(restaurants) {
				console.log("Usao u sortByCity");
				
 			    restaurants.sort(function(a, b){
				    if(a.city < b.city) { return -1; }
				    if(a.city > b.city) { return 1; }
				    return 0;
				})
 				
 				
 				for(let res of restaurants) {
 					addRestaurantInTable(res);
 					$( "#detaljiRestorana" + res.id).click(function() {
						getRestaurantById(res.id);
					});
 				}
 				

 			}
 		});
	});
}

function sortRestaurantsByCountry(){

 	$( "#sortRestaurantsByCountry").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: './rest/restaurant/all',
 			contentType: 'application/json',
 			success: function(restaurants) {
				console.log("Usao u sortByCountry");
				
 			    restaurants.sort(function(a, b){
				    if(a.country < b.country) { return -1; }
				    if(a.country > b.country) { return 1; }
				    return 0;
				})
 				
 				
 				for(let res of restaurants) {
 					addRestaurantInTable(res);
 					$( "#detaljiRestorana" + res.id).click(function() {
						getRestaurantById(res.id);
					});
 				}
 				

 			}
 		});
	});
}




$(document).ready(function(){

	initShowButtons();
	
	
	search();
	filterByType();
	
	sortRestaurantsByRating();
	sortRestaurantsByName();
	sortRestaurantsByCity();
	sortRestaurantsByCountry();
	
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