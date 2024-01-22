  import React, { useState, useEffect } from "react";
  import Navbar2 from "../Componentes/Navbar/navbar2";
  import ListaCliente2 from "../Componentes/ListaCliente/listacliente2";
  import '../Pagos/pagos.css';
  import Dashboard from "../Graficos/graficos";
  import { collection, getFirestore, getDocs, query } from 'firebase/firestore';
  import 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import 'chart.js/auto'; 
function Pagos() {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState('');
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const [exibirPagos, setExibirPagos] = useState(false);
    const [totalValor, setTotalValor] = useState(0);
    const [error, setError] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    useEffect(() => {
      const fetchData = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
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
            setClientes(listaCli);
            setLoading(false);
            const totalValor = listaCli.reduce((total, cliente) => total + cliente.valor, 0);
            setTotalValor(totalValor);
            localStorage.setItem('clientes', JSON.stringify(listaCli));
        } catch (error) {
          console.error('Erro ao obter dados:', error);
        }
      };
      fetchData();
    }, [busca]);
    useEffect(() => {
      const storedClientes = localStorage.getItem('clientes');
      if (storedClientes) {
        setClientes(JSON.parse(storedClientes));
        setLoading(false);
      }
    }, []); 
    useEffect(() => {
      setShowDashboard(false);
    }, []);
    const handleExibirPagos = () => {
      setExibirPagos(!exibirPagos);
    };
    const [showDashboard, setShowDashboard] = useState(false);
    const handleShowDashboard = () => {
      setShowDashboard(!showDashboard);
    };
    useEffect(() => {
      const storedClientes = localStorage.getItem('clientes');
      if (storedClientes) {
          setClientes(JSON.parse(storedClientes));
          setLoading(false);
      }
      const fetchData = async () => {
          try {
            const db = getFirestore();
            let q;
              q = query(collection(db, 'clientes'));
            if (q) {
              const querySnapshot = await getDocs(q);
              const listaCli = [];
              querySnapshot.forEach((doc) => {
                if (
                  doc.data().nome.indexOf(busca) >= 0 ||
                  doc.data().email.indexOf(busca) >= 0 ||
                  doc.data().cpf.indexOf(busca) >= 0
                ) {
                  listaCli.push({
                    id: doc.id,
                    cpf: doc.data().cpf,
                    nome: doc.data().nome,
                    email: doc.data().email,
                    uf: doc.data().uf,
                    fone: doc.data().fone,
                    valor: doc.data().valor,
                    data: doc.data().data, 
                    venc2: doc.data().venc2  
                  });
                }
              });
              setClientes(listaCli);
              setLoading(false);
              localStorage.setItem('clientes', JSON.stringify(listaCli));
            }
          } catch (error) {
            console.error('Erro ao obter dados:', error);
            setError(error);
          }
        };
      if (user) {
          fetchData();
      }
  }, [busca]);
    return (
      <div>
        <Navbar2 />
        <div className="background8">
        <div className="container-fluid titulo">
          <h1>Situação Financeira</h1>
          <div className="row">
            <div className="col-4">
              <button onClick={handleExibirPagos} className="btn btn-success btn-cli" type="button" id="button-addon2">
                <i className="fa-solid fa-dollar-sign"></i> {exibirPagos ? 'Ocultar Pagos' : 'Visualizar Pagos'}
              </button>
              <button onClick={handleShowDashboard} className="btn btn-primary btn-cli" type="button" id="button-addon2">
                {showDashboard ? 'Ocultar Dashboard' : 'Exibir Dashboard'}
              </button>
            </div>
            <div className="col-8">
              <div className="input-group mb-3">
                <input onChange={(e) => setTexto(e.target.value)} type="text" className="form-control" placeholder="Perguntar por nome" aria-describedby="button-addon2" />
                <button onClick={() => setBusca(texto)} className="btn btn-primary" type="button" id="button-addon2">
                  <i className="fa-solid fa-magnifying-glass"></i> Pesquisar
                </button>
              </div>
            </div>
          </div>
          <div>
        </div>
        {showDashboard ? (
        <>
          <Dashboard clientes={clientes} exibirPagos={exibirPagos} totalValor={totalValor} />
        </>
      ) : (
        <ListaCliente2 arrayClientes={clientes} exibirPagos={exibirPagos} />
      )}
</div>
    </div>
    </div>
  );
}
  export default Pagos;