<?php
/**
 * Clase de manejo de datos para un usuario
 */
include_once("./db/dblocal.php");
class dbUsuario
{
	private $id;
	private $nombreUsuario;
	private $contrasena;
	private $usuarioActivo;
	private $nombreCompleto;
	private $cuit;
	private $administrador;
	private $depositos;
	private $destinatario;
	private $materiales;
	private $entregas;
	private $recepciones;
	private $informes;
	private $usuarios;
	private $proveedores;
	private $depositoAsociado;
	private $fechaBaja;
	private $fechaUM;

	public function __construct()
	{
		$this->id = "";
		$this->nombreUsuario = "";
		$this->contrasena = "";
		$this->usuarioActivo = 0;
		$this->nombreCompleto = "";
		$this->cuit = 0;
		$this->administrador = 0;
		$this->depositos = 0;
		$this->destinatario = 0;
		$this->materiales = 0;
		$this->entregas = 0;
		$this->recepciones = 0;
		$this->informes = 0;
		$this->usuarios = 0;
		$this->proveedores = 0;
		$this->depositoAsociado = 0;
		$this->fechaBaja = null;
	}

	public function __destruct()
	{
		unset(
			$this->id,
			$this->nombreUsuario,
			$this->contrasena,
			$this->usuarioActivo,
			$this->nombreCompleto,
			$this->cuit,
			$this->administrador,
			$this->depositos,
			$this->destinatario,
			$this->materiales,
			$this->entregas,
			$this->recepciones,
			$this->informes,
			$this->usuarios,
			$this->proveedores,
			$this->depositoAsociado,
			$this->fechaBaja
		);
	}

	public function buscarUsuarioCompleto($nombreUsuarioBuscado)
	{
		$dblocal = dblocal::getInstancia();
		$sq = "SELECT administrador, proveedores, depositos, destinatario, materiales, entregas, recepciones, informes, usuarios, id_deposito FROM stockdepositos.usuario WHERE nombreUsuario ='" . $nombreUsuarioBuscado . "' AND activo > 0";
		$result = $dblocal->ConsultaSQL($sq);
		$usuarioBuscado = array();

		if ($dblocal->RegistrosAfectados()) {
			while ($row = mysqli_fetch_assoc($result)) {
				$usuarioBuscado[] = $row;
			}
		}

		header('Content-Type: application/json');
		echo json_encode($usuarioBuscado);
	}

	public function BuscarUsuario($nombreUsuario)
	{
		$dblocal = dblocal::getInstancia();
		$sq = "SELECT nombreUsuario, contrasena, nombreCompleto, cuit";
		$sq .= " FROM stockdepositos.usuario WHERE nombreUsuario ='" . $nombreUsuario . "' AND activo=1";
		$result = $dblocal->ConsultaSQL($sq);
		if ($dblocal->RegistrosAfectados()) {
			while ($row = mysqli_fetch_row($result)) {
				$this->nombreUsuario = $row[0];
				$this->contrasena = $row[1];
				$this->nombreCompleto = $row[2];
				$this->cuit = $row[3];
			}
			return true;
		}
		return false;
	}

	public function buscarCUIT($CUITBuscado)
	{
		$dblocal = dblocal::getInstancia();
		$sq = "SELECT id FROM stockdepositos.usuario WHERE CUIT ='" . $CUITBuscado . "' AND activo=1";
		$result = $dblocal->ConsultaSQL($sq);
		$cuitBuscado = array();

		if ($dblocal->RegistrosAfectados()) {
			while ($row = mysqli_fetch_assoc($result)) {
				$cuitBuscado[] = $row;
			}
		}

		header('Content-Type: application/json');
		echo json_encode($cuitBuscado);
	}

	public function buscarNombreUsuario($nombreUsuarioBuscado)
	{
		$dblocal = dblocal::getInstancia();
		$sq = "SELECT id FROM stockdepositos.usuario WHERE nombreUsuario ='" . $nombreUsuarioBuscado . "' AND activo=1";
		$result = $dblocal->ConsultaSQL($sq);
		$usuarioBuscado = array();

		if ($dblocal->RegistrosAfectados()) {
			while ($row = mysqli_fetch_assoc($result)) {
				$usuarioBuscado[] = $row;
			}
		}

		header('Content-Type: application/json');
		echo json_encode($usuarioBuscado);
	}

	public function createUsuario()
	{
		//$this->Error = "";
		$dblocal = dblocal::getInstancia();
		$sq = "INSERT INTO stockdepositos.usuario(nombreUsuario, contrasena, activo, nombreCompleto, CUIT, administrador, depositos, destinatario, materiales, entregas, recepciones, informes, usuarios, proveedores, id_deposito) VALUE('" . $this->nombreUsuario . "', '" . $this->contrasena . "', 1, '" . $this->nombreCompleto . "', '" . $this->cuit . "', '" . $this->administrador . "', '" . $this->depositos . "', '" . $this->destinatario . "', '" . $this->materiales . "', '" . $this->entregas . "', '" . $this->recepciones . "', '" . $this->informes . "', '" . $this->usuarios . "', '" . $this->proveedores . "', '" . $this->depositoAsociado . "')";
		$id = $dblocal->ConsultaInsert($sq);

		return ($id);
	}

