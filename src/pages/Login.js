import { Component, useEffect, useState } from "react";
import Header from "../components/Header";
import { ToastContainer } from 'react-toastify';
import md5 from 'md5';
import { Toaster, toast } from "sonner";


const Login = () => {

    //VARIABLES
    const [usuario, setUsuario] = useState("admin");
    const [contrasena, setContrasena] = useState("1234");
    const [datos, setDatos] = useState({
        Firma: "",
        GUID: "",
        Pedido: "",
        Recurso: "",
        Usuario: "",
        Version: "",
        WebService: ""
    });
    const [detalle, setDetalle] = useState({
        Codigo: 200,
        Descripcion: ""
    });
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [cargando, setCargando] = useState(false);

    //FUNCIONES
    useEffect(() => {
        document.title = "Stock - Iniciar sesión";

        if (window.location.href !== process.env.REACT_APP_URL_LOCAL) {
            window.location.href = process.env.REACT_APP_URL_LOCAL;
        }
    }, []);

    const consultaOptions = async (usuario, contrasena) => {
        document.body.classList.add('busy-cursor');

        const pass = md5(contrasena);


        let response = await fetch(`${process.env.REACT_APP_URL}stingrlgn`, {
            mode: 'cors',
            method: 'OPTIONS'
        });

        if (response.ok) {
            let json = await response.json();

            setDatos({
                Usuario: usuario,
                GUID: json.GUID,
                Firma: md5(pass + json.GUID),
                Recurso: json.Recurso,
                Version: json.Version,
                WebService: json.WebService
            });

            consultaPost({
                Usuario: usuario,
                GUID: json.GUID,
                Firma: md5(pass + json.GUID),
                Recurso: json.Recurso,
                Version: json.Version,
                WebService: json.WebService
            }, usuario);
        } else {
            setDetalle({
                Codigo: response.status
            });
        }
    }

    const consultaPost = async (cuerpo, usuario) => {
        const idCab = md5(cuerpo.Firma + cuerpo.Usuario + cuerpo.GUID);

        try {
            let respuesta = await fetch(`${process.env.REACT_APP_URL}stingrlgn`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "idCab": idCab,
                },
                body: JSON.stringify(cuerpo)
            });

            setCargando(true);

            if (respuesta.status === 200) {
                sessionStorage.setItem('nombreUsuario', usuario);
                if (usuario === "sinpermisos") {
                    sessionStorage.setItem('administrador', 0);
                } else {
                    sessionStorage.setItem('administrador', 1027);
                }

                toast.success("¡Inicio de sesión exitoso! Redirigiendo...");

                setTimeout(() => {
                    window.location.href = '/menu';
                }, 2000);

            } else if (respuesta.status === 500) {
                toast.error("¡Credenciales incorrectas! Por favor, intente de nuevo");
                setTimeout(() => {
                    setCargando(false);
                }, 2000);
            } else {
                toast.error("¡Ocurrió un error! Por favor, intente de nuevo");
                setTimeout(() => {
                    setCargando(false);
                }, 2000);
            }
        } catch (error) {
            toast.error("¡Ocurrió un error al conectar con el servidor! Intente nuevamente")
            setCargando(false);
        }

        document.body.classList.remove('busy-cursor');
    }

    const enviar = event => {
        event.preventDefault();
        consultaOptions(usuario, contrasena);
    };

    const togglePasswordVisibility = () => {
        setMostrarContrasena(!mostrarContrasena);
    }

    const usuarioChange = event => {
        setUsuario(event.target.value);
    }

    const contrasenaChange = event => {
        setContrasena(event.target.value);
    }

    //CODIGO HTML
    return (
        <>
            <Header></Header>
            <div className="container d-flex justify-content-center">
                <form onSubmit={enviar} id="formLogin" className="bg-light bg-gradient rounded p-4 position-absolute top-50 start-50 translate-middle shadow-lg">
                    <div className="mb-3">
                        <label htmlFor="txtUsuario" className="form-label">Usuario:</label>
                        <input disabled={cargando} onChange={usuarioChange} type="text" placeholder="Usuario" className="form-control" id="txtUsuario" name="txtUsuario" aria-describedby="emailHelp" value={usuario}></input>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="txtContrasena" className="form-label">Contraseña:</label>
                        <input disabled={cargando} onChange={contrasenaChange} type={mostrarContrasena ? "text" : "password"} placeholder="Contraseña" className="form-control" id="txtContrasena" name="txtContrasena" value={contrasena}></input>
                    </div>
                    <div className="mb-3 form-check">
                        <input onChange={togglePasswordVisibility} type="checkbox" className="form-check-input" id="chkMostrarContrasena" ></input>
                        <label htmlFor="chkMostrarContrasena" className="form-check-label">Mostrar contraseña</label>
                    </div>
                    <button type="submit" id="btnLogin" className={`btn d-flex ms-auto me-auto ${cargando ? 'btn-secondary' : 'btn-primary'}`} disabled={cargando}>{cargando ? "Iniciando..." : "Iniciar sesión"}</button>
                </form>
            </div>
            <Toaster />
        </>
    );

}

export default Login;