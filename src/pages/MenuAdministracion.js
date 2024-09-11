/* eslint-disable jsx-a11y/alt-text */
import Header from "../components/Header";
import IconoCuentaSidebar from "../img/icono-cuenta-sidebar.png";
import IconoCerrarSesion from "../img/icono-cerrar-sesion.png";
import IconoAjustes from "../img/icono-ajustes.png";
import { act, useEffect, useState } from "react";
import Depositos from "../components/Depositos/Depositos";
import Materiales from "../components/Materiales/Materiales.js"
import Destinatarios from "../components/Destinatarios/Destinatarios.js"
import Usuarios from "../components/Usuarios/Usuarios.js";
import Stocks from "../components/Stock/Stocks.js";
import Recepciones from '../components/Movimientos/Recepciones.js'
import Entregas from "../components/Movimientos/Entregas.js";
import Proveedores from "../components/Proveedores/Proveedores.js";
import Ajustes from "../components/Ajustes/Ajustes.js";
import { Usuario } from "../types/Usuario.js";
import IconoBienvenido from "../img/icono-bienvenido.png"
import { UsuarioService } from "../services/UsuarioService.js";

function MenuAdministracion() {
    //VALOR PERMISOS
    const sinPermiso = 0;
    const lectura = 1;
    const escritura = 2;
    const administrador = 1024;
    const [permAdministrador, setPermAdministrador] = useState(0);
    const [permDepositos, setPermDepositos] = useState(0);
    const [permDestinatario, setPermDestinatario] = useState(0);
    const [permMateriales, setPermMateriales] = useState(0);
    const [permEntregas, setPermEntregas] = useState(0);
    const [permRecepciones, setPermRecepciones] = useState(0);
    const [permInformes, setPermInformes] = useState(0);
    const [permUsuarios, setPermUsuarios] = useState(0);
    const [permProveedores, setPermProveedores] = useState(0);

    //VARIABLES
    const [activeSection, setActiveSection] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [depositoAsociado, setDepositoAsociado] = useState(0);
    const [mostrarDest, setMostrarDest] = useState(false);
    const [mostrarMov, setMostrarMov] = useState(false);
    const [mostrarOpc, setMostrarOpc] = useState(false);
    const [mostrarOpcionesDashboard, setMostrarOpcionesDashboard] = useState(false);

    //FUNCIONES
    useEffect(() => {
        const usuarioIniciado = sessionStorage.getItem("nombreUsuario");

        if (usuarioIniciado) {
            buscarUsuarioCompleto(usuarioIniciado);
            setNombreUsuario(usuarioIniciado);
        }

        document.title = "Stock - Menú de Administración"
    }, []);

    const buscarUsuarioCompleto = async (idCab) => {
        try {
            const usuario = await UsuarioService.buscarUsuarioCompleto(idCab);

            if (usuario.length > 0) {

                const administrador = parseInt(usuario[0].administrador, 10);
                const proveedores = parseInt(usuario[0].proveedores, 10);
                const depositos = parseInt(usuario[0].depositos, 10);
                const destinatario = parseInt(usuario[0].destinatario, 10);
                const materiales = parseInt(usuario[0].materiales, 10);
                const entregas = parseInt(usuario[0].entregas, 10);
                const recepciones = parseInt(usuario[0].recepciones, 10);
                const informes = parseInt(usuario[0].informes, 10);
                const usuarios = parseInt(usuario[0].usuarios, 10);
                const id_deposito = parseInt(usuario[0].id_deposito, 10);

                if (id_deposito > 0) {
                    setDepositoAsociado(id_deposito);
                }

                if (administrador > 0) {
                    setPermAdministrador(administrador);
                } else {
                    setPermProveedores(proveedores);
                    setPermDepositos(depositos);
                    setPermDestinatario(destinatario);
                    setPermMateriales(materiales);
                    setPermEntregas(entregas);
                    setPermRecepciones(recepciones);
                    setPermInformes(informes);
                    setPermUsuarios(usuarios);
                }
            }
        } catch (error) {
            console.log("Error al buscar permisos: ", error);
        }
    }

    const cerrarSesion = () => {
        sessionStorage.removeItem("nombreUsuario");
        window.location.href = "/";
    }

    const mostrarMovimientos = () => {
        setMostrarMov(!mostrarMov);
    }

    //CODIGO HTML
    return (
        <>
            <main className="d-flex flex-nowrap" style={{ minHeight: "100vh" }}>
                <div
                    className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark border-end border-secondary"
                    style={{ width: "280px" }}
                >
                    <a
                        href=""
                        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                    >
                        <span className="fs-5">Control de Stock</span>
                    </a>
                    <hr></hr>
                    <ul className="nav nav-pills flex-column mb-auto">
                        {permAdministrador > 0 ? (
                            <>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeSection === "Depositos" ? "active" : "text-white"
                                        }`} onClick={() => setActiveSection("Depositos")} style={{ cursor: 'pointer' }}>

                                        <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                            <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207l-5 5V13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 2 13.5V8.207l-.646.647a.5.5 0 1 1-.708-.708z" />
                                            <path d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.044c-.613-.181-.613-1.049 0-1.23l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                        </svg>
                                        Depósitos
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeSection === "Destinatarios" ? "active" : "text-white"
                                        }`} onClick={() => setActiveSection("Destinatarios")} style={{ cursor: 'pointer' }}>
                                        <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                        </svg>
                                        Destinatarios
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeSection === "Materiales" ? "active" : "text-white"
                                            }`}
                                        aria-current="page"
                                        onClick={() => setActiveSection("Materiales")}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <svg
                                            className="bi pe-none me-2 mb-1"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                        </svg>
                                        Materiales
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" onClick={mostrarMovimientos}
                                        style={{ cursor: 'pointer' }}>
                                        <svg
                                            className="bi pe-none me-2 mb-1"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                        </svg>
                                        Movimientos
                                        {mostrarMov ? (
                                            <svg className="bi pe-none ms-1" width="16" height="16" fill="currentColor">

                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />

                                            </svg>
                                        ) : (
                                            <svg className="bi pe-none ms-1" width="16" height="16" fill="currentColor">
                                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                            </svg>
                                        )}
                                    </a>
                                    {mostrarMov && (
                                        <>
                                            <a className={`nav-link p-1 ${activeSection === "Entregas" ? "active bg-secondary" : "text-white"}`} onClick={() => setActiveSection("Entregas")} style={{ cursor: 'pointer' }}>
                                                <svg className="bi pe-none ms-4 me-1" width="16" height="16" fill="currentColor" >
                                                    <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                                                </svg>
                                                <small>Entregas</small>
                                            </a>
                                            <a className={`nav-link p-1 ${activeSection === "Recepcion" ? "active bg-secondary" : "text-white"}`} onClick={() => setActiveSection("Recepcion")} style={{ cursor: 'pointer' }}>
                                                <svg className="bi pe-none ms-4 me-1" width="16" height="16" fill="currentColor">
                                                    <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                                <small>Recepciones</small>
                                            </a>
                                        </>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeSection === "Proveedores" ? "active" : "text-white"
                                        }`} onClick={() => setActiveSection("Proveedores")} style={{ cursor: 'pointer' }}>

                                        <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                        </svg>
                                        Proveedores
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeSection === "Stock" ? "active" : "text-white"
                                        }`} onClick={() => setActiveSection("Stock")} style={{ cursor: 'pointer' }}>

                                        <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor" >
                                            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                                        </svg>
                                        Stock
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${activeSection === "Usuarios" ? "active" : "text-white"
                                        }`} onClick={() => setActiveSection("Usuarios")} style={{ cursor: 'pointer' }}>
                                        <svg
                                            className="bi pe-none me-2 mb-1"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                            <path
                                                fillRule="evenodd"
                                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                            />
                                        </svg>
                                        Usuarios
                                    </a>
                                </li>
                            </>
                        ) : (
                            <>
                                {permDepositos > 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "Depositos" ? "active" : "text-white"
                                            }`} onClick={() => setActiveSection("Depositos")} style={{ cursor: 'pointer' }}>

                                            <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                                <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207l-5 5V13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 2 13.5V8.207l-.646.647a.5.5 0 1 1-.708-.708z" />
                                                <path d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.044c-.613-.181-.613-1.049 0-1.23l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                            </svg>
                                            Depósitos
                                        </a>
                                    </li>
                                )}
                                {permDestinatario > 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "Destinatarios" ? "active" : "text-white"
                                            }`} onClick={() => setActiveSection("Destinatarios")} style={{ cursor: 'pointer' }}>
                                            <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                            </svg>
                                            Destinatarios
                                        </a>
                                    </li>
                                )}
                                {permMateriales > 0 && (
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${activeSection === "Materiales" ? "active" : "text-white"
                                                }`}
                                            aria-current="page"
                                            onClick={() => setActiveSection("Materiales")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <svg
                                                className="bi pe-none me-2 mb-1"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                            </svg>
                                            Materiales
                                        </a>
                                    </li>
                                )}
                                {(permEntregas > 0 || permRecepciones > 0) && (
                                    <li className="nav-item">
                                        <a className="nav-link text-white" onClick={mostrarMovimientos}
                                            style={{ cursor: 'pointer' }}>
                                            <svg
                                                className="bi pe-none me-2 mb-1"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                            Movimientos
                                            {mostrarMov ? (
                                                <svg className="bi pe-none ms-1" width="16" height="16" fill="currentColor">

                                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />

                                                </svg>
                                            ) : (
                                                <svg className="bi pe-none ms-1" width="16" height="16" fill="currentColor">
                                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                </svg>
                                            )}
                                        </a>
                                        {mostrarMov && (
                                            <>
                                                {permEntregas > 0 && (
                                                    <a className={`nav-link p-1 ${activeSection === "Entregas" ? "active bg-secondary" : "text-white"}`} onClick={() => setActiveSection("Entregas")} style={{ cursor: 'pointer' }}>
                                                        <svg className="bi pe-none ms-4 me-1" width="16" height="16" fill="currentColor" >
                                                            <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                                                        </svg>
                                                        <small>Entregas</small>
                                                    </a>
                                                )}
                                                {permRecepciones > 0 && (
                                                    <a className={`nav-link p-1 ${activeSection === "Recepcion" ? "active bg-secondary" : "text-white"}`} onClick={() => setActiveSection("Recepcion")} style={{ cursor: 'pointer' }}>
                                                        <svg className="bi pe-none ms-4 me-1" width="16" height="16" fill="currentColor">
                                                            <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                        <small>Recepciones</small>
                                                    </a>
                                                )}
                                            </>
                                        )}
                                    </li>
                                )}
                                {permProveedores > 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "Proveedores" ? "active" : "text-white"
                                            }`} onClick={() => setActiveSection("Proveedores")} style={{ cursor: 'pointer' }}>

                                            <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                            </svg>
                                            Proveedores
                                        </a>
                                    </li>
                                )}
                                {permMateriales > 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "Stock" ? "active" : "text-white"
                                            }`} onClick={() => setActiveSection("Stock")} style={{ cursor: 'pointer' }}>

                                            <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor" >
                                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                                            </svg>
                                            Stock
                                        </a>
                                    </li>
                                )}
                                {permUsuarios > 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "Usuarios" ? "active" : "text-white"
                                            }`} onClick={() => setActiveSection("Usuarios")} style={{ cursor: 'pointer' }}>
                                            <svg
                                                className="bi pe-none me-2 mb-1"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                                />
                                            </svg>
                                            Usuarios
                                        </a>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                    <hr></hr>
                    <div className="dropdown">
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <a className={`nav-link ${activeSection === "Ajustes" ? "active" : "text-white"
                                    }`} onClick={() => setActiveSection("Ajustes")} style={{ cursor: 'pointer' }}>

                                    <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                                    </svg>
                                    Ajustes de usuario
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link icon-hover text-white" onClick={cerrarSesion} style={{ cursor: 'pointer' }}>

                                    <svg className="bi pe-none me-2 mb-1" width="16" height="16" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                    </svg>
                                    Cerrar sesión
                                </a>
                            </li>
                        </ul>
                    </div>
                    <hr></hr>
                    <div className="dropdown">
                        <a
                            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"

                        >
                            <span className="fs-5">Usuario:<strong>&nbsp;{nombreUsuario}</strong></span>

                        </a>
                    </div>
                </div>
                <div className="w-100">
                    {activeSection === "" ? (
                        <>
                            <div className="d-flex justify-content-center align-items-center vh-100">
                                <img src={IconoBienvenido} alt="Logo" className="mb-4" />
                            </div>
                            <div className="d-flex justify-content-center" style={{ marginLeft: '180px' }}>
                                <h1 className="position-absolute" style={{ color: '#FFC42A', top: '72%', fontSize: '70px' }}>CONTROL DE STOCK</h1>
                            </div>
                        </>
                    ) : (
                        <>
                            {activeSection === "Depositos" && <Depositos />}
                            {activeSection === "Materiales" && <Materiales />}
                            {activeSection === "Destinatarios" && <Destinatarios />}
                            {activeSection === "Usuarios" && <Usuarios />}
                            {activeSection === "Stock" && <Stocks />}
                            {activeSection === "Recepcion" && <Recepciones />}
                            {activeSection === "Entregas" && <Entregas />}
                            {activeSection === "Proveedores" && <Proveedores />}
                            {activeSection === "Ajustes" && <Ajustes />}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default MenuAdministracion;