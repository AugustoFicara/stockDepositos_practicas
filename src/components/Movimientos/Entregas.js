import { useState, useEffect } from "react";
import ExportExcel from "../../excelexport";
import { Entrega } from "../../types/Movimiento/Entrega";
import { Deposito } from "../../types/Deposito";
import { Destinatario } from "../../types/Destinatario";
import { Stock } from "../../types/Stock";
import { EntregaService } from "../../services/Movimiento/EntregaService";
import { DepositoService } from "../../services/DepositoService";
import { DestinatarioService } from "../../services/DestinatarioService";
import { StockService } from "../../services/StockService";
import { Toaster, toast } from "sonner";
import Select from 'react-select';

function Entregas() {

    //VARIABLES
    const [entregas, setEntregas] = useState([]);
    const [depositos, setDepositos] = useState([]);
    const [depositosActivos, setDepositosActivos] = useState([]);
    const [destinatarios, setDestinatarios] = useState([]);
    const [destinatariosActivos, setDestinatariosActivos] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedEntrega, setSelectedEntrega] = useState(new Entrega());
    const [mostrarEntregas, setMostrarEntregas] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [cantidadEntrega, setCantidadEntrega] = useState('');
    const [errorCantidadEntrega, setErrorCantidadEntrega] = useState(false);
    const [validoNombreMaterial, setValidoNombreMaterial] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const [errorObservaciones, setErrorObservaciones] = useState(false);
    const [id_destinatario, setId_destinatario] = useState(new Destinatario());
    const [id_deposito, setId_deposito] = useState(new Deposito());
    const [id_stock, setId_stock] = useState(new Stock());
    const [entregaEditando, setEntregaEditando] = useState(null);
    const agregarModalEditarDeshabilitado = errorCantidadEntrega || errorObservaciones;
    const [btnCargando, setBtnCargando] = useState(false);
    const [filtroFechaHoraEntrega, setFiltroFechaHoraEntrega] = useState(new Date());
    const [filtroNombreMaterial, setFiltroNombreMaterial] = useState('');
    const [filtroDeposito, setFiltroDeposito] = useState(new Deposito());
    const [filtroDestinatario, setFiltroDestinatario] = useState(new Destinatario());
    const [materialAEditar, setMaterialAEditar] = useState('');
    const [clickMaterialAEditar, setClickMaterialAEditar] = useState(false);

    //FUNCIONES
    useEffect(() => {
        fetchEntregas();
        fetchStocks();
        fetchDepositos();
        fetchDestinatarios();
    }, []);

    useEffect(() => {
        filtrarEntregas();
    }, [filtroFechaHoraEntrega, filtroNombreMaterial, filtroDeposito, filtroDestinatario, entregas]);

    const fetchEntregas = async () => {
        try {
            const data = await EntregaService.getEntregas();
            setEntregas(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener entregas: ", error);
        }
    };

    const filtrarEntregas = () => {
        let datosFiltrados = entregas;

        /*if (filtroFechaHoraEntrega) {
            datosFiltrados = datosFiltrados.filter(entrega =>
                new Date(entrega.fechaHoraEntrega).toDateString() === new Date(filtroFechaHoraEntrega).toDateString()
            );
        }*/

        if (filtroNombreMaterial) {
            datosFiltrados = datosFiltrados.filter(entrega =>
                entrega.nombreMaterial.toLowerCase().includes(filtroNombreMaterial.toLowerCase())
            );
        }

        if (filtroDeposito && filtroDeposito.id) {
            datosFiltrados = datosFiltrados.filter(entrega =>
                entrega.deposito.id === filtroDeposito.id
            );
        }

        if (filtroDestinatario && filtroDestinatario.id) {
            datosFiltrados = datosFiltrados.filter(entrega =>
                entrega.destinatario.id === filtroDestinatario.id
            );
        }

        setDatosFiltrados(datosFiltrados);
    }

    const fetchDepositos = async () => {
        try {
            const data = await DepositoService.getDepositos();
            setDepositos(data);
        } catch (error) {
            console.error("Error al obtener depositos: ", error);
        }
    };

    const fetchDestinatarios = async () => {
        try {
            const data = await DestinatarioService.getDestinatarios();
            setDestinatarios(data);
        } catch (error) {
            console.error("Error al obtener destinatarios: ", error);
        }
    };


    const fetchStocks = async () => {
        try {
            const data = await StockService.getStockActivos();
            setStocks(data);
        } catch (error) {
            console.error("Error al obtener stock: ", error);
        }
    };

    async function agregarEntrega() {
        setBtnCargando(true);

        const entrega = new Entrega();

        if (id_stock.id === 0) {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe seleccionar un material para continuar!");
            return;
        }
        entrega.id_stock = id_stock;

        if (!cantidadEntrega || cantidadEntrega === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Cantidad de entrega' para continuar!");
            return;
        }
        entrega.cantidadEntrega = cantidadEntrega;

        if (id_deposito.id === 0) {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe seleccionar un depósito para continuar!");
            return;
        }
        entrega.id_deposito = id_deposito;

        if (id_destinatario.id === 0) {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe seleccionar un destinatario para continuar!");
            return;
        }
        entrega.id_destinatario = id_destinatario;
        entrega.observaciones = observaciones;
        entrega.activo = 1;

        console.log(entrega);

        /*toast.promise(EntregaService.createEntrega(entrega), {
            success: () => {
                fetchEntregas();
                fetchStocks();
                fetchDepositos();
                fetchDestinatarios();
                return ("¡Entrega agregada correctamente!");
            },
            error: () => {
                return ("¡Error al agregar la entrega!")
            },
            finally: () => {
                fetchEntregas();
                fetchStocks();
                fetchDepositos();
                fetchDestinatarios();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                }, 500)
            }
        });*/
    }

    const selectId_stock = (selectedOption) => {
        setId_stock(selectedOption.value);
    };

    const selectId_deposito = (selectedOption) => {
        setId_deposito(selectedOption.value);
    };

    const selectId_destinatario = (selectedOption) => {
        selectId_destinatario(selectedOption.value);
    };

    const limpiarInputs = () => {
        setId_deposito({ id: null, descripcion: '' });
        setId_destinatario({ id: null, nombreCompleto: '' });
        setId_stock({ id: null, id_material: '' });
        setObservaciones('');
        setCantidadEntrega('');
        setErrorCantidadEntrega(false);
        setErrorObservaciones(false);
    }

    //CODIGO HTML
    return (
        <>
            <h1 className="text-center text-bg-dark p-2">&mdash; Entregas &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-75 justify-content-between">
                    {/*<input id="startDate" className="form-control" type="date" value={filtroFechaHoraEntrega} onChange={(e) => setFiltroFechaHoraEntrega(e.target.value)} />*/}
                    <input value={filtroNombreMaterial} onChange={(e) => setFiltroNombreMaterial(e.target.value)} type="text" className="form-control" placeholder="Buscar por material..." aria-label="Buscar por material..."></input>

                    <select className="form-select" value={filtroDeposito.id} onChange={(e) => setFiltroDeposito(depositos.find(dep => dep.id === e.target.value))}>
                        <option value="">Filtrar por depósito (mostrar todos)</option>
                        {depositos.map((deposito) => (
                            <option key={deposito.id} value={deposito.id}>
                                {deposito.descripcion}
                            </option>
                        ))}
                    </select>
                    <select className="form-select" value={filtroDestinatario.id} onChange={(e) => setFiltroDestinatario(destinatarios.find(dest => dest.id === e.target.value))}>
                        <option value="">Filtrar por destinatario (mostrar todos)</option>
                        {destinatarios.map((destinatario) => (
                            <option key={destinatario.id} value={destinatario.id}>
                                {destinatario.nombreCompleto}
                            </option>
                        ))}
                    </select>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>
                <div>
                    <button data-bs-toggle="modal" data-bs-target="#activarModal" type="button" className="btn btn-primary me-2 mt-2">+ Agregar entrega</button>
                    <button type="button" className="btn btn-success me-4 mt-2">Generar excel</button>

                </div>
            </div>
            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Fecha de entrega</th>
                        <th scope="col">Material</th>
                        <th scope="col">Cantidad de entrega</th>
                        <th scope="col">Depósito</th>
                        <th scope="col">Destinatario</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.map((entrega) => (
                        <tr key={entrega.id}>
                            <th scope="row">{entrega.id}</th>
                            <td>{new Date(entrega.fechaHoraEntrega).toLocaleDateString()}</td>
                            <td>{entrega.id_stock}</td>
                            <td>{(entrega.cantidadEntrega)}</td>
                            <td>{(entrega.id_deposito)}</td>
                            <td>{entrega.id_destinatario}</td>
                            <td>
                                <button onClick={() => setEntregaEditando(entrega)} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                    Editar
                                </button>
                                {entrega.activo > 0 &&
                                    <button onClick={() => setEntregaEditando(entrega)} type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal">
                                        Desactivar
                                    </button>
                                }
                                {entrega.activo < 1 &&
                                    <button onClick={() => setEntregaEditando(entrega)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal" >
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
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar entrega &mdash;</h5>
                            <button type="button" id="btnCerrarModalAgregar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <Select options={stocks.map((stock) => ({
                                        value: stock.id,
                                        label: stock.id_material,
                                    }))} value={id_stock.id} onChange={selectId_stock}
                                        placeholder="Seleccionar material"
                                        isSearchable />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cantidad de entrega:</label>
                                    <input type="number" placeholder="Cantidad de entrega" className="form-control" id="txtCantidadEntrega"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Depósito:</label>
                                    <Select options={depositos.map((deposito) => ({
                                        value: deposito.id,
                                        label: deposito.descripcion,
                                    }))} value={id_deposito.id} onChange={selectId_deposito}
                                        placeholder="Seleccionar depósito"
                                        isSearchable />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Destinatario:</label>
                                    <Select options={destinatarios.map((destinatario) => ({
                                        value: destinatario.id,
                                        label: destinatario.nombreCompleto,
                                    }))} value={id_destinatario.id} onChange={selectId_destinatario}
                                        placeholder="Seleccionar destinatario"
                                        isSearchable />
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Observaciones (opcional):</label>
                                    <textarea className="form-control" id="txtObservaciones" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">&mdash; Editar entrega &mdash;</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <Select options={stocks.map((stock) => ({
                                        value: stock.id,
                                        label: stock.id_material,
                                    }))} value={id_stock.id} onChange={selectId_stock}
                                        placeholder="Seleccionar material"
                                        isSearchable />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cantidad de entrega:</label>
                                    <input type="number" placeholder="Cantidad de entrega" className="form-control" id="txtCantidadEntrega"></input>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Depósito:</label>
                                    <Select options={depositos.map((deposito) => ({
                                        value: deposito.id,
                                        label: deposito.descripcion,
                                    }))} value={id_deposito.id} onChange={selectId_deposito}
                                        placeholder="Seleccionar depósito"
                                        isSearchable />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Destinatario:</label>
                                    <Select options={destinatarios.map((destinatario) => ({
                                        value: destinatario.id,
                                        label: destinatario.nombreCompleto,
                                    }))} value={id_destinatario.id} onChange={selectId_destinatario}
                                        placeholder="Seleccionar destinatario"
                                        isSearchable />
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Observaciones (opcional):</label>
                                    <textarea className="form-control" id="txtObservaciones" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-warning" data-bs-dismiss="modal">Editar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA DESACTIVAR/ACTIVAR */}
            <div className="modal fade" id="desactivarModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">&mdash; ¿Deseas desactivar la entrega? &mdash;</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Desactivar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA ACTIVAR */}
            <div className="modal fade" id="activarModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">&mdash; ¿Deseas activar la entrega? &mdash;</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal">Activar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Entregas;