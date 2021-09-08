function changeView() {
	$("#divCart").hide();
	$("#divOrders").hide();
	$("#divRestaurants").hide();
	$("#divRestaurantDetails").hide();
	
	$("#buttonCart").click(function(event){
		$("#divCart").show();
		$("#divMyAccount").hide();
		$("#divOrders").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		getCart();
	});

	$("#buttonOrders").click(function(event){
		$("#divCart").hide();
		$("#divMyAccount").hide();
		$("#divOrders").show();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		getMyOrders();
	});

	$("#editMenu").click(function(event){
		$("#divCart").hide();
		$("#divMyAccount").show();
		$("#divOrders").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
	});
	
	$("#buttonRestaurants").click(function(event){
		$("#divCart").hide();
		$("#divMyAccount").hide();
		$("#divOrders").hide();
		$("#divRestaurants").show();
		$("#divRestaurantDetails").hide();
		getAllRestaurants();
	});
	
	$(document).on("click", ".button-details", function(){
		$("#divCart").hide();
		$("#divMyAccount").hide();
		$("#divOrders").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").show();
		let id = $(this).attr("id");
		getRestaurantDetails(id);

	})
}

//Formatiranje datuma
function formatDate(newDate) {
	let date = new Date(newDate);
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return day + "." + month + "." + year + ".";
}

function getLoggedInUser(){
	    $.get({
		type: "GET",
		url: 'rest/user/loggedIn',
		success: function(user) {
			console.log(user);
			$('#usernameEdit').val(user.username);
			$('#passwordEdit').val(user.password);
			$('#nameEdit').val(user.firstName);
			$('#lastNameEdit').val(user.lastName);
			if(user.gender == true){
				$('input#male').prop("checked", true);
			} else {
				$('input#female').prop("checked", true);
			}
		}
	})
}

function logout(){
 	$( "#logoutMenu").click(function() {
 		$.ajax({
 			type: "GET",
 			url: 'rest/logout',
 			contentType: 'application/json',
 			success: function() {
 				window.location = "./index.html";
 			}
 		});
 		
	});
}

// RESTORANI

