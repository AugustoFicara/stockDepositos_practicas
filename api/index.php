<?php
	// Para habilitar los errores en el servidor
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	$Error = "200"; //por omisión es una respuesta Ok
	ini_set('memory_limit', '-1');
	define('WEB_FOLDER', __DIR__ . '/');
	if(!isset($_GET['url'])){
		if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
			//include('seguridad1/optionSeguridad.php');
			include('seguridad1/optionSeguridad2.php');
		}elseif($_SERVER['REQUEST_METHOD'] == 'POST'){
			//include('seguridad1/postSeguridad.php');
			include('seguridad1/postSeguridad2.php');
		}else{
			include('meta.php');
		}
	}else{
			$url = $_GET['url'];
			$urlsep = explode("/", $url);
			$metodo = $_SERVER['REQUEST_METHOD'];
			switch ($urlsep[0]) {
				case 'rrhh':
					include('rechumanos/rrhh.php');
					break;
				case 'seguridad':
					switch ($urlsep[1]) {
						case 'usuarionuevo':
							include('seguridad1/usuarioNuevo.php');
							break;
						case 'solicitudseguridad':
							// Solicitud de cambio de clave, para enviarle un email con el link del usuario que lo solicito
							include('seguridad1/envioEmail.php');
							break;
						case 'cambiocontrasena':
							// Cambio de Contraseña
							include('seguridad1/cambiocontrasena.php');
							break;
						default:
							include('meta.php');
							break;
					}
					break;
				case 'organigrama':
					include('organigrama.php');
					$Respuesta = new WsPhpOgranigrama();
					include('Response.php');
					break;
				case 'rljmarcacion':
					include('relojm/marcacion.php');
					break;
				case 'lstrelojes':
					include('relojm/listarelojes.php');
					break;
				case 'prueba':
					if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
						include('seguridad1/optionSeguridad2.php');
					}else{
						echo "Sin Opciones";
					}
					break;
				case 'stingrlgn':
					if($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/login/postLogin.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
						include('./stockdepos/login/optionsLogin.php');
					}else{
						echo "Sin Opciones ***************";
					}
					break;
				case 'stusrperm':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/usuario/postUsuario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/usuario/putUsuario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/usuario/deleteUsuario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/usuario/getUsuario.php');
					}else{
						echo "Sin Opciones 'stusrperm'";
					}
					break;
				case 'stdepos':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/deposito/getDeposito.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/deposito/postDeposito.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/deposito/putDeposito.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/deposito/deleteDeposito.php');
					}else{
						echo "Sin opciones 'stdepos'";
					}
					break;
				case 'ststock':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/stock/getStock.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/stock/postStock.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/stock/putStock.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/stock/deleteStock.php');
					}else{
						echo "Sin opciones 'ststock'";
					}
					break;
				case 'stdest':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/destinatario/getDestinatario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/destinatario/postDestinatario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/destinatario/putDestinatario.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/destinatario/deleteDestinatario.php');
					}else{
						echo "Sin opciones 'stdest'";
					}
					break;
				case 'stprov':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/proveedor/getProveedor.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/proveedor/postProveedor.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/proveedor/putProveedor.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/proveedor/deleteProveedor.php');
					}else{
						echo "Sin opciones 'stprov'";
					}
					break;
				case 'stmat':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/material/getMaterial.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/material/postMaterial.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/material/putMaterial.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/material/deleteMaterial.php');
					}else{
						echo "Sin opciones 'stmat'";
					}
					break;
				case 'stmoventr':
					header('Access-Control-Allow-Origin: *');
					header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');
					header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, id, activo, crearUsuario, idCab, buscar, buscarCUIT");
					if($_SERVER['REQUEST_METHOD'] == 'GET') {
						include('./stockdepos/movimiento/entrega/getEntrega.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
						include('./stockdepos/movimiento/entrega/postEntrega.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
						include('./stockdepos/movimiento/entrega/putEntrega.php');
					}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
						include('./stockdepos/movimiento/entrega/deleteEntrega.php');
					}else{
						echo "Sin opciones 'stmoventr'";
					}
					break;
				default:
					echo "Es un parametro no delimitado?? ---".$urlsep[0];
					//include('meta.php');
					break;
			}

	}

?>
