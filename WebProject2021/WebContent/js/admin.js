function changeView() {
	
	$("#divAddUser").hide();
	$("#divAllUsers").hide();
	$("#divAddRestaurant").hide();
	
	$("#buttonAddUser").click(function(event){
		$("#divAddUser").show();
		$("#divAllUsers").hide();
		$("#divAddRestaurant").hide();
	});
	
	$("#buttonAllUsers").click(function(event){
		$("#divAllUsers").show();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
	});
	
	$("#buttonAddRestaurant").click(function(event){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").show();
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

function getAllUsers(){
	$.get({
		url: "../rest/user/all",
		contentType: "application/json",
		success: function(users) {
			for(let user of users) {
				addUserInTable(user);
			}
		}
	});
}

function addUserInTable(user) {
	let table = $("#tableUsers");
	
	let gender;
	if (user.gender) {
		gender = "Muški";
	} else {
		gender = "Ženski";
	}

	let tr = "<tr id=\"trUser\">" +
			"<td>" + user.username + "</td>" +
			"<td>" + user.firstName + "</td>" +
			"<td>" + user.lastName + "</td>" +
			"<td>" + user.role + "</td>" +
			"<td>" + gender + "</td>" +
			"<td>" + formatDate(user.birthDate) + "</td>" + 
			"</tr>";
	table.append(tr);

	if(user.role === "ADMIN") {
		$("#trUser").css("background-color", "aqua");
		console.log("USAOOOOO");
	}

}


$(document).ready(function(){
	
	getAllUsers();
	changeView();
	
	$("divAddUser").hide();
	$("buttonAddUser").click(function(){
		$("divAddUser").show();
	});
	
	$("divAllUsers").hide();
	$("buttonAllUsers").click(function(){
		$("divAllUsers").show();
	});
	
	// Dodavanje novog menadzera ili dostavljaca
	$("#formAddUser").submit(function(event){
		event.preventDefault();
		
		let username = $("#username").val();
		let password = $("#password").val();
		let name = $("#name").val();
		let lastName = $("#lastName").val();
		let male = $("#male:checked").val();
		let date = $("#date").val();
		let role = $("#role option:selected").val();
		
		let gender;
		if(male) {
			gender = true;
		} else {
			gender = false;
		}
		
		let data = {
			username: username,
			password: password,
			firstName: name,
			lastName: lastName,
			gender: gender,
			birthDate: date,
			role: role
		}
		console.log(data);
		
		$.post({
			url: "../rest/user/add",
			data: JSON.stringify(data),
			contentType: "application/json",
			success : function(message){
				alert(message);
			},
			error: function(message){
				
			}
		});
		
	});
	
	// Dodavanje novog menadzera ili dostavljaca
	$("#formAddRestaurant").submit(function(event){
		event.preventDefault();
		
		let name = $("#restaurantName").val();
		let type = $("#type option:selected").val();
		let latitude = $("#latitude").val();
		let longitude = $("#longitude").val();
		let city = $("#city").val();
		let streetAndNumber = $("#streetAndNumber").val();
		let postalCode = $("#postalCode").val();
		
		let address = {
			streetAndNumber: streetAndNumber,
			city: city,
			postalCode: postalCode
		}
		
		let location = {
			latitude: latitude,
			longitude: longitude,
			address: address
		}
		
		let data = {
			id: 0,
			name: name,
			restaurantType: type,
			open: true,
			location: location,
		}
		console.log(data);
		
		$.post({
			url: "../rest/restaurant/add",
			data: JSON.stringify(data),
			contentType: "application/json",
			success : function(message){
				alert(message);
			},
			error: function(message){
				
			}
		});
		
	});

	
	
});
