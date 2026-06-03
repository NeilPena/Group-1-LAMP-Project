<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$id = $inData["id"];
    $userId = $inData["userId"];

    // "localhost", "username", "password", "database"
	$conn = new mysqli("localhost", "Neil", "Admin", "LAMP");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contact SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $email, $phoneNumber, $id, $userId);
		$stmt->execute();

        if($stmt->affected_rows >= 0)
	    {
		    returnWithError("");
	    }
	    else
	    {
		    returnWithError("Update Failed");
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
	
?>