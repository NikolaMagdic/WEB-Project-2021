$(document).ready(function(){

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