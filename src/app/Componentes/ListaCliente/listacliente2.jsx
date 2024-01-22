import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
function ListaCliente2(props) {
  const [pagoStatus, setPagoStatus] = useState(() => {
    const storedStatus = localStorage.getItem('pagoStatus');
    return storedStatus ? JSON.parse(storedStatus) : {};
  });
  const [paymentDates, setPaymentDates] = useState(() => {
    const storedDates = localStorage.getItem('paymentDates');
    return storedDates ? JSON.parse(storedDates) : {};
  });
  useEffect(() => {
    const fetchPagoStatus = async () => {
      const db = getFirestore();
      for (const cliente of props.arrayClientes) {
        const clienteRef = doc(db, 'clientes', cliente.id);
        const clienteDoc = await getDoc(clienteRef);
        if (clienteDoc.exists()) {
          const data = clienteDoc.data();
          setPagoStatus((prevStatus) => ({
            ...prevStatus,
            [cliente.id]: data.pago || false,
          }));
        }
      }
    };
    fetchPagoStatus();
  }, [props.arrayClientes]);
  const handlePagoChange = async (clienteId, newValue) => {
    const currentDate = new Date().toISOString();
    const newData = newValue ? { pago: true, dataPagamento: currentDate } : { pago: false, dataPagamento: null };
    Swal.fire({
      title: 'Confirmação',
      text: `O valor em aberto ${newValue ? 'está pago' : 'não está pago'}? Clique aqui para ${newValue ? 'marcar' : 'desmarcar'}!`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPagoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: newValue }));
        setPaymentDates((prevDates) => ({ ...prevDates, [clienteId]: currentDate }));
        const db = getFirestore();
        const clienteRef = doc(db, 'clientes', clienteId);
        await updateDoc(clienteRef, newData);
        localStorage.setItem('paymentDates', JSON.stringify({ ...paymentDates, [clienteId]: currentDate }));
        console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
      } else {
        setPagoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: false }));
        setPaymentDates((prevDates) => ({ ...prevDates, [clienteId]: null }));
        localStorage.setItem('paymentDates', JSON.stringify({ ...paymentDates, [clienteId]: null }));
        console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
      }
    });
  };
  return (
    <table className="table table-hover table-bordered">
      <thead>
        <tr className="table-secondary">
          <th scope="col">CNPJ/CPF</th>
          <th scope="col">Nome</th>
          <th scope="col">Email</th>
          <th scope="col">UF</th>
          <th scope="col">Telefone</th>
          <th scope="col">Valor</th>
          <th scope="col">Vencimento</th>
          <th scope="col">Pago</th>
          <th scope="col">Data de Pagamento</th>
        </tr>
      </thead>
      <tbody>
        {props.arrayClientes.map((cliente) => {
          const isPago = pagoStatus[cliente.id] || false;
          const paymentDate = paymentDates[cliente.id] || null;
          if (props.exibirPagos && !isPago) {
            return null;
          }
          return (
            <tr key={cliente.id} className="table-light">
              <th scope="row" >
                <Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1"></Link>
                {cliente.cpf}
              </th>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.uf}</td>
              <td>{cliente.fone}</td>
              <td>{cliente.valor}</td>
              <td>{cliente.venc2}</td>
              <td>
                <input
                  type="checkbox"
                  checked={isPago}
                  onChange={(e) => handlePagoChange(cliente.id, e.target.checked)}
                />
              </td>
              <td>
                {isPago ? (
                  <DatePicker
                    selected={paymentDate ? new Date(paymentDate) : null}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                    }}
                    readOnly
                  />
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default ListaCliente2;