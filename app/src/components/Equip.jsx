import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import notFound from "../assets/notFound.jpg";
import { Loading } from "./Loading";

export const Equip = () => {
    const { nombre } = useParams();
    const [equipments, setEquipments] = useState([]);
    // Esto es una bandera, para saber si encontró elementos o no después de la búsqueda
    const [sinElementos, setSinElementos] = useState(false);

    const equipmentCollection = collection(db, "medicalSupplies");

    const getEquipments = async () => {
        const test = query(equipmentCollection, where("nombre", "==", `${nombre}`));
        const data = await getDocs(test);
        setEquipments(data.docs.map(doc => ({...doc.data(),id:doc.id})));
        if(data.docs.length === 0) setSinElementos(true);
    };

    useEffect(() => {
        getEquipments();
    }, []);

    if (equipments.length === 0 && !sinElementos){
        return (
            <>
                <Loading />
            </>
        )
    }
    return sinElementos ? (
        // Si no encontró elementos el lenght va seguir siendo 0, por eso utilizo la bandera 'sinElementos'
        <section className="container-fluid d-flex flex-column align-items-center">
            <p className="fs-2">¡No se ha encontrado el elemento solicitado!</p>
            <img src={notFound} alt="elemento_no_encontrado" className="img-fluid" width="300" />            
            <Link to="/">                        
                <Button variant='secondary'>Volver</Button>
            </Link>
        </section>
    ) : (        
        <div className="container-fluid" id="contenedorTabla">
            <Table bordered hover responsive id="tablaEquipamentos">
                <thead>
                    <tr>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Estado</th>
                    <th>Cantidad</th>
                    <th>Antiguedad</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {equipments.map((equipment) => (
                    <tr key={equipment.id}>
                        <td className="text-center">{equipment.nombre}</td>
                        <td className="text-center">{equipment.marca}</td>
                        <td className="text-center">{equipment.modelo}</td>
                        <td className="text-center">{equipment.estado}</td>
                        <td className="text-center">{equipment.cantidad}</td>
                        <td className="text-center">{`${equipment.antiguedad} año(s)`}</td>
                        <td>
                        <div className="d-flex justify-content-center gap-2">
                            <Link to={`/edit/${equipment.id}`}>
                            <Button variant="warning">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="-1 1 23 23"
                                strokeWidth="2"
                                stroke="#000000"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1="16" y1="5" x2="19" y2="8" />
                                </svg>
                            </Button>
                            </Link>
                            <Button
                            variant="danger"
                            onClick={() => confirmRemove(equipment.id)}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="-1 1 23 23"
                                strokeWidth="2"
                                stroke="#FFFFFF"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                            </Button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center">
                <Link to="/">                        
                    <Button variant='secondary'>Volver</Button>
                </Link>
            </div>
        </div>
    )
}