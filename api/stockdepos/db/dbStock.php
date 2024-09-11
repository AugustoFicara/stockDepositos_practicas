<?php

include_once("./db/dblocal.php");
header('Access-Control-Allow-Origin: *');

class dbStock
{
    private $id;
    private $cantidadActual;
    private $id_material;
    private $id_deposito;

    private $activo;

    public function __construct()
    {
        $this->id = "";
        $this->cantidadActual = "";
        $this->id_material = "";
        $this->id_deposito = "";
        $this->activo = "";
    }

    public function __destruct()
    {
        unset(
            $this->id,
            $this->cantidadActual,
            $this->id_material,
            $this->id_deposito,
            $this->activo
        );
    }

    /*public function buscarNombreMaterial($materialBuscado){
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT id FROM stockdepositos.material WHERE nombreMaterial ='".$materialBuscado."' AND activo=1";
        $result = $dblocal->ConsultaSQL($sq);
        $material = array();

        if($dblocal->RegistrosAfectados()){
            while ($row = mysqli_fetch_assoc($result)) {
                $material[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($material);
    }*/

    public function getStockActivos()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT med.* FROM stockdepositos.stock med JOIN stockdepositos.material m ON med.id_material = m.id WHERE m.activo > 0 AND med.activo > 0";
        $result = $dblocal->ConsultaSQL($sq);

        $stock = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $stock[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($stock);
    }

    public function getStock()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT med.*, m.nombreMaterial, d.descripcion AS descripcionDeposito FROM stockdepositos.stock med JOIN stockdepositos.material m ON med.id_material = m.id JOIN stockdepositos.deposito d ON med.id_deposito = d.id WHERE m.activo >= 0";
        $result = $dblocal->ConsultaSQL($sq);

        $stock = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $stock[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($stock);
    }

    public function createStock()
    {
        //$this->Error = "";
        $dblocal = dblocal::getInstancia();
        $sq = "INSERT INTO stockdepositos.stock(cantidadActual, id_material, id_deposito, activo) VALUE('" . $this->cantidadActual . "', '" . $this->id_material . "', '" . $this->id_deposito . "', 1)";
        $id = $dblocal->ConsultaInsert($sq);

        return ($id);
    }

    public function updateStock($idStock)
    {
        $dblocal = dblocal::getInstancia();
        $sq = "UPDATE stockdepositos.stock SET cantidadActual='" . $this->cantidadActual . "' WHERE id = " . $idStock . "";
        $id = $dblocal->ConsultaActualizar($sq);
        return ($id);
    }

    public function deleteStock($idStock, $activoStock)
    {
        $dblocal = dblocal::getInstancia();
        if ($activoStock > 0) {
            $sq = "UPDATE stockdepositos.stock SET activo=0 WHERE id = " . $idStock . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. DESACTIVADO";
            return ($id);
        } else if ($activoStock < 1) {
            $sq = "UPDATE stockdepositos.stock SET activo=1 WHERE id = " . $idStock . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. ACTIVADO";
            return ($id);
        }

    }

    public function getId_Material()
    {
        return ($this->id_material);
    }

    public function setId_Material($Valor)
    {
        $this->id_material = $Valor;
    }

    public function getId_Deposito()
    {
        return ($this->id_deposito);
    }

    public function setId_Deposito($Valor)
    {
        $this->id_deposito = $Valor;
    }

    public function getCantidadActual()
    {
        return ($this->cantidadActual);
    }

    public function setCantidadActual($Valor)
    {
        $this->cantidadActual = $Valor;
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
