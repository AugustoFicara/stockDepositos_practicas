<?php
	/**
	 * Clase de manejo de datos para un usuario
	 */
	include_once("./db/dblocal.php");

	class Reloj{
		private $idRelojes;
		public $Descripcion;
		public $IP;
		private $NumeroSerie;

		public function __construct($Descripcion, $IP){
			$this->Descripcion = $Descripcion;
			$this->IP = $IP;
		}
	}

	class Relojes{
		public $Relojes;

		public function __construct(){
			$this->Relojes = null;
			$this->Error = "";
			$this->Obtener();
		}

		private function Obtener(){
			$sq = "SELECT Descripcion, IP FROM marcaciones.relojes WHERE Activo > 0";
			$dblocal = dblocal::getInstancia();
			$result = $dblocal->ConsultaSQL($sq);
			if($dblocal->RegistrosAfectados()){
				while ($row = mysqli_fetch_row($result)) {
					$this->Relojes[] = new Reloj($row[0], $row[1]);
				}
			}
		}
	}

?>