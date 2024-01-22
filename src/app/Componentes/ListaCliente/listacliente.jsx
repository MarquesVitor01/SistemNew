import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Arquivos from "../../Arquivos/arquivos";
import './listacliente.css';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
function ListaCliente(props) {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [filesInfo, setFilesInfo] = useState({});
  const handleFileSelect = (clientId, event) => {
    console.log('Arquivo selecionado para cliente', clientId, ':', event.target.files);
    const files = event.target.files;
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [clientId]: files,
    }));
  };
  const renderFileIndicator = (clientId) => {
    const fileInfo = filesInfo[clientId];
    if (fileInfo && fileInfo.length > 0) {
      return (
        <span className="text-success">
          Arquivos Armazenados: {fileInfo.length}
        </span>
      );
    } else {
      return <span className="text-muted">Sem Arquivos Armazenados</span>;
    }
  };
  useEffect(() => {
    const storedFilesInfo = localStorage.getItem('filesInfo');
    if (storedFilesInfo) {
      setFilesInfo(JSON.parse(storedFilesInfo));
    }
  }, []);
  const handleArmazenarArquivos = async (clientId) => {
    try {
      const storage = getStorage();
      const files = selectedFiles[clientId];
      if (files && files.length > 0) {
        const storageRef = ref(storage, `arquivos/${clientId}/${files[0].name}`);
        await uploadBytes(storageRef, files[0]);
        const downloadURL = await getDownloadURL(storageRef);
        const newFilesInfo = { ...filesInfo, [clientId]: [{ name: files[0].name, url: downloadURL }] };
        setFilesInfo(newFilesInfo);
        localStorage.setItem('filesInfo', JSON.stringify(newFilesInfo));
        setSelectedFiles({});
      } else {
        console.error('Nenhum arquivo selecionado para upload.');
      }
    } catch (error) {
      console.error('Erro ao armazenar o arquivo:', error);
    }
  };
  const handleClick = (clientId) => {
    handleArmazenarArquivos(clientId); 
  };
  const handleExcluirArquivo = async (clientId, fileName) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `arquivos/${clientId}/${fileName}`);
      await deleteObject(storageRef);
  
      // Update filesInfo state to remove the deleted file
      const updatedFilesInfo = {
        ...filesInfo,
        [clientId]: filesInfo[clientId].filter((file) => file.name !== fileName),
      };
  
      setFilesInfo(updatedFilesInfo);
      localStorage.setItem('filesInfo', JSON.stringify(updatedFilesInfo));
  
      console.log('Arquivo excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error);
    }
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
          <th scope="col">Data de venda</th>
          <th scope="col" className="col-acao"></th>
        </tr>
      </thead>
      <tbody>
        {props.arrayClientes.map((cliente) => {
          return (
            <tr key={cliente.id} className="table-light">
              <th scope="row " className="align-middle"><Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1 align-middle"></Link>{cliente.cpf}</th>
              <td className="align-middle">{cliente.nome}</td>
              <td className="align-middle">{cliente.email}</td>
              <td className="align-middle">{cliente.uf}</td>
              <td className="align-middle">{cliente.fone}</td>
              <td className="align-middle">{cliente.valor}</td>
              <td className="align-middle">{cliente.data}</td>
              <td>
                <Link to={`/app/home/editarcliente/${cliente.id}`}><i className="fa-solid fa-pen-to-square icone-acao"></i></Link>
                <Link to="#" onClick={() => props.clickDelete(cliente.id)}><i className="fa-solid fa-trash icone-acao red"></i></Link>
                <input
                  type="file"
                  onChange={(e) => handleFileSelect(cliente.id, e)}
                  className="form-control-file"
                />
                {renderFileIndicator(cliente.id)}
                <button
                  onClick={() => handleClick(cliente.id)}
                  className="btn btn-success"
                  type="button"
                >
                  <i className="fa-solid fa-upload"></i> Armazenar Arquivos
                </button>
                <Arquivos clientId={cliente.id} filesInfo={filesInfo} handleExcluirArquivo={handleExcluirArquivo}/>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default ListaCliente;