<?php
	class Respuesta { 
		private $Version = "1.1.0";
		private $ErrorDescripcion = [
			0 => Null,
			1 => ["Numero" => "101", "Descripción" => "Falta formato JSON", "Codigo" => "405", "Detalle"=>"Falta formato JSON"],
			2 => ["Numero" => "102", "Descripción" => "JSON Incompleto o con errores", "Codigo" => "406", "Detalle"=>"JSON Incompleto o con errores"],
			3 => ["Numero" => "103", "Descripción" => "Falta body de la petición web", "Codigo" => "407", "Detalle"=>"Falta body de la petición web"],
			4 => ["Numero" => "437", "Descripción" => "Error de usuario o contraseña", "Codigo" => "1101", "Detalle"=>"Error de usuario o contraseña"],
			5 => ["Numero" => "438", "Descripción" => "El certificado de la conexion es erroneo", "Codigo" => "1101", "Detalle"=>"El certificado de la conexion es erroneo"],
			6 => ["Numero" => "439", "Descripción" => "Datos correctamente registrado", "Codigo" => "1102", "Detalle"=>"Datos correctamente registrado"],
			7 => ["Numero" => "439", "Descripción" => "Clase no coincidente al CUIT", "Codigo" => "1103", "Detalle"=>"Clase no coincidente al CUIT"],
			8 => ["Numero" => "439", "Descripción" => "Fecha ingreso no coincidente al CUIT", "Codigo" => "1104", "Detalle"=>"Fecha ingreso no coincidente al CUIT"],
			9 => ["Numero" => "439", "Descripción" => "Usuario anteriormente registrado", "Codigo" => "1105", "Detalle"=>"Usuario anteriormente registrado"],
			10 => ["Numero" => "448", "Descripción" => "Usuario con bono inexistente", "Codigo" => "1106", "Detalle"=>"Usuario con bono inexistente"],
			11 => ["Numero" => "449", "Descripción" => "Usuario ya registrado, use su clave de expediente", "Codigo" => "1107", "Detalle"=>"Usuario ya registrado, use su clave de expediente"],
			12 => ["Numero" => "457", "Descripción" => "No se pudo validar la firma", "Codigo" => "1001", "Detalle"=>"No se pudo validar la firma"],
			13 => ["Numero" => "103", "Descripción" => "Error al Imprimir su bono", "Codigo" => "1007", "Detalle"=>"Error al Imprimir su bono"],
			14 => ["Numero" => "440", "Descripción" => "Verifique los datos", "Codigo" => "1008", "Detalle"=>"No hay coincidencia entre los datos"],
			15 => ["Numero" => "441", "Descripción" => "Se produjo un error al actualizar la contraseña", "Codigo" => "1008", "Detalle"=>"No se puedo actualizar la contraseña nueva"]
		];

		function __construct(){
			// Constructor
		}

		function EncabezadoRespuestaJson(){
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Headers: *');
			header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
			header('Content-Type: application/json; charset=utf-8');
		}

		public function ErrorRespuesta($v){
			$this->EncabezadoRespuestaJson();
			header('HTTP/1.0'.' '.$v);
			$Salida["WebService"] = "MRphpServices";
			$Salida["Version"] = $this->Version;
			$Salida["Estado"] = "error";
			$Salida["detalle"][] = ["Descripcion" =>$this->ErrorDescripcion[$v]["Descripción"],
														"Numero" => $this->ErrorDescripcion[$v]["Numero"],
														"Codigo" => $this->ErrorDescripcion[$v]["Codigo"],
														"Detalle" => $this->ErrorDescripcion[$v]["Detalle"],
													 ];
			$myJSON = json_encode($Salida);
			print_r($myJSON);
		}

		public function SalidaOK($Consulta, $Mensaje){
			$Salida["WebService"] = "MRphpServices";
			$Salida["Version"] = $this->Version;
			$Salida[$Consulta] = $Mensaje;
			$this->MensajeRespuesta($Salida, 200, 0);
		}

		public function SalidaOK108($consulta){
			$this->EncabezadoRespuestaJson();
			print_r($consulta);
		}

		public function MensajeRespuesta($Mensaje, $Codigo, $Numero = 200){
			$this->EncabezadoRespuestaJson();
			if($Codigo == 200){
				$myJSON = json_encode($Mensaje);
				print_r($myJSON);
			}else{
				header("HTTP/1.1 ".$Codigo." Error Numero".$Numero);
				print_r($Mensaje);
			}
		}
	}
?>
