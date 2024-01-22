import React from "react";
function Precos() {
    return <section id="precos">
        <div className="container">
            <div className="row test-center center ">
                <div className="titulo">
                    <h1>Planos e Preços</h1>
                    <p>Comece sua avaliação.</p>
                </div>
            </div>
            <div className="row test-center">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header bg-danger"><h1>Bronze</h1></div>
                        <div className="card-body">
                            <h2>R$ 249,90</h2>
                            <p>Plano Trimestral</p>
                            <p>Suporte valido por 3 meses.</p>
                            <a href="https://grupomapsempresas.com.br/" className="btn btn-lg btn-outline-primary">Saiba mais <i className="fa-solid fa-plus"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header bg-secondary"><h1>Prata</h1></div>
                        <div className="card-body">
                            <h2>R$ 349,90</h2>
                            <p>Plano Semestral</p>
                            <p>Suporte valido por 6 meses.</p>
                            <a href="https://grupomapsempresas.com.br/" className="btn btn-lg btn-outline-primary">Saiba mais <i className="fa-solid fa-plus"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col lg-4">
                    <div className="card">
                        <div className="card-header bg-warning"><h1>Ouro</h1></div>
                        <div className="card-body">
                            <h2>R$ 549,90</h2>
                            <p>Plano Anual</p>
                            <p>Suporte valido por 1 ano.</p>
                            <a href="https://grupomapsempresas.com.br/" className="btn btn-lg btn-outline-primary">Saiba mais <i className="fa-solid fa-plus"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
}
export default Precos;