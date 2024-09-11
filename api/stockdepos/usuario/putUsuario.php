<?php

include('Respuesta.php');
include_once('./stockdepos/db/dbUsuario.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);

$Usuario = new dbUsuario();
$Usuario->setNombreUsuario($datos["nombreUsuario"]);
$Usuario->setContrasena($datos["contrasena"]);
$Usuario->setUsuarioActivo($datos["activo"]);
$Usuario->setNombreCompleto($datos["nombreCompleto"]);
$Usuario->setCuit($datos["CUIT"]);
$Usuario->setAdministrador($datos["administrador"]);
$Usuario->setDepositos($datos["depositos"]);
$Usuario->setDestinatario($datos["destinatario"]);
$Usuario->setMateriales($datos["materiales"]);
$Usuario->setEntregas($datos["entregas"]);
$Usuario->setRecepciones($datos["recepciones"]);
$Usuario->setInformes($datos["informes"]);
$Usuario->setUsuarios($datos["usuarios"]);
$Usuario->setUsuarios($datos["proveedores"]);
$Usuario->setDepositoAsociado($datos["depositoAsociado"]);

$Usuario->updateUsuario($datos["id"]);

class DatosUsuarios
{
	public $WebService;
	public $Version;
	public $Recurso;
	public $ID;
	public $Nombre;
	public $Usuario;
	public $Permisos;

	function __construct($ID, $Nombre, $Usuario, $Permisos)
	{
		$this->WebService = "MRphpServices";
		$this->Version = "2.0.0";
		$this->Recurso = "Stock";
		$this->ID = $ID;
		$this->Nombre = $Nombre;
		$this->Usuario = $Usuario;
		$this->Permisos = $Permisos;
	}
}
?>