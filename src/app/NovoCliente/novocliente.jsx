import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import '../NovoCliente/novocliente.css'
import { getAuth } from 'firebase/auth';
import { useReactToPrint } from "react-to-print";
import { isEmpty } from 'lodash';
function NovoCliente() {
    const [clientes, setClientes] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formState, setFormState] = useState({
        nome: '',
        email: '',
        fone: '',
        numeroContrato: '',
        razao: '',
        cpf: '',
        fantasia: '',
        endereco: '',
        bairro: '',
        uf: '',
        cidade: '',
        cep: '',
        whats: '',
        obs: '',
        funcionamento: '',
        valor: '',
        plano: '',
        renovNao: '',
        renovSim: '',
        validade: '',
        data: '',
        cargo: '',
        venc2: '',
        representante: '',
        operador: '',
        site: '',
        link: '',
        sociais: ''
    });
    const handleInputChange = (field, value) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
    };
    const [plano, setPlano] = useState('');
    const [data, setData] = useState('');
    const [numeroContrato, setNumeroContrato] = useState('');
    const [bairro, setBairro] = useState('');
    const [obs, setObs] = useState('');
    const [funcionamento, setFuncionamento] = useState('');
    const [venc2, setVenc2] = useState('');
    const [valor, setValor] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [uf, setUf] = useState('');
    const [site, setSite] = useState('');
    const [whats, setWhats] = useState('');
    const [endereco, setEndereco] = useState('');
    const [razao, setRazao] = useState('');
    const [cpf, setCpf] = useState('');
    const [link, setLink] = useState('');
    const [nome, setNome] = useState('');
    const [sociais, setSociais] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [email, setEmail] = useState('');
    const [fone, setFone] = useState('');
    const [representante, setRepresentante] = useState('');
    const [renovSim, setRenovSim] = useState(false);
    const [renovNao, setRenovNao] = useState(false);
    const [validade, setValidade] = useState('');
    const [operador, setOperador] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [cargo, setCargo] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            navigate('/app/home/novocliente');
            return;
        }
        const db = getFirestore();
        const q = query(collection(db, 'clientes'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const clientesData = [];
            snapshot.forEach((doc) => {
                clientesData.push({ id: doc.id, ...doc.data() });
            });
            setClientes(clientesData);
        });
        return () => {
            unsubscribe();
        };
    }, [navigate]);
    const db = getFirestore();
    const clienteJaExiste = async (cpf) => {
        const querySnapshot = await getDocs(query(collection(db, 'clientes'), where('cpf', '==', cpf)));
        return !isEmpty(querySnapshot.docs);
    };
    async function cadastrarCliente() {
        try {
            if (nome.length === 0) {
                setMensagem('Informe o seu nome');
                return;
            } else if (email.length === 0) {
                setMensagem('Informe o email');
                return;
            }
            const clienteData = {
                nome,
                email,
                fone,
                numeroContrato,
                razao,
                cpf,
                fantasia,
                endereco,
                bairro,
                uf,
                cidade,
                cep,
                whats,
                obs,
                funcionamento,
                valor,
                plano,
                renovNao,
                renovSim,
                validade,
                data,
                representante,
                venc2,
                cargo,
                operador,
                site,
                link,
                sociais
            };
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            clienteData.userId = userId;
            const clienteExistente = await clienteJaExiste(cpf);
            if (clienteExistente) {
                setMensagem('Cliente já cadastrado.');
                return;
            }
            const novoClienteRef = await addDoc(collection(db, 'clientes'), clienteData);
            setFormState({
                nome: '',
                email: '',
                fone: '',
                numeroContrato: '',
                razao: '',
                cpf: '',
                fantasia: '',
                endereco: '',
                bairro: '',
                uf: '',
                cidade: '',
                cep: '',
                whats: '',
                obs: '',
                funcionamento: '',
                valor: '',
                plano: '',
                renovNao: '',
                renovSim: '',
                validade: '',
                data: '',
                representante: '',
                venc2: '',
                cargo: '',
                operador: '',
                site: '',
                link: '',
                sociais: ''
            });
            setMensagem('');
            setSucesso('S');
            console.log('Novo cliente criado com ID:', novoClienteRef.id);
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            setMensagem('Ocorreu um erro ao cadastrar o cliente. Por favor, tente novamente.');
            setSucesso('N');
        }
    }
    const contentDocument = useRef();
    const handlePrint = useReactToPrint({
        content: () => contentDocument.current,
    });
    return <div>
        <div className="background">
            <div ref={contentDocument} className="contrato container-fluid titulo-2" id="formId">
                <div className="logo-street">
                    <img src="../../../img/logo-street.jpg" alt="" />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Ficha/ Nº do contrato:</th>
                            <th>Vigência</th>
                            <th>Veiculo de divulgação</th>
                            <th>Operador</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input onChange={(e) => setNumeroContrato(e.target.value)} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td>2024/ 2025 /2026</td>
                            <td>Site de buscas</td>
                            <td>
                                <input onChange={(e) => setOperador(e.target.value)} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td>
                                <input onChange={(e) => setData(e.target.value)} id="date" type="date" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="caixa">
                    <div className="linha1">
                        <h3>
                            AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                        </h3>
                    </div>
                    <br /><br />
                    <div className="escrever">
                        <hr className="font-weight-bold" />
                    </div>
                    <div className="assinante">
                        <h3>
                            ASSINATURA DO AUTORIZANTE
                        </h3>
                    </div>
                    <div className="linha2">
                        <h3>
                            AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                        </h3>
                    </div>
                </div>
                <form className="caixa2">
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Razão Social:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setRazao(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Nome Fantasia:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFantasia(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">CNPJ/CPF:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCpf(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Endereço:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setEndereco(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Cidade:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCidade(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Estado:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setUf(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">CEP:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCep(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Telefone:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFone(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">WhatsApp:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setWhats(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Horario de funcionamento:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFuncionamento(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">E-mail:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Site:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setSite(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row atualizacao">
                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <label className="custom-control-label" htmlFor="atualizacao">Atualização</label>
                            <input type="checkbox" className="custom-control-input" id="atualizacao" />
                        </div>
                        <p className=" mb-3 font-weight-bold"> - </p>
                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <label className="custom-control-label" htmlFor="atualizacao">Criação</label>
                            <input type="checkbox" className="custom-control-input" id="atualizacao" />
                        </div>

                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <label className="custom-control-label" htmlFor="atualizacao">Anuncio</label>
                            <input type="checkbox" className="custom-control-input" id="atualizacao" />
                        </div>
                        <p className=" mb-3 font-weight-bold">-</p>
                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <label className="custom-control-label" htmlFor="atualizacao">Cartão Digital</label>
                            <input type="checkbox" className="custom-control-input" id="atualizacao" />
                        </div>
                        <p className=" mb-3 font-weight-bold">-</p>
                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <label className="custom-control-label" htmlFor="atualizacao">Logotipo</label>
                            <input type="checkbox" className="custom-control-input" id="atualizacao" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Link da Página:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setLink(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Autorizante:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setNome(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Redes Sociais:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setSociais(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Obsvervações:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setObs(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                </form>
                <div className="condicoes">
                    <h3>
                        <b>Condições</b>;(12) Doze, parcelas por vigência no valor de 399,90(Trezentos e noventa e nove reais e noventa centavos) mensal, parcelado no boleto bancário.
                    </h3>
                </div>
                <div className="regras">
                    <h2>
                        AS PARTES A CIMA NOMEADAS ASSINARAM, QUE SE REGERÁ PELAS CLAUSULAS E CONDIÇÕES
                    </h2>
                </div>
                <div className="texto">
                    <p>
                        1)Declaro ter recebido todas as informações referente a prestação de serviço da empresa estando em total e plena concordância com a adesão dos sShape7 Shape6erviços supracitados; Atualização e divulgação dos dados que constam na plataforma digital do Google Maps, O contratante poderá encaminhar para a contratado mensalmente 20 fotos e 5 vídeos para atualização de sua página, horário de funcionamento, inclusão de site/ páginas de redes sociais / telefones para contato / ajuda para criação de anúncios/ Criação de Cartão Digital Interativo com links Direcionadores. fica acordado que a contratante deve entrar em contato com a contratada para solicitar o devido suporte quando necessário, e por estar devidamente autorizado a responder pela empresa ativa e passivamente assumo as obrigações deste contrato conforme clausulas; 2)como proponente estou de acordo que a empresa. Goo 360 Marketing Digital CNPJ: 28.062.365/0001-60, realize a administração de minha página dentro do site de busca da Google, realizando mudanças e alterações quando solicitado por parte da contratante, a empresa supracitada nas condições gerais estabelecidas pela lei 10.406/02 e lei 8.078/90 e condições particulares definidas em caráter irrevogável e irretratável. A validação deste contrato dar-se de acordo assinatura para o vínculo contratual conforme Código Civil. 107. 3) Este termo/contrato tem sua validade de validade de 3 anos. O vencimento da 1º parcela será no 8º dia após a assinatura do contrato. O prazo para cancelamento desta prestação de serviço sem ônus, são de 7 sete dias corridos conforme Art.49 do CDC, a solicitação de cancelamento deverá ser feita por escrito através do e-mail: sac@goo360marketing.com.br , formalizando o pedido. Após este prazo dá-se 23 dias corridos para o cancelamento com multa de 40% (quarenta porcento) sobre o valor total do contrato. 4) A inadimplência de qualquer das parcelas, implicara no vencimento antecipado no saldo devedor e o envio aos órgãos de proteção ao crédito (spc e protesto em Cartório), acrescido de juros de mora de 2% e taxas de juros de 12% ao ano. 5) O presente contrato considera se sucessivamente renovado para o(S) mesmo(s) serviço(s) com antecedência de 60 dias de antecedência do termino do prazo em curso , se não houver a manifestação expressa em contrário(s) entre contratante (s) e contratada mantendo-se as mesmas prestações devidamente autorizada vencíveis a mesma época. 6) Se somente quitada a primeira edição, está não dará nulidade ao contrato, a saber, a cobrança da(s) outras edições fica(m) a tempo e a critério da contratada. 7) A data inicial da vigência prevista poderá ser alterada conforme necessidade da contratada sem que isso caracterize prejuízo ao proponente/contratante. 8) No período de 24(horas) após a contratação, estará inserida no site www.google.com.br/maps.com.br o cadastro do proponente com todas as suas inclusões e atualizações no cadastro do proponente, importante ressaltar que está empresa não possui vínculos com a Google Brasil e sim presta serviços técnicos para empresas prestando o seguinte suporte; Atualização de dados na plataforma digital do Google Maps, Criação de Qr-Code Direcionador, Recuperação de Domínio, Criação de Cartão Digital Interativo com links Direcionadores. O contratante poderá encaminhar para a contratado mensalmente 20 fotos e 5 videos para atualização de sua página, através do Whatsaap número ( 11) 5990-2412 ou através do e-mail Marketing@goo360marketing.com.br. 9) Na hipótese de atraso no pagamento deste contrato, poderá a contratada a qualquer tempo ao seu exclusivo critério promover ação judicial cabível em face do proponente / contratante para cumprimento da obrigação adquirida. 10) A contratada não respondera por prejuízo resultantes de erros totais ou parciais que venham a ocorrer nos dados ou figurações fornecidas pelo proponente /contratante cujas características e conteúdo são de exclusiva responsabilidade. Caberá a contratada o direito de propor ação regressiva contra o proponente /contratante caso esta seja condenada a reparar danos causados a terceiros por eleito da publicidade ora autorizada. 11)O signatário desta contratação de publicidade declara estar autorizado pelos dados informados neste instrumento e responderá solidariamente pelas obrigações nele contida. 12 - Nossos boletos são registrados junto ao banco central após a assinatura do contrato o boleto é emitido e enviado a empresa contratante através do e-mail cadastrado.13 –Após o vencimento do boleto caso o pagamento não seja realizado empresa da o prazo de 7 dias corridos para que o mesmo venha ser realizado afins de evitar a negativação.14 - No 8º dia em atraso o não pagamento gera automaticamente o envio dos documentos (CPF/CNPJ) do responsavel Titular do CNPJ aos orgão de proteção ao crédito.15 – Caso o pagamento venha ser realizado em uma dessas instituições fica de responsabilidade da Contratante arcar com as taxas e despesas cartórarias e se gerado cobrança judicialmente o contratante se responsabiliza em arcar com os honorarios Advocatícios. 16) As partes elegem o foro da capital do estado de São Paulo para dirimir eventuais questões deste contrato, renunciando a qualquer outro por mais privilegiado que seja. Declaro ter recebido por e-mail e WhatsApp cópia deste documento após ter lido as informações a mim passadas e por estar devidamente habilitado a responder pela empresa ativa e passivamente, assumo as obrigações deste documento.
                    </p>
                </div>
                <div className="escrever2">
                    <br /><br />
                    <hr className="font-weight-bold" />
                    <h3>
                        Declaro ter lido os termos de uso e concordo com suas clausulas e condições.
                    </h3>
                </div>
                <div className="linha3">
                    <h3>
                        AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                    </h3>
                </div>
                <div className="texto">
                    <p>
                        1. Do direito à privacidade
                        A Lei 13709/2018 - Lei Geral de Proteção de Dados (LGPD) estabelece como fundamento o respeito à privacidade. Desse modo, o presente Termo de Privacidade tem o propósito de comunicar de forma simples quais tipos de dados pessoais serão coletados, quando, de que forma e para quais finalidades serão utilizados. A privacidade é um direito conferido a todo indivíduo, está protegida pela lei brasileira e consiste na habilidade que este tem de controlar a exposição de informações sobre sua vida pessoal, sua intimidade, bem como a disponibilidade de dados sobre si mesmo, de retificar, ratificar ou apagar estes e de proteger a confidencialidade de suas comunicações, seu domicílio, sua imagem, honra e reputação perante terceiros.2. Atualização e veracidade dos dados; O titular e/ou seus responsáveis legais são os responsáveis pela atualização, exatidão e veracidade dos dados que informarem à empresa Goo 360 Marketing Digital. Caso sejam identificados erros de informações cadastradas, o Goo 360 Marketing Digital i solicitará ao Titular correções; O Goo 360 Marketing Digital não se responsabiliza por dados desatualizados em suas bases de dados. 3. Do prazo e forma de armazenamento. Os dados do usuário serão obtidos por meio da efetivação de seu vínculo com a Instituição, quando o usuário insere as informações voluntariamente, por meio de ferramentas de coleta de dados de acesso e navegação existentes em alguns sites e/ou aplicativos. Os dados coletados são armazenados em ambiente seguro e em servidor próprio ou de terceiro contratado para este fim. 4. Da Segurança e Proteção dos Dados Pessoais; As informações são protegidas com padrões de segurança e confidencialidade, para fornecer aos usuários um ambiente seguro e confiável através do uso de criptografia, certificações digitais e acessos controlados. Adicionalmente, o próprio titular deve exercer alguns cuidados para auxiliar na proteção de seus dados. a) Cuidados com Golpes: Os criminosos cibernéticos se aproveitam dos assuntos do momento para enviar mensagens fraudulentas com intuito de roubar dados ou instalar vírus e outros softwares maliciosos por meio de links em mensagens falsas. b) Compartilhamento de senhas: Sua senha é pessoal e intransferível e que deve ser mantida sob sigilo e em ambiente seguro. Não compartilhe a sua senha, ceder ou utilizar a senha de outra pessoa é tipificado como crime no art. 308, do Código Penal.
                    </p>
                </div>
                <div className="escrever2">
                    <br /><br />
                    <hr className="font-weight-bold" />
                    <h3>
                        Autorizo a divulgação dos meus dados comerciais.
                    </h3>
                </div>
                <br /><br />
                <div className="inf">
                    <h3>
                        GOO 360º MARKETING DIGITAL
                        <br />
                        SAC@GOO360MARKETING.COM.BR
                        <br />
                        Central de Atendimento: (11) 5242-4990
                        <br />
                        Central de Marketing (11) 5990-2412
                    </h3>
                </div>
                {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
                {sucesso === 'S' ? <Navigate to='/app/home' /> : null}
            </div>
        </div>
        <div className="row salvar">
            <Link to="/app/home" className="btn btn-warning btn-acao">Cancelar</Link>
            <button onClick={cadastrarCliente} type="button" className="btn btn-primary btn-acao">Salvar</button>
            <button className="btn btn-danger btn-cli" onClick={handlePrint} disabled={loader}>
                {loader ? <span>Baixando</span> : <span>Baixar PDF</span>}<i className="fa-solid fa-file-pdf"></i>
            </button>
        </div>
    </div >
}
export default NovoCliente;