function initHide(){
	$("#divLogin").hide();
	$("#divRegister").hide();
	$("#divAllRestaurants").hide();
	$("#divSearchInfo").hide();
	$("#divRestaurantDetails").hide();
	$("#divRestaurantArticles").hide();
	$("#divRestaurantComments").hide();
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
			$("#divRestaurantArticles").hide();
			$("#divRestaurantComments").hide();
		});	
		$("#registerMenu").click( function(){
			$("#divLogin").hide();
			$("#divRegister").show();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
			$("#divRestaurantDetails").hide();
			$("#divRestaurantArticles").hide();
			$("#divRestaurantComments").hide();
		});	
		$("#restaurantsMenu").click( function(){
			console.log("Clicked restaurants menu");
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").show();
			$("#divRestaurantArticles").hide();
			$("#divSearchInfo").hide();
			$("#tableRestaurants tbody").empty();
			$("#divRestaurantDetails").hide();
			$("#divRestaurantComments").hide();
			getAllRestaurants();
		});
		$("#openSearchBox").click( function(){
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").show();
			$("#divRestaurantArticles").hide();
			$("#divSearchInfo").show();
			$("#divRestaurantDetails").hide();
			$("#divRestaurantComments").hide();
			$("#tableRestaurants tbody").empty();
			getAllRestaurants();
		});
		
		$(document).on("click", "button[name = 'detaljiRestorana']", function(){
			$("#divLogin").hide();
			$("#divRegister").hide();
			$("#divAllRestaurants").hide();
			$("#divSearchInfo").hide();
			$("#divRestaurantDetails").show();
			$("#divRestaurantArticles").show();
			$("#divRestaurantComments").show();
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

	var opened = restaurant.open ? "Opened" : "Closed";

	let tr = "<tr id=\"trRestaurant\">" +
			"<td>" + restaurant.name + "</td>" +
			"<td><img alt='' src='" + restaurant.image + "' width='50px' height='50px'></td>" +
			"<td>" + restaurant.restaurantType + "</td>" +
			"<td>" + opened + "</td>" +
			"<td>" + restaurant.location.address.city + "</td>" +
			"<td>" + restaurant.location.address.country + "</td>" +
			"<td>" + restaurant.rating + "</td>" +
			" <td> <button id='detaljiRestorana" + restaurant.id + "' class='buttonDetails' name='detaljiRestorana'> Details </button></td>" +
			"</tr>";
	table.append(tr);

}

function getRestaurantById(id){
	getRestaurantComments(id);
	$.ajax({
		
		type: "GET",
		url: './rest/restaurant/' + id,
		contentType: 'application/json',
		success: function(res) {
			var opened = res.open ? "Opened" : "Closed";
			$('#h2Restaurant').text("Restaurant " + res.name + " details");
			$('#txtIdRestorana').val(res.id);
			$('#txtNameRestorana').val(res.name);
			$('#txtCityRestorana').val(res.location.address.city);
			$('#txtAddressRestorana').val(res.location.address.streetAndNumber);
			$('#txtCountryRestorana').val(res.location.address.country);
			$('#txtTypeRestorana').val(res.restaurantType);
			$('#txtStatusRestorana').val(opened);
			$('#txtRatingRestorana').val(res.rating);
			
			// Mapa
			$("#map").empty();
			var map = new ol.Map({
			    target: 'map',
			    layers: [
			      new ol.layer.Tile({
			        source: new ol.source.OSM()
			      })
			    ],
			    view: new ol.View({
			      center: ol.proj.fromLonLat([res.location.longitude, res.location.latitude ]),
			      zoom: 18
			    })
			 });
			 
			var markers = new ol.layer.Vector({
			  source: new ol.source.Vector(),
			  style: new ol.style.Style({
			    image: new ol.style.Icon({
			      anchor: [0.5, 1],
			      src: 'ol/marker.png'
			    })
			  })
			});
			map.addLayer(markers);
			
			var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([res.location.longitude, res.location.latitude])));
			markers.getSource().addFeature(marker);
						 
		}
	});
	
	$.ajax({
		
		type: "GET",
		url: './rest/article/' + id,
		contentType: 'application/json',
		success: function(articles) {
			
			$('#tableArticles tbody').empty();
			console.log("USAO JE U GET ARTICLES INDEX");
			
			//mora ici OF umesto IN da bi zapravo uzeo vrednost u listi
			for(let article of articles) {
				addArticleInTable(article);
			}
		}
	});	

}

