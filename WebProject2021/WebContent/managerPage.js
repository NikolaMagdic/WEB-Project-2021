function initHide(){
	$("#divRestaurantDetails").hide();
	$("#divEditAccount").hide();
}


function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
		$("#divRestaurantDetails").hide();
	});
	$("#buttonMyRestaurant").click( function(){
		$("#divEditAccount").hide();
		$("#divRestaurantDetails").show();
	});
}

function logout(){
 	$( "#logoutMenu").click(function() {
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
	
	let username = $("#usernameEdit").val();
	let password = $("#passwordEdit").val();
	let confirmPassword = $("#confirmPasswordEdit").val();
	let firstName = $("#nameEdit").val();
	let lastName = $("#lastNameEdit").val();
	let male = $("#maleEdit:checked").val();
	let date = $("#dateEdit").val();
	
	console.log("EditAccount:");
	console.log(username);
	console.log(password);
	console.log(confirmPassword);
	console.log(firstName);
	console.log(lastName);
	console.log(male);
	console.log(date);
	
	
	
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
	
	$("#formEdit").submit(function (event){
		$.ajax({
			type: "PUT",
			url: "./rest/user",
			data: JSON.stringify(user),
			contentType: "application/json",
			success: function(){
				alert("Uspesno izmenjeni podaci");
			},
			error: function() {}
		});
	});
}


var managerUsername; 


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	getLoggedUserData();
	editAccount();
	logout();
})