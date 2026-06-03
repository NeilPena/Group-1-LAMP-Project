// MAKE SURE TO CHANGE URL TO CORRECT LATER!!
const urlBase = 'https://www.justinpruitt.xyz/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password}; 
	//let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "UserName/Password is incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() {
	firstName = document.getElementById("registerFirst").value;
	lastName = document.getElementById("registerLast").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = "User already exists";
					return;
				} else {
					let jsonObject = JSON.parse(xhr.responseText);
					userId = jsonObject.id;
					document.getElementById("registerResult").innerHTML = "User added";
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					saveCookie();
				}
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let firstName = document.getElementById("contactAddFirst").value;
	let lastName = document.getElementById("contactAddLast").value;
	let phoneNumber = document.getElementById("contactAddPhone").value;
	let email = document.getElementById("contactAddEmail").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, email:email, phoneNumber:phoneNumber, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";

				document.getElementById("contactAddFirst").value = "";
				document.getElementById("contactAddLast").value = "";
				document.getElementById("contactAddPhone").value = "";
				document.getElementById("contactAddEmail").value = "";
				
				searchContact();

			} else {
				document.getElementById("contactAddResult").innerHTML = jsonObject.error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = "Add Failed";
	}
	
}

function searchContact(srch = null)
{
	if(srch == null) {
		srch = document.getElementById("searchText").value;
	}

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "";
				let jsonObject = JSON.parse( xhr.responseText );

				
				populateTable(jsonObject.results || []);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function populateTable(results) {
	let tableBody = document.getElementById("contactTableBody");

	tableBody.innerHTML = "";
	if(!results || results.length == 0) {
		let row = `<tr>
			<td colspan="5" style="text-align:center;">No Contacts Found</td>
		</tr>`

		tableBody.innerHTML += row;
		return;
	}
	

	for (let i = 0; i < results.length; i++) {
		let row = `<tr>
			<td>${results[i].FirstName}</td>
			<td>${results[i].LastName}</td>
			<td>${results[i].Email}</td>
			<td>${results[i].PhoneNumber}</td>
			<td>
				<button onclick="openEditModal(
				${results[i].ID},
				'${results[i].FirstName}',
				'${results[i].LastName}',
				'${results[i].Email}',
				'${results[i].PhoneNumber}'
			)">Edit</button>
				<button onclick="deleteContact(${results[i].ID})">Delete</button>
			</td>
		</tr>`;

		tableBody.innerHTML += row;
	}
}

function deleteContact(contactId){
	let tmp = {id:contactId, userId:userId};
	document.getElementById("contactDeleteResult").innerHTML = "";

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
				searchContact();

			} else {
				document.getElementById("contactDeleteResult").innerHTML = jsonObject.error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
	
}

function openEditModal(id, firstName, lastName, email, phoneNumber) {
	document.getElementById("editResult").innerHTML = "";

	document.getElementById("editID").value = id;
	document.getElementById("editFirstName").value = firstName;
	document.getElementById("editLastName").value = lastName;
	document.getElementById("editEmail").value = email;
	document.getElementById("editPhoneNumber").value = phoneNumber;

	document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
	document.getElementById("editModal").style.display = "none";
}

function saveEdit()
{
	let tmp = {id:document.getElementById("editID").value,firstName:document.getElementById("editFirstName").value,
		 lastName:document.getElementById("editLastName").value, email:document.getElementById("editEmail").value, 
		 phoneNumber:document.getElementById("editPhoneNumber").value, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/EditContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.error == "") {
					closeEditModal();
					searchContact();
				} else {
					document.getElementById("editResult").innerHTML = jsonObject.error;
				}

			} 
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = "Edit Failed";
	}
	
}