function getAllRestaurants(){
	$("#tableRestaurants").empty();
	$.get({
		url: "rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			for(let restaurant of restaurants) {
				addRestaurantInTable(restaurant);
			}
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
			" <td> <button id='" + restaurant.id + "' class='button-details'> Details </button></td>" +
			"</tr>";
	table.append(tr);

}

function getRestaurantDetails(restaurantId) {
	getRestaurantArticles(restaurantId);
	$.ajax({
		type: "GET",
		url: 'rest/restaurant/' + restaurantId,
		contentType: 'application/json',
		success: function(restaurant) {
			console.log(restaurant.image);
			$('#h1Restaurant').text("Restaurant " + restaurant.name);
			$('#tdRestaurantId').text(restaurant.id);
			$('#tdRestaurantName').text(restaurant.name);
			$('#tdRestaurantCity').text(restaurant.city);
			$('#tdRestaurantStreet').text(restaurant.address);
			$('#tdRestaurantCountry').text(restaurant.country);
			$('#tdRestaurantType').text(restaurant.type);
			$('#tdRestaurantStatus').text(restaurant.open);
			$('#tdRestaurantRating').text(restaurant.rating);
			$('#imgRestaurantLogo').attr("src", restaurant.image);
			
		}
	});
}

// Artikli u izabranom restoranu	
function getRestaurantArticles(restaurantId) {
	$.ajax({
		
		type: "GET",
		url: './rest/article/' + restaurantId,
		contentType: 'application/json',
		success: function(articles) {
	    	for(let article of articles) {
				addRestaurantArticles(article);
			}
		}
	});
	addToCart(restaurantId)
}

function addRestaurantArticles(article){
	let c = "<tr>" +
	" <td>" + article.name + "</td> " +
	" <td><img src='" + article.image + "'alt='" + article.image + "'></td> " +
	" <td>" + article.description + "</td> " +
	" <td>" + article.price + "</td> " +
	" <td><input type='number' required value='1' min='1' class='input-amount' id='" + article.id + "'>" + "</td> " +
	" <td><button class='add-to-cart' id='" + article.id  + "'>Dodaj u korpu</button></td> " +
	"</tr>"
	
	$("#tableArticles").append(c);
}

// Shopping cart

function addToCart(restaurantId) {
	$(document).on('click', '.add-to-cart', function(){
		var article = $(this).attr('id');
		var amount = $("#" + article + ".input-amount").val();
		console.log(article);
		console.log(amount)
		var cartItem = {
			"article": article,
			"amount": amount
		}
		$.post({
			url: "rest/cart/add-to-cart/" + restaurantId,
			contentType: "application/json",
			data: JSON.stringify(cartItem),
			success: function(){
				alert("Artikal dodat u korpu");
			}
		});
	});
}

function getCart() {
	$("#tableCart").empty();
	$("#totalSum").empty();
	$.get({
		url: "rest/cart",
		contentType: "application/json",
		success: function (cart) {
			for(let cartItem of cart.cartItems) {
				getArticle(cartItem.article, cartItem.amount);
			}
			userCart = cart;
			let tableFooter = $("#totalSum");
			let tr = "<tr><td colspan='5'>Ukupna cena: " + cart.price + "</td></tr>";
			tableFooter.append(tr);
		}
	});
}

function getArticle(cartItem, amount) {
	$.get({
		url: "rest/article/one/" + cartItem,
		contentType: "application/json",
		success: function (article) {
			addArticleInTable(article, amount);
		}
	});	
}


function addArticleInTable(article, amount) {
	let table = $("#tableCart");
	
	let tr = "<tr>" +
			"<td>" + article.name + "</td>" +
			"<td><input type='number' min='1' class='input-number' id='" + article.id + "' value='" + amount + "'>" + "</td>" +
			"<td>" + article.price + "</td>" +
			"<td>" + "ovde ce biti slika" + "</td>" +
			"<td><button class='remove-article' id='" + article.id  + "'>Izbaci</button></td>" +
			"</tr>";
	
	table.append(tr);
		
}

function removeArticleFromCart() {	
	$(document).on('click', '.remove-article', function(){
		let id = $(this).attr("id");
		$.ajax({
			url: "rest/cart/" + id,
			type: "DELETE",
			dataType: "json",
			complete: function(){
				alert("Uspesno izbacen artikal");
				// Primer okidanja klika iz javascript-a
				$("#buttonCart").trigger('click');
			}
		});
	});
}

function refreshCart() {
	
	$("#buttonRefreshCart").click(function(){
		console.log(userCart);
		var tempCart;
		for (let cartItem of userCart.cartItems) {
			let articleAmount = $("#" + cartItem.article + ".input-number").val();
			cartItem.amount = articleAmount;
		}
		tempCart = userCart;
		
		$.ajax({
			type: "PUT",
			url: "rest/cart",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(tempCart),
			success: function() {
				alert("Uspesno izmenjena korpa");
				$("#buttonCart").trigger('click');
			}
		})
	});
}

// PORUDZBINE

function makeOrder() {
	$("#buttonCreateOrder").click(function(){
		let data = userCart;
		$.post({
			url: "rest/order",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function() {
				alert("Uspesno kreirana porudzbina");
			}
		});
	});
	
}

function getMyOrders() {
	$("#tableOrders").empty();
	$.get({
		url: "rest/order",
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addOrderInTable(order);
			}
			shownOrders = orders;
		}
	});
}

