<?php
	class dblocal{
	  static private $instancia = NULL;
	  private $servidor;
	  private $usuario;
	  private $password;
	  private $basedatos;  
	  private $conexion;
	  private $Afectadas;
	  private $Error;

	  public function __construct(){

      if(getenv('HTTP_HOST') == "api.rd.gob.ar"){
	  		//$this->servidor = 'localhost';
        $this->servidor = '192.168.253.120';
        $this->usuario = 'amadeo';
        $this->password = 'jose23225';
        $this->basedatos = '';
      }else{
     	  $this->servidor = 'localhost';
			  $this->usuario = 'root';
		  	$this->password = '';
		  	$this->basedatos = '';
      }
			$this->Afectadas = 0;
			$this->Error = "";
			$this->conectar();
    }

	  public function __destruct(){
	  	unset($this->servidor, $this->usuario, $this->password,	$this->basedatos, $this->Afectadas, $this->Error);
	  }

	  //Función de conexión
	  private function conectar(){
			$this->conexion = mysqli_connect($this->servidor,$this->usuario,$this->password,$this->basedatos) or die (mysqli_error($this->conexion));
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
			if (mysqli_connect_errno()) {
		    $this->Error = "Error de conección ".$Consulta;
		    return null;
			}else{
				$res = mysqli_query($this->conexion, $Consulta);
				$id = mysqli_insert_id($this->conexion);
				if(mysqli_error($this->conexion)){
					$this->Error = mysqli_error($this->conexion);
				}
				return $id;
			}
		}

		public function ConsultaActualizar($consulta){
			if(mysqli_connect_errno()){
				$this->Error = "Error de conección ".$Consulta;
		    return null;
			}else{
				$Filas = mysqli_query($this->conexion, $consulta);
				return mysqli_affected_rows($this->conexion);
			}
		}

		static public function getInstancia() {
			if (self::$instancia == NULL) {
				self::$instancia = new dblocal();
			}
			return self::$instancia;
	  }

		public function RegistrosAfectados(){
			return $this->Afectadas;
		}

		public function Error(){
			return $this->Error;
		}
	}
?>
