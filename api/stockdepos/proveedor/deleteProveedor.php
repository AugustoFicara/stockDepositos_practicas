<?php
include('Respuesta.php');
include_once('./stockdepos/db/dbProveedor.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);

$Proveedor = new dbProveedor();

$Proveedor->deleteProveedor($datos["id"], $datos["activo"]);

class DatosProveedores
{
	public $WebService;
	public $Version;
	public $Recurso;
	public $nombreCompleto;
	public $CUIT;
	public $domicilio;
	public $nroTelefono;
	public $email;

	function __construct($nombreCompleto, $CUIT, $nroTelefono, $email, $domicilio)
	{
		$this->WebService = "MRphpServices";
		$this->Version = "2.0.0";
		$this->Recurso = "Stock Depósitos - Proveedores";
		$this->nombreCompleto = $nombreCompleto;
		$this->domicilio = $domicilio;
		$this->CUIT = $CUIT;
		$this->nroTelefono = $nroTelefono;
		$this->email = $email;
	}
}
?>