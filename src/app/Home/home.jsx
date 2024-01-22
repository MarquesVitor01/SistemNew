import React, { useState, useEffect } from "react";
import { Link, Navigate } from 'react-router-dom';
import Navbar from "../Componentes/Navbar/navbar";
import ListaCliente from "../Componentes/ListaCliente/listacliente";
import '../Home/home.css'
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import SweetAlert from "react-bootstrap-sweetalert";
import clientesPDF from "../Reports/Clientes/clientes";
const ScriptModal = ({ onClose }) => {
    return (
        <div className="script-modal over">
            <div className="script-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <br />
                <p>Olá, Bom dia. O meu nome é _____, faço parte do Grupo Maps. O motivo do meu contato é
                    referente a inclusão e a divulgação dos seus serviços dentro da plataforma de busca do google
                    maps. Eu só vou precisar validar com o senhor algumas informações que vão ficar disponiveis
                    pros seus clientes, tudo bem?
                    O nome fantasia é esse mesmo___?
                    o endereço cadastrado seria____?
                    o numero pro cliente entrar em contato com o senhor é esse mesmo que estamos nos falando
                    ou teria outro? Ele seria whatsapp?
                    Qua seria o horário de funcionamento? De segunda a sexta?
                    o email é___
                    Certo, vou estar falando agora o seu cnpj e a razao social e o senhor me confirma se está
                    correto.
                    Perfeito. O marketing vai entrar em contato com o senhor atraves do whatsapp e por lá é
                    importante o senhor estar encaminhando até 30 fotos e 5 vídeos do seu serviço mensalmente
                    pra estarmos atualizando a sua página. Caso o senhor tenha redes sociais, como facebook ou
                    instagram, o senhor pode estar nos encaminhando o link para incluirmos na sua página. Além
                    disso, também conseguimos criar um cartão interativo digital e uma logotipo para a sua
                    empresa. Teria também uma divulgação, onde o senhor consegue escolher 5 bairros e
                    municipios mais próximos para a divulgação da sua página. O senhor tem alguma dúvida até
                    aqui?
                    Referente a todo esse processo de criação, atualização e divulgação da sua página, gera um
                    investimento no valor de 39,90 mensalmente, válido por 1 ano, com a data de vencimento
                    somente para o dia ____
                    Lembrando que esse investimento é realizado somente após o senhor verificar todas as
                    atualizações, ou seja, primeiro o senhor vera todos os serviços prestados e só depois irá
                    realizar o investimento.
                    Como a empresa do senhor é uma empresa privada, vamos encaminhar no seu whatsapp um
                    termo de autorização onde o senhor vai estar autorizando os nossos serviços.</p>
            </div>
        </div>
    );
};
function Home() {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState('');
    const [texto, setTexto] = useState('');
    const [excluido, setExcluido] = useState('');
    const [confirmacao, setConfirmacao] = useState(false);
    const [confirmacaoId, setConfirmacaoId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantidadeClientes, setQuantidadeClientes] = useState(0);
    const [arquivosSelecionados, setArquivosSelecionados] = useState({})
    const auth = getAuth();
    const user = auth.currentUser;
    const deleteUser = (id) => {
        const db = getFirestore();
        const clienteDocRef = doc(db, 'clientes', id);
        if (user.uid === '3UbiYQZwJShtQl86KXNu0xyWPnx1') {
            deleteDoc(clienteDocRef)
                .then(() => {
                    console.log('Documento excluído com sucesso:', id);
                    setExcluido(id);
                    setConfirmacao(false);
                })
                .catch((erro) => {
                    console.error('Erro ao excluir documento:', erro);
                    setError(erro);
                });
        } else {
            console.error('Usuário não tem permissão para excluir clientes.');
            setError('Você não tem permissão para excluir clientes.');
            alert('Você não tem permissão para excluir clientes.')
            setConfirmacao(false); 
        }
    };
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError(null); 
                <Navigate to='/app/home'></Navigate> 
            }, 3000); 
            return () => clearTimeout(timeout);
        }
    }, [error]);
    const confirmDeleteUser = (id) => {
        setConfirmacaoId(id);
        setConfirmacao(true);
    };
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
        const fetchData = async () => {
            try {
              const db = getFirestore();
              let q;
              if ((user && user.uid === 'tRcBpcXnM7Od7gXDHD5p8MSYrhl2') || (user && user.uid === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2')) {
                q = query(collection(db, 'clientes'));
              } else if (user) {
                q = query(collection(db, 'clientes'), where('userId', '==', user.uid));
              }
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
                    });
                  }
                });
                setClientes(listaCli);
                setQuantidadeClientes(listaCli.length);
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
    }, [busca, excluido, user]);
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
    }, []);
    const [isScriptModalVisible, setScriptModalVisible] = useState(false);
    const handleMostrarScript = () => {
        setScriptModalVisible(true);
    };
    const handleFecharScriptModal = () => {
        setScriptModalVisible(false);
    };
    return (
        <div>
            <Navbar />
            <div className="background7">
                <div className="container-fluid titulo">
                    <h1>Lista de Clientes</h1>
                    <div className="row">
                        <div className="col-4 buttons">
                            <Link to='/app/home/novocliente' className="btn btn-primary btn-cli" type="button">
                                <i className="fa-solid fa-plus"></i> Clientes
                            </Link>
                            <button onClick={(e) => clientesPDF(clientes)} className="btn btn-danger btn-cli" type="button" id="button-addon2">
                                <i className="fa-solid fa-file-pdf"></i> Relatório de vendas
                            </button>
                            <button onClick={handleMostrarScript} className="btn btn-cli" type="button" id="button-addon2">
                                <i className="fa-solid fa-scroll"></i> Script
                            </button>
                            {isScriptModalVisible && (
                                <ScriptModal onClose={handleFecharScriptModal} />
                            )}
                        </div>
                        <div className="col-8 pesquisa">
                            <div className="input-group mb-3 ">
                                <input onChange={(e) => setTexto(e.target.value)} type="text" className="form-control barra" placeholder="Perquisar por nome" aria-describedby="button-addon2" />
                                <button onClick={(e) => setBusca(texto)} className="btn btn-primary" type="button" id="button-addon2">
                                    <i className="fa-solid fa-magnifying-glass"></i> Pesquisar
                                </button>
                            </div>
                        </div>
                    </div>
                    <ListaCliente arrayClientes={clientes} clickDelete={confirmDeleteUser} />
                    {confirmacao ?
                        <SweetAlert
                            warning
                            showCancel
                            showCloseButton
                            confirmBtnText="Sim"
                            confirmBtnBsStyle="danger"
                            cancelBtnText="Não"
                            cancelBtnBsStyle="ligth"
                            title="Exclusão"
                            onConfirm={() => deleteUser(confirmacaoId)}
                            onCancel={() => setConfirmacao(false)}
                            reverseButtons={true}
                        >
                            Deseja excluir o cliente selecionado?
                        </SweetAlert> : null}
                </div>
            </div>
        </div>
    );
}
export default Home;