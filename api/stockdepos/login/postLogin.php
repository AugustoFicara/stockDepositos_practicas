<?php
include('Respuesta.php');
include_once('./stockdepos/db/dbUsuario.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);
$id = md5($datos['Firma'] . $datos['Usuario'] . $datos['GUID']);

if ($id == getallheaders()['idCab']) {
	$Usuario = new dbUsuario();
	$Respuesta = new Respuesta();
	$Usuario->BuscarUsuario($datos["Usuario"]);

	if ($Usuario->getCuit() != "") {
		$Firma = md5($Usuario->getContrasena() . $datos["GUID"]);

		if ($Firma == $datos["Firma"]) {
			$Usuario->conexionActiva($datos['GUID'], $Usuario->getNombreCompleto(), $datos['Usuario'], $Usuario->getCuit());
			$Mensaje = new DatosUsuarios($datos['GUID'], $Usuario->getNombreCompleto(), $datos['Usuario']);
			$Respuesta->MensajeRespuesta($Mensaje, 200, 200);
		} else {
			$Respuesta->ErrorRespuesta(12);
		}

	} else {
		$Respuesta->ErrorRespuesta(12);
	}

} else {
	$Respuesta = new Respuesta();
	$Respuesta->ErrorRespuesta(14);
}

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