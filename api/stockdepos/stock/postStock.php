<?php
	include('Respuesta.php');
    include_once('./stockdepos/db/dbStock.php');
	header('Access-Control-Allow-Origin: *');

	$ch = curl_init();
	$body = file_get_contents("php://input");
	$datos = json_decode($body, true);

	$Stock = new dbStock();
    $Stock->setCantidadActual($datos["cantidadActual"]);
    $Stock->setId_Material($datos["id_material"]);
	$Stock->setId_Deposito($datos["id_deposito"]);
    $Stock->setActivo($datos["activo"]);
    
    $Stock->createStock();

	class DatosStock{
		public $WebService;
		public $Version;
		public $Recurso;

		public $id_material;
		public $cantidadActual;
		public $id_deposito;

		function __construct($id_material, $cantidadActual, $id_deposito){
			$this->WebService = "MRphpServices";
			$this->Version = "2.0.0";
			$this->Recurso = "Stock";
			$this->id_material = $id_material;
			$this->cantidadActual = $cantidadActual;
			$this->id_deposito = $id_deposito;
		}
	}
?>