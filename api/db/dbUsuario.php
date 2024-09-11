<?php
	/**
	 * Clase de manejo de datos para un usuario
	 */
	include_once("./db/dblocal.php");
	include_once("./db/dbinfogov3306.php");
	include_once("./db/dbinfogov3307.php");
	include_once("./db/db101.php");
	class dbUsuario{
		private $id;
		private $cuit;
		private $apellidoNombre;
		private $activo;
		private $login;
		private $clave;
		private $email;
		private $telefono;
		private $mssql;
		private $fechaBaja;
		private $fechaIngreso;
		private $clase;
		private $Error;

		public function __construct(){
			$this->id = "";
			$this->cuit = "";
			$this->apellidoNombre = "";
			$this->activo = 0;
			$this->login = "";
			$this->clave = "";
			$this->email = "";
			$this->telefono = "";
			$this->mssql = 0;
			$this->fechaBaja = null;
			$this->Error = "";
		}

		public function __destruct(){
			unset($this->id, $this->cuit, $this->apellidoNombre, $this->activo, $this->login, $this->clave, $this->email, $this->telefono, $this->mssql, $this->fechaBaja, $this->Error);
		}

		public function AgregarUsuario(){
			$this->Error = "";
			$dblocal = dblocal::getInstancia();
			$sq = "INSERT INTO seguridad.usuarios(cuit, apellidoNombre, activo, login, clave, email, telefono, mssql) VALUE(";
			$sq .= "'".$this->cuit."','".$this->apellidoNombre."',$this->activo,'".$this->login."','".$this->clave."','";
			$sq .= $this->email."','".$this->telefono."',".$this->mssql.")";
			$id = $dblocal->ConsultaInsert($sq);

			if($dblocal->Error()){
				$this->Error = $dblocal->Error();
			}
			return($id);
		}

		public function BuscaCuitInfogov($Cuit){
			$fechaIngresoP = "1900-01-01";
			$fechaIngresoP3 = "1900-01-01";
			$apellidoNombreP = "";
			$apellidoNombreP3 = "";
			$claseP = "";
			$claseP3 = "";
			$this->Error = "";

			//personal Autoridades
			// Sistema de Infogov Puerto 3307
			$dbInfogov3307 = dbInfogov3307::getInstancia();
			$sq = "SELECT NoapLega, FeinLega, CodiClas";
			$sq .= " FROM personal3.vistaLiquidacion";
			$sq .= " WHERE CucuLega='".$Cuit."'";
			$sq .= " AND CodiLiqu = (SELECT MAX(CodiLiqu) FROM personal3.vistaLiquidacion WHERE CucuLega='".$Cuit."')";
			$result = $dbInfogov3307->ConsultaSQL($sq);
      while($row = mysqli_fetch_row($result)){
      	$apellidoNombreP = $row[0];
      	$fechaIngresoP = $row[1];
      	$claseP = $row[2];
      }
      mysqli_free_result($result);

			//personal3 Personal
			// Sistema de Infogov Puerto 3306
			$dbInfogov3306 = dbInfogov3306::getInstancia();

			$result = $dbInfogov3306->ConsultaSQL($sq);
      while($row = mysqli_fetch_row($result)){
      	$apellidoNombreP3 = $row[0];
      	$fechaIngresoP3 = $row[1];
      	$claseP3 = $row[2];
      }
      if($fechaIngresoP3 > $fechaIngresoP){
				$this->apellidoNombre = $apellidoNombreP3;
      	$this->fechaIngreso = $fechaIngresoP3;
      	$this->clase = $claseP3;
      }else{
				$this->apellidoNombre = $apellidoNombreP;
      	$this->fechaIngreso = $fechaIngresoP;
      	$this->clase = $claseP;
      }
      mysqli_free_result($result);
		}

		public function BuscarEmail($Cuit){
			$Email= null;
			//Buscar usuario en el 101
			$sq ="SELECT mediodecontacto.pmdcContacto, persona.persApeNom FROM mrzentral.mediodecontacto";
			$sq .= " INNER JOIN mrzentral.persona ON mrzentral.mediodecontacto.pmdcPersona = mrzentral.persona.persID";
			$sq .= " WHERE persCUI='".$Cuit."' AND pmdcEstado = 'Activo' AND pmdcTipo='email'";
			$db101 = db101::getInstancia();
			$result = $db101->ConsultaSQL($sq);
			if($db101->RegistrosAfectados()){
				while ($row = mysqli_fetch_row($result)) {
					$Email = $row[0];
					$this->apellidoNombre = $row[1];
					$this->cuit = $Cuit;
				}
			}
			if($Email == null){
				//Si no lo encuentra buscar usuario en localhost 120
				$sq = "SELECT email, apellidoNombre FROM seguridad.usuarios WHERE cuit = '".$Cuit."'";
				$dblocal = dblocal::getInstancia();
				$result = $dblocal->ConsultaSQL($sq);
				if($dblocal->RegistrosAfectados()){
					while ($row = mysqli_fetch_row($result)) {
						$Email = $row[0];
						$this->apellidoNombre = $row[1];
						$this->cuit = $Cuit;
					}
				}
			}
			//busca el ID de l ultima conexión
			$sq = "SELECT id FROM seguridad.activas WHERE cuit='".$Cuit."'";
			$dblocal = dblocal::getInstancia();
			$result = $dblocal->ConsultaSQL($sq);
			if($dblocal->RegistrosAfectados()){
				while ($row = mysqli_fetch_row($result)) {
					$this->id = $row[0];
				}
			}
			return $Email;
		}

		public function BuscarUsuarioSeguridad($Cuit){
			$Encontrado = false;
			$dblocal = dblocal::getInstancia();
			$sq = "SELECT cuit FROM seguridad.usuarios WHERE cuit ='".$Cuit."'";
			$result = $dblocal->ConsultaSQL($sq);
			if($dblocal->RegistrosAfectados()){
				$Encontrado = true;
			}
			return $Encontrado;
		}

/*
		public function BuscarUsuarioMRZentral($Cuit){
			$Encontrado = false;
			$db101 = db101::getInstancia();
			$sq = "SELECT  persApeNom FROM mrzentral.usuarioapp";
			$sq .= " INNER JOIN mrzentral.persona ON mrzentral.usuarioapp.usraPersona = mrzentral.persona.persID";
			$sq .= " WHERE persCUI ='".$Cuit."'";
			$result = $db101->ConsultaSQL($sq);
			if($db101->RegistrosAfectados()){
				$Encontrado = true;
				$this->usuarioPasswordMRZentral($Cuit);
			}
			return $Encontrado;	
		}
*/

		public function BuscarUsuario($Cuit){
			$this->usuarioPasswordMRZentral($Cuit);
			if(is_null($this->apellidoNombre)){
				$this->usuarioPasswordRegistrado($Cuit);	
			}
		}

		public function usuarioPasswordRegistrado($Cuit){
			$dblocal = dblocal::getInstancia();
			$sq = "SELECT  cuit, apellidoNombre, clave, login, email,telefono";
			$sq.= " FROM seguridad.usuarios WHERE cuit ='".$Cuit."' AND activo=1";
			$result = $dblocal->ConsultaSQL($sq);
			if($dblocal->RegistrosAfectados()){
				while ($row = mysqli_fetch_row($result)) {
					$this->cuit = $row[0];
					$this->apellidoNombre = $row[1];
					$this->clave = $row[2];
					$this->login = $row[3];
					$this->email = $row[4];
					$this->telefono = $row[5];
				}
				return true;
			}
			return false;
		}

		public function usuarioPasswordMRZentral($Cuit){
			$db101 = db101::getInstancia();
			$sq = "SELECT persID,persApeNom,Min(usraNombre),usraClave,";
			$sq .= " (SELECT pmdcContacto FROM mrzentral.mediodecontacto";
			$sq .= " WHERE pmdcPersona = (SELECT persID FROM mrzentral.persona WHERE persCUI='".$Cuit."')";
			$sq .= " AND pmdcTipo='Celular'  AND pmdcEstado='Activo') AS telefono,";
			$sq .= " (SELECT pmdcContacto FROM mrzentral.mediodecontacto";
			$sq .= " WHERE pmdcPersona = (SELECT persID FROM mrzentral.persona WHERE persCUI='".$Cuit."')";
			$sq .= " AND pmdcTipo='email' AND pmdcEstado='Activo') AS email";
			$sq .= " FROM mrzentral.persona";
			$sq .= " INNER JOIN mrzentral.usuarioapp ON persID=usraPersona";
			$sq .= " WHERE persCUI='".$Cuit."' AND usraActivo=1";
			$result = $db101->ConsultaSQL($sq);
			if($db101->RegistrosAfectados()){
				while ($row = mysqli_fetch_row($result)) {
					$this->cuit = $Cuit;
					$this->apellidoNombre = $row[1];
					$this->login = $row[2];
					$this->clave = $row[3];
					$this->telefono = $row[4];
					$this->email = $row[5];
				}
				return true;
			}
			return false;
		}		

		public function conexionActiva($ID, $Nombre, $UsuarioItem, $UsuarioD){
			$dblocal = dblocal::getInstancia();
	 		$sq = "DELETE FROM seguridad.activas WHERE CUIT ='".$UsuarioD."'";
	 		$dblocal->ConsultaInsert($sq);
	 		$sq = "INSERT INTO seguridad.activas(ID, Nombre, Usuario, CUIT) VALUES (";
	 		$sq .= "'".$ID."',";
	 		$sq .= "'".$Nombre."',";
	 		$sq .= "'".$UsuarioItem."',";
	 		$sq .= "'".$UsuarioD."')";
	 		$id = $dblocal->ConsultaInsert($sq);
		}

		public function cambioClave($Cuit, $NuevaClave){
			$E = 0;
			//Cambio la clave en el 101
			$db101 = db101::getInstancia();
			$sq = "SELECT persID FROM mrzentral.persona WHERE persCUI=".$Cuit;
			$result = $db101->ConsultaSQL($sq);
			if($db101->RegistrosAfectados() == 1){
				while ($row = mysqli_fetch_row($result)) {
					$PersID = $row[0];
				}
				if($PersID > 0){
					$sq = "UPDATE mrzentral.usuarioapp SET usraClave='' WHERE usraPersona=".$PersID;
					$filaAfectadas = $db101->ConsultaActualizar($sq);
					$sq = "UPDATE mrzentral.usuarioapp SET usraClave='".$NuevaClave."' WHERE usraPersona=".$PersID;
					$filaAfectadas = $db101->ConsultaActualizar($sq);
					if($filaAfectadas == 1){
						// NO hay error
						$E = 1;
					}
				}
			}
			//Cambio la clave en el 120
			$dblocal = dblocal::getInstancia();
			$sq = "UPDATE seguridad.usuarios SET clave='".$NuevaClave."' WHERE cuit='".$Cuit."'";
			$filaAfectadas = $dblocal->ConsultaActualizar($sq);
			if($filaAfectadas == 1){
				//NO hay Error
				$E = 1;
			}
			if($E != 1){
				//Hay Error
				$this->Error = "Se produjo un error al actualizar la contraseña";
			}
		}

		public function Cerrar(){
			$this->__destruct();
		}

		public function getCuit(){
			return($this->cuit);
		}
		
		public function setCuit($Valor){
			$this->cuit = $Valor;
		}

		public function getApellidoNombre(){
			return($this->apellidoNombre);
		}
		
		public function setApellidoNombre($Valor){
			$this->apellidoNombre = $Valor;
		}

		public function getActivo(){
			return($this->activo);
		}
		
		public function setActivo($Valor){
			$this->activo = $Valor;
		}

		public function getLogin(){
			return($this->login);
		}
		
		public function setLogin($Valor){
			$this->login = $Valor;
		}
		
		public function getClave(){
			return($this->clave);
		}

		public function setClave($Valor){
			$this->clave = $Valor;
		}

		public function getEmail(){
			return($this->email);
		}

		public function setEmail($Valor){
			$this->email = $Valor;
		}
		
		public function getTelefono(){
			return($this->telefono);
		}

		public function setTelefono($Valor){
			$this->telefono = $Valor;
		}
		
		public function getMsSql(){
			return($this->mssql);
		}

		public function setMsSql($Valor){
			$this->mssql = $Valor;
		}

		public function getFechaBaja(){
			return($this->fechaBaja);
		}

		public function setFechaBaja($Valor){
			$this->fechaBaja = $Valor;
		}

		public function getFechaIngreso(){
			return($this->fechaIngreso);
		}

		public function getClase(){
			return($this->clase);
		}

		public function getId(){
			return($this->id);
		}

		public function Error(){
			return($this->Error);
		}
	}
?>