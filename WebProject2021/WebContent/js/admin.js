$(document).ready(function(){
	$("formAddUser").hide();
	$("buttonAddUser").click(function(){
		$("formAddUser").show();
	});
	
	// Dodavanje novog menadzeda ili dostavljaca
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
	
	$("#buttonAddUser").click(function(event){
		if($("#divAddUser").css("display") == "none") {
			$("#divAddUser").show();
		} else {
			$("#divAddUser").hide();
		}
	});
	
});

