function changeView() {
	
	// Na početku su svi divovi sakriveni
	$("#divAddUser").hide();
	$("#divAllUsers").hide();
	$("#divAddRestaurant").hide();
	$("#divAddManager").hide();
	$("#divEditAccount").hide();
	
	$("#buttonAddUser").click(function(event){
		$("#divAddUser").show();
		$("#divAllUsers").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
	});
	
	$("#buttonAllUsers").click(function(event){
		$("#divAllUsers").show();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
	});
	
	$("#buttonAddRestaurant").click(function(event){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").show();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
	});

	$("#buttonEditAccount").click(function(event){
		getLoggedUserData();
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
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

// Svi korisnici koji su registrovani (sve role)
function getAllUsers(){
	$.get({
		url: "../rest/user/all",
		contentType: "application/json",
		success: function(users) {
			for(let user of users) {
				addUserInTable(user);
			}
			shownUsers = users;
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
			"<td>" + ((user.points === null) ? "/" : user.points) + "</td>" +
			"<td>" + ((user.customerType === null) ? "/" : user.customerType.customerTypeName) + "</td>";
	if (user.role === "ADMIN") {
		tr += "<td></td><tr>";
	} else {
		if (!user.blocked) {
			tr += "<td>" +  "<button id=\"" + user.username + "\" name=\"block\">Blokiraj</button>"  + "</td>" +
			"</tr>";
		} else {
			tr += "<td>" +  "<button id=\"" + user.username + "\" name=\"unblock\">Odblokiraj</button>"  + "</td>" +
			"</tr>";
		}
	}
	
	table.append(tr);

	if(user.role === "ADMIN") {
		$("#trUser").css("background-color", "aqua");
	}

}

//Dodavanje novog menadzera ili dostavljaca
function addManagerOrDeliverer() {
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
			success : function(user){
				alert("Uspešno dodat " + user.role + " " + user.firstName + " " + user.lastName);
				location.reload();
			},
			error: function(message){
				
			}
		});
		
	});

}

// Menadzeri koji ne upravljaju restoranima
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

function editAccount() {
	
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
	
	$("#formEdit").submit(function (event){
		$.ajax({
			type: "PUT",
			url: "../rest/user",
			data: JSON.stringify(user),
			contentType: "application/json",
			success: function(){
				alert("Uspesno izmenjeni podaci");
			},
			error: function() {}
		});
	});
}

function searchUsers() {
	
	$("#formSearchUsers").submit(function (event){
		event.preventDefault();
		let queryParams = {
			firstName: $("#searchFirstName").val(),
			lastName: $("#searchLastName").val(),
			username: $("#searchUsername").val()	
		};
		
		$.get({
			url: "../rest/user/search",
			//contentType: "application/x-www-form-urlencoded",
			data: queryParams,
			success: function(users){
				// Prvo brisem postojece korisnike iz tabele pa dodajem filtrirane - pretraga
				$("#tableUsers").empty();
				for (let user of users) {
					addUserInTable(user);
				}
				shownUsers = users;
			}
		})
	});
}

// SORTIRANJE

function sortUsersByUsername() {
	$("#sortUsername").click(function() {
		$("#tableUsers").empty();
		// selection sort
		// videti da li treba koristiti localeCompare
		for (var i = 0; i < shownUsers.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownUsers.length; j++) {
				if(shownUsers[j].username.toLowerCase() < shownUsers[i].username.toLowerCase())
					min_idx = j;
			}
			let temp = shownUsers[i];
			shownUsers[i] = shownUsers[min_idx];
			shownUsers[min_idx] = temp;
		}
		if(sortUsernameDesc) {
			sortUsernameDesc = false;
			$("#imageSortUsername").attr("src", "../images/sort-up.png");
		} else {
			shownUsers.reverse();
			sortUsernameDesc = true;
			$("#imageSortUsername").attr("src", "../images/sort-down.png");
		}
		for(let user of shownUsers) {
			addUserInTable(user);
		}

	});
}

function sortUsersByLastName() {
	$("#sortLastName").click(function() {
		$("#tableUsers").empty();
		for (var i = 0; i < shownUsers.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownUsers.length; j++) {
				if(shownUsers[j].lastName.toLowerCase() < shownUsers[i].lastName.toLowerCase())
					min_idx = j;
			}
			let temp = shownUsers[i];
			shownUsers[i] = shownUsers[min_idx];
			shownUsers[min_idx] = temp;
		}
		if(sortLastNameDesc) {
			sortLastNameDesc = false;
			$("#imageSortLastName").attr("src", "../images/sort-up.png");
		} else {
			shownUsers.reverse();
			sortLastNameDesc = true;
			$("#imageSortLastName").attr("src", "../images/sort-down.png");
		}
		for(let user of shownUsers) {
			addUserInTable(user);
		}
	});
}

