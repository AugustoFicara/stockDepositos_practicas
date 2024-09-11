import { useEffect, useState } from "react";
import ExportExcel from "../../excelexport";
import { Destinatario } from "../../types/Destinatario";
import { DestinatarioService } from "../../services/DestinatarioService";
import $ from "jquery";
import { Toaster, toast } from "sonner";
import XLSX from 'sheetjs-style';

function Destinatarios() {

    //VARIABLES
    const [destinatarios, setDestinatarios] = useState([]);
    const [selectedDestinatario, setSelectedDestinatario] = useState(new Destinatario());
    const [mostrarDestinatarios, setMostrarDestinatarios] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [errorNombreCompleto, setErrorNombreCompleto] = useState(false);
    const [CUIT, setCUIT] = useState('');
    const [errorCUIT, setErrorCUIT] = useState(false);
    const [validoCUIT, setValidoCUIT] = useState(false);
    const [domicilio, setDomicilio] = useState('');
    const [errorDomicilio, setErrorDomicilio] = useState(false);
    const [nroTelefono, setNroTelefono] = useState('');
    const [errorNroTelefono, setErrorNroTelefono] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [validoEmail, setValidoEmail] = useState(false);
    const [destinatarioEditando, setDestinatarioEditando] = useState(null);
    const agregarModalEditarDeshabilitado = errorNombreCompleto || errorCUIT || errorNroTelefono;
    const [btnCargando, setBtnCargando] = useState(false);
    const [filtroNombreCompleto, setFiltroNombreCompleto] = useState('');
    const [filtroCUIT, setFiltroCUIT] = useState('');
    const [destinatarioAEditar, setDestinatarioAEditar] = useState('');
    const [clickDestinatarioAEditar, setClickDestinatarioAEditar] = useState(false);

    //FUNCIONES
    useEffect(() => {
        fetchDestinatarios();
    }, []);

    useEffect(() => {
        filtrarDestinatarios();
    }, [filtroNombreCompleto, filtroCUIT, destinatarios]);

    const fetchDestinatarios = async () => {
        try {
            const data = await DestinatarioService.getDestinatarios();
            setDestinatarios(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener destinatarios: ", error);
        }
    };

    const filtrarDestinatarios = () => {
        let datosFiltrados = destinatarios;

        if (filtroNombreCompleto) {
            datosFiltrados = datosFiltrados.filter(destinatario =>
                destinatario.nombreCompleto.toLowerCase().includes(filtroNombreCompleto.toLowerCase())
            );
        }

        if (filtroCUIT) {
            datosFiltrados = datosFiltrados.filter(destinatario =>
                destinatario.CUIT.toLowerCase().includes(filtroCUIT.toLowerCase())
            );
        }

        setDatosFiltrados(datosFiltrados);
    }

    async function agregarDestinatario() {
        setBtnCargando(true);

        const destinatario = new Destinatario();

        if (!nombreCompleto || nombreCompleto === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre completo' para continuar!");
            return;
        }
        destinatario.nombreCompleto = capitalizarPalabras(nombreCompleto);

        if (!CUIT || CUIT === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'CUIT' para continuar!");
            return;
        }
        destinatario.CUIT = CUIT;

        if (!domicilio || domicilio === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Domicilio' para continuar!");
            return;
        }
        destinatario.domicilio = capitalizarPalabras(domicilio);

        if (!nroTelefono || nroTelefono === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Número de teléfono' para continuar!");
            return;
        }
        destinatario.nroTelefono = nroTelefono;
        destinatario.email = email;
        destinatario.activo = 1;

        toast.promise(DestinatarioService.createDestinatario(destinatario), {
            success: () => {
                fetchDestinatarios();
                return ("¡Destinatario agregado correctamente!");
            },
            error: () => {
                return ("¡Error al agregar el destinatario!")
            },
            finally: () => {
                fetchDestinatarios();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const editarDestinatario = async () => {
        setBtnCargando(true);

        const destinatario = new Destinatario();
        destinatario.id = destinatarioEditando.id;

        if (!destinatarioEditando.nombreCompleto || destinatarioEditando.nombreCompleto === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre completo' para continuar!");
            return;
        }
        destinatario.nombreCompleto = capitalizarPalabras(destinatarioEditando.nombreCompleto);

        if (!destinatarioEditando.CUIT || destinatarioEditando.CUIT === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'CUIT' para continuar!");
            return;
        }
        destinatario.CUIT = destinatarioEditando.CUIT;

        if (!destinatarioEditando.domicilio || destinatarioEditando.domicilio === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Domicilio' para continuar!");
            return;
        }
        destinatario.domicilio = capitalizarPalabras(destinatarioEditando.domicilio);

        if (!destinatarioEditando.nroTelefono || destinatarioEditando.nroTelefono === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Número de teléfono' para continuar!");
            return;
        }
        destinatario.nroTelefono = destinatarioEditando.nroTelefono;
        destinatario.email = destinatarioEditando.email;
        destinatario.activo = 1;

        toast.promise(DestinatarioService.updateDestinatario(destinatario), {
            success: () => {
                fetchDestinatarios();
                return ("¡Destinatario editado correctamente!")
            },
            error: () => {
                return ("¡Error al editar el destinatario!")
            },
            finally: () => {
                fetchDestinatarios();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalEditar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const desactivarActivarDestinatario = async () => {
        setBtnCargando(true);

        let destinatario = new Destinatario();
        destinatario.id = destinatarioEditando.id;
        destinatario.activo = destinatarioEditando.activo;

        toast.promise(DestinatarioService.deleteDestinatario(destinatario), {
            success: () => {
                fetchDestinatarios();

                if (destinatario.activo === "1") {
                    return ("¡Destinatario desactivado correctamente!")
                } else if (destinatario.activo === "0") {
                    return ("¡Destinatario activado correctamente!")
                }
            },
            error: () => {
                if (destinatario.activo === "1") {
                    return ("¡Error al desactivar el destinatario!")
                } else if (destinatario.activo === "0") {
                    return ("¡Error al activar el destinatario!")
                }
            },
            finally: () => {
                fetchDestinatarios();
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
        setDestinatarioEditando(prev => ({
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
            const CUITExistente = await DestinatarioService.buscarCUIT(CUIT);

            if (CUITExistente.length > 0) {
                const destinatarioEncontrado = destinatarios.find(destinatario => destinatario.CUIT === CUIT);
                if (destinatarioEncontrado) {
                    setNombreCompleto(destinatarioEncontrado.nombreCompleto);
                }
                toast.error("¡Error! CUIT ya existente");
                setErrorCUIT(CUITExistente.length > 0);

                const destinatario = CUITExistente[0];
                setDestinatarioEditando(destinatario);

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

    const txtDomicilioChange = (e) => {
        const value = e.target.value;
        setDomicilio(value);
        setErrorDomicilio(value.length <= 5 && value.length > 0);
    }

    const txtEditarDomicilioChange = (e) => {
        const value = e.target.value;
        setDestinatarioEditando(prev => ({
            ...prev,
            domicilio: value
        }));
        setErrorDomicilio(value.length <= 5);
    }

    const txtNroTelefonoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNroTelefono(value);
        setErrorNroTelefono(value.length <= 9 && value.length > 0 || value.length > 20);
    }

    const txtEditarNroTelefonoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setDestinatarioEditando(prev => ({
            ...prev,
            nroTelefono: value
        }));
        setErrorNroTelefono(value.length <= 9 || value.length > 20);
    }

    const txtEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrorEmail(value.length > 0 && !emailPattern.test(value));
    }

    const txtEditarEmailChange = (e) => {
        const value = e.target.value;
        setDestinatarioEditando(prev => ({
            ...prev,
            email: value
        }));
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrorEmail(value.length > 0 && !emailPattern.test(value));
    }

    const buscarEmail = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const EmailExistente = await DestinatarioService.buscarEmail(email);

            if (EmailExistente.length > 0) {
                toast.error("¡Error! E-Mail ya existente");
                setErrorEmail(EmailExistente.length > 0);
            } else if (EmailExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoEmail(EmailExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el E-Mail!");
            }
        }
    }

    const buscarEmailEditar = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const EmailExistente = await DestinatarioService.buscarEmail(destinatarioEditando.email);

            if (EmailExistente.length > 0) {
                if (destinatarioEditando.email.toLowerCase() === destinatarioAEditar) {
                    toast.success("¡Perfecto! Es el E-Mail que busca editar. Puede continuar");
                    setValidoEmail(destinatarioEditando.email.toLowerCase() === destinatarioAEditar);
                    return;
                }

                toast.error("¡Error! E-Mail ya existente");
                setErrorEmail(EmailExistente.length > 0);

                /*const material = nombreMaterialExistente[0];
                setMaterialEditando(material);

                document.getElementById('btnAbrirConsultarModal').click();
                document.getElementById('btnCerrarAgregarModalCUITExistente').click();*/
            } else if (EmailExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoEmail(EmailExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el E-Mail!");
            }
        }
    }

    const clickearDestinatarioAEditar = (e) => {
        if (!clickDestinatarioAEditar) {
            setDestinatarioAEditar(e.target.value.toLowerCase());
            setClickDestinatarioAEditar(true);
        }
    }

    const limpiarInputs = () => {
        setNombreCompleto('');
        setCUIT('');
        setDomicilio('');
        setNroTelefono('');
        setEmail('');
        setErrorNombreCompleto(false);
        setErrorCUIT(false);
        setValidoCUIT(false);
        setErrorDomicilio(false);
        setErrorNroTelefono(false);
        setErrorEmail(false);
        setValidoEmail(false);
        setClickDestinatarioAEditar(false);
    }

    const cerrarConsultarModal = () => {
        document.getElementById('btnCerrarConsultarModalCUITExistente').click();
        limpiarInputs();
    }

    const cerrarVolverConsultarModal = async () => {
        await setNombreCompleto('');
        document.getElementById('btnCerrarConsultarModalCUITExistente').click();
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
            if (destinatarios.length > 0) {
                //FILTRAR DATOS QUE QUEREMOS Y CREAMOS HOJA
                const datosExcel = destinatarios.map(({ id, CUIT, nombreCompleto, domicilio, nroTelefono, email }) => ({ id, CUIT, nombreCompleto, domicilio, nroTelefono, email }));
                const worksheet = XLSX.utils.json_to_sheet(datosExcel);

                //CABECERAS
                XLSX.utils.sheet_add_aoa(worksheet, [["ID", "CUIL/CUIT", "Nombre completo", "Domicilio", "Número de teléfono", "E-Mail"]], { origin: "A1" });

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
                worksheet['F1'].s = estiloCabecera;

                Object.keys(worksheet).forEach(celda => {
                    if (celda.startsWith('A')) {
                        worksheet[celda].s = estiloCelda;
                    }
                });

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de destinatarios");

                XLSX.writeFile(workbook, "Listado de destinatarios.xlsx");

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
            <h1 className="text-center text-bg-dark p-2">&mdash; Destinatarios &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-50 justify-content-between">
                    <input title="Buscar por nombre" value={filtroNombreCompleto} onChange={(e) => setFiltroNombreCompleto(e.target.value)} type="text" className="form-control" placeholder="Buscar por nombre..." aria-label="Buscar por nombre..." aria-describedby="button-addon2"></input>
                    <input title="Buscar por CUIL/CUIT" value={filtroCUIT} onChange={(e) => setFiltroCUIT(e.target.value)} type="text" className="form-control" placeholder="Buscar por CUIT/CUIL..." aria-label="Buscar por CUIT/CUIL..." aria-describedby="button-addon2"></input>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>

                <div>
                    <button data-bs-toggle="modal" data-bs-target="#agregarModal" type="button" className="btn btn-primary me-2 mt-2">+ Agregar destinatario</button>
                    <button onClick={exportToExcel} type="button" className="btn btn-success me-4 mt-2">Generar excel</button>
                </div>
            </div>
            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">CUIT/CUIL</th>
                        <th scope="col">Domicilio</th>
                        <th scope="col">Número de teléfono</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.length > 0 ? (

                        datosFiltrados.map((destinatario) => (
                            <tr key={destinatario.id}>
                                <th scope="row">{destinatario.id}</th>
                                <td>{destinatario.nombreCompleto}</td>
                                <td>{(destinatario.CUIT)}</td>
                                <td>{(destinatario.domicilio)}</td>
                                <td>{destinatario.nroTelefono}</td>
                                <td>
                                    <button onClick={() => setDestinatarioEditando(destinatario)} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                        Editar
                                    </button>
                                    {destinatario.activo > 0 &&
                                        <button onClick={() => setDestinatarioEditando(destinatario)} type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal">
                                            Desactivar
                                        </button>
                                    }
                                    {destinatario.activo < 1 &&
                                        <button onClick={() => setDestinatarioEditando(destinatario)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal">
                                            Activar
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))

                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No se encontraron datos.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>

            {/* MODAL PARA AGREGAR */}
            <div className="modal fade" id="agregarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar destinatario &mdash;</h5>
                            <button type="button" id="btnCerrarModalAgregar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={nombreCompleto} onChange={txtNombreCompletoChange} type="text" placeholder="Nombre completo" className={`form-control ${nombreCompleto ? (errorNombreCompleto ? 'is-invalid' : 'is-valid') : ''}`} id="txtNombreCompleto"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CUIT/CUIL:</label>
                                    <input onBlur={buscarCUIT} title="Debe contener 11 números" required={true} value={CUIT} onChange={txtCUITChange} type="text" placeholder="CUIT/CUIL" className={`form-control ${errorCUIT ? 'is-invalid' : validoCUIT ? 'is-valid' : ''}`} id="txtCUIT"></input>
                                    <button id="btnAbrirConsultarModal" data-bs-toggle="modal" data-bs-target="#consultarModal" style={{ display: 'none' }}></button>
                                    <button id="btnCerrarAgregarModalCUITExistente" data-bs-dismiss="modal" data-bs-target="#agregarModal" style={{ display: 'none' }}></button>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Domicilio:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={domicilio} onChange={txtDomicilioChange} type="text" placeholder="Domicilio" className={`form-control ${domicilio ? (errorDomicilio ? 'is-invalid' : 'is-valid') : ''}`} id="txtDomicilio"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Número de teléfono:</label>
                                    <input title="Debe contener entre 10 y 20 números" required={true} value={nroTelefono} onChange={txtNroTelefonoChange} type="text" placeholder="Número de teléfono" className={`form-control ${nroTelefono ? (errorNroTelefono ? 'is-invalid' : 'is-valid') : ''}`} id="txtNroTelefono"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">E-Mail:</label>
                                    <input onBlur={buscarEmail} title="Debe contener formato E-Mail" required={true} value={email} onChange={txtEmailChange} type="text" placeholder="E-Mail (opcional)" className={`form-control ${errorEmail ? 'is-invalid' : validoEmail ? 'is-valid' : ''}`} id="txtEmail"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={limpiarInputs} data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-primary'}`} onClick={agregarDestinatario} disabled={agregarModalEditarDeshabilitado || btnCargando}>{btnCargando ? 'Procesando...' : 'Agregar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalEditar">&mdash; Editar destinatario &mdash;</h5>
                            <button type="button" id="btnCerrarModalEditar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={destinatarioEditando ? destinatarioEditando.nombreCompleto : ""} onChange={txtEditarNombreCompletoChange} type="text" placeholder="Nombre completo" className={`form-control ${destinatarioEditando ? (errorNombreCompleto ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarNombreCompleto"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CUIT/CUIL:</label>
                                    <input disabled value={destinatarioEditando ? destinatarioEditando.CUIT : ""} onChange={(e) => setDestinatarioEditando({ ...destinatarioEditando, CUIT: e.target.value })} type="text" placeholder="CUIT/CUIL" className="form-control is-valid text-secondary" id="txtEditarCUIT"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Domicilio:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={destinatarioEditando ? destinatarioEditando.domicilio : ""} onChange={txtEditarDomicilioChange} type="text" placeholder="Domicilio" className={`form-control ${destinatarioEditando ? (errorDomicilio ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarDomicilio"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Número de teléfono:</label>
                                    <input title="Debe contener entre 10 y 20 números" required={true} value={destinatarioEditando ? destinatarioEditando.nroTelefono : ""} onChange={txtEditarNroTelefonoChange} type="text" placeholder="Número de teléfono" className={`form-control ${destinatarioEditando ? (errorNroTelefono ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarNroTelefono"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">E-Mail:</label>
                                    <input onBlur={buscarEmailEditar} onClick={clickearDestinatarioAEditar} title="Debe contener formato E-Mail" required={true} value={destinatarioEditando ? destinatarioEditando.email : ""} onChange={txtEditarEmailChange} type="text" placeholder="E-Mail (opcional)" className={`form-control ${destinatarioEditando ? (errorEmail ? 'is-invalid' : validoEmail ? 'is-valid' : '') : ''}`} id="txtEditarEmail"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarInputs}>Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-warning'}`} disabled={btnCargando || agregarModalEditarDeshabilitado} onClick={editarDestinatario}>{btnCargando ? 'Procesando...' : 'Editar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA DESACTIVAR */}
            <div className="modal fade" id="desactivarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalDesactivar">&mdash; ¿Deseas desactivar el destinatario? &mdash;</h5>
                            <button type="button" id="btnCerrarModalDesactivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" disabled={btnCargando} onClick={desactivarActivarDestinatario}>{btnCargando ? 'Procesando...' : 'Desactivar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA ACTIVAR */}
            <div className="modal fade" id="activarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalActivar">&mdash; ¿Deseas activar el destinatario? &mdash;</h5>
                            <button type="button" id="btnCerrarModalActivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" disabled={btnCargando} onClick={desactivarActivarDestinatario}>{btnCargando ? 'Procesando...' : 'Activar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA CONSULTAR SOBRE CUIT EXISTENTE */}
            <div className="modal fade" id="consultarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleConsultarModal">&mdash; ¿Deseas editar el destinatario? &mdash;</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>El CUIL/CUIT: <strong>- {CUIT} -</strong> , del destinatario: <strong>- {nombreCompleto} -</strong> ya existe dentro del sistema. ¿Deseas editar el destinatario con ese CUIL/CUIT?</p>
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

export default Destinatarios;