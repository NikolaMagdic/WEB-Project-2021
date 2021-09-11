function changeView() {
	
	// Na početku su svi divovi sakriveni
	$("#divAddUser").hide();
	$("#divAllUsers").hide();
	$("#divAddRestaurant").hide();
	$("#divRestaurants").hide();
	$("#divRestaurantDetails").hide();
	$("#divAddManager").hide();
	$("#divEditAccount").hide();
	
	$("#buttonAddUser").click(function(event){
		$("#divAddUser").show();
		$("#divAllUsers").hide();
		$("#divAddRestaurant").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
	});
	
	$("#buttonAllUsers").click(function(event){
		$("#divAllUsers").show();
		$("#divAddUser").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		$("#divAddRestaurant").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
	});
	
	$("#buttonAddRestaurant").click(function(event){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").show();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
		
		// Mape
		$("#map").empty();
		var map = new ol.Map({
		    target: 'map',
		    layers: [
		      new ol.layer.Tile({
		        source: new ol.source.OSM()
		      })
		    ],
		    view: new ol.View({
		      center: ol.proj.fromLonLat([19.81, 45.25 ]),
		      zoom: 12
		    })
		 });
		
		map.on('singleclick', function(event){
			console.log(event.coordinate);
			coords = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
			$("#latitude").val(coords[1]);
			$("#longitude").val(coords[0]);
		
		});
	});

	$("#buttonEditAccount").click(function(event){
		getLoggedUserData();
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").show();
	});
	
	$("#buttonRestaurants").click(function(event){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divRestaurants").show();
		$("#divRestaurantDetails").hide();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
		getAllRestaurants();
	});
	
	$(document).on("click", ".button-details", function(){
		$("#divAllUsers").hide();
		$("#divAddUser").hide();
		$("#divAddRestaurant").hide();
		$("#divRestaurants").hide();
		$("#divRestaurantDetails").show();
		$("#divAddManager").hide();
		$("#divEditAccount").hide();
		let id = $(this).attr("id");
		getRestaurantDetails(id);

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

	let tr = "<tr class='tr-user' id='" + user.username + "'>" +
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
			tr += "<td>" +  "<button id=\"" + user.username + "\" name=\"block\" class='button-block'>Blokiraj</button>"  + "</td>" +
			"</tr>";
		} else {
			tr += "<td>" +  "<button id=\"" + user.username + "\" name=\"unblock\" class='button-unblock'>Odblokiraj</button>"  + "</td>" +
			"</tr>";
		}
	}
	
	table.append(tr);

	if(user.numberOfCancellations > 5) {
		$("#" + user.username + ".tr-user").css("background-color", "red");
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
		if(sortFirstNameDesc) {
			sortFirstNameDesc = false;
			$("#imageSortFirstName").attr("src", "../images/sort-up.png");
		} else {
			shownUsers.reverse();
			sortFirstNameDesc = true;
			$("#imageSortFirstName").attr("src", "../images/sort-down.png");
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
				alert("User is blocked!");
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
				alert("User is unblocked!");
				$("button[id='" + username + "']").css("color", "black");
			}
		});
	});
}

// RESTORANI
function getAllRestaurants(){
	$("#tableRestaurants").empty();
	$.get({
		url: "../rest/restaurant/all",
		contentType: "application/json",
		success: function(restaurants) {
			for(let restaurant of restaurants) {
				addRestaurantInTable(restaurant);
			}
			shownRestaurants = restaurants;
		}
	});
}

function addRestaurantInTable(restaurant) {
	let table = $("#tableRestaurants");

	let tr = "<tr id=\"trRestaurant\">" +
			"<td>" + restaurant.name + "</td>" +
			"<td><img alt='' src='../" + restaurant.image + "' width='100px' height='100px'></td>" +
			"<td>" + restaurant.type + "</td>" +
			"<td>" + restaurant.open + "</td>" +
			"<td>" + restaurant.city + "</td>" +
			"<td>" + restaurant.country + "</td>" +
			"<td>" + restaurant.rating + "</td>" +
			" <td> <button id='" + restaurant.id + "' class='button-details'> Details </button></td>" +
			"</tr>";
	table.append(tr);

}

