import React, { useState, useEffect } from "react";
import Navbar2 from "../Componentes/Navbar/navbar2";
import ListaCliente3 from "../Componentes/ListaCliente/listacliente3";
import '../Cobranca/cobranca.css';
import { collection, getFirestore, getDocs, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
function Cobranca() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [exibirPagos, setExibirPagos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const clientesRef = collection(db, 'clientes');
        const q = query(clientesRef);
        const snapshot = await getDocs(q);
        const listaCli = snapshot.docs.map(doc => ({
          id: doc.id,
          cpf: doc.data().cpf,
          nome: doc.data().nome,
          email: doc.data().email,
          uf: doc.data().uf,
          fone: doc.data().fone,
          valor: doc.data().valor,
          venc2: doc.data().venc2,
          pago: doc.data().pago || false,
        }));
        const filteredClientes = listaCli.filter(cliente => !cliente.pago);
        setClientes(filteredClientes);
        setLoading(false);
        localStorage.setItem('clientes', JSON.stringify(filteredClientes));
      } catch (error) {
        console.error('Erro ao obter dados:', error);
        setError(error);
      }
    };
    fetchData();
  }, []);
  const handleExibirPagos = () => {
    setExibirPagos(!exibirPagos);
  };
  const handleSearch = () => {
    setBusca(texto);
  };
  return (
    <div>
      <Navbar2 />
      <div className="background8">
      <div className="container-fluid titulo">
        <h1>Cobrança</h1>
        <div className="row">
          <div className="col-8">
            <div className="input-group mb-3">
              <input onChange={(e) => setTexto(e.target.value)} type="text" className="form-control" placeholder="Perguntar por nome" aria-describedby="button-addon2" />
              <button onClick={handleSearch} className="btn btn-primary" type="button" id="button-addon2">
                <i className="fa-solid fa-magnifying-glass"></i> Pesquisar
              </button>
            </div>
          </div>
        </div>
        <ListaCliente3 arrayClientes={clientes} exibirPagos={exibirPagos} />
      </div>
    </div>
    </div>
  );
}
export default Cobranca;