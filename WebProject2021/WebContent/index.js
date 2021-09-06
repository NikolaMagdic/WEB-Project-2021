function initHide(){
	$("#divLogin").hide();
	$("#divRegister").hide();
	$("#divAllRestaurants").hide();
	$("#divSearchInfo").hide();
	$("#divRestaurantDetails").hide();

}

function initShowButtons(){
	initHide();
	{
		$("#loginMenu").click( function(){
			$("#divLogin").show();
			$("#divRegister").hide();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
			$("#divRestaurantDetails").hide();
		});	
		$("#registerMenu").click( function(){
			$("#divLogin").hide();
			$("#divRegister").show();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
			$("#divRestaurantDetails").hide();
		});	
		$("#restaurantsMenu").click( function(){
			console.log("Clicked restaurants menu");
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").show();
			$("#divSearchInfo").hide();
			$("#tableRestaurants tbody").empty();
			$("#divRestaurantDetails").hide();
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
		
		$(document).on("click", "button[name = 'detaljiRestorana']", function(){
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
			$("#divRestaurantDetails").show();
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
	
			restaurants.sort(function(a, b){
				if(a.open > b.open) { return -1; }
			    if(a.open < b.open) { return 1; }
				    return 0;
			});
	
			for(let restaurant of restaurants) {
				addRestaurantInTable(restaurant);
					$( "#detaljiRestorana" + restaurant.id).click(function() {
						getRestaurantById(restaurant.id);
					});
			}
			console.log("All restaurants method");
			shownRestaurants = restaurants;
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
			" <td> <button id='detaljiRestorana" + restaurant.id + "' class='buttonDetails' name='detaljiRestorana'> Details </button></td>" +
			"</tr>";
	table.append(tr);

	$("#tableRestaurants").css("background-color", "aqua");

}

function getRestaurantById(id){
	$('#tableSadrzaj tbody').empty();
	$.ajax({
		
		type: "GET",
		url: './rest/article/' + id,
		contentType: 'application/json',
		success: function(articles) {
	    	for(let article of articles) {
				dodajSadrzajRestorana(article);
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

function dodajSadrzajRestorana(article){
	let c = 
	" <td>" + article.name + ", </td> "; 
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
				shownRestaurants = [];
 		    	for(let res of restaurants) {
 					addRestaurantInTable(res);
	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
					shownRestaurants.push(res);
 				}
 			}
 		});
 		
	});
}

//prikazuje samo restorane koji su otvoreni
function filterByType(){
 	$("#typeZaFiltraciju").change(function() {
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: 'rest/restaurant/open',
 			contentType: 'application/json',
 			success: function(restaurants) {
				shownRestaurants = [];
 		    	for(let res of restaurants) {
 		    		if($("#typeZaFiltraciju").val() == '' || res.type.toLowerCase().includes($("#typeZaFiltraciju").val().toLowerCase())){
 	 					addRestaurantInTable(res);
 	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
						shownRestaurants.push(res);
 		    		}

 				}
 			}
 		});	
 		
	});
}

function sortRestaurantsByStatus() {
	$("#sortRestaurantsByStatus").click(function() {
		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
		
		for(let res of shownRestaurants) {
			if(res.open === "Open") {
	 	 		addRestaurantInTable(res);
	 	 		$( "#detaljiRestorana" + res.id).click(function() {
					getRestaurantById(res.id);
				});
			}
 		}
	})
}


function sortRestaurantsByRating(){

 	$( "#sortRestaurantsByRating").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();

		console.log("Usao u sortByRating");
 		
 		if(sortRatingDesc) {
 			for(let i=0; i<shownRestaurants.length; i++){
 	 			for(let j = i+1; j < shownRestaurants.length; j++){
 	 	 			if(shownRestaurants[i].rating < shownRestaurants[j].rating){
 	 	 				temp = shownRestaurants[i];
 	 	 				shownRestaurants[i] = shownRestaurants[j];
 	 	 				shownRestaurants[j] = temp;
 	 	 			}
 	 			}
 	 		}
			
 			sortRatingDesc = false;
 			$("#imageSortRating").attr("src", "./images/sort-down.png");
 		} else {
 			//shownUsers.reverse();
 			for(let i=0; i<shownRestaurants.length; i++){
 	 			for(let j = i+1; j < shownRestaurants.length; j++){
 	 	 			if(shownRestaurants[i].rating > shownRestaurants[j].rating){
 	 	 				temp = shownRestaurants[i];
 	 	 				shownRestaurants[i] = shownRestaurants[j];
 	 	 				shownRestaurants[j] = temp;
 	 	 			}
 	 			}
 	 		}
 			sortRatingDesc = true;
 			$("#imageSortRating").attr("src", "./images/sort-up.png");
 		}
 		
 			for(let res of shownRestaurants) {
 	 		addRestaurantInTable(res);
 	 		$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
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
	
		console.log("Usao u sortByName");
			
			
		if(sortNameDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.name < b.name) { return -1; }
			    if(a.name > b.name) { return 1; }
			    return 0;
			});
			sortNameDesc = false;
			$("#imageSortName").attr("src", "./images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.name > b.name) { return -1; }
			    if(a.name < b.name) { return 1; }
			    return 0;
			});
			sortNameDesc = true;
			$("#imageSortName").attr("src", "./images/sort-up.png");
		}
 			
 			
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 				
	});
}


function sortRestaurantsByCity(){

 	$( "#sortRestaurantsByCity").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();

		console.log("Usao u sortByCity");

		if(sortCityDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.city < b.city) { return -1; }
			    if(a.city > b.city) { return 1; }
			    return 0;
			});
			sortCityDesc = false;
			$("#imageSortCity").attr("src", "./images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.city > b.city) { return -1; }
			    if(a.city < b.city) { return 1; }
			    return 0;
			});
			sortCityDesc = true;
			$("#imageSortCity").attr("src", "./images/sort-up.png");
		}
 		
 		
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 		
	});
}

function sortRestaurantsByCountry(){

 	$( "#sortRestaurantsByCountry").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();

		console.log("Usao u sortByCountry");
		
		
		if(sortCountryDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.country < b.country) { return -1; }
			    if(a.country > b.country) { return 1; }
			    return 0;
			});
			sortCountryDesc = false;
			$("#imageSortCountry").attr("src", "./images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.country > b.country) { return -1; }
			    if(a.country < b.country) { return 1; }
			    return 0;
			});
			sortCountryDesc = true;
			$("#imageSortCountry").attr("src", "./images/sort-up.png");
		}
 		
 		
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 		
	});
}


//GLOBALNE PROMENLJIVE


//Svi sortovi su podrazumevano od veceg ka manjem
var sortNameDesc;
var sortRatingDesc;
var sortCityDesc;
var sortCountryDesc;

//Svi trenutno prikazani restorani 
var shownRestaurants;


$(document).ready(function(){

	initShowButtons();
	
	
	search();
	filterByType();
	
	sortRestaurantsByRating();
	sortRestaurantsByName();
	sortRestaurantsByCity();
	sortRestaurantsByCountry();
	sortRestaurantsByStatus();
	
	sortNameDesc = true;
	sortRatingDesc = true;
	sortCityDesc = true;
	sortCountryDesc = true;
	
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
					window.location = "./managerPage.html";
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