<?php
  include('Respuesta.php');

  $Solicitud = new SolicitucOption();
  $Respuesta = new Respuesta();

  $Solicitud->WebService = "mrPHP1";
  $Solicitud->Version = "2.0.0";
  $Solicitud->Recurso = "SolicitudConexion";
  $Solicitud->GUID = GUID();
  $Solicitud->Usuario = "";
  $Solicitud->Firma = "";

  $Respuesta->MensajeRespuesta($Solicitud, 200, 200);


  function GUID() {
    if (function_exists('com_create_guid') === true) {
      return trim(com_create_guid(), '{}');
    }
    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
  }


  function Pedido($BasadoEn){
    $n =  hexdec(substr($BasadoEn, 9, 4));
    $n = $n * 200 + (date("Y") - 1958);
    $n = $n * 12 + date("n");
    $n = $n * 32 + date("d");
    $n = $n * 24 + date("H");
    $n = $n * 60 + date("i");
    $n = $n * 60 + date("s");
    return $n;
  }

  class SolicitucOption{
    public $WebService;
    public $Version;
    public $Recurso;
    public $GUID;
    public $Usuario;
    public $Firma;
  }
?>