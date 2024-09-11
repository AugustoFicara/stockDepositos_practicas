<?php
	include_once("./db/dblocal.php");
  include_once("./db/dbinfogov3306.php");
  include_once("./db/dbinfogov3307.php");

	class BonoLegajo{
		private $NRO_LEGAJO;
		private $IdLegajo;
		private $CUIL;
		private $ApellidoNombre;
		private $FechaIngreso;
		private $Desempeno;
		private $Descripcion;
		private $Jurisdiccion;
		private $Conyuge;
		private $Hijos;
		private $OSEPVoluntario;
		private $OSEPVoluntarioEstudiante;
		private $OSEPIndirecto;
		private $DiasTrabajados;
		private $Reparticion;
		private $Convenio;
    private $BancoAcreditacion = " ";

		private $NumeroLiquidacion;
		private $HaberesSujeto = [];
		private $HaberesNoSujeto = [];
		private $Retenciones = [];
		private $TotalHaberesSujeto;
		private $TotalHaberesNoSujeto;
		private $TotalAsignacionFamiliar;
		private $TotalRetenciones;
		private $Neto;
    private $NetoBase;

    private $NumRegistro;
    private $Error;
    
    function __construct($Legajo, $FecNumBono){
      $NumeroDocumento = substr($Legajo, 2, 8);
      $NumeroLiquidacion = substr($FecNumBono, 10, 1000);
      $db = substr($FecNumBono, 8, 1);
      $Fecha = substr($FecNumBono, 0, 8);
      $this->TotalHaberesSujeto = 0;
      $this->TotalHaberesNoSujeto = 0;
      $this->TotalAsignacionFamiliar = 0;
      $this->TotalRetenciones = 0;
      $this->Neto = 0;
      $this->NetoBase = 0;
      $this->BancoAcreditacion = " ";
      $this->NumeroLiquidacion = 0;
      switch ($db) {
        case 'A':
          // Sistema Access Migrado a la Bases RRHH
          $this->DatosEmpleadoRRHH($Legajo, $Fecha);
          $this->NoSujetoRRHH($Legajo, $Fecha);
          $this->SujetoRRHH($Legajo, $Fecha);
          $this->RetencionesRRHH($Legajo, $Fecha);
          $this->Neto = $this->TotalHaberesSujeto + $this->TotalHaberesNoSujeto + $this->TotalAsignacionFamiliar - $this->TotalRetenciones;
          $this->NetoBase = $this->Neto;
          break;
        case 'B':
           // Poder Ejecutivo con Infogov
          $this->DatosEmpleadoPersonalInfogov($Legajo, $NumeroLiquidacion);
          $this->SujetoPersonal($Legajo, $NumeroLiquidacion);
          $this->NoSujetoPersonal($Legajo, $NumeroLiquidacion);
          $this->RetencionesPersonal($Legajo, $NumeroLiquidacion);
          $this->Neto = $this->TotalHaberesSujeto + $this->TotalHaberesNoSujeto + $this->TotalAsignacionFamiliar - $this->TotalRetenciones;
          $this->NetoBase = $this->TomarNetoPersonal($Legajo, $NumeroLiquidacion);
          break;
        case 'C':
          // Personal Liquidado por Infogov
          $this->DatosEmpleadoPersonalInfogov3($Legajo, $NumeroLiquidacion);
          $this->SujetoPersonal3($Legajo, $NumeroLiquidacion);
          $this->NoSujetoPersonal3($NumeroDocumento, $NumeroLiquidacion);
          $this->RetencionesPersonal3($Legajo, $NumeroLiquidacion);
          $this->Neto = $this->TotalHaberesSujeto + $this->TotalHaberesNoSujeto + $this->TotalAsignacionFamiliar - $this->TotalRetenciones;
          $this->NetoBase = $this->TomarNetoPersonal3($Legajo, $NumeroLiquidacion);
          break;
        default:
          # code...
          break;
      }
    }

    function __destruct(){
      unset($this->NRO_LEGAJO, $this->CUIL, $this->ApellidoNombre, $this->FechaIngreso, $this->Desempeno, $this->Descripcion, $this->Conyuge, $this->Hijos, $this->OSEPVoluntario, $this->OSEPVoluntarioEstudiante,	$this->OSEPIndirecto,	$this->DiasTrabajados, $this->NumRegistro, $this->Error, $this->Reparticion);
    }
    
    public function Cerrar(){
      $this->__destruct();
    }

    private function DatosEmpleadoRRHH($Legajo, $Fecha){
    	$dblocal = dblocal::getInstancia();
    	$Legajo = substr($Legajo, 2, 8);
    	$sq = "SELECT personal.NRO_LEGAJO, CUIL, personal.APE_NOM, FEC_ING, escalafo.DESEMPENO,";
			$sq .= " grupocon.DESCRIP, NOM_CECO,";
			$sq .= " (SELECT count(NRO_FAMILI) FROM rrhh.familia WHERE NRO_LEGAJO = '";
			$sq .= $Legajo."' AND PARENTES = 'Conyuge' and (FEC_ACA = NULL OR FEC_ACA <= '".$Fecha."')) AS Conyuge,";
			$sq .= " (SELECT count(NRO_FAMILI) FROM rrhh.familia WHERE NRO_LEGAJO = '".$Legajo;
			$sq .= "' AND PARENTES = 'Hijo'and (FEC_ACA = NULL OR FEC_ACA <= '".$Fecha."')) AS Hijos,";
			$sq .= " personal.VOLUNTARIO, personal.VOLUN_ESTD, personal.INDIRECTOS,";
			$sq .= " (SELECT DIAS_TRAB FROM rrhh.movimi";
			$sq .= " WHERE NRO_LEGAJO = '".$Legajo."' AND FECHA_MOV = '".$Fecha."') as DiasTrabajados,";
			$sq .= " (SELECT NRO_RECIBO from rrhh.movimi WHERE NRO_LEGAJO='".$Legajo."' AND FECHA_MOV='".$Fecha."') AS NumeroRecibo";
			$sq .= " FROM rrhh.personal";
			$sq .= " INNER JOIN rrhh.escalafo ON personal.COD_ESCA = escalafo.COD_ESCALA";
			$sq .= " INNER JOIN rrhh.grupocon ON personal.COD_GRUPO = grupocon.COD_GRUPO";
			$sq .= " INNER JOIN rrhh.centcost ON personal.COD_CECO = centcost.COD_CECO";
			$sq .= " WHERE personal.NRO_LEGAJO = '".$Legajo."'";

      $result = $dblocal->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
      	$this->NRO_LEGAJO = $fila[0];
				$this->CUIL = $fila[1];
				$this->ApellidoNombre = $fila[2];
				$this->IdLegajo = "";
				$this->FechaIngreso = $fila[3];
				$this->Desempeno = $fila[4];
				$this->Jurisdiccion = "Municipalidad de Rivadavia";
				$this->Descripcion = $fila[5];
				$this->Reparticion = $fila[6];
				$this->Conyuge = $fila[7];
				$this->Hijos = $fila[8];
				$this->OSEPVoluntario = $fila[9];
				$this->OSEPVoluntarioEstudiante = $fila[10];
				$this->OSEPIndirecto = $fila[11];
				$this->DiasTrabajados = $fila[12];
				$this->NumeroLiquidacion = $fila[13];
				$this->Convenio = "1 Municipalidad de Rivadavia";
        $this->BancoAcreditacion = " ";
      }
    }

    private function NoSujetoRRHH($Legajo, $Fecha){
    	$dblocal = dblocal::getInstancia();
    	$Legajo = substr($Legajo, 2, 8);
    	$sq = "SELECT COD_CON, DESCRIP, IMPORTE, TIPO_CON FROM rrhh.movi_con";
    	$sq .= " WHERE nro_legajo = ".$Legajo;
    	$sq .= " AND fecha_mov = ".$Fecha;
    	$sq .= " AND (TIPO_CON = 'AF' OR TIPO_CON = 'HN')";
    	$sq .= " order by cod_con";
    	$result = $dblocal->ConsultaSQL($sq);
    	while($fila = mysqli_fetch_row($result)){
    		if($fila[3] == "AF"){
    			$this->TotalAsignacionFamiliar += $fila[2];
    		}else{
    			$this->TotalHaberesNoSujeto += $fila[2];
    		}
    		$this->HaberesNoSujeto[] = [$fila[0], $fila[1], $fila[2]];
    	}
    }

    private function SujetoRRHH($Legajo, $Fecha){
    	$this->TotalHaberesSujeto = 0;
    	$dblocal = dblocal::getInstancia();
    	$Legajo = substr($Legajo, 2, 8);
    	$sq =" SELECT COD_CON, DESCRIP, IMPORTE FROM rrhh.movi_con";
    	$sq .= " WHERE nro_legajo = ".$Legajo;
    	$sq .= " AND fecha_mov = ".$Fecha;
    	$sq .= " AND TIPO_CON = 'HR'";
    	$sq .= " ORDER BY cod_con";
    	$result = $dblocal->ConsultaSQL($sq);
    	while ($fila = mysqli_fetch_row($result)) {
    		$this->HaberesSujeto[] = [$fila[0], $fila[1], $fila[2]];
    		$this->TotalHaberesSujeto += $fila[2];
    	}
    }

    private function RetencionesRRHH($Legajo, $Fecha){
    	$this->TotalRetenciones = 0;
    	$dblocal = dblocal::getInstancia();
    	$Legajo = substr($Legajo, 2, 8);
    	$sq = " SELECT COD_CON, DESCRIP, IMPORTE FROM rrhh.movi_con";
    	$sq .= " WHERE nro_legajo = ".$Legajo;
    	$sq .= " AND fecha_mov = ".$Fecha;
    	$sq .= " AND TIPO_CON = 'DE'";
    	$sq .= " ORDER BY cod_con";
    	$result = $dblocal->ConsultaSQL($sq);
    	while ($fila = mysqli_fetch_row($result)) {
    		$this->Retenciones[] = [$fila[0], $fila[1], $fila[2]];
    		$this->TotalRetenciones += $fila[2];
    	}
    }

    private function DatosEmpleadoPersonalInfogov($CUIT, $NumeroLiquidacion){
      // Sistema de Infogov Puerto 3307
      // Poder Ejecutivo con Infogov
      $dbInfogov3307 = dbInfogov3307::getInstancia();
      $sq = "SELECT NumeLega, CucuLega AS CUIL, NoapLega, FeinLega AS FechaIngreso, DetaClas AS DesempFuncion,";
      $sq .= " DetaRepa, ConyLile AS Conyuge, HijoLile AS Hijos, VopuOsep AS VoluntarioOSEP,VoesOsep AS Voluntario_EstudiantesOSEP,";
      $sq .= " IndiOsep AS IndirectoOSEP, DitrLile AS DiasTrabajados, DetaConv, CodiClas, DetaBanc";
      $sq .= ",funcion, ConyLile AS Conyuge, HijoLile + MecaLile AS Hijo";
      $sq .= " FROM personal3.vistaLiquidacion";
      $sq .= " WHERE CucuLega='".$CUIT."'";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $result = $dbInfogov3307->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->NRO_LEGAJO = $fila[0];
        $this->CUIL = $fila[1];
        $this->ApellidoNombre = $fila[2];
        $this->IdLegajo = "";
        $this->FechaIngreso = $fila[3];
        $this->Desempeno =  $fila[15];
        $this->Jurisdiccion = "Municipalidad de Rivadavia";
        $this->Descripcion = $fila[13];
        $this->Reparticion = $fila[5];
        $this->Conyuge = $fila[16];
        $this->Hijos = $fila[17];
        $this->OSEPVoluntario = $fila[8];
        $this->OSEPVoluntarioEstudiante = $fila[9];
        $this->OSEPIndirecto = $fila[10];
        $this->DiasTrabajados = $fila[11];
        $this->NumeroLiquidacion = intval($NumeroLiquidacion);
        $this->Convenio = $fila[12];
        $this->BancoAcreditacion = $fila[14]." ";
      }
    }

    private function SujetoPersonal($Legajo, $NumeroLiquidacion){
      // Sistema de Infogov Puerto 3307
      // Poder Ejecutivo con Infogov
      $dbInfogov3307 = dbInfogov3307::getInstancia();
      $sq = "SELECT CodiConc, DetaConc, UnidItco, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico = 1";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbInfogov3307->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        switch ($fila[0]) {
          case 37:
            $texto = $fila[1]." (".floor($fila[2])." %)";
            break;
          case 48:
            $texto = $fila[1]." (".floor($fila[2])." años)";
            break;
          case 144:
            $texto = $fila[1]." (".floor($fila[2])." dias)";
            break;
          default:
            $texto = $fila[1];
            break;
        }
        $this->HaberesSujeto[] = [$fila[0], $texto, $fila[3]];
        $this->TotalHaberesSujeto += $fila[3];
      }
    }

    private function NoSujetoPersonal($Legajo, $NumeroLiquidacion){
      // Sistema de Infogov Puerto 3307
      // Poder Ejecutivo con Infogov
      $dbInfogov3307 = dbInfogov3307::getInstancia();
      $Legajo = substr($Legajo, 2,8);
      $this->TotalHaberesNoSujeto = 0;
      $sq = "SELECT CodiConc, DetaConc, ImpoItco, CodiTico";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico in(2, 5)";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbInfogov3307->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->HaberesNoSujeto[] = [$fila[0], $fila[1], $fila[2]];
        if($fila[3] == 2){
          $this->TotalHaberesNoSujeto += $fila[2];
        }else{
          $this->TotalAsignacionFamiliar += $fila[2];
        }
      }
    }

    private function RetencionesPersonal($Legajo, $NumeroLiquidacion){
      // Sistema de Infogov Puerto 3307
      // Poder Ejecutivo con Infogov
      $dbInfogov3307 = dbInfogov3307::getInstancia();
      $Legajo = substr($Legajo, 2,8);
      $this->TotalRetenciones = 0;
      $sq = "SELECT CodiConc, DetaConc, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico IN(3, 6, 7, 8, 9, 12, 13)";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbInfogov3307->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->Retenciones[] = [$fila[0], $fila[1], $fila[2]];
        $this->TotalRetenciones += $fila[2];
      }
    }

    private function TomarNetoPersonal($Legajo, $NumeroLiquidacion){
      // Sistema de Infogov Puerto 3307
      // Poder Ejecutivo con Infogov
      $dbInfogov3307 = dbInfogov3307::getInstancia();
      $Legajo = substr($Legajo, 2,8);
      $sq = "SELECT CodiConc, DetaConc, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiLiqu=".$NumeroLiquidacion;
      $sq .= " AND CodiConc =999";
      $result = $dbInfogov3307->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        return($fila[2]);
      }
    }

    private function DatosEmpleadoPersonalInfogov3($CUIT, $NumeroLiquidacion){
      $sq = "SELECT NumeLega, CucuLega AS CUIL, NoapLega, FeinLega AS FechaIngreso, DetaClas AS DesempFuncion,";
      $sq .= " DetaRepa, ConyLile AS Conyuge, HijoLile AS Hijos, VopuOsep AS VoluntarioOSEP,VoesOsep AS Voluntario_EstudiantesOSEP,";
      $sq .= " IndiOsep AS IndirectoOSEP, DitrLile AS DiasTrabajados, DetaConv, CodiClas, DetaBanc";
      $sq .= ",funcion, ConyLile AS Conyuge, HijoLile + MecaLile AS Hijo";
      $sq .= " FROM personal3.vistaLiquidacion";
      $sq .= " WHERE CucuLega='".$CUIT."'";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $dbinfogov3306 = dbinfogov3306::getInstancia();
      $result = $dbinfogov3306->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->NRO_LEGAJO = $fila[0];
        $this->CUIL = $fila[1];
        $this->ApellidoNombre = $fila[2];
        $this->IdLegajo = "";
        $this->FechaIngreso = $fila[3];
        $this->Desempeno =  $fila[15];
        $this->Jurisdiccion = "Municipalidad de Rivadavia";
        $this->Descripcion = $fila[13];
        $this->Reparticion = $fila[5];
        $this->Conyuge = $fila[16];
        $this->Hijos = $fila[17];
        $this->OSEPVoluntario = $fila[8];
        $this->OSEPVoluntarioEstudiante = $fila[9];
        $this->OSEPIndirecto = $fila[10];
        $this->DiasTrabajados = $fila[11];
        $this->NumeroLiquidacion = intval($NumeroLiquidacion);
        $this->Convenio = $fila[12];
        $this->BancoAcreditacion = $fila[14]." ";
      }
    }

    private function SujetoPersonal3($Legajo, $NumeroLiquidacion){
      $Legajo = substr($Legajo, 2,8);
      $this->TotalHaberesSujeto = 0;
      $dbinfogov3306 = dbinfogov3306::getInstancia();
      $sq = "SELECT CodiConc, DetaConc, UnidItco, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico = 1";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbinfogov3306->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        switch ($fila[0]) {
          case 37:
            $texto = $fila[1]." (".floor($fila[2])." %)";
            break;
          case 48:
            $texto = $fila[1]." (".floor($fila[2])." años)";
            break;
          case 144:
            $texto = $fila[1]." (".floor($fila[2])." dias)";
            break;
          default:
            $texto = $fila[1];
            break;
        }
        $this->HaberesSujeto[] = [$fila[0], $texto, $fila[3]];
        $this->TotalHaberesSujeto += $fila[3];
      }
    }

    private function NoSujetoPersonal3($Legajo, $NumeroLiquidacion){
      $Legajo = substr($Legajo, 2,8);
      $this->TotalHaberesNoSujeto = 0;
      $dbinfogov3306 = dbinfogov3306::getInstancia();
      $sq = "SELECT CodiConc, DetaConc, ImpoItco, CodiTico";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico in(2, 5)";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbinfogov3306->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->HaberesNoSujeto[] = [$fila[0], $fila[1], $fila[2]];
        if($fila[3] == 2){
          $this->TotalHaberesNoSujeto += $fila[2];
        }else{
          $this->TotalAsignacionFamiliar += $fila[2];
        }
      }
    }

    private function RetencionesPersonal3($Legajo, $NumeroLiquidacion){
      $Legajo = substr($Legajo, 2,8);
      $this->TotalRetenciones = 0;
      $dbinfogov3306 = dbinfogov3306::getInstancia();
      $sq = "SELECT CodiConc, DetaConc, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiTico IN(3, 6, 7, 8, 9, 12, 13)";
      $sq .= " AND CodiLiqu=".$NumeroLiquidacion;
      $sq .= " ORDER BY CodiConc";
      $result = $dbinfogov3306->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        $this->Retenciones[] = [$fila[0], $fila[1], $fila[2]];
        $this->TotalRetenciones += $fila[2];
      }
    }

    private function TomarNetoPersonal3($Legajo, $NumeroLiquidacion){
      $Legajo = substr($Legajo, 2,8);
      $sq = "SELECT CodiConc, DetaConc, ImpoItco";
      $sq .= " FROM personal3.vistaDetalleLiquidacion";
      $sq .= " WHERE CodiLiqu=".$NumeroLiquidacion;
      $sq .= " AND CodiConc =999";
      $dbinfogov3306 = dbinfogov3306::getInstancia();
      $result = $dbinfogov3306->ConsultaSQL($sq);
      while($fila = mysqli_fetch_row($result)){
        return($fila[2]);
      }
    }

    public function NRO_LEGAJO(){
    	return ($this->NRO_LEGAJO);
    }
    
    public function CUIL(){
			return ($this->CUIL);
    }

    public function ApellidoNombre(){
    	return ($this->ApellidoNombre);
    }

    public function IdLegajo(){
    	return ($this->IdLegajo);
    }

    public function FechaIngreso(){
      return (date("d/m/Y", strtotime($this->FechaIngreso)));
    }

    public function Desempeno(){
    	return ($this->Desempeno);
    }

    public function Descripcion(){
    	return ($this->Descripcion);
    }

    public function Jurisdiccion(){
    	return ($this->Jurisdiccion);
    }

    public function Conyuge(){
    	return ($this->Conyuge);
    }

    public function Hijos(){
    	return ($this->Hijos);
    }

    public function OSEPVoluntario(){
    	return ($this->OSEPVoluntario);
    }

    public function OSEPVoluntarioEstudiante(){
    	return ($this->OSEPVoluntarioEstudiante);
    }

    public function OSEPIndirecto(){
    	return ($this->OSEPIndirecto);
    }

    public function Reparticion(){
    	return ($this->Reparticion);
    }

    public function DiasTrabajados(){
    	return ($this->DiasTrabajados);
    }

    public function Convenio(){
    	return ($this->Convenio);
    }

    public function BancoAcreditacion(){
      return ($this->BancoAcreditacion);
    }

    public function HaberesSujeto(){
    	return ($this->HaberesSujeto);
    }


    public function NumeroLiquidacion(){
    	return($this->NumeroLiquidacion);
    }
    public function HaberesNoSujeto(){
    	return ($this->HaberesNoSujeto);
    }

    public function Retenciones(){
    	return ($this->Retenciones);
    }

    public function TotalHaberesNoSujeto(){
    	return ($this->TotalHaberesNoSujeto);
    }

    public function TotalHaberesSujeto(){
    	return ($this->TotalHaberesSujeto);
    }

    public function TotalAsignacionFamiliar(){
    	return ($this->TotalAsignacionFamiliar);	
    }

    public function TotalRetenciones(){
    	return ($this->TotalRetenciones);
    }

    public function Neto(){
    	return ($this->Neto);
    }

    public function NetoReal(){
      return ($this->NetoBase);
    }
	}
?>