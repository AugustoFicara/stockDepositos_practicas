<?php
	require_once('db.php');
  // lista los meses liquidados
  class MesesLiquidacion{
    private $Dia = array();
    private $Mes = array();
    private $Año = array();
    private $Fecha = array();
    private $NumRegistro;
    private $Error;
    
    function __construct($Legajo){
			$db = db::getInstancia();
      $sq = "SELECT fecha_mov FROM movi_con";
      $sq = $sq." WHERE NRO_LEGAJO = ".$Legajo;
      $sq = $sq." GROUP BY year(fecha_mov), month(fecha_mov)";
      $sq = $sq." ORDER BY year(fecha_mov) desc, month(fecha_mov) desc";
      $result = $db->ConsultaSQL($sq);
      $this->NumRegistro = 0;
      while($row = mysql_fetch_row($result)){
        $this->Fecha[] = $row[0];
        $F1 = explode(" ", $row[0]);
        $FechaDet = explode("-", $F1[0]);
        $this->Dia[] = $FechaDet[2];
        $this->Mes[] = $FechaDet[1];
        $this->Año[] = $FechaDet[0];
        $this->NumRegistro++;
      }
      mysql_free_result($result);
    }
    
    function __destruct(){
      unset($this->Año, $this->Dia, $this->Fecha,$this->Mes, $this->NumRegistro, $this->Error);
    }
    
    function Cerrar(){
      $this->__destruct();
    }
    
    function Dia($i){
      return($this->Dia[$i]);
    }
    
    function Mes($i){
      return($this->Mes[$i]);
    }
    
    function Año($i){
      return($this->Año[$i]);
    }
    
    function Fecha($i){
      return($this->Fecha[$i]);
    }

    function CantidadRegistro(){
      return($this->NumRegistro);
    }
    
    function Error(){
      return($this->Error);
    }
  }
?>