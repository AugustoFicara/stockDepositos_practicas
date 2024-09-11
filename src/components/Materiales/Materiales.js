import { useEffect, useState } from "react";
import ExportExcel from "../../excelexport";
import { Material } from "../../types/Material";
import { MaterialService } from "../../services/MaterialService";
import XLSX from 'sheetjs-style';
import { Toaster, toast } from "sonner";

function Materiales() {

    //VARIABLES
    const [materiales, setMateriales] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(new Material());
    const [mostrarMateriales, setMostrarMateriales] = useState(true);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [nombreMaterial, setNombreMaterial] = useState('');
    const [errorNombreMaterial, setErrorNombreMaterial] = useState(false);
    const [validoNombreMaterial, setValidoNombreMaterial] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [errorDescripcion, setErrorDescripcion] = useState(false);
    const [materialEditando, setMaterialEditando] = useState(null);
    const agregarModalEditarDeshabilitado = errorNombreMaterial || errorDescripcion;
    const [btnCargando, setBtnCargando] = useState(false);
    const [filtroNombreMaterial, setFiltroNombreMaterial] = useState('');
    const [materialAEditar, setMaterialAEditar] = useState('');
    const [clickMaterialAEditar, setClickMaterialAEditar] = useState(false);

    //FUNCIONES
    useEffect(() => {
        fetchMateriales();
    }, []);

    useEffect(() => {
        filtrarMateriales();
    }, [filtroNombreMaterial, materiales]);

    const fetchMateriales = async () => {
        try {
            const data = await MaterialService.getMateriales();
            setMateriales(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error al obtener materiales: ", error);
        }
    };

    const filtrarMateriales = () => {
        let datosFiltrados = materiales;

        if (filtroNombreMaterial) {
            datosFiltrados = datosFiltrados.filter(material =>
                material.nombreMaterial.toLowerCase().includes(filtroNombreMaterial.toLowerCase())
            );
        }

        setDatosFiltrados(datosFiltrados);
    }

    async function agregarMaterial() {
        setBtnCargando(true);

        const material = new Material();

        if (!nombreMaterial || nombreMaterial === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre del material' para continuar!");
            return;
        }
        material.nombreMaterial = capitalizarPalabras(nombreMaterial);

        if (!descripcion || descripcion === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Descripción' para continuar!");
            return;
        }
        material.descripcion = capitalizarPalabras(descripcion);
        material.activo = 1;

        toast.promise(MaterialService.createMaterial(material), {
            success: () => {
                fetchMateriales();
                return ("¡Material agregado correctamente!");
            },
            error: () => {
                return ("¡Error al agregar el material!")
            },
            finally: () => {
                fetchMateriales();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalAgregar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const editarMaterial = async () => {
        setBtnCargando(true);

        let material = new Material();
        material.id = materialEditando.id;

        if (!materialEditando.nombreMaterial || materialEditando.nombreMaterial === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Nombre del material' para continuar!");
            return;
        }
        material.nombreMaterial = capitalizarPalabras(materialEditando.nombreMaterial);

        if (!materialEditando.descripcion || materialEditando.descripcion === '') {
            setTimeout(() => {
                setBtnCargando(false);
            }, 100);
            toast.error("¡Debe completar el campo 'Descripción' para continuar!");
            return;
        }
        material.descripcion = capitalizarPalabras(materialEditando.descripcion);
        material.activo = 1;

        toast.promise(MaterialService.updateMaterial(material), {
            success: () => {
                fetchMateriales();
                return ("Material editado correctamente!")
            },
            error: () => {
                return ("¡Error al editar el material!")
            },
            finally: () => {
                fetchMateriales();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalEditar').click();
                    limpiarInputs();
                }, 500)
            }
        });
    }

    const desactivarActivarMaterial = async () => {
        setBtnCargando(true);

        let material = new Material();
        material.id = materialEditando.id;
        material.activo = materialEditando.activo;

        toast.promise(MaterialService.deleteMaterial(material), {
            success: () => {
                fetchMateriales();

                if (material.activo === "1") {
                    return ("¡Material desactivado correctamente!")
                } else if (material.activo === "0") {
                    return ("¡Material activado correctamente!")
                }
            },
            error: () => {
                if (material.activo === "1") {
                    return ("¡Error al desactivar el material!")
                } else if (material.activo === "0") {
                    return ("¡Error al activar el material!")
                }
            },
            finally: () => {
                fetchMateriales();
                setTimeout(() => {
                    setBtnCargando(false);
                    document.getElementById('btnCerrarModalDesactivar').click();
                    document.getElementById('btnCerrarModalActivar').click();
                }, 500)
            }
        });

    }

    const txtNombreMaterialChange = (e) => {
        const value = e.target.value;
        setNombreMaterial(value);
        setErrorNombreMaterial(value.length <= 3 && value.length > 0);
    }

    const txtEditarNombreMaterialChange = (e) => {
        const value = e.target.value;
        setMaterialEditando(prev => ({
            ...prev,
            nombreMaterial: value
        }));
        setErrorNombreMaterial(value.length <= 3);
    }

    const buscarNombreMaterial = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const nombreMaterialExistente = await MaterialService.buscarNombreMaterial(nombreMaterial);

            if (nombreMaterialExistente.length > 0) {
                toast.error("¡Error! Material ya existente");
                setErrorNombreMaterial(nombreMaterialExistente.length > 0);

                /*const material = nombreMaterialExistente[0];
                setMaterialEditando(material);

                document.getElementById('btnAbrirConsultarModal').click();
                document.getElementById('btnCerrarAgregarModalCUITExistente').click();*/
            } else if (nombreMaterialExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoNombreMaterial(nombreMaterialExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el material!");
            }
        }
    }

    const buscarNombreMaterialEditar = async (e) => {
        if (!e.target.classList.contains('is-invalid') && e.target.value.trim() !== '') {
            const nombreMaterialExistente = await MaterialService.buscarNombreMaterial(materialEditando.nombreMaterial);

            if (nombreMaterialExistente.length > 0) {
                if (materialEditando.nombreMaterial.toLowerCase() === materialAEditar) {
                    toast.success("¡Perfecto! Es el material que busca editar. Puede continuar");
                    setValidoNombreMaterial(materialEditando.nombreMaterial.toLowerCase() === materialAEditar);
                    return;
                }

                toast.error("¡Error! Material ya existente");
                setErrorNombreMaterial(nombreMaterialExistente.length > 0);

                /*const material = nombreMaterialExistente[0];
                setMaterialEditando(material);

                document.getElementById('btnAbrirConsultarModal').click();
                document.getElementById('btnCerrarAgregarModalCUITExistente').click();*/
            } else if (nombreMaterialExistente.length === 0) {
                toast.success("¡Perfecto! Puede continuar");
                setValidoNombreMaterial(nombreMaterialExistente.length === 0);
            } else {
                toast.error("¡Error al buscar el material!");
            }
        }
    }

    const clickearMaterialAEditar = (e) => {
        if (!clickMaterialAEditar) {
            setMaterialAEditar(e.target.value.toLowerCase());
            setClickMaterialAEditar(true);
        }
    }

    const txtDescripcionChange = (e) => {
        const value = e.target.value;
        setDescripcion(value);
        setErrorDescripcion(value.length <= 5 && value.length > 0);
    }

    const txtEditarDescripcionChange = (e) => {
        const value = e.target.value;
        setMaterialEditando(prev => ({
            ...prev,
            descripcion: value
        }));
        setErrorDescripcion(value.length <= 5);
    }

    const limpiarInputs = () => {
        setNombreMaterial('');
        setDescripcion('');
        setErrorNombreMaterial(false);
        setErrorDescripcion(false);
        setValidoNombreMaterial(false);
        setClickMaterialAEditar(false);
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
            if (materiales.length > 0) {
                //FILTRAR DATOS QUE QUEREMOS Y CREAMOS HOJA
                const datosExcel = materiales.map(({ id, nombreMaterial, descripcion }) => ({ id, nombreMaterial, descripcion }));
                const worksheet = XLSX.utils.json_to_sheet(datosExcel);

                //CABECERAS
                XLSX.utils.sheet_add_aoa(worksheet, [["ID", "Nombre del material", "Descripción"]], { origin: "A1" });

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
                XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de materiales");

                XLSX.writeFile(workbook, "Listado de materiales.xlsx");

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
            <h1 className="text-center text-bg-dark p-2">&mdash; Materiales &mdash;</h1>
            <div className="d-flex justify-content-between">
                <div className="input-group mb-1 ms-4 mt-2 d-flex w-25 justify-content-between">
                    <input title="Buscar por nombre" value={filtroNombreMaterial} onChange={(e) => setFiltroNombreMaterial(e.target.value)} type="text" className="form-control" placeholder="Buscar por nombre..." aria-label="Filtrar por nombre..."></input>
                    <button disabled className="btn btn-outline-secondary" type="button" id="button-addon2"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-search mb-1" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg></button>
                </div>
                <div>
                    <button data-bs-toggle="modal" data-bs-target="#agregarModal" type="button" className="btn btn-primary me-2 mt-2">+ Agregar material</button>
                    <button onClick={exportToExcel} type="button" className="btn btn-success me-4 mt-2">Generar excel</button>
                </div>
            </div>

            <hr className="mx-4"></hr>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre del material</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.map((material) => (
                        <tr key={material.id}>
                            <th scope="row">{material.id}</th>
                            <td>{material.nombreMaterial}</td>
                            <td>{(material.descripcion)}</td>
                            <td >
                                <button onClick={() => setMaterialEditando(material)} type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editarModal">
                                    Editar
                                </button>
                                {material.activo > 0 &&
                                    <button onClick={() => setMaterialEditando(material)} type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#desactivarModal">
                                        Desactivar
                                    </button>
                                }
                                {material.activo < 1 &&
                                    <button onClick={() => setMaterialEditando(material)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#activarModal" >
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
                            <h5 className="modal-title" id="titleModalAgregar">&mdash; Agregar material &mdash;</h5>
                            <button type="button" id="btnCerrarModalAgregar" onClick={limpiarInputs} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <input onBlur={buscarNombreMaterial} title="Debe contener más de 3 caracteres" required={true} value={nombreMaterial} onChange={txtNombreMaterialChange} type="text" placeholder="Nombre del material" className={`form-control ${errorNombreMaterial ? 'is-invalid' : validoNombreMaterial ? 'is-valid' : ''}`} id="txtNombreMaterial"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Descripción:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={descripcion} onChange={txtDescripcionChange} type="text" placeholder="Descripción" className={`form-control ${descripcion ? (errorDescripcion ? 'is-invalid' : 'is-valid') : ''}`} id="txtDescripcion"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={limpiarInputs} data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-primary'}`} onClick={agregarMaterial} disabled={agregarModalEditarDeshabilitado || btnCargando}>{btnCargando ? 'Procesando...' : 'Agregar'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titleModalEditar">&mdash; Editar material &mdash;</h5>
                            <button type="button" id="btnCerrarModalEditar" className="btn-close" onClick={limpiarInputs} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del material:</label>
                                    <input onBlur={buscarNombreMaterialEditar} onClick={clickearMaterialAEditar} title="Debe contener más de 3 caracteres" required={true} value={materialEditando ? materialEditando.nombreMaterial : ""} onChange={txtEditarNombreMaterialChange} type="text" placeholder="Nombre del material" className={`form-control ${materialEditando ? (errorNombreMaterial ? 'is-invalid' : validoNombreMaterial ? 'is-valid' : '') : ''}`} id="txtEditarNombreMaterial"></input>
                                </div>
                                <div className="mb-1">
                                    <label className="form-label">Descripción:</label>
                                    <input title="Debe contener más de 5 caracteres" required={true} value={materialEditando ? materialEditando.descripcion : ""} onChange={txtEditarDescripcionChange} type="text" placeholder="Descripción" className={`form-control ${materialEditando ? (errorDescripcion ? 'is-invalid' : 'is-valid') : ''}`} id="txtEditarDescripcion"></input>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarInputs}>Cancelar</button>
                            <button type="button" className={`btn ${agregarModalEditarDeshabilitado ? 'btn-secondary' : 'btn-warning'}`} onClick={editarMaterial} disabled={btnCargando || agregarModalEditarDeshabilitado}>{btnCargando ? 'Procesando...' : 'Editar'}</button>
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
                            <button type="button" className="btn btn-danger" disabled={btnCargando} onClick={desactivarActivarMaterial}>{btnCargando ? 'Procesando...' : 'Desactivar'}</button>
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
                            <button type="button" className="btn btn-success" disabled={btnCargando} onClick={desactivarActivarMaterial}>{btnCargando ? 'Procesando...' : 'Activar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Materiales;