function initHide(){
	$("#divRestaurantDetails").hide();
	$("#divEditAccount").hide();
	$("#divRestaurantArticles").hide();
	$("#divArticleDetails").hide();
	$("#divEditArticle").hide();
	$("#divAddArticle").hide();
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
	});
	
	$(document).on("click", "button[name = 'detaljiArticla']", function(){
		//getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").show();
		$("#divEditArticle").hide();
		$("#divAddArticle").hide();
	});
	
	$("#buttonEditArticle").click( function(){
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").show();
		$("#divAddArticle").hide();
	}); 
	$("#buttonAddArticle").click( function(){
		getManagerUsername();
		getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
		$("#divArticleDetails").hide();
		$("#divEditArticle").hide();
		$("#divAddArticle").show();
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
	console.log("ID artikla za koji nam trebaju detalji: " + articleId);
	
	
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





//globalna promenljiva koja nam cuva username ulogovanog menadzera
var managerUsername;
var restaurantId; 

//Svi trenutno prikazani artikli 
var shownArticles;


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	getManagerUsername();
	//getLoggedUserData();
	editAccount();
	editArticle();
	addArticle();
	logout();
	
})