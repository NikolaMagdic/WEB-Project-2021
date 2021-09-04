function changeView() {
	$("#divCart").hide();
	$("#divOrders").hide();
	
	$("#buttonCart").click(function(event){
		$("#divCart").show();
		$("#divMyAccount").hide();
		$("#divOrders").hide();
		getCart();
	});

	$("#buttonOrders").click(function(event){
		$("#divCart").hide();
		$("#divMyAccount").hide();
		$("#divOrders").show();
		getMyOrders();
	});
	
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

// Shopping cart
function getCart() {
	$.get({
		url: "rest/cart",
		contentType: "application/json",
		success: function (cart) {
			for(let cartItem of cart.cartItems) {
				getArticle(cartItem.article);
			}
			userCart = cart;
			let tableFooter = $("#totalSum");
			let tr = "<tr><td colspan='4'>Ukupna cena: " + cart.price + "</td></tr>";
			tableFooter.append(tr);
		}
	});
}

function getArticle(cartItem) {
	$.get({
		url: "rest/article/one/" + cartItem,
		contentType: "application/json",
		success: function (article) {
			addArticleInTable(article);
		}
	});	
}


function addArticleInTable(article) {
	let table = $("#tableCart");
	
	let tr = "<tr>" +
			"<td>" + article.name + "</td>" +
			"<td>" + article.amount + "</td>" +
			"<td>" + article.price + "</td>" +
			"<td>" + "ovde ce biti slika" + "</td>" +
			"</tr>";
	
	table.append(tr);
		
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
	$.get({
		url: "rest/order",
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addOrderInTable(order);
			}
		}
	});
}

function addOrderInTable(order) {
	let table = $("#tableOrders");
	
	let tr = "<tr>" +
			"<td>" + order.restaurant + "</td>" +
			"<td>" + order.restaurant + "</td>" +
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

// GLOBALNE PROMENLJIVE

var userCart;

$(document).ready(function(){
	
	changeView();
	
	getLoggedInUser();
	
	logout();
	
	makeOrder();
	
	cancelOrder();
	
	// OVO JE SAMO POMOC
	var artikal1 = {
	    "article": 1,
	    "amount": 2
	}
	$.post({
		url: "rest/cart/add-to-cart/1",
		contentType: "application/json",
		data: JSON.stringify(artikal1),
		
	});
	var artikal2 = {
		    "article": 2,
		    "amount": 1
		}
	$.post({
		url: "rest/cart/add-to-cart/1",
		contentType: "application/json",
		data: JSON.stringify(artikal2),
	});
	// OBRISATI KADA SE URADI DODAVANJE ARTIKALA U KORPU
	
	// Show/hide edit form
	$("#editMenu").click(function(event){
		if($("#divMyAccount").css("display") == "none") {
			$("#divMyAccount").show();
		} else {
			$("#divMyAccount").hide();
		}
		
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