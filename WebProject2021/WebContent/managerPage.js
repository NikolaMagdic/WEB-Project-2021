function initHide(){
	$("#divRestaurantDetails").hide();
	$("#divEditAccount").hide();
	$("#divRestaurantArticles").hide();
	
}


function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divRestaurantDetails").hide();
		$("#divRestaurantArticles").hide();
	});
	$("#buttonMyRestaurant").click( function(){
		getManagerUsername();
		getRestaurantByManager();
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").show();
		$("#divRestaurantArticles").show();
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
			
			//mora ici OF umesto IN da bi zapravo uzeo vrednost u listi
			for(let articleId of res.articles) {
				console.log("ArticleId na koji dobijemo na frontu: " + articleId);
				addArticleInTable(articleId);
			}
			
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

			let tr = "<tr id=\"trArticle\">" +
					"<td ' class='tdTable'>" + article.name + "</td>" +
					"<td ' class='tdTable'>" + article.price + "</td>" +
					"<td ' class='tdTable'>" + article.type + "</td>" +
					"<td ' class='tdTable'>" + article.amount + "</td>" +
					"<td ' class='tdTable'>" + article.description + "</td>" +
					"<td ' class='tdTable'>" + article.image + "</td>" +
					" <td> <button id='detaljiArticla" + article.id + "' class='buttonDetails' name='detaljiArticla'> Details </button></td>" +
					"</tr>";
			table.append(tr);
		}
	})

	$("#tableArticles").css("background-color", "aqua");

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
			
			console.log("LoggedInData:");
			console.log(user.username);
			console.log(user.password);
			console.log(user.firstName);
			console.log(user.lastName);
			console.log(user.gender);
			console.log(user.birthDate);
			
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
			error: function() {}
		});
	});
	
}





//globalna promenljiva koja nam cuva username ulogovanog menadzera
var managerUsername; 

//Svi trenutno prikazani artikli 
var shownArticles;


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	getManagerUsername();
	//getLoggedUserData();
	editAccount();
	logout();
	
})