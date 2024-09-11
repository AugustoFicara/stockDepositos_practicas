<?php

include_once("./db/dblocal.php");
header('Access-Control-Allow-Origin: *');

class dbMaterial
{
    private $id;
    private $nombreMaterial;
    private $descripcion;
    private $activo;

    public function __construct()
    {
        $this->id = "";
        $this->nombreMaterial = "";
        $this->descripcion = "";
        $this->activo = 0;
    }

    public function __destruct()
    {
        unset(
            $this->id,
            $this->nombreMaterial,
            $this->descripcion,
            $this->activo
        );
    }

    public function buscarNombreMaterial($materialBuscado){
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
    }

    public function getMaterialesActivosStock()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT m.* FROM stockdepositos.material m WHERE m.activo > 0 AND NOT EXISTS (SELECT 1 FROM stockdepositos.stock med WHERE med.id_material = m.id AND med.activo > 0)";
        $result = $dblocal->ConsultaSQL($sq);

        $materiales = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $materiales[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($materiales);
    }

    public function getMaterialesActivos()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.material WHERE activo = 1";
        $result = $dblocal->ConsultaSQL($sq);

        $materiales = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $materiales[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($materiales);
    }

    public function getMateriales()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.material WHERE activo >= 0";
        $result = $dblocal->ConsultaSQL($sq);

        $materiales = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $materiales[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($materiales);
    }

    public function createMaterial()
    {
        //$this->Error = "";
        $dblocal = dblocal::getInstancia();
        $sq = "INSERT INTO stockdepositos.material(nombreMaterial, descripcion, activo) VALUE('" . $this->nombreMaterial . "', '" . $this->descripcion . "', 1)";
        $id = $dblocal->ConsultaInsert($sq);

        
        return ($id);
    }

    public function updateMaterial($idMaterial)
    {
        $dblocal = dblocal::getInstancia();
        $sq = "UPDATE stockdepositos.material SET nombreMaterial='" . $this->nombreMaterial . "', descripcion='" . $this->descripcion . "' WHERE id = " . $idMaterial . "";
        $id = $dblocal->ConsultaActualizar($sq);
        return ($id);
    }

    public function deleteMaterial($idMaterial, $activoMaterial)
    {
        $dblocal = dblocal::getInstancia();
        if ($activoMaterial > 0) {
            $sq = "UPDATE stockdepositos.material SET activo=0 WHERE id = " . $idMaterial . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. DESACTIVADO";
            return ($id);
        } else if ($activoMaterial < 1) {
            $sq = "UPDATE stockdepositos.material SET activo=1 WHERE id = " . $idMaterial . "";
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

    public function getNombreMaterial()
    {
        return ($this->nombreMaterial);
    }

    public function setNombreMaterial($Valor)
    {
        $this->nombreMaterial = $Valor;
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
