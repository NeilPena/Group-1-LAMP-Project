
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$login = $inData["login"];
	$password = $inData["password"];

	// "localhost", "username", "password", "database"
	$conn = new mysqli("localhost", "Neil", "Admin", "LAMP"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName,Password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			$id = $row["ID"];
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$storedPassword = $row["Password"];

			$parts = explode(':', $storedPassword );
			$storedHash = $parts[0];
			$salt = $parts[1];
			$checkHash = md5($password . $salt);

			if( $checkHash == $storedHash ) {
				returnWithInfo( $firstName, $lastName, $id );
			} else {
				returnWithError("Invalid username or password");
			}
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
