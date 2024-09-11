<?php
include('Respuesta.php');
include_once('./stockdepos/db/dbUsuario.php');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
$body = file_get_contents("php://input");
$datos = json_decode($body, true);

$Usuario = new dbUsuario();

$Usuario->deleteUsuario($datos["id"], $datos["activo"]);

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