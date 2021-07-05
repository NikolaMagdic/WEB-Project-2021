function changeView() {
	
	// Na početku su svi divovi sakriveni
	$("#divAddUser").hide();
	$("#divAllUsers").hide();
	$("#divAddRestaurant").hide();
	$("#divAddManager").hide();
	
	$("#buttonAddUser").click(function(event){
		$("#divAddUser").show();
		$("#divAllUsers").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
	});
	
	$("#buttonAllUsers").click(function(event){
		$("#divAllUsers").show();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
	});
	
	$("#buttonAddRestaurant").click(function(event){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").show();
		$("#divAddManager").hide();
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
	}

}

function getAllAvailableManagers() {
	$.get({
		url: "../rest/user/available-managers",
		contentType: "application/json",
		success: function(managers){
			for (let manager of managers){
				addManagerInDropDown(manager);
			}
		}
	});
}

function addManagerInDropDown(manager) {
	let select = $("#managerOfRestaurant");
	let option = "<option value=" + 
				manager.username + ">" + 
				manager.firstName + " " + 
				manager.lastName + 
				"</option>";
	select.append(option);
}

// Globalna promenljiva koja nam treba da znamo koji je restoran prethodno dodat
var restaurantId; 

$(document).ready(function(){
	
	getAllUsers();
	changeView();
	getAllAvailableManagers();
	
	console.log($("#managerOfRestaurant option:selected").val());
	
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
	
	// Dodavanje novog restorana
	$("#formAddRestaurant").submit(function(event){
		event.preventDefault();
		
		let name = $("#restaurantName").val();
		let type = $("#type option:selected").val();
		let latitude = $("#latitude").val();
		let longitude = $("#longitude").val();
		let city = $("#city").val();
		let streetAndNumber = $("#streetAndNumber").val();
		let postalCode = $("#postalCode").val();
		let image = $("#image").attr("src");
		
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
		
		let manager = $("#managerOfRestaurant option:selected").val();
		
		let data = {
			id: 0,
			name: name,
			restaurantType: type,
			open: true,
			location: location,
			image: image
		}
		console.log(data);
				
		$.post({
			url: "../rest/restaurant/",
			headers: { "Manager-Username":  manager},
			data: JSON.stringify(data),
			contentType: "application/json",
			success : function(restaurant){
				if(manager === undefined) {
					$("#divAllUsers").hide();
					$("#divAddUser").hide();
					$("#divAddRestaurant").hide();
					$("#divAddManager").show();
					restaurantId = restaurant.id;
					console.log(restaurantId);
				}
				alert("Uspešno dodat restoran");
			},
			error: function(message){
				
			}
		});
		
	});
	
	// Prikaz dodate slike za restoran
	$("#restaurantImage").change(function(e){
		
		let file = e.target.files[0]
		
		var reader = new FileReader();
		
		reader.readAsDataURL(file);
		
		reader.onload = e => {
			$('#image').attr("src",  e.target.result);
		}

	});
	
	// Dodavanje novog menadzera automatski povezanog sa restoranom
	$("#formAddManager").submit(function(event){
		event.preventDefault();
		
		let username = $("#managerUsername").val();
		let password = $("#managerPassword").val();
		let name = $("#managerName").val();
		let lastName = $("#managerLastName").val();
		let male = $("#managerMale:checked").val();
		let date = $("#managerDate").val();
		
		let role = "MENADZER";
		let restaurant = restaurantId;
		
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
			role: role,
			restaurant: restaurant
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
	
	// Logout
	$("#buttonLogout").click(function(event){
		$.get({
			url: "../rest/logout",
			contentType: "application/json",
			success: function(message){
				alert("Uspešno ste se odjavili");
				window.location = "../index.html"
			}
		});
	});

	
	
});
