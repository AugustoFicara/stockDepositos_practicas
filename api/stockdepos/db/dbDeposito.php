<?php

include_once("./db/dblocal.php");
header('Access-Control-Allow-Origin: *');

class dbDeposito
{
    private $id;
    private $descripcion;
    private $domicilio;
    private $activo;

    public function __construct()
    {
        $this->id = "";
        $this->descripcion = "";
        $this->domicilio = "";
        $this->activo = 0;
    }

    public function __destruct()
    {
        unset(
            $this->id,
            $this->descripcion,
            $this->domicilio,
            $this->activo
        );
    }

    public function getDepositosActivos()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.deposito WHERE activo = 1";
        $result = $dblocal->ConsultaSQL($sq);

        $depositos = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $depositos[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($depositos);
    }

    public function getDepositos()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.deposito WHERE activo >= 0";
        $result = $dblocal->ConsultaSQL($sq);

        $depositos = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $depositos[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($depositos);
    }

    public function createDeposito()
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
        
    }

    public function getDescripcion()
    {
        return ($this->descripcion);
    }

    public function setDescripcion($Valor)
    {
        $this->descripcion = $Valor;
    }

    public function getDomicilio()
    {
        return ($this->domicilio);
    }

    public function setDomicilio($Valor)
    {
        $this->domicilio = $Valor;
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
