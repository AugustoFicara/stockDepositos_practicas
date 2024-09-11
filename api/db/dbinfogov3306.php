<?php
	class dbInfogov3306{
	  static private $instancia = NULL;
	  private $servidor;
	  private $usuario;
	  private $password;
	  private $basedatos;
	  private $conexion;
	  private $puerto;
	  private $Afectadas;

	  public function __construct(){
			$this->servidor = '172.16.48.176';
			$this->usuario = 'vistaspers';
			$this->password = 'v1st4sp3rs0n4l';
			$this->basedatos = 'personal';
			$this->puerto = '3306';
			$this->Afectadas = 0;
			$this->conectar();
	  }

	  //Función de conexión
	  private function conectar(){
			$this->conexion = mysqli_connect($this->servidor,$this->usuario,$this->password,$this->basedatos,$this->puerto) or die (mysqli_error($this->conexion));
	  }

	  public function desconectar(){
			mysqli_close($this->conexion);
	  }

	  public function ConsultaSQL($consulta){
			$res = mysqli_query($this->conexion, $consulta) or die (mysqli_error($this->conexion));
			$this->Afectadas =mysqli_affected_rows($this->conexion);
			return $res;
	  }

		public function ConsultaInsert($Consulta){
			$res = mysqli_query($this->conexion,$Consulta) or die (mysqli_error($this->conexion));
			$id = mysqli_insert_id($this->conexion);
			return $id;

		}

		static public function getInstancia() {
			if (self::$instancia == NULL) {
				self::$instancia = new dbInfogov3306();
			}
			return self::$instancia;
	  }

		public function RegistrosAfectados(){
			return $this->Afectadas;
		}
	}
?>
