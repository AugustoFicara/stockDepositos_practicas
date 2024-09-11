<?php

include_once("./db/dblocal.php");
header('Access-Control-Allow-Origin: *');

class dbEntrega
{
    private $id;
    private $cantidadEntrega;
    private $fechaHoraEntrega;
    private $observaciones;
    private $id_destinatario;
    private $id_usuario;
    private $id_deposito;
    private $id_stock;
    private $activo;

    public function __construct()
    {
        $this->id = "";
        $this->cantidadEntrega = "";
        $this->fechaHoraEntrega = "";
        $this->observaciones = "";
        $this->id_destinatario = 0;
        $this->id_usuario = 0;
        $this->id_deposito = 0;
        $this->id_stock = 0;
        $this->activo = 0;
    }

    public function __destruct()
    {
        unset(
            $this->id,
            $this->cantidadEntrega,
            $this->fechaHoraEntrega,
            $this->observaciones,
            $this->id_destinatario,
            $this->id_usuario,
            $this->id_deposito,
            $this->id_stock,
            $this->activo
        );
    }

    public function getEntregas()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.entrega WHERE activo >= 0";
        $result = $dblocal->ConsultaSQL($sq);

        $entregas = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $entregas[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($entregas);
    }

    /*public function createDeposito()
    {
        //$this->Error = "";
        $dblocal = dblocal::getInstancia();
        $sq = "INSERT INTO stockdepositos.deposito(descripcion, domicilio, activo) VALUE('" . $this->descripcion . "', '" . $this->domicilio . "', 1)";
        $id = $dblocal->ConsultaInsert($sq);

        return ($id);
    }

    public function updateDeposito($idDeposito)
    {
        $dblocal = dblocal::getInstancia();
        $sq = "UPDATE stockdepositos.deposito SET descripcion='" . $this->descripcion . "', domicilio='" . $this->domicilio . "' WHERE id = " . $idDeposito . "";
        $id = $dblocal->ConsultaActualizar($sq);
        return ($id);
    }

    public function deleteDeposito($idDeposito, $activoDeposito)
    {
        $dblocal = dblocal::getInstancia();
        if ($activoDeposito > 0) {
            $sq = "UPDATE stockdepositos.deposito SET activo=0 WHERE id = " . $idDeposito . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. DESACTIVADO";
            return ($id);
        } else if ($activoDeposito < 1) {
            $sq = "UPDATE stockdepositos.deposito SET activo=1 WHERE id = " . $idDeposito . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. ACTIVADO";
            return ($id);
        }
        
    }*/

    public function getCantidadEntrega()
    {
        return $this->cantidadEntrega;
    }

    public function setCantidadEntrega($cantidadEntrega)
    {
        $this->cantidadEntrega = $cantidadEntrega;
    }

    public function getFechaHoraEntrega()
    {
        return $this->fechaHoraEntrega;
    }

    public function setFechaHoraEntrega($fechaHoraEntrega)
    {
        $this->fechaHoraEntrega = $fechaHoraEntrega;
    }

    public function getObservaciones()
    {
        return $this->observaciones;
    }

    public function setObservaciones($observaciones)
    {
        $this->observaciones = $observaciones;
    }

    public function getIdDestinatario()
    {
        return $this->id_destinatario;
    }

    public function setIdDestinatario($id_destinatario)
    {
        $this->id_destinatario = $id_destinatario;
    }

    public function getIdUsuario()
    {
        return $this->id_usuario;
    }

    public function setIdUsuario($id_usuario)
    {
        $this->id_usuario = $id_usuario;
    }

    public function getIdDeposito()
    {
        return $this->id_deposito;
    }

    public function setIdDeposito($id_deposito)
    {
        $this->id_deposito = $id_deposito;
    }

    public function getIdStock()
    {
        return $this->id_stock;
    }

    public function setIdStock($id_stock)
    {
        $this->id_stock = $id_stock;
    }

    public function getActivo()
    {
        return ($this->activo);
    }

    public function setActivo($Valor)
    {
        $this->activo = $Valor;
    }
}
