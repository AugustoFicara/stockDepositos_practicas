<?php
	switch ($Error){
		case "-1":
			header('Access-Control-Allow-Origin : *');
			header('Access-Control-Allow-Methods : GET, POST, OPTIONS');
			break;
		case "404":
			header('HTTP/1.1 404 Not Found');
			header('Access-Control-Allow-Methods : GET, POST, OPTIONS');
			break;
		case "405":
			header('HTTP/1.1 405 Method not allowed');
      header('Access-Control-Allow-Methods : GET, POST, OPTIONS');
      break;
		case "200":
			header("Access-Control-Allow-Origin : *");
			header('Content-Type: application/json');
			$R = json_encode($Respuesta, JSON_UNESCAPED_UNICODE);
			echo utf8_decode($R);
			break;
		default:
			header('Access-Control-Allow-Origin : *');
			header('Access-Control-Allow-Methods : GET, POST, OPTIONS');
			break;
	}
?>