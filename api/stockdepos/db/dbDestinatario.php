<?php

include_once("./db/dblocal.php");
header('Access-Control-Allow-Origin: *');

class dbDestinatario
{
    private $id;
    private $nombreCompleto;
    private $CUIT;
    private $domicilio;
    private $nroTelefono;
    private $email;
    private $activo;

    public function __construct()
    {
        $this->id = "";
        $this->nombreCompleto = "";
        $this->CUIT = 0;
        $this->domicilio = "";
        $this->nroTelefono = 0;
        $this->email = "";
        $this->activo = 0;
    }

    public function __destruct()
    {
        unset(
            $this->id,
            $this->nombreCompleto,
            $this->CUIT,
            $this->domicilio,
            $this->nroTelefono,
            $this->email,
            $this->activo
        );
    }

    public function buscarEmail($emailBuscado){
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT id FROM stockdepositos.destinatario WHERE email ='".$emailBuscado."' AND activo=1";
        $result = $dblocal->ConsultaSQL($sq);
        $email = array();

        if($dblocal->RegistrosAfectados()){
            while ($row = mysqli_fetch_assoc($result)) {
                $email[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($email);
    }

    public function buscarCUIT($CUITBuscado){
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT id, nombreCompleto, CUIT, domicilio, nroTelefono, email FROM stockdepositos.destinatario WHERE CUIT ='".$CUITBuscado."' AND activo=1";
        $result = $dblocal->ConsultaSQL($sq);
        $cuitBuscado = array();

        if($dblocal->RegistrosAfectados()){
            while ($row = mysqli_fetch_assoc($result)) {
                $cuitBuscado[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($cuitBuscado);
    }

    public function getDestinatarios()
    {
        $dblocal = dblocal::getInstancia();
        $sq = "SELECT * FROM stockdepositos.destinatario WHERE activo >= 0";
        $result = $dblocal->ConsultaSQL($sq);

        $destinatarios = array();

        if ($dblocal->RegistrosAfectados()) {
            while ($row = mysqli_fetch_assoc($result)) {
                $destinatarios[] = $row;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($destinatarios);
    }

    public function createDestinatario()
    {
        //$this->Error = "";
        $dblocal = dblocal::getInstancia();
        $sq = "INSERT INTO stockdepositos.destinatario(nombreCompleto, CUIT, domicilio, nroTelefono, email, activo) VALUE('" . $this->nombreCompleto . "', '" . $this->CUIT . "', '".$this->domicilio."', '".$this->nroTelefono."', '".$this->email."', 1)";
        $id = $dblocal->ConsultaInsert($sq);

        return ($id);
    }

    public function updateDestinatario($idDestinatario)
    {
        $dblocal = dblocal::getInstancia();
        $sq = "UPDATE stockdepositos.destinatario SET nombreCompleto='" . $this->nombreCompleto . "', CUIT='" . $this->CUIT . "', domicilio='" . $this->domicilio . "', nroTelefono='".$this->nroTelefono."', email='" . $this->email . "' WHERE id = " . $idDestinatario . "";
        $id = $dblocal->ConsultaActualizar($sq);
        return ($id);
    }

    public function deleteDestinatario($idDestinatario, $activoDestinatario)
    {
        $dblocal = dblocal::getInstancia();
        if ($activoDestinatario > 0) {
            $sq = "UPDATE stockdepositos.destinatario SET activo=0 WHERE id = " . $idDestinatario . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. DESACTIVADO";
            return ($id);
        } else if ($activoDestinatario < 1) {
            $sq = "UPDATE stockdepositos.destinatario SET activo=1 WHERE id = " . $idDestinatario . "";
            $id = $dblocal->ConsultaActualizar($sq);
            echo "FUNCIONO. ACTIVADO";
            return ($id);
        }
        
    }

    public function getNombreCompleto()
    {
        return ($this->nombreCompleto);
    }

    public function setNombreCompleto($Valor)
    {
        $this->nombreCompleto = $Valor;
    }

    public function getCUIT()
    {
        return ($this->CUIT);
    }

    public function setCUIT($Valor)
    {
        $this->CUIT = $Valor;
    }

    public function getDomicilio()
    {
        return ($this->domicilio);
    }

    public function setDomicilio($Valor)
    {
        $this->domicilio = $Valor;
    }

    public function getNroTelefono()
    {
        return ($this->nroTelefono);
    }

    public function setNroTelefono($Valor)
    {
        $this->nroTelefono = $Valor;
    }

    public function getEmail()
    {
        return ($this->email);
    }

    public function setEmail($Valor)
    {
        $this->email = $Valor;
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
