import React from "react";

function ListaArquivosCliente({ clientId, filesInfo, handleExcluirArquivo }) {
  const renderFiles = () => {
    if (filesInfo && filesInfo[clientId] && filesInfo[clientId].length > 0) {
      return (
        <div>
          <p>Arquivos Armazenados:</p>
          <ul>
            {filesInfo[clientId].map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
                <button onClick={() => handleExcluirArquivo(clientId, file.name)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <p>Adicione o contrato assinado.</p>;
    }
  };

  return <div>{renderFiles()}</div>;
}

export default ListaArquivosCliente;