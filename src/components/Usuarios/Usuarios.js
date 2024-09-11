import { useEffect, useState } from "react";
import { Usuario } from "../../types/Usuario";
import { Deposito } from "../../types/Deposito";
import { UsuarioService } from "../../services/UsuarioService";
import { DepositoService } from "../../services/DepositoService";
import { Toaster, toast } from "sonner";
import XLSX from 'sheetjs-style';
import Select from 'react-select';

function Usuarios() {

    //PERMISOS
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
    const [usuarios, setUsuarios] = useState([]);
    const [depositos, setDepositos] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(new Usuario());
    const [mostrarUsuario, setMostrarUsuario] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [errorNombreUsuario, setErrorNombreUsuario] = useState(false);
    const [validoNombreUsuario, setValidoNombreUsuario] = useState(false);
    const [contrasena, setContrasena] = useState('');
    const [errorContrasena, setErrorContrasena] = useState(false);
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [errorNuevaContrasena, setErrorNuevaContrasena] = useState(false);
    const [repetirContrasena, setRepetirContrasena] = useState('');
    const [errorRepetirContrasena, setErrorRepetirContrasena] = useState(false);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [errorNombreCompleto, setErrorNombreCompleto] = useState(false);
    const [CUIT, setCUIT] = useState('');
    const [errorCUIT, setErrorCUIT] = useState(false);
    const [validoCUIT, setValidoCUIT] = useState(false);
    const [depositoAsociado, setDepositoAsociado] = useState(new Deposito());
    const [depositoAsociadoEditar, setDepositoAsociadoEditar] = useState(new Deposito());
    const [id_deposito, setId_deposito] = useState(0);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [filtroNombreCompleto, setFiltroNombreCompleto] = useState('');
    const [filtroCUIT, setFiltroCUIT] = useState('');
    const [filtroDeposito, setFiltroDeposito] = useState(new Deposito());
    const agregarModalEditarDeshabilitado = errorNombreUsuario || errorContrasena || errorCUIT || errorNombreCompleto;
    const [btnCargando, setBtnCargando] = useState(false);
    const [usuarioAEditar, setUsuarioAEditar] = useState('');
    const [clickUsuarioAEditar, setClickUsuarioAEditar] = useState(false);
    const [isAdminChecked, setIsAdminChecked] = useState(false);
    const [lecturaActivoDep, setLecturaActivoDep] = useState(false);
    const [escrituraActivoDep, setEscrituraActivoDep] = useState(false);
    const [lecturaActivoDes, setLecturaActivoDes] = useState(false);
    const [escrituraActivoDes, setEscrituraActivoDes] = useState(false);
    const [lecturaActivoMat, setLecturaActivoMat] = useState(false);
    const [escrituraActivoMat, setEscrituraActivoMat] = useState(false);
    const [lecturaActivoEnt, setLecturaActivoEnt] = useState(false);
    const [escrituraActivoEnt, setEscrituraActivoEnt] = useState(false);
    const [lecturaActivoRec, setLecturaActivoRec] = useState(false);
    const [escrituraActivoRec, setEscrituraActivoRec] = useState(false);
    const [lecturaActivoInf, setLecturaActivoInf] = useState(false);
    const [escrituraActivoInf, setEscrituraActivoInf] = useState(false);
    const [lecturaActivoUsu, setLecturaActivoUsu] = useState(false);
    const [escrituraActivoUsu, setEscrituraActivoUsu] = useState(false);
    const [lecturaActivoPro, setLecturaActivoPro] = useState(false);
    const [escrituraActivoPro, setEscrituraActivoPro] = useState(false);

    //FUNCIONES
    useEffect(() => {
        fetchUsuarios();
        fetchDepositos();
    }, []);

    useEffect(() => {
        filtrarUsuarios();
    }, [filtroNombreCompleto, filtroCUIT, usuarios]);

    const fetchUsuarios = async () => {
        try {
            let data = await UsuarioService.getUsuarios();
            setUsuarios(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener usuarios: ", error);
        }
    };

    const filtrarUsuarios = () => {
        let datosFiltrados = usuarios;

        if (filtroNombreCompleto) {
            datosFiltrados = datosFiltrados.filter(usuario =>
                (usuario.nombreCompleto).toLowerCase().includes(filtroNombreCompleto.toLowerCase())
            );
        }

        if (filtroCUIT) {
            datosFiltrados = datosFiltrados.filter(usuario =>
                (usuario.CUIT).toLowerCase().includes(filtroCUIT.toLowerCase())
            );
        }

        setDatosFiltrados(datosFiltrados);
    };

    const fetchDepositos = async () => {
        try {
            let data = await DepositoService.getDepositos();
            setDepositos(data);
        } catch (error) {
            console.error("Error al obtener depositos: ", error);
        }
    }

    async function agregarUsuario() {
        setBtnCargando(true);

        const usuario = new Usuario();
        const md5 = require('md5');

        if (!nombreCompleto || nombreCompleto === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre completo' para continuar!");
            return;
        }
        usuario.nombreCompleto = capitalizarPalabras(nombreCompleto);

        if (!CUIT || CUIT === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'CUIT' para continuar!");
            return;
        }
        usuario.CUIT = CUIT;

        if (!nombreUsuario || nombreUsuario === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre de usuario' para continuar!");
            return;
        }
        usuario.nombreUsuario = nombreUsuario;

        if (!contrasena || contrasena === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Contraseña' para continuar!");
            return;
        }
        usuario.contrasena = md5(contrasena);
        usuario.activo = 1;
        usuario.administrador = permAdministrador;
        usuario.depositos = permDepositos;
        usuario.destinatario = permDestinatario;
        usuario.materiales = permMateriales;
        usuario.entregas = permEntregas;
        usuario.recepciones = permRecepciones;
        usuario.informes = permInformes;
        usuario.usuarios = permUsuarios;

        if (depositoAsociado.id === 0) {
            toast.error("¡Debe seleccionar un deposito!");
            return;
        }
        usuario.id_deposito = depositoAsociado;

        usuario.fechaBaja = null;

        console.log(usuario);

        toast.promise(UsuarioService.createUsuario(usuario), {
            success: () => {
                fetchUsuarios();
                fetchDepositos();
                return ("¡Usuario agregado correctamente!");
            },
            error: () => {
                return ("¡Error al agregar el usuario!")
            },
            finally: () => {
                fetchUsuarios();
                fetchDepositos();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const editarUsuario = async () => {
        setBtnCargando(true);

        const usuario = new Usuario();
        const md5 = require('md5');
        usuario.id = usuarioEditando.id;

        if (!usuarioEditando.nombreCompleto || usuarioEditando.nombreCompleto === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre completo' para continuar!");
            return;
        }
        usuario.nombreCompleto = capitalizarPalabras(usuarioEditando.nombreCompleto);

        if (!usuarioEditando.nombreUsuario || usuarioEditando.nombreUsuario === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre de usuario' para continuar!");
            return;
        }
        usuario.nombreUsuario = usuarioEditando.nombreUsuario;
        usuario.contrasena = md5(nuevaContrasena);
        usuario.activo = 1;
        usuario.administrador = usuarioEditando.permAdministrador;
        usuario.depositos = usuarioEditando.permDepositos;
        usuario.destinatario = usuarioEditando.permDestinatario;
        usuario.materiales = usuarioEditando.permMateriales;
        usuario.entregas = usuarioEditando.permEntregas;
        usuario.recepciones = usuarioEditando.permRecepciones;
        usuario.informes = usuarioEditando.permInformes;
        usuario.usuarios = usuarioEditando.permUsuarios;
        usuario.proveedores = usuarioEditando.permProveedores;

        if (usuarioEditando.depositoAsociado?.value > 0) {
            usuario.depositoAsociado = parseInt(usuarioEditando.depositoAsociado?.value);
        } else {
            usuario.depositoAsociado = parseInt(usuarioEditando?.id_deposito);
        }


        console.log(usuario);

        toast.promise(UsuarioService.updateUsuario(usuario), {
            success: () => {
                fetchUsuarios();
                fetchDepositos();
                return ("¡Usuario editado correctamente!");
            },
            error: () => {
                return ("¡Error al editar el usuario!")
            },
            finally: () => {
                fetchUsuarios();
                fetchDepositos();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalEditar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const desactivarActivarUsuario = async () => {
        setBtnCargando(true);

        let usuario = new Usuario();
        usuario.id = usuarioEditando.id;
        usuario.activo = usuarioEditando.activo;

        toast.promise(UsuarioService.deleteUsuario(usuario), {
            success: () => {
                fetchDepositos();
                fetchUsuarios();
                if (usuario.activo === "1") {
                    return ("¡Usuario desactivado correctamente!")
                } else if (usuario.activo === "0") {
                    return ("¡Usuario activado correctamente!")
                }
            },
            error: () => {
                if (usuario.activo === "1") {
                    return ("¡Error al desactivar el usuario!")
                } else if (usuario.activo === "0") {
                    return ("¡Error al activar el usuario!")
                }
            },
            finally: () => {
                fetchDepositos();
                fetchUsuarios();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalDesactivar').click();
                    document.getElementById('btnCerrarModalActivar').click();
                }, 500)
            }
        });

    }

    const txtNombreCompletoChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s-]/g, '');
        setNombreCompleto(value);
        setErrorNombreCompleto(value.length <= 5 && value.length > 0);
    }

    const txtEditarNombreCompletoChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s-]/g, '');
        setUsuarioEditando(prev => ({
            ...prev,
            nombreCompleto: value
        }));
        setErrorNombreCompleto(value.length <= 5);
    }

    const txtCUITChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCUIT(value);
        setErrorCUIT(value.length !== 11 && value.length > 0);
    }

    const buscarCUIT = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const CUITExistente = await UsuarioService.buscarCUIT(CUIT);

            if (CUITExistente.length > 0) {
                const usuarioEncontrado = usuarios.find(usuario => usuario.CUIT === CUIT);
                if (usuarioEncontrado) {
                    setNombreCompleto(usuarioEncontrado.nombreCompleto);
                }
                toast.error("¡Error! CUIT ya existente");
                setErrorCUIT(CUITExistente.length > 0);

                const usuario = CUITExistente[0];
                setUsuarioEditando(usuario);

                document.getElementById('btnAbrirConsultarModal').click();
                document.getElementById('btnCerrarAgregarModalCUITExistente').click();
            } else if (CUITExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoCUIT(CUITExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el CUIT!");
            }
        }
    }

    const txtNombreUsuarioChange = (e) => {
        const value = e.target.value;
        setNombreUsuario(value);
        setErrorNombreUsuario(value.length <= 3 && value.length > 0);
    }

    const txtEditarNombreUsuarioChange = (e) => {
        const value = e.target.value;
        setUsuarioEditando(prev => ({
            ...prev,
            nombreUsuario: value
        }));
        setErrorNombreUsuario(value.length <= 3);
    }

    const buscarNombreUsuario = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const NombreUsuarioExistente = await UsuarioService.buscarNombreUsuario(nombreUsuario);

            if (NombreUsuarioExistente.length > 0) {
                toast.error("¡Error! Nombre de usuario ya existente");
                setErrorNombreUsuario(NombreUsuarioExistente.length > 0);
            } else if (NombreUsuarioExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoNombreUsuario(NombreUsuarioExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el nombre de usuario!");
            }
        }
    }

    const buscarNombreUsuarioEditar = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const NombreUsuarioExistente = await UsuarioService.buscarNombreUsuario(usuarioEditando.nombreUsuario);

            if (NombreUsuarioExistente.length > 0) {
                if (usuarioEditando.nombreUsuario.toLowerCase() === usuarioAEditar) {
                    toast.success("¡Perfecto! Es el nombre de usuario que busca editar. Puede continuar");
                    setValidoNombreUsuario(usuarioEditando.nombreUsuario.toLowerCase() === usuarioAEditar);
                    return;
                }

                toast.error("¡Error! Nombre de usuario ya existente");
                setErrorNombreUsuario(NombreUsuarioExistente.length > 0);
            } else if (NombreUsuarioExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoNombreUsuario(NombreUsuarioExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el nombre de usuario!");
            }
        }
    }

    const txtContrasenaChange = (e) => {
        const value = e.target.value;
        setContrasena(value);
        setErrorContrasena(value.length <= 3 && value.length > 0);
    }

    const txtEditarContrasenaChange = (e) => {
        const value = e.target.value;
        setNuevaContrasena(value);
        setErrorNuevaContrasena(value.length <= 3);
    }

    const txtEditarRepetirContrasenaChange = (e) => {
        const value = e.target.value;
        setRepetirContrasena(value);
        setErrorRepetirContrasena(value.length <= 3 || value !== nuevaContrasena);
    }

    const selectId_deposito = (selectedOption) => {
        setDepositoAsociado(selectedOption.value);
    };

    const selectEditarId_deposito = (selectedOption) => {
        setUsuarioEditando(prev => ({
            ...prev,
            depositoAsociado: selectedOption
        }));
    };

    const clickearUsuarioAEditar = (e) => {
        if (!clickUsuarioAEditar) {
            setUsuarioAEditar(e.target.value.toLowerCase());
            setClickUsuarioAEditar(true);
        }
    }

    const cerrarConsultarModal = () => {
        document.getElementById('btnCerrarConsultarModalCUITExistente').click();
        limpiarInputs();
    }

    const cerrarVolverConsultarModal = async () => {
        await setNombreCompleto('');
        document.getElementById('btnCerrarConsultarModalCUITExistente').click();
    }

    const handleAdminCheckboxChange = () => {
        setIsAdminChecked(prevState => !prevState);
        if (!isAdminChecked === true) {
            setPermAdministrador(sinPermiso + lectura + escritura + administrador);
            setPermDepositos(sinPermiso);
            setPermDestinatario(sinPermiso);
            setPermMateriales(sinPermiso);
            setPermEntregas(sinPermiso);
            setPermRecepciones(sinPermiso);
            setPermInformes(sinPermiso);
            setPermUsuarios(sinPermiso);
            setPermProveedores(sinPermiso);

            setLecturaActivoDep(false);
            setEscrituraActivoDep(false);

            setLecturaActivoDes(false);
            setEscrituraActivoDes(false);

            setLecturaActivoMat(false);
            setEscrituraActivoMat(false);

            setLecturaActivoEnt(false);
            setEscrituraActivoEnt(false);

            setLecturaActivoRec(false);
            setEscrituraActivoRec(false);

            setLecturaActivoInf(false);
            setEscrituraActivoInf(false);

            setLecturaActivoUsu(false);
            setEscrituraActivoUsu(false);

            setLecturaActivoPro(false);
            setEscrituraActivoPro(false);
        } else if (!isAdminChecked === false) {
            setPermAdministrador(sinPermiso);
        }
    };

    const handleEditarAdminCheckboxChange = () => {
        setIsAdminChecked(prevState => !prevState);
        if (!isAdminChecked === true) {
            setUsuarioEditando(prev => ({
                ...prev,
                permAdministrador: (sinPermiso + lectura + escritura + administrador),
                permDepositos: (sinPermiso),
                permDestinatario: (sinPermiso),
                permMateriales: (sinPermiso),
                permEntregas: (sinPermiso),
                permRecepciones: (sinPermiso),
                permInformes: (sinPermiso),
                permUsuarios: (sinPermiso),
                permProveedores: (sinPermiso),
            }));

            setLecturaActivoDep(false);
            setEscrituraActivoDep(false);

            setLecturaActivoDes(false);
            setEscrituraActivoDes(false);

            setLecturaActivoMat(false);
            setEscrituraActivoMat(false);

            setLecturaActivoEnt(false);
            setEscrituraActivoEnt(false);

            setLecturaActivoRec(false);
            setEscrituraActivoRec(false);

            setLecturaActivoInf(false);
            setEscrituraActivoInf(false);

            setLecturaActivoUsu(false);
            setEscrituraActivoUsu(false);

            setLecturaActivoPro(false);
            setEscrituraActivoPro(false);
        } else if (!isAdminChecked === false) {
            setUsuarioEditando(prev => ({
                ...prev,
                permAdministrador: (sinPermiso)
            }));
        }
    };

    const handleCheckboxChangeDep = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoDep(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoDep) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoDep(isChecked);
            if (isChecked) {
                setLecturaActivoDep(1);
            } else {
                if (lecturaActivoDep) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeDes = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoDes(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoDes) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoDes(isChecked);
            if (isChecked) {
                setLecturaActivoDes(1);
            } else {
                if (lecturaActivoDes) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeMat = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoMat(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoMat) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoMat(isChecked);
            if (isChecked) {
                setLecturaActivoMat(1);
            } else {
                if (lecturaActivoMat) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeEnt = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoEnt(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoEnt) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoEnt(isChecked);
            if (isChecked) {
                setLecturaActivoEnt(1);
            } else {
                if (lecturaActivoEnt) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeRec = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoRec(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoRec) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoRec(isChecked);
            if (isChecked) {
                setLecturaActivoRec(1);
            } else {
                if (lecturaActivoRec) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeInf = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoInf(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoInf) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoInf(isChecked);
            if (isChecked) {
                setLecturaActivoInf(1);
            } else {
                if (lecturaActivoInf) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangeUsu = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoUsu(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoUsu) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoUsu(isChecked);
            if (isChecked) {
                setLecturaActivoUsu(1);
            } else {
                if (lecturaActivoUsu) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const handleCheckboxChangePro = (value, isChecked) => {
        if (value === (lectura + sinPermiso)) {
            setLecturaActivoPro(isChecked ? 1 : 0);
            if (isChecked) {
            } else {
                if (escrituraActivoPro) {
                    return (sinPermiso + lectura + escritura);
                }
            }
        }

        if (value === (escritura + lectura + sinPermiso)) {
            setEscrituraActivoPro(isChecked);
            if (isChecked) {
                setLecturaActivoPro(1);
            } else {
                if (lecturaActivoPro) {
                    return lectura;
                }
            }
        }

        let permisos = 0;

        if (isChecked) {
            permisos = (value);
        } else {
            permisos = (sinPermiso);
        }

        return permisos;
    };

    const limpiarInputs = () => {
        setNombreCompleto('');
        setCUIT('');
        setNombreUsuario('');
        setContrasena('');
        setErrorNombreCompleto(false);
        setErrorCUIT(false);
        setValidoCUIT(false);
        setErrorContrasena(false);
        setErrorNombreUsuario(false);
        setValidoNombreUsuario(false);
        setClickUsuarioAEditar(false);
        setDepositoAsociado({ id: null, descripcion: '' });
        setLecturaActivoDep(false);
        setEscrituraActivoDep(false);
        setPermDepositos(0);
        setLecturaActivoMat(false);
        setEscrituraActivoMat(false);
        setPermMateriales(0);
        setLecturaActivoDes(false);
        setEscrituraActivoDes(false);
        setPermDestinatario(0);
        setLecturaActivoEnt(false);
        setEscrituraActivoEnt(false);
        setPermEntregas(0);
        setLecturaActivoRec(false);
        setEscrituraActivoRec(false);
        setPermRecepciones(0);
        setLecturaActivoInf(false);
        setEscrituraActivoInf(false);
        setPermInformes(0);
        setLecturaActivoUsu(false);
        setEscrituraActivoUsu(false);
        setPermUsuarios(0);
        setLecturaActivoPro(false);
        setEscrituraActivoPro(false);
        setPermProveedores(0);
        setPermAdministrador(0);
        setIsAdminChecked(false);
    }

    const setPermisos = (usuarioEditando) => {
        //ADMINISTRADOR
        if (parseInt(usuarioEditando?.administrador) === (sinPermiso + lectura + escritura + administrador)) {
            setIsAdminChecked(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permAdministrador: parseInt(usuarioEditando?.administrador)
            }));
        } else if (parseInt(usuarioEditando?.administrador) === (sinPermiso)) {
            setUsuarioEditando(prev => ({
                ...prev,
                permAdministrador: parseInt(usuarioEditando?.administrador)
            }));
        }
        //DEPOSITOS
        if (parseInt(usuarioEditando?.depositos) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoDep(true);
            setEscrituraActivoDep(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permDepositos: parseInt(usuarioEditando?.depositos)
            }));
        } else if (parseInt(usuarioEditando?.depositos) === (sinPermiso + lectura)) {
            setLecturaActivoDep(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permDepositos: parseInt(usuarioEditando?.depositos)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permDepositos: parseInt(usuarioEditando?.depositos)
            }));
        }
        //DESTINATARIOS
        if (parseInt(usuarioEditando?.destinatario) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoDes(true);
            setEscrituraActivoDes(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permDestinatario: parseInt(usuarioEditando?.destinatario)
            }));
        } else if (parseInt(usuarioEditando?.destinatario) === (sinPermiso + lectura)) {
            setLecturaActivoDes(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permDestinatario: parseInt(usuarioEditando?.destinatario)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permDestinatario: parseInt(usuarioEditando?.destinatario)
            }));
        }
        //MATERIALES
        if (parseInt(usuarioEditando?.materiales) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoMat(true);
            setEscrituraActivoMat(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permMateriales: parseInt(usuarioEditando?.materiales)
            }));
        } else if (parseInt(usuarioEditando?.materiales) === (sinPermiso + lectura)) {
            setLecturaActivoMat(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permMateriales: parseInt(usuarioEditando?.materiales)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permMateriales: parseInt(usuarioEditando?.materiales)
            }));
        }
        //ENTREGAS
        if (parseInt(usuarioEditando?.entregas) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoEnt(true);
            setEscrituraActivoEnt(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permEntregas: parseInt(usuarioEditando?.entregas)
            }));
        } else if (parseInt(usuarioEditando?.entregas) === (sinPermiso + lectura)) {
            setLecturaActivoEnt(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permEntregas: parseInt(usuarioEditando?.entregas)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permEntregas: parseInt(usuarioEditando?.entregas)
            }));
        }
        //RECEPCIONES
        if (parseInt(usuarioEditando?.recepciones) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoRec(true);
            setEscrituraActivoRec(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permRecepciones: parseInt(usuarioEditando?.recepciones)
            }));
        } else if (parseInt(usuarioEditando?.recepciones) === (sinPermiso + lectura)) {
            setLecturaActivoRec(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permRecepciones: parseInt(usuarioEditando?.recepciones)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permRecepciones: parseInt(usuarioEditando?.recepciones)
            }));
        }
        //PROVEEDORES
        if (parseInt(usuarioEditando?.proveedores) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoPro(true);
            setEscrituraActivoPro(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permProveedores: parseInt(usuarioEditando?.proveedores)
            }));
        } else if (parseInt(usuarioEditando?.proveedores) === (sinPermiso + lectura)) {
            setLecturaActivoPro(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permProveedores: parseInt(usuarioEditando?.proveedores)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permProveedores: parseInt(usuarioEditando?.proveedores)
            }));
        }
        //INFORMES
        if (parseInt(usuarioEditando?.informes) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoInf(true);
            setEscrituraActivoInf(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permInformes: parseInt(usuarioEditando?.informes)
            }));
        } else if (parseInt(usuarioEditando?.informes) === (sinPermiso + lectura)) {
            setLecturaActivoInf(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permInformes: parseInt(usuarioEditando?.informes)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permInformes: parseInt(usuarioEditando?.informes)
            }));
        }
        //USUARIOS
        if (parseInt(usuarioEditando?.usuarios) === (sinPermiso + lectura + escritura)) {
            setLecturaActivoUsu(true);
            setEscrituraActivoUsu(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permUsuarios: parseInt(usuarioEditando?.usuarios)
            }));
        } else if (parseInt(usuarioEditando?.usuarios) === (sinPermiso + lectura)) {
            setLecturaActivoUsu(true);
            setUsuarioEditando(prev => ({
                ...prev,
                permUsuarios: parseInt(usuarioEditando?.usuarios)
            }));
        } else {
            setUsuarioEditando(prev => ({
                ...prev,
                permUsuarios: parseInt(usuarioEditando?.usuarios)
            }));
        }

    }

    const capitalizarPalabras = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const exportToExcel = () => {
        try {
            if (usuarios.length > 0) {
                //FILTRAR DATOS QUE QUEREMOS Y CREAMOS HOJA
                const datosExcel = usuarios.map(({ id, CUIT, nombreCompleto, nombreUsuario, descripcionDeposito }) => ({ id, CUIT, nombreCompleto, nombreUsuario, id_deposito }));
                const worksheet = XLSX.utils.json_to_sheet(datosExcel);

                //CABECERAS
                XLSX.utils.sheet_add_aoa(worksheet, [["ID", "CUIL/CUIT", "Nombre completo", "Nombre de usuario", "Depósito asociado"]], { origin: "A1" });

                //ESTILOS
                const estiloCabecera = {
                    font: { bold: true }
                };
                const estiloCelda = {
                    font: { bold: true }
                };

                worksheet['A1'].s = estiloCabecera;
                worksheet['B1'].s = estiloCabecera;
                worksheet['C1'].s = estiloCabecera;
                worksheet['D1'].s = estiloCabecera;
                worksheet['E1'].s = estiloCabecera;

                Object.keys(worksheet).forEach(celda => {
                    if (celda.startsWith('A')) {
                        worksheet[celda].s = estiloCelda;
                    }
                });

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de usuarios");

                XLSX.writeFile(workbook, "Listado de usuarios.xlsx");

                toast.success("¡Informe generado correctamente!");
            } else {
                toast.error("¡No hay datos para generar el informe!");
            }

        } catch (error) {
            console.log(error);
            toast.error("¡Error al generar el informe!");
        }
    }

    //CODIGO HTML
    return (
        <>
            <Toaster />
            <h1 className="text-center text-bg-dark p-2">&mdash; Usuarios &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-50 justify-content-between">
                    <input type="text" className="form-control" placeholder="Buscar por nombre..." title="Buscar por nombre" value={filtroNombreCompleto} onChange={(e) => setFiltroNombreCompleto(e.target.value)}></input>
                    <input type="text" className="form-control" placeholder="Buscar por CUIT/CUIL..." aria-label="Buscar por CUIT/CUIL..." title="Buscar por CUIL/CUIT" value={filtroCUIT} onChange={(e) => setFiltroCUIT(e.target.value)}></input>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>

                <div>
                    <button data-bs-toggle="modal" data-bs-target="#agregarModal" type="button" className="btn btn-primary me-2 mt-2">+ Agregar usuario</button>
                    <button type="button" onClick={exportToExcel} className="btn btn-success me-4 mt-2">Generar excel</button>

                </div>
            </div>
            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">CUIT/CUIL</th>
                        <th scope="col">Usuario</th>
                        <th scope="col">Depósito asociado</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                            <th scope="row">{usuario.id}</th>
                            <td>{usuario.nombreCompleto}</td>
                            <td>{(usuario.CUIT)}</td>
                            <td>{usuario.nombreUsuario}</td>
                            <td>{usuario.id_deposito === "0" ? "Sin depósito" : usuario.descripcionDeposito}</td>
                            <td>
                                <button onClick={() => { setUsuarioEditando(usuario); setPermisos(usuario) }} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                    Editar
                                </button>
                                {usuario.activo > 0 &&
                                    <button onClick={() => setUsuarioEditando(usuario)} type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal">
                                        Desactivar
                                    </button>
                                }
                                {usuario.activo < 1 &&
                                    <button onClick={() => setUsuarioEditando(usuario)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal">
                                        Activar
                                    </button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL PARA AGREGAR */}
            <div className="modal fade" id="agregarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar usuario &mdash;</h5>
                            <button type="button" id="btnCerrarModalAgregar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo:</label>
                                    <input required={true} title="Debe contener más de 5 caracteres" value={nombreCompleto} onChange={txtNombreCompletoChange} type="text" placeholder="Nombre completo" className={`form-control ${nombreCompleto ? (errorNombreCompleto ? 'is-invalid' : 'is-valid') : ''}`} id="txtNombreCompleto"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CUIT/CUIL:</label>
                                    <input required={true} value={CUIT} onChange={txtCUITChange} title="Debe contener 11 números" onBlur={buscarCUIT} type="text" placeholder="CUIT/CUIL" className={`form-control ${errorCUIT ? 'is-invalid' : validoCUIT ? 'is-valid' : ''}`} id="txtCUIT"></input>
                                    <button id="btnAbrirConsultarModal" data-bs-toggle="modal" data-bs-target="#consultarModal" style={{ display: 'none' }}></button>
                                    <button id="btnCerrarAgregarModalCUITExistente" data-bs-dismiss="modal" data-bs-target="#agregarModal" style={{ display: 'none' }}></button>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de usuario:</label>
                                    <input required={true} title="Debe contener más de 3 caracteres" value={nombreUsuario} onChange={txtNombreUsuarioChange} onBlur={buscarNombreUsuario} type="text" placeholder="Nombre de usuario" className={`form-control ${errorNombreUsuario ? 'is-invalid' : validoNombreUsuario ? 'is-valid' : ''}`} id="txtNombreUsuario"></input>

                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña:</label>
                                    <input required={true} value={contrasena} title="Debe contener más de 3 caracteres" onChange={txtContrasenaChange} type="password" placeholder="Contraseña" className={`form-control ${contrasena ? (errorContrasena ? 'is-invalid' : 'is-valid') : ''}`} id="txtContrasena"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Depósito asociado:</label>
                                    <Select options={depositos
                                        .filter(deposito => deposito.activo > 0)
                                        .map(deposito => ({
                                            value: deposito.id,
                                            label: deposito.descripcion,
                                        }))
                                    } value={depositoAsociado.id} onChange={selectId_deposito}
                                        placeholder="Seleccionar depósito"
                                        isSearchable />
                                </div>
                                <label className="form-label">Permisos:</label>
                                <div className="mb-1 d-flex justify-content-around flex-column">
                                    <div className="mb-1 d-flex justify-content-around">
                                        <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                            <h6 style={{ marginLeft: '-4px' }}>Administrador</h6>
                                            <div className="form-check form-switch ms-1">
                                                <input className="form-check-input" value={permAdministrador} type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isAdminChecked} onChange={handleAdminCheckboxChange}></input>
                                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">F / V</label>
                                            </div>
                                        </div>
                                        {!isAdminChecked && (
                                            <>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 className="ms-2">Depósitos</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkDeposLec" onChange={(e) => setPermDepositos(handleCheckboxChangeDep((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoDep}></input>
                                                    <label className="form-check-label" htmlFor="checkDeposLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkDeposEsc" onChange={(e) => setPermDepositos(handleCheckboxChangeDep((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoDep}></input>
                                                    <label className="form-check-label" htmlFor="checkDeposEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {!isAdminChecked && (
                                        <>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '' }}>Destinatario</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkDestLec" onChange={(e) => setPermDestinatario(handleCheckboxChangeDes((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoDes}></input>
                                                    <label className="form-check-label" htmlFor="checkDestLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkDestEsc" onChange={(e) => setPermDestinatario(handleCheckboxChangeDes((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoDes}></input>
                                                    <label className="form-check-label" htmlFor="checkDestEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 className="ms-2">Materiales</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkMatLec" onChange={(e) => setPermMateriales(handleCheckboxChangeMat((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoMat}></input>
                                                    <label className="form-check-label" htmlFor="checkMatLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkMatEsc" onChange={(e) => setPermMateriales(handleCheckboxChangeMat((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoMat}></input>
                                                    <label className="form-check-label" htmlFor="checkMatEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Entregas</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEntrLec" onChange={(e) => setPermEntregas(handleCheckboxChangeEnt((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoEnt}></input>
                                                    <label className="form-check-label" htmlFor="checkEntrLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEntrEsc" onChange={(e) => setPermEntregas(handleCheckboxChangeEnt((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoEnt}></input>
                                                    <label className="form-check-label" htmlFor="checkEntrEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '3px' }}>Recepciones</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkRecepLec" onChange={(e) => setPermRecepciones(handleCheckboxChangeRec((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoRec}></input>
                                                    <label className="form-check-label" htmlFor="checkRecepLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkRecepEsc" onChange={(e) => setPermRecepciones(handleCheckboxChangeRec((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoRec}></input>
                                                    <label className="form-check-label" htmlFor="checkRecepEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Informes</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkInfoLec" onChange={(e) => setPermInformes(handleCheckboxChangeInf((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoInf}></input>
                                                    <label className="form-check-label" htmlFor="checkInfoLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkInfoEsc" onChange={(e) => setPermInformes(handleCheckboxChangeInf((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoInf}></input>
                                                    <label className="form-check-label" htmlFor="checkInfoEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Usuarios</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkUsuaLec" onChange={(e) => setPermUsuarios(handleCheckboxChangeUsu((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoUsu}></input>
                                                    <label className="form-check-label" htmlFor="checkUsuaLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkUsuaEsc" onChange={(e) => setPermUsuarios(handleCheckboxChangeUsu((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoUsu}></input>
                                                    <label className="form-check-label" htmlFor="checkUsuaEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Proveedores</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkProvLec" onChange={(e) => setPermProveedores(handleCheckboxChangePro((lectura + sinPermiso), e.target.checked))} checked={lecturaActivoPro}></input>
                                                    <label className="form-check-label" htmlFor="checkProvLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkProvEsc" onChange={(e) => setPermProveedores(handleCheckboxChangePro((escritura + lectura + sinPermiso), e.target.checked))} checked={escrituraActivoPro}></input>
                                                    <label className="form-check-label" htmlFor="checkProvEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={limpiarInputs} data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-primary'}`} onClick={agregarUsuario} disabled={agregarModalEditarDeshabilitado || btnCargando}>{btnCargando ? 'Procesando...' : 'Agregar'}</button>
                        </div>
                    </div>
                </div >
            </div >

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalEditar">&mdash; Editar usuario &mdash;</h5>
                            <button type="button" id="btnCerrarModalEditar" className="btn-close" data-bs-dismiss="modal" onClick={limpiarInputs} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo:</label>
                                    <input required={true} title="Debe contener más de 5 caracteres" value={usuarioEditando ? usuarioEditando.nombreCompleto : ""} onChange={txtEditarNombreCompletoChange} type="text" placeholder="Nombre completo" className={`form-control ${usuarioEditando ? (errorNombreCompleto ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarNombreCompleto"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CUIT/CUIL:</label>
                                    <input disabled value={usuarioEditando ? usuarioEditando.CUIT : ""} type="text" placeholder="CUIT/CUIL" className="form-control is-valid text-secondary" id="txtEditarCUIT"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de usuario:</label>
                                    <input required={true} title="Debe contener más de 3 caracteres" onClick={clickearUsuarioAEditar} value={usuarioEditando ? usuarioEditando.nombreUsuario : ""} onChange={txtEditarNombreUsuarioChange} onBlur={buscarNombreUsuarioEditar} type="text" placeholder="Nombre de usuario" className={`form-control is-valid ${usuarioEditando ? (errorNombreUsuario ? 'is-invalid' : validoNombreUsuario ? 'is-valid' : '') : ''}`} id="txtEditarNombreUsuario"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña:</label>
                                    <input required={true} title="Debe contener más de 3 caracteres" value={nuevaContrasena} onChange={txtEditarContrasenaChange} type="password" placeholder="Contraseña" className={`form-control ${nuevaContrasena ? (errorNuevaContrasena ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarContrasena"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Repetir contraseña:</label>
                                    <input required={true} title="Las contraseñas deben coincidir" value={repetirContrasena} onChange={txtEditarRepetirContrasenaChange} type="password" placeholder="Repetir contraseña" className={`form-control ${repetirContrasena ? (errorRepetirContrasena ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarRepetirContrasena"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Depósito asociado:</label>
                                    <Select options={depositos
                                        .filter(deposito =>
                                            deposito.activo > 0 && deposito.id !== usuarioEditando?.id_deposito
                                        )
                                        .map(deposito => ({
                                            value: deposito.id,
                                            label: deposito.descripcion,
                                        }))
                                    } value={usuarioEditando?.depositoAsociado} onChange={selectEditarId_deposito}
                                        placeholder="Cambiar depósito asociado"
                                        isSearchable />
                                </div>
                                <label className="form-label">Permisos:</label>
                                <div className="mb-1 d-flex justify-content-around flex-column">
                                    <div className="mb-1 d-flex justify-content-around">
                                        <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                            <h6 style={{ marginLeft: '-4px' }}>Administrador</h6>
                                            <div className="form-check form-switch ms-1">
                                                <input className="form-check-input" value={usuarioEditando ? usuarioEditando.permAdministrador : ""} type="checkbox" role="switch" id="flexSwitchEditarCheckChecked" checked={isAdminChecked} onChange={handleEditarAdminCheckboxChange}></input>
                                                <label className="form-check-label" htmlFor="flexSwitchEditarCheckChecked">F / V</label>
                                            </div>
                                        </div>
                                        {!isAdminChecked && (
                                            <>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 className="ms-2">Depósitos</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarDeposLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeDep((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permDepositos: valor
                                                        }));
                                                    }} checked={lecturaActivoDep}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarDeposLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarDeposEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeDep((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permDepositos: valor
                                                        }));
                                                    }} checked={escrituraActivoDep}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarDeposEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {!isAdminChecked && (
                                        <>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '' }}>Destinatario</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarDestLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeDes((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permDestinatario: valor
                                                        }));
                                                    }} checked={lecturaActivoDes}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarDestLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarDestEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeDes((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permDestinatario: valor
                                                        }));
                                                    }} checked={escrituraActivoDes}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarDestEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 className="ms-2">Materiales</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarMatLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeMat((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permMateriales: valor
                                                        }));
                                                    }} checked={lecturaActivoMat}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarMatLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarMatEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeMat((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permMateriales: valor
                                                        }));
                                                    }} checked={escrituraActivoMat}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarMatEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Entregas</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarEntrLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeEnt((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permEntregas: valor
                                                        }));
                                                    }} checked={lecturaActivoEnt}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarEntrLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarEntrEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeEnt((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permEntregas: valor
                                                        }));
                                                    }} checked={escrituraActivoEnt}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarEntrEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '3px' }}>Recepciones</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarRecepLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeRec((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permRecepciones: valor
                                                        }));
                                                    }} checked={lecturaActivoRec}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarRecepLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarRecepEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeRec((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permRecepciones: valor
                                                        }));
                                                    }} checked={escrituraActivoRec}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarRecepEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Informes</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarInfoLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeInf((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permInformes: valor
                                                        }));
                                                    }} checked={lecturaActivoInf}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarInfoLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarInfoEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeInf((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permInformes: valor
                                                        }));
                                                    }} checked={escrituraActivoInf}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarInfoEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Usuarios</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarUsuaLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangeUsu((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permUsuarios: valor
                                                        }));
                                                    }} checked={lecturaActivoUsu}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarUsuaLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarUsuaEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangeUsu((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permUsuarios: valor
                                                        }));
                                                    }} checked={escrituraActivoUsu}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarUsuaEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mb-1 d-flex justify-content-around">
                                                <div className="form-check border ps-5 py-2" style={{ width: '42%' }}>
                                                    <h6 style={{ marginLeft: '13px' }}>Proveedores</h6>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarProLec" onChange={(e) => {
                                                        const valor = handleCheckboxChangePro((lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permProveedores: valor
                                                        }));
                                                    }} checked={lecturaActivoPro}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarProLec">
                                                        Lectura/Consulta
                                                    </label>
                                                    <br></br>
                                                    <input className="form-check-input" type="checkbox" id="checkEditarProEsc" onChange={(e) => {
                                                        const valor = handleCheckboxChangePro((escritura + lectura + sinPermiso), e.target.checked);
                                                        setUsuarioEditando((prevUsuario) => ({
                                                            ...prevUsuario,
                                                            permProveedores: valor
                                                        }));
                                                    }} checked={escrituraActivoPro}></input>
                                                    <label className="form-check-label" htmlFor="checkEditarProEsc">
                                                        Escritura
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={limpiarInputs} data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-warning'}`} disabled={btnCargando || agregarModalEditarDeshabilitado} onClick={editarUsuario}>{btnCargando ? 'Procesando...' : 'Editar'}</button>
                        </div>
                    </div>
                </div>
            </div >


            {/* MODAL PARA DESACTIVAR */}
            <div className="modal fade" id="desactivarModal" tabIndex="-1" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalDesactivar">&mdash; ¿Deseas desactivar el usuario? &mdash;</h5>
                            <button type="button" id="btnCerrarModalDesactivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" style={{ backgroundColor: 'red' }} onClick={desactivarActivarUsuario}>Eliminar permanentemente</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" disabled={btnCargando} onClick={desactivarActivarUsuario}>{btnCargando ? 'Procesando...' : 'Desactivar'}</button>

                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA ACTIVAR */}
            <div className="modal fade" id="activarModal" tabIndex="-1" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalActivar">&mdash; ¿Deseas activar el usuario? &mdash;</h5>
                            <button type="button" id="btnCerrarModalActivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" disabled={btnCargando} onClick={desactivarActivarUsuario}>{btnCargando ? 'Procesando...' : 'Activar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA CONSULTAR SOBRE CUIT EXISTENTE */}
            <div className="modal fade" id="consultarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleConsultarModal">&mdash; ¿Deseas editar el usuario? &mdash;</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>El CUIL/CUIT: <strong>- {CUIT} -</strong> , del usuario: <strong>- {nombreCompleto} -</strong> ya existe dentro del sistema. ¿Deseas editar el usuario con ese CUIL/CUIT?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" onClick={cerrarVolverConsultarModal} data-bs-target="#agregarModal">No</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" data-bs-toggle="modal" onClick={cerrarConsultarModal} data-bs-target="#editarModal">Si</button>
                            <button id="btnCerrarConsultarModalCUITExistente" data-bs-dismiss="modal" data-bs-target="#consultarModal" style={{ display: 'none' }}></button>
                        </div>
                    </div>
                </div>
            </div>
        </>


    );
}

export default Usuarios;