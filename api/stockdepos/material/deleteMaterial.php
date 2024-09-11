<?php
	include('Respuesta.php');
    include_once('./stockdepos/db/dbMaterial.php');
	header('Access-Control-Allow-Origin: *');

	$ch = curl_init();
	$body = file_get_contents("php://input");
	$datos = json_decode($body, true);

echo "************** DELETE MATERIALES";
var_dump($datos);

$Material = new dbMaterial();
    
    $Material->deleteMaterial($datos["id"], $datos["activo"]);

	class DatosMateriales{
		public $WebService;
		public $Version;
		public $Recurso;
		public $nombreMaterial;
		public $descripcion;

		function __construct($nombreMaterial, $descripcion){
			$this->WebService = "MRphpServices";
			$this->Version = "2.0.0";
			$this->Recurso = "Stock";
			$this->nombreMaterial = $nombreMaterial;
			$this->descripcion = $descripcion;
		}
	}
?>