	public function updateUsuario($idUsuario)
	{
		//$this->Error = "";
		$dblocal = dblocal::getInstancia();
		$sq = "UPDATE stockdepositos.usuario SET nombreUsuario='" . $this->nombreUsuario . "', contrasena='" . $this->contrasena . "', nombreCompleto='" . $this->nombreCompleto . "', administrador='" . $this->administrador . "', depositos='" . $this->depositos . "', destinatario='" . $this->destinatario . "', materiales='" . $this->materiales . "', entregas='" . $this->entregas . "', recepciones='" . $this->recepciones . "', informes='" . $this->informes . "', usuarios='" . $this->usuarios . "', proveedores='" . $this->proveedores . "', id_deposito='" . $this->depositoAsociado . "' WHERE id = " . $idUsuario . "";
		$id = $dblocal->ConsultaActualizar($sq);

		return ($id);
	}

	public function deleteUsuario($idUsuario, $activoUsuario)
    {
        $dblocal = dblocal::getInstancia();
        if ($activoUsuario > 0) {
            $sq = "UPDATE stockdepositos.usuario SET activo=0 WHERE id = " . $idUsuario . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. DESACTIVADO";
            return ($id);
        } else if ($activoUsuario < 1) {
            $sq = "UPDATE stockdepositos.usuario SET activo=1 WHERE id = " . $idUsuario . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. ACTIVADO";
            return ($id);
        }
        
    }



	public function conexionActiva($ID, $Nombre, $UsuarioItem, $UsuarioD)
	{
		$dblocal = dblocal::getInstancia();
		$sq = "DELETE FROM stockdepositos.activas WHERE cuit ='" . $UsuarioD . "'";
		$dblocal->ConsultaInsert($sq);
		$sq = "INSERT INTO stockdepositos.activas(id, nombre, usuario, cuit) VALUES (";
		$sq .= "'" . $ID . "',";
		$sq .= "'" . $Nombre . "',";
		$sq .= "'" . $UsuarioItem . "',";
		$sq .= "'" . $UsuarioD . "')";
		$id = $dblocal->ConsultaInsert($sq);
	}

	public function ObtenerUsuariosJSON()
	{
		$dblocal = dblocal::getInstancia();
		$sq = "SELECT u.*, d.descripcion AS descripcionDeposito FROM stockdepositos.usuario u LEFT JOIN stockdepositos.deposito d ON u.id_deposito = d.id WHERE u.activo >= 0";
		$result = $dblocal->ConsultaSQL($sq);

		$usuarios = array();

		if ($dblocal->RegistrosAfectados()) {
			while ($row = mysqli_fetch_assoc($result)) {
				$usuarios[] = $row;
			}
		}

		header('Content-Type: application/json');
		echo json_encode($usuarios);
	}



	public function Cerrar()
	{
		$this->__destruct();
	}

	public function getAdministrador()
	{
		return ($this->administrador);
	}

	public function setAdministrador($Valor)
	{
		$this->administrador = $Valor;
	}

	public function getDepositos()
	{
		return ($this->depositos);
	}

	public function setDepositos($Valor)
	{
		$this->depositos = $Valor;
	}

	public function getDestinatario()
	{
		return ($this->destinatario);
	}

	public function setDestinatario($Valor)
	{
		$this->destinatario = $Valor;
	}

	public function getMateriales()
	{
		return ($this->materiales);
	}

	public function setMateriales($Valor)
	{
		$this->materiales = $Valor;
	}

	public function getEntregas()
	{
		return ($this->entregas);
	}

	public function setEntregas($Valor)
	{
		$this->entregas = $Valor;
	}

	public function getRecepciones()
	{
		return ($this->recepciones);
	}

	public function setRecepciones($Valor)
	{
		$this->recepciones = $Valor;
	}

	public function getInformes()
	{
		return ($this->informes);
	}

	public function setInformes($Valor)
	{
		$this->informes = $Valor;
	}

	public function getUsuarios()
	{
		return ($this->usuarios);
	}

	public function setUsuarios($Valor)
	{
		$this->usuarios = $Valor;
	}

	public function getDepositoAsociado()
	{
		return ($this->depositoAsociado);
	}

	public function setDepositoAsociado($Valor)
	{
		$this->depositoAsociado = $Valor;
	}

	public function getCuit()
	{
		return ($this->cuit);
	}

	public function setCuit($Valor)
	{
		$this->cuit = $Valor;
	}

	public function getNombreUsuario()
	{
		return ($this->nombreUsuario);
	}

	public function setNombreUsuario($Valor)
	{
		$this->nombreUsuario = $Valor;
	}

	public function getContrasena()
	{
		return ($this->contrasena);
	}

	public function setContrasena($Valor)
	{
		$this->contrasena = $Valor;
	}

	public function getNombreCompleto()
	{
		return ($this->nombreCompleto);
	}

	public function setNombreCompleto($Valor)
	{
		$this->nombreCompleto = $Valor;
	}

	public function getUsuarioActivo()
	{
		return ($this->usuarioActivo);
	}

	public function setUsuarioActivo($Valor)
	{
		$this->usuarioActivo = $Valor;
	}

	public function getMsSql()
	{
		return ($this->mssql);
	}

	public function setMsSql($Valor)
	{
		$this->mssql = $Valor;
	}

	public function getFechaBaja()
	{
		return ($this->fechaBaja);
	}

	public function setFechaBaja($Valor)
	{
		$this->fechaBaja = $Valor;
	}

	public function getFechaIngreso()
	{
		return ($this->fechaIngreso);
	}

	public function getClase()
	{
		return ($this->clase);
	}

	public function getId()
	{
		return ($this->id);
	}

	public function Error()
	{
		return ($this->Error);
	}
}
?>