function getRestaurantDetails(restaurantId) {
	getRestaurantArticles(restaurantId);
	getRestaurantComments(restaurantId);
	$.ajax({
		type: "GET",
		url: '../rest/restaurant/' + restaurantId,
		contentType: 'application/json',
		success: function(restaurant) {
			console.log(restaurant.image);
			$('#h1Restaurant').text("Restaurant " + restaurant.name);
			$('#tdRestaurantId').text(restaurant.id);
			$('#tdRestaurantName').text(restaurant.name);
			$('#tdRestaurantCity').text(restaurant.city);
			$('#tdRestaurantStreet').text(restaurant.address);
			$('#tdRestaurantCountry').text(restaurant.country);
			$('#tdRestaurantType').text(restaurant.type);
			$('#tdRestaurantStatus').text(restaurant.open);
			$('#tdRestaurantRating').text(restaurant.rating);
			$('#imgRestaurantLogo').attr("src", "../" + restaurant.image);
			$('#imgRestaurantLogo').attr("height", "150px");
			$('#imgRestaurantLogo').attr("width", "200px");
			
		}
	});
}

// Artikli u izabranom restoranu	
function getRestaurantArticles(restaurantId) {
	$("#tableArticles").empty();
	$.ajax({
		
		type: "GET",
		url: '../rest/article/' + restaurantId,
		contentType: 'application/json',
		success: function(articles) {
	    	for(let article of articles) {
				addRestaurantArticles(article);
			}
		}
	});
}

function addRestaurantArticles(article){
	let c = "<tr>" +
	" <td>" + article.name + "</td> " +
	" <td><img src='../" + article.image + "'alt='" + article.image + "'  width='100px' height='100px'></td> " +
	" <td>" + article.description + "</td> " +
	" <td>" + article.price + "</td> " +
	"</tr>"
	
	$("#tableArticles").append(c);
}

// Komentari za izabrani arikal
function getRestaurantComments(restaurantId) {
	$("#tableComments").empty();
	$.ajax({
		type: "GET",
		url: '../rest/comment/' + restaurantId,
		contentType: 'application/json',
		success: function(comments) {
	    	for(let comment of comments) {
				addRestaurantComments(comment);
			}
		}
	});	
}

function addRestaurantComments(comment){
	let tr = "<tr>" +
	" <td>" + comment.customer + "</td> " +
	" <td>" + comment.text + "</td> " +
	" <td>" + comment.grade + "</td> " +
	"</tr>"
	
	$("#tableComments").append(tr);
}

//RESTORANI PRETRAGA SORTIRANJE I FILTRIRANJE
function search(){	
 	$("#formSearchRestaurants").submit(function() {
 		
 		event.preventDefault();
 		$("#tableRestaurants").empty();

 		var name = $("#searchRestaurantsName");
 		var type = $("#searchRestaurantsType");
 		var city = $("#searchRestaurantsCity");
 		var rating = $("#searchRestaurantsRating");

 		//console.log(checkInTime.val());
 		var filter = new Object();
 		
 		if(name.val() == ""){
 			filter.name = null;
 		} else filter.name = name.val();
 		
 		if(type.val() == ""){
 			filter.type = null;
 		} else filter.type = type.val();
 		
 		if(city.val() == ""){
 			filter.city = null;
 		} else filter.city = city.val();
 		
 		if(rating.val() == ""){
 			filter.rating = null;
 		} else filter.rating = rating.val();
 		
 		
 		
 		console.log(filter);
 		$.ajax({
 			type: "POST",
 			url: '../rest/restaurant/search',
			data : JSON.stringify(filter),
 			contentType: 'application/json',
 			success: function(restaurants) {
 				console.log(restaurants);
				shownRestaurants = [];
 		    	for(let res of restaurants) {
 					addRestaurantInTable(res);
	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
					shownRestaurants.push(res);
 				}
 			}
 		});
 		
	});
}

//prikazuje samo restorane koji su otvoreni
function filterByType(){
 	$("#typeZaFiltraciju").change(function() {
 		event.preventDefault();
 		
 		$("#tableRestaurants").empty();
 		$.ajax({
 			
 			type: "GET",
 			url: '../rest/restaurant/open',
 			contentType: 'application/json',
 			success: function(restaurants) {
				shownRestaurants = [];
 		    	for(let res of restaurants) {
 		    		if($("#typeZaFiltraciju").val() == '' || res.type.toLowerCase().includes($("#typeZaFiltraciju").val().toLowerCase())){
 	 					addRestaurantInTable(res);
 	 					$( "#detaljiRestorana" + res.id).click(function() {
							getRestaurantById(res.id);
						});
						shownRestaurants.push(res);
 		    		}

 				}
 			}
 		});	
 		
	});
}


function sortRestaurantsByStatus() {
	$("#sortRestaurantsByStatus").click(function() {
		event.preventDefault();
 		
 		$("#tableRestaurants").empty();
		
		for(let res of shownRestaurants) {
			if(res.open === "Open") {
	 	 		addRestaurantInTable(res);
	 	 		$( "#detaljiRestorana" + res.id).click(function() {
					getRestaurantById(res.id);
				});
			}
 		}
	})
}


