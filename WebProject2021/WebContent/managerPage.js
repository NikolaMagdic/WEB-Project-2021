function initHide(){
	$("#divRestaurantDetails").hide();
	$("#divEditAccount").hide();
	$("#divRestaurantArticles").hide();
	$("#divRestaurantComments").hide();
	$("#divArticleDetails").hide();
	$("#divEditArticle").hide();
	$("#divAddArticle").hide();
	$("#divOrders").hide();
	$("#divSearchOrders").hide();
	$("#divEditOrder").hide();
	$("#divRequestOrders").hide();
	$("#divSearchRequestOrders").hide();
}


function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	$("#buttonMyRestaurant").click( function(){
		getManagerUsername();
		getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").show();
		$("#divRestaurantArticles").show();
		$("#divRestaurantComments").show();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	
	$(document).on("click", "button[name = 'detaljiArticla']", function(){
		//getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").show();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	
	$("#buttonEditArticle").click( function(){
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").show();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	}); 
	$("#buttonAddArticle").click( function(){
		getRestaurantByManager();
		getManagerUsername();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").show();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	
	$("#buttonOrders").click(function(event){
		getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").show();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	
	$("#buttonSearch").click(function(event){
		getRestaurantByManager();
		getManagerUsername();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").show();
		$("#divSearchOrders").show();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});
	
	$(document).on("click", "button[name = 'detaljiOrdera']", function(){
		//getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divRestaurantComments").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").show();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	});  
	
	$("#buttonRequests").click(function(event){
		getRestaurantByManager();
		getManagerUsername();
		//getRestaurantRequestOrders();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide(); divRequestOrders
		$("#divRequestOrders").show();
		$("#divSearchRequestOrders").hide();
	});
	
	$(document).on("click", "button[name = 'approveOrder']", function(){
		getRestaurantByManager();
		//getRestaurantRequestOrders();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").show();
		$("#divSearchRequestOrders").hide();
	});
		 
	$(document).on("click", "button[name = 'rejectOrder']", function(){
		getRestaurantByManager();
		//getRestaurantRequestOrders();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").show();
		$("#divSearchRequestOrders").hide();
	}); 
	
	$("#buttonSearchRequest").click(function(event){
		getRestaurantByManager();
		//getRestaurantRequestOrders();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").show();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").show();
		$("#divSearchRequestOrders").show();
	});  
	
	$(document).on("click", "button[name = 'obrisiArtical']", function(){
		getManagerUsername();
		getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").show();
		$("#divRestaurantArticles").show();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
		$("#divEditOrder").hide();
		$("#divRequestOrders").hide();
		$("#divSearchRequestOrders").hide();
	}); 
}

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

function getManagerUsername(){
	$.get({
		type: "GET",
		url: "./rest/loggedIn",
		dataType: "json",
		success: function(user) {
			managerUsername = user.username;
		}
	})
}

function getRestaurantByManager(){
	$.ajax({
		
		type: "GET",
		url: './rest/user/manager/' + managerUsername,
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
			
			$('#tableArticles tbody').empty();
			
			//mora ici OF umesto IN da bi zapravo uzeo vrednost u listi
			for(let articleId of res.articles) {
				addArticleInTable(articleId);
					$(document).on("click", "#detaljiArticla" + articleId, function() {
						getArticleById(articleId);
					});
					$(document).on("click", "#obrisiArtical" + articleId, function() {
						deleteArticleById(articleId);
					});
			}
			
			restaurantId = res.id;
			console.log("Postavljamo globalnu promenljivu restaurantId na: " + restaurantId);
			
			getRestaurantOrders(res.id);
			getRestaurantRequestOrders(res.id);
			getRestaurantComments(res.id);
			
			shownArticles = res.articles;
		}
	});	
}

function addArticleInTable(articleId) {
	let table = $("#tableArticles");
	
	
	$.get({
		type: "GET",
		url: "./rest/article/Id/" + articleId,
		dataType: "json",
		success: function(article) {
			
			console.log("ARTICLE IMA IMAGE: " + article.image);

			let tr = "<tr id=\"trArticle\">" +
					"<td class=\"tdTable\">" + article.name + "</td>" +
					"<td class=\"tdTable\">" + article.price + "</td>" +
					"<td class=\"tdTable\">" + article.type + "</td>" +
					"<td class=\"tdTable\">" + article.amount + "</td>" +
					"<td class=\"tdTable\">" + article.description + "</td>" +
					"<td><image alt='' src='" + article.image + "' width='50px' height='50px'></td>" +
					" <td> <button id='detaljiArticla" + article.id + "' class='buttonDetails' name='detaljiArticla'> Details </button></td>" +
					" <td> <button id='obrisiArtical" + article.id + "' class='buttonDelete' name='obrisiArtical'> Delete </button></td>" +
					"</tr>";
			table.append(tr);
		}
	})


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

function deleteArticleById(orderId) {
	console.log("ID articla koji brisemo: " + orderId);

	$.ajax({
		type: "PUT",
		url: "./rest/article/deleteArticle/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(){
			getManagerUsername();
			getRestaurantByManager();
			alert("Uspesno obrisan artikal");
		},
		error: function(message) {
			alert(message);
		}
	});
}

function isArticleDeleted(orderId) {
	console.log("ID articla za koji proveravamo da li je obrisan: " + orderId);
	articleDeleted = false;
	
	$.ajax({
		type: "GET",
		url: "./rest/article/isDeleted/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(deleted){
			//console.log("Funkcija isDeleted nam vraca vrednost" + deleted);
			articleDeleted = deleted;
			console.log("Funkcija isDeleted nam vraca vrednost" + deleted+", articleDeleted je sada:" + articleDeleted);
		},
		error: function(message) {
			alert(message);
		}
	});
}


// KOMENTARI

function getRestaurantComments(restaurantId) {
	$("#tableComments").empty();
	$.ajax({
		type: "GET",
		url: 'rest/comment/' + restaurantId,
		contentType: 'application/json',
		success: function(comments) {
	    	for(let comment of comments) {
				addRestaurantComments(comment);
			}
		}
	});	
}

function addRestaurantComments(comment) {
	let tr = "<tr>" +
	"<td>" + comment.customer + "</td> " +
	"<td>" + comment.text + "</td> " +
	"<td>" + comment.grade + "</td> ";
	
	if(!comment.accepted) {
		tr = tr + 	"<td><button class='approve-comment' id='" + comment.id + "'>Approve Comment</button></td> " +
					"</tr>"
	} else {
		tr = tr + "<td></td></tr>"
	}
	
	
	$("#tableComments").append(tr);
}

// Odobravanje komentara od strane menadzera
function approveComment() {
	$(document).on('click', '.approve-comment', function(){
		let commentId = $(this).attr("id");
		
		$.ajax({
			url: "rest/comment/" + commentId,
			type: "PUT",
			contentType: "application/json",
			success: function() {
				alert("Comment is approved");
				location.reload();
				$()
			}
		});
		
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


function getLoggedUserData() {
	$.get({
		type: "GET",
		url: "./rest/loggedIn",
		dataType: "json",
		success: function(user) {
			managerUsername = user.username;
			
			
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
		event.preventDefault();
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

function setSelectedArticleData(article) {
	$('#txtIdArticlaEdit').val(article.id);
	$('#txtNameArticlaEdit').val(article.name);
	$('#txtPriceArticlaEdit').val(article.price);
	$('#txtTypeArticlaEdit').val(article.type);
	$('#txtAmountArticlaEdit').val(article.amount);
	$('#txtDescriptionArticlaEdit').val(article.description);
	$('#txtImageArticlaEdit').val(article.image);
}


function editArticle() {
	$("#formEditArticle").submit(function (event){
		event.preventDefault();
		let id = $("#txtIdArticlaEdit").val();
		let name = $("#txtNameArticlaEdit").val();
		let price = $("#txtPriceArticlaEdit").val();
		let type = $("#txtTypeArticlaEdit").val();
		let amount = $("#txtAmountArticlaEdit").val();
		let description = $("#txtDescriptionArticlaEdit").val();
		let image = $("#txtImageArticlaEdit").val();
		
		
		
		let newArticle = {
			id: id,
			name: name,
			price: price,
			type: type,
			amount: amount,
			description: description,
			image: image
		}
		
		$.ajax({
			type: "PUT",
			url: "rest/article/edit",
			data: JSON.stringify(newArticle),
			contentType: "application/json",
			success: function(){
				alert("Uspesno izmenjeni podaci artikla");
			},
			error: function(message) {
				alert(message);
			}
		});
	});	
}

function addArticle() {
	$("#formAddArticle").submit(function (event){
		event.preventDefault();
		let id = 0;
		let name = $("#txtNameArticlaAdd").val();
		let price = $("#txtPriceArticlaAdd").val();
		let type = $("#typeArticlaAdd option:selected").val();
		let amount = $("#txtAmountArticlaAdd").val();
		let description = $("#txtDescriptionArticlaAdd").val();
		let image = $("#txtImageArticlaAdd").attr("src");
		
		
		if(name == ""){
			alert("Name field is empty!");
			return;
		}
		
		if(price == ""){
			alert("Price field is empty!");
			return;
		}
		
		
		
		let newArticle = {
			id: id,
			name: name,
			price: price,
			type: type,
			amount: amount,
			description: description,
			image: image
		}
		
		console.log(newArticle);
		
		$.ajax({
			type: "POST",
			url: "rest/article/add/" + restaurantId,
			data: JSON.stringify(newArticle),
			contentType: "application/json",
			success: function(){
				alert("Uspesno dodat artikal");
			},
			error: function(message) {
				alert(message);
			}
		});
	});
	
}

//ORDERI###################################################################################
function getRestaurantOrders(id) {
	console.log("Usao u restaurantOrders za restaurantId:" + id);
	$("#tableOrders").empty();
	$.get({
		url: "rest/order/restaurant/" + id,
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				//console.log("ORDER: " + order);
				addOrderInTable(order);
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
	
	let tr = "<tr>" +
			"<td>" + order.price + "</td>" +
			"<td>" + formatDate(order.date) + "</td>" +
			"<td>" + order.customer + "</td>" +
			"<td>" + order.orderStatus + "</td>" +
			"<td><button id='detaljiOrdera" + order.orderId + "' class='buttonDetails' name='detaljiOrdera'>Edit</button></td>" +
			"</tr>";
	
	table.append(tr);
	
} 

function getOrderById(orderId){
	//event.preventDefault();
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

function editOrder() {
	$("#formEditOrder").submit(function (event){
		event.preventDefault();
		let orderId = $("#txtIdOrderaEdit").val();
		let date = $("#txtDateOrderaEdit").val();
		let price = $("#txtPriceOrderaEdit").val();
		let customer = $("#txtCustomerOrderaEdit").val(); 
		let orderStatus = $("#txtStatusOrderaEdit  option:selected").val(); 


		let newOrder = {
			orderId: orderId,
			date: date,
			price: price,
			customer: customer,
			orderStatus: orderStatus
		}
		
		$.ajax({
			type: "PUT",
			url: "rest/order/edit",
			data: JSON.stringify(newOrder),
			contentType: "application/json",
			success: function(){
				alert("Uspesno izmenjeni podaci narudzbine");
			},
			error: function(message) {
				alert(message);
			}
		});
	});	
}

//Request Orders - APROVE/REJECT #######################################
function getRestaurantRequestOrders(id) {
	console.log("Usao u getRestaurantRequestOrders za restaurantId:" + id);
	$("#tableRequestOrders").empty();
	$.get({
		url: "rest/order/forPickup/restaurant/" + id,
		contentType: "application/json",
		success: function (orders) {
			for(let order of orders) {
				addRequestOrderInTable(order);
				//console.log("ORDER ID: " + order.orderId);
					$(document).on("click", "#approveOrder" + order.orderId, function() {
							approveOrderById(order.orderId);
					});
					$(document).on("click", "#rejectOrder" + order.orderId, function() {
							rejectOrderById(order.orderId);
					});
			}
			shownOrders = orders;
		}
	});
}

function addRequestOrderInTable(order) {
	let table = $("#tableRequestOrders");
	
	let tr = "<tr>" +
			"<td>" + order.price + "</td>" +
			"<td>" + formatDate(order.date) + "</td>" +
			"<td>" + order.customer + "</td>" +
			"<td>" + order.orderDeliveryStatus + "</td>" +
			"<td><button id='approveOrder" + order.orderId + "' class='buttonDetails' name='approveOrder'>Approve</button></td>" +
			"<td><button id='rejectOrder" + order.orderId + "' class='buttonReject' name='detaljiOrdera'>Reject</button></td>" +
			"</tr>";
	
	table.append(tr);
	
} 

function approveOrderById(orderId){
	//event.preventDefault();
	console.log("ID ordera koji odobravamo: " + orderId);

	
	$.ajax({
		type: "PUT",
		url: "./rest/order/approveOrder/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(){
			//getRestaurantRequestOrders();
			alert("Uspesno odobrena dostava narudzbine");
		},
		error: function(message) {
			alert(message);
		}
	});
}

function rejectOrderById(orderId){
	//event.preventDefault();
	console.log("ID ordera koji odbijamo: " + orderId);

	
	$.ajax({
		type: "PUT",
		url: "./rest/order/reject/" + orderId,
		data: "",
		contentType: "application/json",
		success: function(){
			//getRestaurantRequestOrders();
			alert("Uspesno odbijena dostava narudzbine");
		},
		error: function(message) {
			alert(message);
		}
	});
}


// PRETRAGA - SEARCH ######################################################################
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
			minPrice: $("#searchMinPrice").val(),
			maxPrice: $("#searchMaxPrice").val(),
			startDate: startDate,
			endDate: endDate
		};
		
		$.get({
			url: "rest/order/search/" + restaurantId,
			data: queryParams,
			success: function(orders){
				// Prvo brisem postojece narudzbine iz tabele pa dodajem filtrirane - pretraga
				$("#tableOrders").empty();
				for (let order of orders) {
					addOrderInTable(order);
					$(document).on("click", "#detaljiOrdera" + order.orderId, function() {
							getOrderById(order.orderId);
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


function filterOrdersByStatus() {
	$("#filterStatus").change(function(){
		$.get({
			url: "rest/order/restaurant/" + restaurantId,
			contentType: "application/json",
			success: function(orders) {
				$("#tableOrders").empty();
				shownOrders = [];
				let status = $("#filterStatus option:selected").val();
				for (let order of orders) {					
					if((order.orderStatus === status) || status === "SVE") {
						addOrderInTable(order);
							$(document).on("click", "#detaljiOrdera" + order.orderId, function() {
								getOrderById(order.orderId);
							});
						shownOrders.push(order);
					}
				}
			}
		});
	});
}



// SORTIRANJE #############################################################################
function sortOrdersByPrice() {
	$("#sortPrice").click(function(){
		//event.preventDefault();
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
			//console.log("Menjam sortPriceDesc na " + sortPriceDesc);
			$("#imageSortPrice").attr("src", "./images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortPriceDesc = true;
			//console.log("Menjam sortPriceDesc na " + sortPriceDesc);
			$("#imageSortPrice").attr("src", "./images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
		}

	});
}

function sortOrdersByDate() {
	$("#sortDate").click(function(){
		//event.preventDefault();
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




//GLOBALNE PROMENLJIVE
//globalna promenljiva koja nam cuva username ulogovanog menadzera
var managerUsername;
var restaurantId; 

//Svi trenutno prikazani artikli 
var shownArticles;

var shownOrders;

var sortPriceDesc;
var sortDateDesc;

//sluzi za proveru da li je artikal obrisan
var articleDeleted;


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	getManagerUsername();
	//getRestaurantByManager();
	//getLoggedUserData();
	editAccount();
	editArticle();
	addArticle();
	
	editOrder(); 
	searchOrders();
	
	filterOrdersByStatus();
	
	sortOrdersByPrice();
	sortOrdersByDate();
	
	approveComment();
	
	logout();
	
	// Prikaz dodate slike za artikal
	$("#articleImage").change(function(e){
		
		let file = e.target.files[0]
		
		var reader = new FileReader();
		
		reader.readAsDataURL(file);
		
		reader.onload = e => {
			$('#txtImageArticlaAdd').attr("src",  e.target.result);
		}
	
	});
	
})