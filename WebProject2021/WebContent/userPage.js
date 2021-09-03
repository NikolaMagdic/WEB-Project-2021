function changeView() {
	$("#divCart").hide();
	
	$("#buttonCart").click(function(event){
		$("#divCart").show();
		$("#divMyAccount").hide();
	});
}

function getLoggedInUser(){
	    $.get({
		type: "GET",
		url: 'rest/user/loggedIn',
		success: function(user) {
			console.log(user);
			$('#usernameEdit').val(user.username);
			$('#passwordEdit').val(user.password);
			$('#nameEdit').val(user.firstName);
			$('#lastNameEdit').val(user.lastName);
			if(user.gender == true){
				$('input#male').prop("checked", true);
			} else {
				$('input#female').prop("checked", true);
			}
		}
	})
}

function logout(){
 	$( "#logoutMenu").click(function() {
 		$.ajax({
 			type: "GET",
 			url: 'rest/logout',
 			contentType: 'application/json',
 			success: function() {
 				window.location = "./index.html";
 			}
 		});
 		
	});
}


$(document).ready(function(){
	
	changeView();
	
	getLoggedInUser();
	
	logout();
	
	// Show/hide edit form
	$("#editMenu").click(function(event){
		if($("#divMyAccount").css("display") == "none") {
			$("#divMyAccount").show();
		} else {
			$("#divMyAccount").hide();
		}
		
	});

	$("#formEdit").submit(function(event){
	
			console.log("Usao u EDIT");
			event.preventDefault();
			
			
			let username = $("#usernameEdit").val();
			let password = $("#passwordEdit").val();
			let firstName = $("#nameEdit").val();
			let lastName = $("#lastNameEdit").val();
			let confirmPassword = $("#confirm-password").val();
			let male = $("#male:checked").val();
			
			if(password == '' || firstName== '' || lastName == ''){
				alert('Please fill all mandatory fields');
				return;
			}
			
			if(password != confirmPassword){
				alert('Passwords do not match');
				return;
			}
			
			
			let gender;
			if(male){
				gender = "True";
				//alert("Musko");
			}else {
				gender = "False";
				//alert("Zensko");
			}
			
			let data = {
				username: username,
				password: password,
				firstName: firstName,
				lastName: lastName,
				gender: gender
			};
			console.log(data);
			
			$.ajax({
				type: "PUT",
				url: 'rest/user',
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function() {
					console.log("Success edit");
				},
				error : function(){
					console.log("error");
					alert("Error edit");
				}
			})
	
	});

});