function sortRestaurantsByRating(){

 	$( "#sortRestaurantsByRating").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants").empty();

		console.log("Usao u sortByRating");
 		
 		if(sortRatingDesc) {
 			for(let i=0; i<shownRestaurants.length; i++){
 	 			for(let j = i+1; j < shownRestaurants.length; j++){
 	 	 			if(shownRestaurants[i].rating < shownRestaurants[j].rating){
 	 	 				temp = shownRestaurants[i];
 	 	 				shownRestaurants[i] = shownRestaurants[j];
 	 	 				shownRestaurants[j] = temp;
 	 	 			}
 	 			}
 	 		}
			
 			sortRatingDesc = false;
 			$("#imageSortRating").attr("src", "../images/sort-down.png");
 		} else {
 			//shownUsers.reverse();
 			for(let i=0; i<shownRestaurants.length; i++){
 	 			for(let j = i+1; j < shownRestaurants.length; j++){
 	 	 			if(shownRestaurants[i].rating > shownRestaurants[j].rating){
 	 	 				temp = shownRestaurants[i];
 	 	 				shownRestaurants[i] = shownRestaurants[j];
 	 	 				shownRestaurants[j] = temp;
 	 	 			}
 	 			}
 	 		}
 			sortRatingDesc = true;
 			$("#imageSortRating").attr("src", "../images/sort-up.png");
 		}
 		
 			for(let res of shownRestaurants) {
 	 		addRestaurantInTable(res);
 	 		$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
	});
}

function strcmp(a, b)
{   
    return (a<b?-1:(a>b?1:0));  
}

function sortRestaurantsByName(){

 	$( "#sortRestaurantsByName").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants").empty();
	
		console.log("Usao u sortByName");
			
			
		if(sortNameDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.name < b.name) { return -1; }
			    if(a.name > b.name) { return 1; }
			    return 0;
			});
			sortNameDesc = false;
			$("#imageSortName").attr("src", "../images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.name > b.name) { return -1; }
			    if(a.name < b.name) { return 1; }
			    return 0;
			});
			sortNameDesc = true;
			$("#imageSortName").attr("src", "../images/sort-up.png");
		}
 			
 			
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 				
	});
}


function sortRestaurantsByCity(){

 	$( "#sortRestaurantsByCity").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants").empty();

		console.log("Usao u sortByCity");

		if(sortCityDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.city < b.city) { return -1; }
			    if(a.city > b.city) { return 1; }
			    return 0;
			});
			sortCityDesc = false;
			$("#imageSortCity").attr("src", "../images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.city > b.city) { return -1; }
			    if(a.city < b.city) { return 1; }
			    return 0;
			});
			sortCityDesc = true;
			$("#imageSortCity").attr("src", "../images/sort-up.png");
		}
 		
 		
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 		
	});
}

function sortRestaurantsByCountry(){

 	$( "#sortRestaurantsByCountry").click(function() {
 		
 		event.preventDefault();
 		
 		$("#tableRestaurants").empty();

		console.log("Usao u sortByCountry");
		
		
		if(sortCountryDesc) {
			shownRestaurants.sort(function(a, b){
			    if(a.country < b.country) { return -1; }
			    if(a.country > b.country) { return 1; }
			    return 0;
			});
			sortCountryDesc = false;
			$("#imageSortCountry").attr("src", "../images/sort-down.png");
		} else {
			shownRestaurants.sort(function(a, b){
			    if(a.country > b.country) { return -1; }
			    if(a.country < b.country) { return 1; }
			    return 0;
			});
			sortCountryDesc = true;
			$("#imageSortCountry").attr("src", "../images/sort-up.png");
		}
 		
 		
 		for(let res of shownRestaurants) {
 			addRestaurantInTable(res);
 			$( "#detaljiRestorana" + res.id).click(function() {
				getRestaurantById(res.id);
			});
 		}
 		
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

var allRestaurants;
var shownRestaurants;

// restorani
var sortNameDesc;
var sortRatingDesc;
var sortCityDesc;
var sortCountryDesc;

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
	sortFirstNameDesc = true;
	sortLastNameDesc = true;
	sortPointsDesc = true;
	
	// Restorani PSF
	sortRestaurantsByStatus();
	sortRestaurantsByName();
	sortRestaurantsByCity();
	sortRestaurantsByCountry();
	sortRestaurantsByRating();
	filterByType();
	search();
	
	// Slide up/down za search
	$("#buttonSearchRestaurants").click(function(){
		$("#divSearchRestaurants").slideToggle();
	});
	
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
				alert("Restaurant added successfully");
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
			success : function(user){
				alert("Added " + user.role + " " + user.firstName + " " + user.lastName);
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
