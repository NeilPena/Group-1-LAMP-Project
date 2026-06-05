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
	
				window.location.href = "/html/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

	updateUserDisplay();

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
	
				window.location.href = "/html/contacts.html";
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
	document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString();
	document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString();
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(";");
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
		window.location.href = "/html/index.html";
	}
	else
	{
		updateUserDisplay();
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "lastName=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "userId=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/html/index.html";
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
				<button class="btn btn--ghost btn--sm" title="Edit contact" onclick="openEditModal(
				${results[i].ID},
				'${results[i].FirstName}',
				'${results[i].LastName}',
				'${results[i].Email}',
				'${results[i].PhoneNumber}'
			)"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.334 2.00001L13.9993 4.66634M2 14H5.33333L13.1333 6.2L10.4673 3.53401L2.66733 11.334L2 14Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only">Edit</span></button>
				<button class="btn btn--ghost btn--sm" title="Delete contact" onclick="deleteContact(${results[i].ID})"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H3.33333H14M13.3333 4V12.6667C13.3333 13.0203 13.1929 13.359 12.9428 13.609C12.6928 13.8591 12.354 14 12 14H4C3.64638 14 3.30724 13.8591 3.05719 13.609C2.80714 13.359 2.66667 13.0203 2.66667 12.6667V4M5.33333 4V2.66667C5.33333 2.48986 5.40357 2.32029 5.52859 2.19526C5.65362 2.07024 5.82319 2 6 2H10C10.1768 2 10.3464 2.07024 10.4714 2.19526C10.5964 2.32029 10.6667 2.48986 10.6667 2.66667V4M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only">Delete</span></button>
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

function updateUserDisplay() {
    document.getElementById("userName").innerHTML = firstName + " " + lastName;
}

function updateContactCount(results) {
    let count = results ? results.length : 0;
    document.getElementById("contactCount").innerHTML = count + " contact" + (count !== 1 ? "s" : "");
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

                let results = jsonObject.results || [];
                populateTable(results);
                updateContactCount(results);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}