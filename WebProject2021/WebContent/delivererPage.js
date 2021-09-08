function initHide(){
	$("#divEditAccount").hide();
	$("#divOrders").hide();
	$("#divAllOrders").hide();
}

function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divOrders").hide();
		$("#divAllOrders").hide();
	});
	
	$("#buttonMyOrders").click(function(){
		getLoggedUserData();
		getDelivererUsername();
		$("#divEditAccount").hide();
		$("#divOrders").show();
		$("#divAllOrders").hide();
	}); 
	
	$("#buttonPickupOrders").click(function(){
		getPickupOrders();
		$("#divEditAccount").hide();
		$("#divOrders").hide();
		$("#divAllOrders").show();
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
 			url: './rest/logout',
 			contentType: 'application/json',
 			success: function() {
				alert("Uspešno ste se odjavili");
 				window.location = "./index.html";
 			}
 		});
 		
	});
}

function getLoggedUserData() {
	$.get({
		type: "GET",
		url: "./rest/loggedIn",
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
			url: "rest/user",
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
		url: "./rest/loggedIn",
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
		url: "rest/order/deliverer/" + username,
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addOrderInTable(order);
				//console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#detaljiOrdera" + order.orderId, function() {
							getOrderById(order.orderId);
					});
			}
			shownOrders = orders;
		}
	});
}

function getPickupOrders() {
	$("#tableAllOrders").empty();
	$.get({
		url: "rest/order/forPickup",
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addPickupOrderInTable(order);
				//console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#detaljiOrdera" + order.orderId, function() {
							getOrderById(order.orderId);
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
			"<td><button id='detaljiOrdera" + order.orderId + "' class='buttonDetails' name='detaljiOrdera'>Edit</button></td>" +
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
			"<td><button id='detaljiOrdera" + order.orderId + "' class='buttonDetails' name='detaljiOrdera'>Edit</button></td>" +
			"</tr>";
	
	table.append(tr);
} 

function getOrderById(orderId){
	event.preventDefault();
	//console.log("ID ordera za koji nam trebaju detalji: " + orderId);
	
	
	$.get({
		type: "GET",
		url: "./rest/order/" + orderId,
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
		url: "rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			allRestaurants = restaurants;
		}
	});
}


//SORTIRANJE 

//FILTRIRANJE

//SEARCH


//GLOBALNE PROMENLJIVE
var delivererUsername;
var shownOrders;
var allRestaurants;


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	editAccount();
	getRestaurants();
	
	logout();
})