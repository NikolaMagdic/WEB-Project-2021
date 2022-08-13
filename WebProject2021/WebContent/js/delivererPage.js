function initHide(){
	$("#divEditAccount").hide();
	$("#divOrders").hide();
	$("#divAllOrders").hide();
	$("#divSearchOrders").hide();
	$("#divSearchAllOrders").hide();
}

function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divOrders").hide();
		$("#divAllOrders").hide();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").hide();
	});
	
	$("#buttonMyOrders").click(function(){
		getLoggedUserData();
		getDelivererUsername();
		$("#divEditAccount").hide();
		$("#divOrders").show();
		$("#divAllOrders").hide();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").hide();
	}); 
	
	$("#buttonPickupOrders").click(function(){
		getPickupOrders();
		$("#divEditAccount").hide();
		$("#divOrders").hide();
		$("#divAllOrders").show();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").hide();
	});
	
	$("#buttonSearch").click(function(event){
		$("#divEditAccount").hide();
		$("#divOrders").show();
		$("#divAllOrders").hide();
		$("#divSearchOrders").show();
		$("#divSearchAllOrders").hide();
	});
	
	$("#buttonSearchAll").click(function(event){
		$("#divEditAccount").hide();
		$("#divOrders").hide();
		$("#divAllOrders").show();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").show();
	});
	
	$(document).on("click", "button[name = 'deliverOrder']", function(){
		$("#divEditAccount").hide();
		$("#divOrders").hide();
		$("#divAllOrders").show();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").hide();
	}); 
	
	$(document).on("click", "button[name = 'setDeliveryStatusOrdera']", function(){
		$("#divEditAccount").hide();
		$("#divOrders").show();
		$("#divAllOrders").hide();
		$("#divSearchOrders").hide();
		$("#divSearchAllOrders").hide();
	});
}



// Formatiranje datuma
function formatDate(newDate) {
	let date = new Date(newDate);
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return day + "." + month + "." + year + ".";
}

// Formatiranje datuma za date picker
function formatDatePicker(newDate) {
	let date = new Date(newDate);
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return year + "-" + month + "-" + day;
}

//ACCOUNT #######################################################
function logout(){
 	$( "#buttonLogout").click(function() {
 		$.ajax({
 			type: "GET",
 			url: '../rest/logout',
 			contentType: 'application/json',
 			success: function() {
				alert("Uspešno ste se odjavili");
 				window.location = "../index.html";
 			}
 		});
 		
	});
}

function getLoggedUserData() {
	$.get({
		type: "GET",
		url: "../rest/loggedIn",
		dataType: "json",
		success: function(user) {
			delivererUsername = user.username;
			
			
			$("#usernameEdit").val(user.username);
			$("#passwordEdit").val(user.password);
			$("#nameEdit").val(user.firstName);
			$("#lastNameEdit").val(user.lastName);
			if(user.gender == true){
				$('input#male').prop("checked", true);
			} else {
				$('input#female').prop("checked", true);
			}
			$("#dateEdit").val(formatDatePicker(user.birthDate));
			
		}
		
	});
}

function editAccount() {
	$("#formEdit").submit(function (event){
		let username = $("#usernameEdit").val();
		let password = $("#passwordEdit").val();
		let confirmPassword = $("#confirmPasswordEdit").val();
		let firstName = $("#nameEdit").val();
		let lastName = $("#lastNameEdit").val();
		let male = $("#maleEdit:checked").val();
		let date = $("#dateEdit").val();
		
		if(password != confirmPassword){
			alert("Passwords do not match");
			return;
		}
		
		let gender;
		if(male){
			gender = "True";
		}else {
			gender = "False";
		}
		
		let user = {
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
			gender: gender,
			birthDate: date,
			
		}
		
		$.ajax({
			type: "PUT",
			url: "../rest/user",
			data: JSON.stringify(user),
			contentType: "application/json",
			success: function(){
				alert("Uspesno izmenjeni podaci");
			},
			error: function(message) {
				alert(message);
			}
		});
	});	
}

function getDelivererUsername(){
	$.get({
		type: "GET",
		url: "../rest/loggedIn",
		dataType: "json",
		success: function(user) {
			delivererUsername = user.username;
			getDelivererOrders(user.username);
		}
	})
}



//ORDERI###################################################################################
function getDelivererOrders(username) {
	console.log("Usao u delivererOrders za dostavljaca:" + username);
	$("#tableOrders").empty();
	$.get({
		url: "../rest/order/deliverer/" + username,
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addOrderInTable(order);
				//console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
							setDeliveryStatusOrderById(order.orderId);
					});
			}
			shownOrders = orders;
		}
	});
}

