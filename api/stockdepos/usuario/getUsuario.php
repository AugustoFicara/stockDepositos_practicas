<?php
    include('Respuesta.php');
    include_once('./stockdepos/db/dbUsuario.php');
    $buscarUsuarios=1;
    $buscarCuit=2;
    $buscarNombreUsuario=3;
    $buscarUsuarioCompleto = 4;

    if ($buscarUsuarios == getallheaders()['buscar']) {
        $Respuesta = new Respuesta();
        $usuario = new dbUsuario();
        $usuario->ObtenerUsuariosJSON();
	} else if ($buscarNombreUsuario == getallheaders()['buscar']){
        $Respuesta = new Respuesta();
		$Usuario = new dbUsuario();
		$Usuario->buscarNombreUsuario(getallheaders()['idCab']);
    } else if ($buscarCuit == getallheaders()['buscar']) {
        $Respuesta = new Respuesta();
		$Usuario = new dbUsuario();
		$Usuario->buscarCUIT(getallheaders()['idCab']);
	} else if ($buscarUsuarioCompleto == getallheaders()['buscar']) {
        $Respuesta = new Respuesta();
		$Usuario = new dbUsuario();
		$Usuario->buscarUsuarioCompleto(getallheaders()['idCab']);
	} 

?>