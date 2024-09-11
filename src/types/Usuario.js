import { Deposito } from "./Deposito";

export class Usuario{

    id = 0;
    nombreUsuario = '';
    contrasena = '';
    activo = 0;
    nombreCompleto = '';
    CUIT = '';
    administrador = 0;
    proveedores = 0;
    depositos = 0;
    destinatario = 0;
    materiales = 0;
    entregas = 0;
    recepciones = 0;
    informes = 0;
    usuarios = 0;
    depositoAsociado = 0;
    fechaBaja = null;
    fechaUM = new Date();
    GUID = 0;

    constructor(){
        
    }

};