function addOrderInTable(order) {
	let table = $("#tableOrders");
	
	var restaurantName;
	var restaurantType;
	for (let restaurant of allRestaurants) {
		if(restaurant.id === order.restaurant) {
			restaurantName = restaurant.name;
			restaurantType = restaurant.type;
			break;
		}
	}
	
	let tr = "<tr>" +
			"<td>" + restaurantName + "</td>" +
			"<td>" + restaurantType + "</td>" +
			"<td>" + order.price + "</td>" +
			"<td>" + formatDate(order.date) + "</td>" +
			"<td>" + order.customer + "</td>" +
			"<td>" + order.orderStatus + "</td>" +
			"<td><button id='" + order.orderId + "' name='cancel'>Otkaži</button></td>" +
			"</tr>";
	
	table.append(tr);
	
} 

function cancelOrder() {
	$(document).on('click', 'button[name="cancel"]', function(){
		let orderId = $(this).attr("id");
		$.ajax({
			url: "rest/order/cancel/" + orderId,
			type: "PUT", 
			success: function(message){
				alert(message);
			}
		});
	});
}

// Za popunjavanje podataka o restoranu u tabeli sa poruzbinama

function getRestaurants() {
	$.get({
		url: "rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			allRestaurants = restaurants;
		}
	});
}

// PRETRAGA - SEARCH

function searchOrders() {
	
	$("#formSearchOrders").submit(function (event){
		event.preventDefault();
		let sDate = $("#searchStartDate").val();
		let eDate = $("#searchEndDate").val();
		var startDate;
		var EndDate;
		console.log(sDate);
		console.log(eDate);
		if(sDate != "") {
			startDate = new Date(sDate);
			startDate = startDate.getTime();
		} else {
			startDate = "";
		}
		if(eDate != "") {
			endDate = new Date(eDate);
			endDate = endDate.getTime();
		} else {
			endDate = "";
		}
		
		// getTime() vraca vreme u milisekundama
		let queryParams = {
			restaurant: $("#searchRestaurant").val(),
			minPrice: $("#searchMinPrice").val(),
			maxPrice: $("#searchMaxPrice").val(),
			startDate: startDate,
			endDate: endDate
		};
		
		$.get({
			url: "rest/order/search",
			data: queryParams,
			success: function(orders){
				// Prvo brisem postojece narudzbine iz tabele pa dodajem filtrirane - pretraga
				$("#tableOrders").empty();
				for (let order of orders) {
					addOrderInTable(order);
				}
				shownOrders = orders;
			},
			error: function(message){
				alert(message);
			}
		})
	});
}

// SORTIRANJE