function getPickupOrders() {
	$("#tableAllOrders").empty();
	$.get({
		url: "../rest/order/forPickup",
		contentType: "application/json",
		success: function (orders) {
			console.log(orders);
			for(let order of orders) {
				addPickupOrderInTable(order);
				console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#deliverOrder" + order.orderId, function() {
						deliverOrderById(order.orderId);
					});
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
			"<td>" + order.orderDeliveryStatus + "</td>" +
			"<td><button id='setDeliveryStatusOrdera" + order.orderId + "' class='buttonDetails' name='setDeliveryStatusOrdera'>Delivered</button></td>" +
			"</tr>";
	
	table.append(tr);
} 

function addPickupOrderInTable(order) {
	let table = $("#tableAllOrders");
	
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
			"<td><button id='deliverOrder" + order.orderId + "' class='buttonDetails' name='deliverOrder'>Deliver Order</button></td>" +
			"</tr>";
	
	table.append(tr);
} 

function getOrderById(orderId){
	//console.log("ID ordera za koji nam trebaju detalji: " + orderId);
	
	
	$.get({
		type: "GET",
		url: "../rest/order/" + orderId,
		dataType: "json",
		success: function(order) {
			setSelectedOrderData(order);
		}
	})
}

function setSelectedOrderData(order) {
	$('#txtIdOrderaEdit').val(order.orderId);
	$('#txtDateOrderaEdit').val(formatDatePicker(order.date));
	$('#txtPriceOrderaEdit').val(order.price);
	$('#txtCustomerOrderaEdit').val(order.customer);
	$('#txtStatusOrderaEdit').val(order.orderStatus);
}

// Za popunjavanje podataka o restoranu u tabeli sa poruzbinama
function getRestaurants() {
	$.get({
		url: "../rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			allRestaurants = restaurants;
		}
	});
}

function deliverOrderById(orderId){
	console.log("ID ordera koji zelimo dostaviti: " + orderId);

	
	$.ajax({
		type: "PUT",
		url: "../rest/order/deliverOrder/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(){
			alert("Uspesno zatrazena dostava narudzbine");
		},
		error: function(message) {
			alert(message);
		}
	});
}

function setDeliveryStatusOrderById(orderId) {
	console.log("ID ordera koji smo dostavili: " + orderId);

	$.ajax({
		type: "PUT",
		url: "../rest/order/deliverOrder/setDelivered/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(){
			alert("Uspesno dostavljena narudzbina");
		},
		error: function(message) {
			alert(message);
		}
	});
}


//SORTIRANJE ###############################################################
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
			$("#imageSortPrice").attr("src", "./images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortPriceDesc = true;
			$("#imageSortPrice").attr("src", "./images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
				$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
						setDeliveryStatusOrderById(order.orderId);
				});
		}

	});
	
	$("#sortPriceAll").click(function(){
		$("#tableAllOrders").empty();

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
		if(sortPriceDesc2) {
			sortPriceDesc2 = false;
			$("#imageSortPrice2").attr("src", "../images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortPriceDesc2 = true;
			$("#imageSortPrice2").attr("src", "../images/sort-down.png");
		}
		for(let order of shownOrders) {
			addPickupOrderInTable(order);
				$(document).on("click", "#deliverOrder" + order.orderId, function() {
						deliverOrderById(order.orderId);
				});
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
			$("#imageSortDate").attr("src", "../images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortDateDesc = true;
			$("#imageSortDate").attr("src", "../images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
				$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
						setDeliveryStatusOrderById(order.orderId);
				});
		}

	});
	
	$("#sortDateAll").click(function(){
		$("#tableAllOrders").empty();

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
		if(sortDateDesc2) {
			sortDateDesc2 = false;
			$("#imageSortDate2").attr("src", "../images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortDateDesc2 = true;
			$("#imageSortDate2").attr("src", "../images/sort-down.png");
		}
		for(let order of shownOrders) {
			addPickupOrderInTable(order);
				$(document).on("click", "#deliverOrder" + order.orderId, function() {
						deliverOrderById(order.orderId);
				});
		}

	});
}

function sortOrdersByCustomer(){

 	$( "#sortCustomer").click(function() {
 		
		$("#tableOrders").empty();

		console.log("Usao u sortCustomer");

		if(sortCustomerDesc) {
			shownOrders.sort(function(a, b){
			    if(a.customer < b.customer) { return -1; }
			    if(a.customer > b.customer) { return 1; }
			    return 0;
			});
			sortCustomerDesc = false;
			$("#imageSortCustomer").attr("src", "../images/sort-down.png");
		} else {
			shownOrders.sort(function(a, b){
			    if(a.customer > b.customer) { return -1; }
			    if(a.customer < b.customer) { return 1; }
			    return 0;
			});
			sortCustomerDesc = true;
			$("#imageSortCustomer").attr("src", "../images/sort-up.png");
		}
 		
 		
 		for(let order of shownOrders) {
			addOrderInTable(order);
			console.log("ORDER ID: " + order.orderId);
				$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
						setDeliveryStatusOrderById(order.orderId);
				});
		}
 		
	});
	
	$( "#sortCustomerAll").click(function() {
 		
		$("#tableAllOrders").empty();

		console.log("Usao u sortCustomerAll");

		if(sortCustomerDesc2) {
			shownOrders.sort(function(a, b){
			    if(a.customer < b.customer) { return -1; }
			    if(a.customer > b.customer) { return 1; }
			    return 0;
			});
			sortCustomerDesc2 = false;
			$("#imageSortCustomer2").attr("src", "../images/sort-down.png");
		} else {
			shownOrders.sort(function(a, b){
			    if(a.customer > b.customer) { return -1; }
			    if(a.customer < b.customer) { return 1; }
			    return 0;
			});
			sortCustomerDesc2 = true;
			$("#imageSortCustomer2").attr("src", "../images/sort-up.png");
		}
 		
 		
 		for(let order of shownOrders) {
			addPickupOrderInTable(order);
			console.log("ORDER ID: " + order.orderId);
				$(document).on("click", "#deliverOrder" + order.orderId, function() {
						deliverOrderById(order.orderId);
				});
		}
 		
	});
}

