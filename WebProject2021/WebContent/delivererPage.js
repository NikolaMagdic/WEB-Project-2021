function initHide(){
	$("#divEditAccount").hide();
}

function initShowButtons(){
	$("#buttonEditAccount").click( function(){
		getLoggedUserData();
		$("#divEditAccount").show();
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



//GLOBALNE PROMENLJIVE
var delivererUsername;


$(document).ready(function(){
	initHide();	
	initShowButtons();
	
	editAccount();
	
	logout();
})