function sortUsersByName() {
	$("#sortName").click(function() {
		$("#tableUsers").empty();
		for (var i = 0; i < shownUsers.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownUsers.length; j++) {
				if(shownUsers[j].firstName.toLowerCase() < shownUsers[i].firstName.toLowerCase())
					min_idx = j;
			}
			let temp = shownUsers[i];
			shownUsers[i] = shownUsers[min_idx];
			shownUsers[min_idx] = temp;
		}
		if(sortNameDesc) {
			sortNameDesc = false;
			$("#imageSortName").attr("src", "../images/sort-up.png");
		} else {
			shownUsers.reverse();
			sortNameDesc = true;
			$("#imageSortName").attr("src", "../images/sort-down.png");
		}
		for(let user of shownUsers) {
			addUserInTable(user);
		}
	});
}

function sortUsersByPoints() {
	$("#sortPoints").click(function() {
		$("#tableUsers").empty();
		// selection sort
		for (var i = 0; i < shownUsers.length - 1; i++) {
			var min_idx = i;
			for (var j = i + 1; j < shownUsers.length; j++) {
				if(shownUsers[j].points < shownUsers[i].points)
					min_idx = j;
			}
			let temp = shownUsers[i];
			shownUsers[i] = shownUsers[min_idx];
			shownUsers[min_idx] = temp;
		}
		if(sortPointsDesc) {
			sortPointsDesc = false;
			$("#imageSortPoints").attr("src", "../images/sort-up.png");
		} else {
			shownUsers.reverse();
			sortPointsDesc = true;
			$("#imageSortPoints").attr("src", "../images/sort-down.png");
		}
		for(let user of shownUsers) {
			addUserInTable(user);
		}
	});
}

// FILTRIRANJE

function filterUsersByRole() {
	$("#filterRole").change(function(){
		$.get({
			url: "../rest/user/all",
			contentType: "application/json",
			success: function(users) {
				$("#tableUsers").empty();
				shownUsers = [];
				let role = $("#filterRole option:selected").val();
				for (let user of users) {					
					if((user.role === role) || role === "SVI") {
						addUserInTable(user);
						shownUsers.push(user);
					}
				}
			}
		});
	});
}

function filterUsersByType() {
	$("#filterType").change(function(){
		$.get({
			url: "../rest/user/all",
			contentType: "application/json",
			success: function(users) {
				shownUsers = [];
				$("#tableUsers").empty();
				let role = $("#filterType option:selected").val();
				for (let user of users) {					
					if((user.role === role) || role === "SVI") {
						addUserInTable(user);
						shownUsers.push(user);
					}
				}
			}
		});
	});
}

function getLoggedUserData() {
	$.get({
		type: "GET",
		url: "../rest/loggedIn",
		dataType: "json",
		success: function(user) {
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

//Blokiranje korisnika
function blockUser() {
	// MORA OVAKO JER SE TABELA KREIRA DINAMICKI - korisitimo delegat!!!
	$(document).on('click', 'button[name="block"]', function(){
		console.log("USAOOOOOOOOOOO");
		let username = $(this).attr("id");
		$.ajax({
			url: "../rest/user/block/" + username,
			type: "PUT",
			success: function(data) {
				alert("Korisnik uspesno blokiran!");
				$("button[id='" + username + "']").css("color", "red");
			}
		});
	});
}

function unblockUser() {
	// MORA OVAKO JER SE TABELA KREIRA DINAMICKI - korisitimo delegat!!!
	$(document).on('click', 'button[name="unblock"]', function(){

		let username = $(this).attr("id");
		$.ajax({
			url: "../rest/user/unblock/" + username,
			type: "PUT",
			success: function(data) {
				alert("Korisnik uspesno odblokiran!");
				$("button[id='" + username + "']").css("color", "black");
			}
		});
	});
}

// GLOBALNE PROMENLJIVE

// Globalna promenljiva koja nam treba da znamo koji je restoran prethodno dodat
var restaurantId; 

// Svi sortovi su podrazumevano od veceg ka manjem
var sortUsernameDesc;
var sortNameDesc;
var sortLastNameDesc;
var sortPointsDesc;

// Svi trenutno prikazani korisnici  (na pregledu korisnika)
var shownUsers;

$(document).ready(function(){

	getAllUsers();
	searchUsers();
	changeView();
	
	addManagerOrDeliverer();
	getAllAvailableManagers();
	
	editAccount();
	sortUsersByUsername();
	sortUsersByName();
	sortUsersByLastName();
	sortUsersByPoints();
	filterUsersByRole();
	filterUsersByType();
	console.log($("#managerOfRestaurant option:selected").val());
	
	blockUser();
	unblockUser();
	
	sortUsernameDesc = true;
	sortNameDesc = true;
	sortLastNameDesc = true;
	sortPointsDesc = true;
	
	// Slide up/down za search
	$("#buttonSearch").click(function(){
		$("#divSearchUsers").slideToggle();
	});
	
		
	// Dodavanje novog restorana
	$("#formAddRestaurant").submit(function(event){
		event.preventDefault();
		
		let name = $("#restaurantName").val();
		let type = $("#type option:selected").val();
		let latitude = $("#latitude").val();
		let longitude = $("#longitude").val();
		let city = $("#city").val();
		let country = $("#country").val();
		let streetAndNumber = $("#streetAndNumber").val();
		let postalCode = $("#postalCode").val();
		let image = $("#image").attr("src");
		
		let address = {
			streetAndNumber: streetAndNumber,
			city: city,
			country: country,
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