//FILTRIRANJE ##############################################################
function filterOrdersByStatus() {
	$("#filterStatus").change(function(){
		$.get({
			url: "rest/order/deliverer/" + delivererUsername,
			contentType: "application/json",
			success: function(orders) {
				$("#tableOrders").empty();
				shownOrders = [];
				let status = $("#filterStatus option:selected").val();
				for (let order of orders) {					
					if((order.orderStatus === status) || status === "SVE") {
						addOrderInTable(order);
							$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
								setDeliveryStatusOrderById(order.orderId);
							});
						shownOrders.push(order);
					}
				}
			}
		});
	});
}


//SEARCH #################################################################
function searchOrders() {
	
	$("#formSearchOrders").submit(function (event){
		event.preventDefault();
		let sDate = $("#searchStartDate").val();
		let eDate = $("#searchEndDate").val();
		var startDate;
		var endDate;
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
				$("#tableOrders").empty();
				for (let order of orders) {
					addOrderInTable(order);
					$(document).on("click", "#setDeliveryStatusOrdera" + order.orderId, function() {
							setDeliveryStatusOrderById(order.orderId);
					});
				}
				shownOrders = orders;
			},
			error: function(message){
				alert(message);
			}
		})
	});
}

function searchAllOrders() {
	
	$("#formSearchAllOrders").submit(function (event){
		event.preventDefault();
		let sDate = $("#searchStartDateAll").val();
		let eDate = $("#searchEndDateAll").val();
		var startDate;
		var endDate;
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
			restaurant: $("#searchRestaurantAll").val(),
			minPrice: $("#searchMinPriceAll").val(),
			maxPrice: $("#searchMaxPriceAll").val(),
			startDate: startDate,
			endDate: endDate
		};
		
		$.get({
			url: "rest/order/search/pickup",
			data: queryParams,
			success: function(orders){
				// Prvo brisem postojece narudzbine iz tabele pa dodajem filtrirane - pretraga
				$("#tableAllOrders").empty();
				for (let order of orders) { 
					addPickupOrderInTable(order);
					//console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#deliverOrder" + order.orderId, function() {
							deliverOrderById(order.orderId);
					});
				}
				shownOrders = orders;
			},
			error: function(message){
				alert(message);
			}
		})
	});
}




//GLOBALNE PROMENLJIVE
var delivererUsername;
var shownOrders;
var allRestaurants;

var sortPriceDesc;
var sortDateDesc;
var sortPriceDesc2;
var sortDateDesc2;
var sortCustomerDesc;
var sortCustomerDesc2;



$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	editAccount();
	getRestaurants();
	
	searchOrders();
	searchAllOrders();
	
	filterOrdersByStatus();
	
	sortOrdersByPrice();
	sortOrdersByDate();
	sortOrdersByCustomer();
	
	logout();
})