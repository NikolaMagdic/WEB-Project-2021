function initHide(){
	$("#divRestaurantDetails").hide();
	$("#divEditAccount").hide();
	$("#divRestaurantArticles").hide();
	$("#divArticleDetails").hide();
	$("#divEditArticle").hide();
	$("#divAddArticle").hide();
	$("#divOrders").hide();
	$("#divSearchOrders").hide();
}


function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
	});
	$("#buttonMyRestaurant").click( function(){
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
	});
	
	$(document).on("click", "button[name = 'detaljiArticla']", function(){
		//getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").show();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
	});
	
	$("#buttonEditArticle").click( function(){
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").show();
		$("#divAddArticle").hide();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
	}); 
	$("#buttonAddArticle").click( function(){
		getRestaurantByManager();
		getManagerUsername();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").show();
		$("#divOrders").hide();
		$("#divSearchOrders").hide();
	});
	
	$("#buttonOrders").click(function(event){
		getRestaurantByManager();
		getManagerUsername();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").show();
		$("#divSearchOrders").hide();
		getRestaurantOrders();
	});
	
	$("#buttonSearch").click(function(event){
		getRestaurantByManager();
		getManagerUsername();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
		$("#divOrders").show();
		$("#divSearchOrders").show();
		getRestaurantOrders();
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
			}
			
			restaurantId = res.id;
			console.log("Postavljamo globalnu promenljivu restaurantId na: " + restaurantId);
			
			getRestaurantOrders(res.id);
			
			shownArticles = res.articles;
		}
	});	
}

function addArticleInTable(articleId) {
	event.preventDefault();
	let table = $("#tableArticles");
	
	
	$.get({
		type: "GET",
		url: "./rest/article/Id/" + articleId,
		dataType: "json",
		success: function(article) {

			let tr = "<tr id=\"trArticle\">" +
					"<td class=\"tdTable\">" + article.name + "</td>" +
					"<td class=\"tdTable\">" + article.price + "</td>" +
					"<td class=\"tdTable\">" + article.type + "</td>" +
					"<td class=\"tdTable\">" + article.amount + "</td>" +
					"<td class=\"tdTable\">" + article.description + "</td>" +
					"<td class=\"tdTable\"'>" + article.image + "</td>" +
					" <td> <button id='detaljiArticla" + article.id + "' class='buttonDetails' name='detaljiArticla'> Details </button></td>" +
					"</tr>";
			table.append(tr);
		}
	})


}

function getArticleById(articleId){
	event.preventDefault();
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
		let image = $("#txtImageArticlaAdd").val();
		
		
		if(name == ""){
			alert("Name field is empty!");
			return;
		}
		
		if(price == ""){
			alert("Price field is empty!");
			return;
		}
		
		if(image == ""){
			alert("Image field is empty!");
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


function getRestaurantOrders(id) {
	console.log("Usao u restaurantOrders za restaurantId:" + id);
	$("#tableOrders").empty();
	$.get({
		url: "rest/order/restaurant/" + id,
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
	
	let tr = "<tr>" +
			"<td>" + order.price + "</td>" +
			"<td>" + formatDate(order.date) + "</td>" +
			"<td>" + order.customer + "</td>" +
			"<td>" + order.orderStatus + "</td>" +
			"<td><button id='" + order.orderId + "' name='cancel'>Otkaži</button></td>" +
			"</tr>";
	
	table.append(tr);
	
} 


// PRETRAGA - SEARCH
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
						shownOrders.push(order);
					}
				}
			}
		});
	});
}



// SORTIRANJE
function sortOrdersByPrice() {
	$("#sortPrice").click(function(){
		event.preventDefault();
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
			console.log("Menjam sortPriceDesc na " + sortPriceDesc);
			$("#imageSortPrice").attr("src", "./images/sort-up.png");
		} else {
			shownOrders.reverse();
			sortPriceDesc = true;
			console.log("Menjam sortPriceDesc na " + sortPriceDesc);
			$("#imageSortPrice").attr("src", "./images/sort-down.png");
		}
		for(let order of shownOrders) {
			addOrderInTable(order);
		}

	});
}

function sortOrdersByDate() {
	$("#sortDate").click(function(){
		event.preventDefault();
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


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	getManagerUsername();
	//getLoggedUserData();
	editAccount();
	editArticle();
	addArticle();
	searchOrders();
	
	filterOrdersByStatus();
	
	sortOrdersByPrice();
	sortOrdersByDate();
	
	logout();
	
})