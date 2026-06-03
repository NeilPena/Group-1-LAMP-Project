<?php
	$inData = getRequestInfo();
	
    $id = $inData["id"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "Neil", "Admin", "LAMP");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contact WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $id, $userId);
		$stmt->execute();
        if ($stmt->affected_rows > 0)
	    {
		    returnWithError("");
	    } else {
            returnWithError("Delete Failed");
        }
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>