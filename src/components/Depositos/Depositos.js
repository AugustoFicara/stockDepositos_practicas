import { useEffect, useState } from "react";
import ExportExcel from "../../excelexport";
import { Deposito } from "../../types/Deposito";
import { DepositoService } from "../../services/DepositoService";
import { data, error } from "jquery";
import { Toaster, toast } from "sonner";
import XLSX from 'sheetjs-style';

const Depositos = ({ isOpen, onClose }) => {

    //VARIABLES
    const [depositos, setDepositos] = useState([]);
    const [selectedDeposito, setSelectedDeposito] = useState(new Deposito());
    const [mostrarDepositos, setMostrarDepositos] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [errorDescripcion, setErrorDescripcion] = useState(false);
    const [domicilio, setDomicilio] = useState('');
    const [errorDomicilio, setErrorDomicilio] = useState(false);
    const [depositoEditando, setDepositoEditando] = useState(null);
    const modalAgregarEditarDeshabilitado = errorDescripcion || errorDomicilio;
    const [btnCargando, setBtnCargando] = useState(false);

    //FUNCIONES
    useEffect(() => {
        fetchDepositos();
    }, []);

    const fetchDepositos = async () => {
        try {
            const data = await DepositoService.getDepositos();
            setDepositos(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener depositos: ", error);
        }
    };

    const filtroDepositos = (e) => {
        const filtro = e.target.value;
        setSelectedDeposito(filtro);

        if (filtro === '') {
            setDatosFiltrados(depositos);
        } else {
            const datosFiltrados = depositos.filter(deposito =>
                deposito.descripcion === filtro
            );
            setDatosFiltrados(datosFiltrados);
        }
    };

    async function agregarDeposito() {
        setBtnCargando(true);

        const deposito = new Deposito();

        if (!descripcion || descripcion === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Descripción' para continuar!");
            return;
        }
        deposito.descripcion = capitalizarPalabras(descripcion);

        if (!domicilio || domicilio === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Domicilio' para continuar!");
            return;
        }
        deposito.domicilio = capitalizarPalabras(domicilio);
        deposito.activo = 1;


        toast.promise(DepositoService.createDeposito(deposito), {
            success: () => {
                fetchDepositos();
                return ("¡Depósito agregado correctamente!")
            },
            error: () => {
                return ("¡Error al agregar el depósito!")
            },
            finally: () => {
                fetchDepositos();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                    setSelectedDeposito("");
                }, 500)
            }
        });


    }

    const editarDeposito = async () => {
        setBtnCargando(true);

        const deposito = new Deposito();
        deposito.id = depositoEditando.id;

        if (!depositoEditando.descripcion || depositoEditando.descripcion === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Descripción' para continuar!");
            return;
        }
        deposito.descripcion = capitalizarPalabras(depositoEditando.descripcion);

        if (!depositoEditando.domicilio || depositoEditando.domicilio === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Domicilio' para continuar!");
            return;
        }
        deposito.domicilio = capitalizarPalabras(depositoEditando.domicilio);
        deposito.activo = 1;

        toast.promise(DepositoService.updateDeposito(deposito), {
            success: () => {
                fetchDepositos();
                return ("¡Depósito editado correctamente!")
            },
            error: () => {
                return ("¡Error al editar el depósito!")
            },
            finally: () => {
                fetchDepositos();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalEditar').click();
                    limpiarInputs();
                    setSelectedDeposito("");
                }, 500)
            }
        });

    }

    const desactivarActivarDeposito = async () => {
        setBtnCargando(true);

        let deposito = new Deposito();
        deposito.id = depositoEditando.id;
        deposito.activo = depositoEditando.activo;

        toast.promise(DepositoService.deleteDeposito(deposito), {
            success: () => {
                fetchDepositos();

                if (deposito.activo === "1") {
                    return ("¡Depósito desactivado correctamente!")
                } else if (deposito.activo === "0") {
                    return ("¡Depósito activado correctamente!")
                }

            },
            error: () => {
                if (deposito.activo === "1") {
                    return ("¡Error al desactivar el depósito!")
                } else if (deposito.activo === "0") {
                    return ("¡Error al activar el depósito!")
                }
            },
            finally: () => {
                fetchDepositos();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalDesactivar').click();
                    document.getElementById('btnCerrarModalActivar').click();
                    setSelectedDeposito("");
                }, 500)
            }
        });

    }

    const txtDescripcionChange = (e) => {
        const value = e.target.value;
        setDescripcion(value);
        setErrorDescripcion(value.length <= 3 && value.length > 0);
    }

    const txtEditarDescripcionChange = (e) => {
        const value = e.target.value;
        setDepositoEditando(prev => ({
            ...prev,
            descripcion: value
        }));
        setErrorDescripcion(value.length <= 3);
    }

    const txtDomicilioChange = (e) => {
        const value = e.target.value;
        setDomicilio(value);
        setErrorDomicilio(value.length <= 5 && value.length > 0);
    }

    const txtEditarDomicilioChange = (e) => {
        const value = e.target.value;
        setDepositoEditando(prev => ({
            ...prev,
            domicilio: value
        }));
        setErrorDomicilio(value.length <= 5);
    }

    const limpiarInputs = () => {
        setDescripcion('');
        setDomicilio('');
        setErrorDescripcion(false);
        setErrorDomicilio(false);
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
            if (depositos.length > 0) {
                //FILTRAR DATOS QUE QUEREMOS Y CREAMOS HOJA
                const datosExcel = depositos.map(({ id, descripcion, domicilio }) => ({ id, descripcion, domicilio }));
                const worksheet = XLSX.utils.json_to_sheet(datosExcel);

                //CABECERAS
                XLSX.utils.sheet_add_aoa(worksheet, [["ID", "Descripción", "Domicilio"]], { origin: "A1" });

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

                Object.keys(worksheet).forEach(celda => {
                    if (celda.startsWith('A')) {
                        worksheet[celda].s = estiloCelda;
                    }
                });

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de depósitos");

                XLSX.writeFile(workbook, "Listado de depósitos.xlsx");

                toast.success("¡Informe generado correctamente!");
            } else {
                toast.error("¡No hay datos para generar el informe!");
            }

        } catch {
            toast.error("¡Error al generar el informe!");
        }
    }

    //CODIGO HTML
    return (
        <>
            <Toaster />
            <h1 className="text-center text-bg-dark p-2">&mdash; Depósitos &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-25 justify-content-between">
                    <select title="Buscar por depósito" className="form-select" value={selectedDeposito} onChange={filtroDepositos}>
                        <option value="" className="text-secondary">Buscar por depósito (mostrar todos)</option>
                        {depositos.map(deposito => (
                            <option key={deposito.descripcion} defaultValue={deposito.descripcion}>
                                {deposito.descripcion}
                            </option>
                        ))}
                    </select>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>
                <div>
                    <button data-bs-toggle="modal" data-bs-target="#modalAgregar" type="button" className="btn btn-primary me-2 mt-2">+ Agregar depósito</button>
                    <button onClick={exportToExcel} type="button" className="btn btn-success me-4 mt-2">Generar excel</button>
                </div>
            </div>

            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Domicilio</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.length > 0 ? (
                        datosFiltrados.map(deposito => (
                            <tr key={deposito.id}>
                                <th scope="row">{deposito.id}</th>
                                <td>{deposito.descripcion}</td>
                                <td>{deposito.domicilio}</td>
                                <td>
                                    <button onClick={() => setDepositoEditando(deposito)} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                        Editar
                                    </button>
                                    {deposito.activo > 0 &&
                                        <button onClick={() => setDepositoEditando(deposito)} type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal">
                                            Desactivar
                                        </button>
                                    }
                                    {deposito.activo < 1 &&
                                        <button onClick={() => setDepositoEditando(deposito)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal">
                                            Activar
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-muted">
                                No se encontraron datos.
                            </td>
                        </tr>
                    )}


                </tbody>
            </table>

            {/* MODAL PARA AGREGAR */}
            <div className="modal fade" id="modalAgregar" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar depósito &mdash;</h5>
                            <button id="btnCerrarModalAgregar" type="button" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Descripción:</label>
                                    <input title="Debe contener más de 3 caracteres" pattern=".{4,}" required={true} value={descripcion} onChange={txtDescripcionChange} type="text" placeholder="Descripción" className={`form-control ${descripcion ? (errorDescripcion ? 'is-invalid' : 'is-valid') : ''}`} id="txtDescripcion"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Domicilio:</label>
                                    <input title="Debe contener más de 5 caracteres" pattern=".{6,}" required={true} value={domicilio} onChange={txtDomicilioChange} type="text" placeholder="Domicilio" className={`form-control ${domicilio ? (errorDomicilio ? 'is-invalid' : 'is-valid') : ''}`} id="txtDomicilio"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarInputs}>Cancelar</button>
                            <button type="button" onClick={agregarDeposito} className={`btn ${modalAgregarEditarDeshabilitado ? 'btn-secondary' : 'btn-primary'}`} disabled={modalAgregarEditarDeshabilitado || btnCargando}>{btnCargando ? 'Procesando...' : 'Agregar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalEditar">&mdash; Editar depósito &mdash;</h5>
                            <button id="btnCerrarModalEditar" type="button" className="btn-close" data-bs-dismiss="modal" onClick={limpiarInputs} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Descripción:</label>
                                    <input title="Debe contener más de 3 caracteres" required={true} value={depositoEditando ? depositoEditando.descripcion : ""} onChange={txtEditarDescripcionChange} type="text" placeholder="Descripción" className={`form-control ${depositoEditando ? (errorDescripcion ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarDescripcion"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Domicilio:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={depositoEditando ? depositoEditando.domicilio : ""} onChange={txtEditarDomicilioChange} type="text" placeholder="Domicilio" className={`form-control ${depositoEditando ? (errorDomicilio ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarDomicilio"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarInputs}>Cancelar</button>
                            <button type="button" className={`btn ${modalAgregarEditarDeshabilitado ? 'btn-secondary' : 'btn-warning'}`} disabled={modalAgregarEditarDeshabilitado || btnCargando} onClick={editarDeposito}>{btnCargando ? 'Procesando...' : 'Editar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA DESACTIVAR */}
            <div className="modal fade" id="desactivarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalDesactivar">&mdash; ¿Deseas desactivar el depósito? &mdash;</h5>
                            <button type="button" id="btnCerrarModalDesactivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" disabled={btnCargando} onClick={desactivarActivarDeposito}>{btnCargando ? 'Procesando...' : 'Desactivar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA ACTIVAR */}
            <div className="modal fade" id="activarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalActivar">&mdash; ¿Deseas activar el depósito? &mdash;</h5>
                            <button type="button" id="btnCerrarModalActivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" disabled={btnCargando} onClick={desactivarActivarDeposito}>{btnCargando ? 'Procesando...' : 'Activar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Depositos;