//TODO: Proveriti da li je ovo dobro kada se zavrsi dodavanje u korpu
function sortOrdersByRestaurantName() {
	$("#sortRestaurant").click(function(){
		$("#tableOrders").empty();

		for (var i = 0; i < shownOrders.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownOrders.length; j++) {
				let res1Id = shownOrders[j].restaurant;
				let res2Id = shownOrders[i].restaurant;
				let res1Name;
				let res2Name;
				for (let restaurant of allRestaurants) {
					if(restaurant.id === res1Id) {
						res1Name = restaurant.name;
					}
					if(restaurant.id === res2Id) {
						res2Name = restaurant.name;
					}
				}

				if(res1Name.toLowerCase() < res2Name.toLowerCase())
					min_idx = j;
			}
			let temp = shownOrders[i];
			shownOrders[i] = shownOrders[min_idx];
			shownOrders[min_idx] = temp;
		}
		if(sortRestaurantNameDesc) {
			sortRestaurantNameDesc = false;
			$("#imageSortRestaurantName").attr("src", "images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortRestaurantNameDesc = true;
			$("#imageSortRestaurantName").attr("src", "images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
		}

	});
}

function sortOrdersByPrice() {
	$("#sortPrice").click(function(){
		$("#tableOrders").empty();

		for (var i = 0; i < shownOrders.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownOrders.length; j++) {
				if(shownOrders[j].price < shownOrders[i].price)
					min_idx = j;
			}
			let temp = shownOrders[i];
			shownOrders[i] = shownOrders[min_idx];
			shownOrders[min_idx] = temp;
		}
		if(sortPriceDesc) {
			sortPriceDesc = false;
			$("#imageSortPrice").attr("src", "images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortPriceDesc = true;
			$("#imageSortPrice").attr("src", "images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
		}

	});
}

function sortOrdersByDate() {
	$("#sortDate").click(function(){
		$("#tableOrders").empty();

		for (var i = 0; i < shownOrders.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownOrders.length; j++) {
				if(shownOrders[j].date < shownOrders[i].date)
					min_idx = j;
			}
			let temp = shownOrders[i];
			shownOrders[i] = shownOrders[min_idx];
			shownOrders[min_idx] = temp;
		}
		if(sortDateDesc) {
			sortDateDesc = false;
			$("#imageSortDate").attr("src", "images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortDateDesc = true;
			$("#imageSortDate").attr("src", "images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
		}

	});
}

// FILTRIRANJE

function filterOrdersByRestaurantType() {
	$("#filterType").change(function(){
		$.get({
			url: "rest/order",
			contentType: "application/json",
			success: function(orders) {
				$("#tableOrders").empty();
				shownOrders = [];
				let restaurantType = $("#filterType option:selected").val();
				for (let order of orders) {		
					for (let restaurant of allRestaurants) {
						if (order.restaurant === restaurant.id) {
							let type = restaurant.type;
							if((restaurantType === type) || restaurantType === "SVI") {
								addOrderInTable(order);
								shownOrders.push(order);
							}
							break;
						}
					}
				}
			}
		});
	});
}

function filterOrdersByStatus() {
	$("#filterStatus").change(function(){
		$.get({
			url: "rest/order",
			contentType: "application/json",
			success: function(orders) {
				$("#tableOrders").empty();
				shownOrders = [];
				let status = $("#filterStatus option:selected").val();
				for (let order of orders) {					
					if((order.orderStatus === status) || status === "SVE") {
						addOrderInTable(order);
						shownOrders.push(order);
					}
				}
			}
		});
	});
}



// GLOBALNE PROMENLJIVE

var userCart;

var allRestaurants;
var shownRestaurants;

var shownOrders;

var sortRestaurantNameDesc;
var sortPriceDesc;
var sortDateDesc;

$(document).ready(function(){
	
	changeView();
	
	getLoggedInUser();
	
	logout();
	
	removeArticleFromCart();
	refreshCart();
	
	makeOrder();
	
	cancelOrder();
	
	getRestaurants();
	
	searchOrders();
	
	sortOrdersByRestaurantName();
	sortOrdersByPrice();
	sortOrdersByDate();
	sortRestaurantNameDesc = true;
	sortPriceDesc = true;
	sortDateDesc = true;
	
	filterOrdersByRestaurantType();
	filterOrdersByStatus();
	
	
	$("#buttonSearch").click(function(){
		$("#divSearchOrders").slideToggle();
	});

	$("#formEdit").submit(function(event){
	
			console.log("Usao u EDIT");
			event.preventDefault();
			
			
			let username = $("#usernameEdit").val();
			let password = $("#passwordEdit").val();
			let firstName = $("#nameEdit").val();
			let lastName = $("#lastNameEdit").val();
			let confirmPassword = $("#confirm-password").val();
			let male = $("#male:checked").val();
			
			if(password == '' || firstName== '' || lastName == ''){
				alert('Please fill all mandatory fields');
				return;
			}
			
			if(password != confirmPassword){
				alert('Passwords do not match');
				return;
			}
			
			
			let gender;
			if(male){
				gender = "True";
				//alert("Musko");
			}else {
				gender = "False";
				//alert("Zensko");
			}
			
			let data = {
				username: username,
				password: password,
				firstName: firstName,
				lastName: lastName,
				gender: gender
			};
			console.log(data);
			
			$.ajax({
				type: "PUT",
				url: 'rest/user',
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function() {
					console.log("Success edit");
				},
				error : function(){
					console.log("error");
					alert("Error edit");
				}
			})
	
	});

});