import { useEffect, useState } from "react";
import ExportExcel from "../../excelexport";
import XLSX from 'sheetjs-style';
import { Toaster, toast } from "sonner";
import { StockService } from "../../services/StockService";
import { Stock } from "../../types/Stock";
import { Deposito } from "../../types/Deposito";
import { DepositoService } from "../../services/DepositoService";
import { Material } from "../../types/Material";
import { MaterialService } from "../../services/MaterialService";
import Select from 'react-select';

function Stocks() {

    //VARIABLES
    const [stocks, setStocks] = useState([]);
    const [depositos, setDepositos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [materialesStock, setMaterialesStock] = useState([]);
    const [selectedStock, setSelectedStock] = useState(new Stock());
    const [selectedDeposito, setSelectedDeposito] = useState(new Deposito());
    const [mostrarStock, setMostrarStock] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [cantidadActual, setCantidadActual] = useState('');
    const [errorCantidadActual, setErrorCantidadActual] = useState(false);
    const [id_material, setId_material] = useState(0);
    const [materialAsociado, setMaterialAsociado] = useState(new Material());
    const [id_deposito, setId_deposito] = useState(0);
    const [depositoAsociado, setDepositoAsociado] = useState(new Deposito());
    const agregarModalEditarDeshabilitado = errorCantidadActual;
    const [btnCargando, setBtnCargando] = useState(false);
    const [filtroNombreMaterial, setFiltroNombreMaterial] = useState('');
    const [stockEditando, setStockEditando] = useState(null);

    //FUNCIONES
    useEffect(() => {
        fetchStock();
        fetchDepositos();
        fetchMaterialesStock();
    }, []);

    useEffect(() => {
        filtrarStock();
    }, [filtroNombreMaterial, stocks]);

    const fetchStock = async () => {
        try {
            const data = await StockService.getStock();
            setStocks(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener stock: ", error);
        }
    };

    const filtrarStock = () => {
        let datosFiltrados = stocks;

        if (filtroNombreMaterial) {
            datosFiltrados = datosFiltrados.filter(stock =>
                (stock.nombreMaterial).toLowerCase().includes(filtroNombreMaterial.toLowerCase())
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
    };

    const fetchMaterialesStock = async () => {
        try {
            let data = await MaterialService.getMaterialesActivosStock();
            setMaterialesStock(data);
        } catch (error) {
            console.error("Error al obtener materiales para stock: ", error);
        }
    }

    async function agregarStock() {
        setBtnCargando(true);

        const stock = new Stock();

        if (materialAsociado.id === 0 || materialAsociado.nombreMaterial === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe seleccionar un material!");
            return;
        }
        stock.id_material = materialAsociado;

        if (!cantidadActual || cantidadActual === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Cantidad actual' para continuar!");
            return;
        }
        stock.cantidadActual = cantidadActual;

        if (depositoAsociado.id === 0 || depositoAsociado.descripcion === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe seleccionar un depósito!");
            return;
        }
        stock.id_deposito = depositoAsociado;
        stock.activo = 1;

        toast.promise(StockService.createStock(stock), {
            success: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();
                return ("¡Stock agregado correctamente!");
            },
            error: () => {
                return ("¡Error al agregar el stock!")
            },
            finally: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const editarStock = async () => {
        setBtnCargando(true);

        let stock = new Stock();
        stock.id = stockEditando.id;

        if (!stockEditando.cantidadActual || stockEditando.cantidadActual === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Cantidad actual' para continuar!");
            return;
        }
        stock.cantidadActual = stockEditando.cantidadActual;
        stock.activo = 1;

        console.log(stock);

        toast.promise(StockService.updateStock(stock), {
            success: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();
                return ("Stock editado correctamente!")
            },
            error: () => {
                return ("¡Error al editar el stock!")
            },
            finally: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalEditar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const desactivarActivarStock = async () => {
        setBtnCargando(true);

        let stock = new Stock();
        stock.id = stockEditando.id;
        stock.activo = stockEditando.activo;

        toast.promise(StockService.deleteStock(stock), {
            success: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();

                if (stock.activo === "1") {
                    return ("¡Stock desactivado correctamente!")
                } else if (stock.activo === "0") {
                    return ("¡Stock activado correctamente!")
                }
            },
            error: () => {
                if (stock.activo === "1") {
                    return ("¡Error al desactivar el stock!")
                } else if (stock.activo === "0") {
                    return ("¡Error al activar el stock!")
                }
            },
            finally: () => {
                fetchStock();
                fetchDepositos();
                fetchMaterialesStock();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalDesactivar').click();
                    document.getElementById('btnCerrarModalActivar').click();
                }, 500)
            }
        });

    }

    const selectId_material = (selectedOption) => {
        setMaterialAsociado(selectedOption.value);
    };

    const selectEditarId_material = (selectedOption) => {
        setStockEditando(prev => ({
            ...prev,
            materialAsociado: selectedOption
        }));
    };

    const selectId_deposito = (selectedOption) => {
        setDepositoAsociado(selectedOption.value);
    };

    const selectEditarId_deposito = (selectedOption) => {
        setStockEditando(prev => ({
            ...prev,
            depositoAsociado: selectedOption
        }));
    };

    const txtCantidadActualChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCantidadActual(value);
        setErrorCantidadActual(value < 0);
    }

    const txtEditarCantidadActualChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setStockEditando(prev => ({
            ...prev,
            cantidadActual: value
        }));
        setErrorCantidadActual(value < 0);
    }

    const limpiarInputs = () => {
        setMaterialAsociado({ id: null, nombreMaterial: '' });
        setCantidadActual('');
        setErrorCantidadActual(false);
        setDepositoAsociado({ id: null, descripcion: '' });
    }

    const exportToExcel = () => {
        try {
            //FILTRAR DATOS QUE QUEREMOS Y CREAMOS HOJA
            const datosExcel = stocks.map(({ id, id_material, cantidadActual }) => ({ id, id_material, cantidadActual }));
            const worksheet = XLSX.utils.json_to_sheet(datosExcel);

            //CABECERAS
            XLSX.utils.sheet_add_aoa(worksheet, [["ID", "Nombre del material", "Cantidad actual"]], { origin: "A1" });

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
            XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de stock");

            XLSX.writeFile(workbook, "Listado de stock.xlsx");

            toast.success("¡Informe generado correctamente!");
        } catch (error) {
            console.log(error);
            toast.error("¡Error al generar el informe!");
        }
    }


    //CODIGO HTML
    return (
        <>
            <Toaster />
            <h1 className="text-center text-bg-dark p-2">&mdash; Stock &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-50 justify-content-between">
                    <input title="Buscar por nombre" value={filtroNombreMaterial} onChange={(e) => setFiltroNombreMaterial(e.target.value)} type="text" className="form-control" placeholder="Buscar por nombre..." aria-label="Filtrar por nombre..."></input>
                    <select title="Buscar por depósito" className="form-select" value={selectedDeposito} onChange={(e) => setSelectedDeposito(e.target.value)}>
                        <option value="" className="text-secondary">Buscar por depósito (mostrar todos)</option>
                        {depositos.map(deposito => (
                            <option key={deposito.id} defaultValue={deposito.id}>
                                {deposito.descripcion}
                            </option>
                        ))}
                    </select>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>
                <div>
                    <button data-bs-toggle="modal" data-bs-target="#agregarModal" type="button" className="btn btn-primary me-2 mt-2">+ Agregar stock</button>
                    <button onClick={exportToExcel} type="button" className="btn btn-success me-4 mt-2">Generar excel</button>
                </div>
            </div>

            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre del material</th>
                        <th scope="col">Cantidad actual</th>
                        <th scope="col">Depósito asociado</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.map((stock) => (
                        <tr key={stock.id}>
                            <th scope="row">{stock.id}</th>
                            <td>{(stock.nombreMaterial)}</td>
                            <td>{(stock.cantidadActual)} unidad/es</td>
                            <td>{stock.id_deposito <= 0 ? "Sin depósito" : stock.descripcionDeposito}</td>
                            <td >
                                <button onClick={() => setStockEditando(stock)} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                    Editar
                                </button>
                                {stock.activo > 0 &&
                                    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal" onClick={() => setStockEditando(stock)}>
                                        Desactivar
                                    </button>
                                }
                                {stock.activo < 1 &&
                                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal" onClick={() => setStockEditando(stock)}>
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
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar stock &mdash;</h5>
                            <button type="button" id="btnCerrarModalAgregar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <Select options={materialesStock.map((material) => ({
                                        value: material.id,
                                        label: material.nombreMaterial,
                                    }))} value={materialAsociado.id} onChange={selectId_material}
                                        placeholder="Seleccionar material"
                                        isSearchable />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cantidad actual (unidades):</label>
                                    <input title="Debe contener un número mayor o igual a 0" required={true} value={cantidadActual} onChange={txtCantidadActualChange} type="text" placeholder="Cantidad actual (unidades)" className={`form-control ${cantidadActual ? (errorCantidadActual ? 'is-invalid' : 'is-valid') : ''}`} id="txtCantidadActual"></input>
                                </div>
                                <div className="mb-1">
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
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={limpiarInputs} data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-primary'}`} onClick={agregarStock} disabled={agregarModalEditarDeshabilitado || btnCargando}>{btnCargando ? 'Procesando...' : 'Agregar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalEditar">&mdash; Editar stock &mdash;</h5>
                            <button type="button" id="btnCerrarModalEditar" className="btn-close" onClick={limpiarInputs} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <input required={true} disabled value={(stockEditando ? stockEditando.nombreMaterial : "")} type="text" className={`form-control ${stockEditando ? (errorCantidadActual ? 'is-invalid' : 'is-valid') : ''}`}></input>

                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cantidad actual (unidades):</label>
                                    <input title="Debe contener un número mayor o igual a 0" required={true} value={stockEditando ? stockEditando.cantidadActual : ""} onChange={txtEditarCantidadActualChange} type="text" placeholder="Cantidad actual (unidades)" className={`form-control ${stockEditando ? (errorCantidadActual ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarCantidadActual"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Depósito asociado:</label>
                                    <input required={true} disabled value={(stockEditando ? stockEditando.descripcionDeposito : "")} type="text" className={`form-control ${stockEditando ? (errorCantidadActual ? 'is-invalid' : 'is-valid') : ''}`}></input>

                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarInputs}>Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-warning'}`} onClick={editarStock} disabled={btnCargando || agregarModalEditarDeshabilitado}>{btnCargando ? 'Procesando...' : 'Editar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA DESACTIVAR */}
            <div className="modal fade" id="desactivarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalDesactivar">&mdash; ¿Deseas desactivar el material? &mdash;</h5>
                            <button type="button" id="btnCerrarModalDesactivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" disabled={btnCargando} onClick={desactivarActivarStock}>{btnCargando ? 'Procesando...' : 'Desactivar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA ACTIVAR */}
            <div className="modal fade" id="activarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalActivar">&mdash; ¿Deseas activar el material? &mdash;</h5>
                            <button type="button" id="btnCerrarModalActivar" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" disabled={btnCargando} onClick={desactivarActivarStock}>{btnCargando ? 'Procesando...' : 'Activar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Stocks;