function dodajSadrzajRestorana(article){
	let c = 
	" <td>" + article.name + ", </td> "; 
	$("#tableSadrzaj").append(c);
}


//ARTIKLI ##################################################################
function addArticleInTable(article) {
	let table = $("#tableArticles");
	//console.log("ArticleId: " + articleId);
	
	console.log("ARTICLE : " + article);

	let tr = "<tr id=\"trArticle\">" +
			"<td class=\"tdTable\">" + article.name + "</td>" +
			"<td class=\"tdTable\">" + article.price + "</td>" +
			"<td class=\"tdTable\">" + article.type + "</td>" +
			"<td class=\"tdTable\">" + article.amount + "</td>" +
			"<td class=\"tdTable\">" + article.description + "</td>" +
			"<td><img alt='' src='" + article.image + "' width='50px' height='50px'></td>" +
			"</tr>";
	table.append(tr);

}

function getArticleById(articleId){
	//console.log("ID artikla za koji nam trebaju detalji: " + articleId);
	
	
	$.get({
		type: "GET",
		url: "./rest/article/Id/" + articleId,
		dataType: "json",
		success: function(article) {
			

			$('#txtIdArticla').val(article.id);
			$('#txtNameArticla').val(article.name);
			$('#txtPriceArticla').val(article.price);
			$('#txtTypeArticla').val(article.type);
			$('#txtAmountArticla').val(article.amount);
			$('#txtDescriptionArticla').val(article.description);
			$('#txtImageArticla').val(article.image);
			
			setSelectedArticleData(article);
		}
	})
}

//KOMENTARI ##############################
function getRestaurantComments(restaurantId) {
	$("#tableComments").empty();
	$.ajax({
		type: "GET",
		url: 'rest/comment/approved/' + restaurantId,
		contentType: 'application/json',
		success: function(comments) {
	    	for(let comment of comments) {
				addRestaurantComments(comment);
			}
		}
	});	
}

function addRestaurantComments(comment){
	let tr = "<tr>" +
	" <td>" + comment.customer + "</td> " +
	" <td>" + comment.text + "</td> " +
	" <td>" + comment.grade + "</td> " +
	"</tr>"
	
	$("#tableComments").append(tr);
}

//SEARCH #################################################################
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


//FILTER ####################################################################
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
 		    		if($("#typeZaFiltraciju").val() == '' || res.restaurantType.toLowerCase().includes($("#typeZaFiltraciju").val().toLowerCase())){
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


//SORTIRANJE ##############################################################
function sortRestaurantsByStatus() {
	$("#sortRestaurantsByStatus").click(function() {
		event.preventDefault();
 		
 		$("#tableRestaurants tbody").empty();
		
		for(let res of shownRestaurants) {
			if(res.open) {
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
			    if(a.location.address.city < b.location.address.city) { return -1; }
			    if(a.location.address.city > b.location.address.city) { return 1; }
			    return 0;
			});
			sortCityDesc = false;
			$("#imageSortCity").attr("src", "./images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.location.address.city > b.location.address.city) { return -1; }
			    if(a.location.address.city < b.location.address.city) { return 1; }
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
			    if(a.location.address.country < b.location.address.country) { return -1; }
			    if(a.location.address.country > b.location.address.country) { return 1; }
			    return 0;
			});
			sortCountryDesc = false;
			$("#imageSortCountry").attr("src", "./images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.location.address.country > b.location.address.country) { return -1; }
			    if(a.location.address.country < b.location.address.country) { return 1; }
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
					window.location = "./html/managerPage.html";
				} else if(message === "DOSTAVLJAC") {
					window.location = "./html/delivererPage.html";
				} else if(message === "KUPAC"){
					window.location = "./html/userPage.html";
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
		let birthDate = $("#date").val();
		
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
						data : JSON.stringify({username, password, firstName, lastName, gender, birthDate}),
						contentType: "application/json",
						success : function(){
							alert("You are registered");
							console.log("success");
							window.location = "./html/userPage.html";
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