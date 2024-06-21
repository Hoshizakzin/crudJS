'use strict' 

const openModal = () => document.getElementById('modal').classList.add('active');
const closeModal = () => {
    limparForm();
    document.getElementById('modal').classList.remove('active');
}

document.getElementById('cadastrarCliente').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);

//CRUD create read update delete

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (esseCliente) => localStorage.setItem('db_client', JSON.stringify(esseCliente));
const todoCliente = getLocalStorage();

const criarClient = (esseCliente) => {
    todoCliente.push(esseCliente);
    setLocalStorage(todoCliente);
}

const lerClient = () => getLocalStorage();

const editarClient = (indice, esseCliente) => {
    todoCliente[indice] = esseCliente;
    setLocalStorage(todoCliente);
}

const eliminarClient = (indice) => {
    todoCliente.splice(indice, 1);
    setLocalStorage(todoCliente);
}

//INTERAÇÃO COM O HTML

const limparForm = () => {
    const campo = document.querySelectorAll('.modal-field');
    campo.forEach( c => c.value = '');
}

const cadastrarClient = () => {
    const validarForm = () => {
        return document.getElementById('formulario').reportValidity();
    }

    if (validarForm()) {
        const esseCliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const status = document.getElementById('nome').dataset.status;
        if (status == 'new') {
            criarClient(esseCliente);
            atualizarTabela();
            closeModal();
        } else {
            editarClient(status, esseCliente);
            atualizarTabela();
            closeModal();
        }

    };
}

document.getElementById('salvar').addEventListener('click', cadastrarClient);


const oneCliente = (esseCliente, id) => {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${esseCliente.nome}</td>
        <td>${esseCliente.email}</td>
        <td>${esseCliente.celular}</td>
        <td>${esseCliente.cidade}</td>
        <td>
            <button type="button" class="button green" id="editar-${id}">Editar</button>
            <button type="button" class="button red" id="excluir-${id}">Excluir</button>
        </td>
    `;
    document.querySelector('#tabelaClientes>tbody').appendChild(novaLinha);
}

const limparTabela = () => {
    const linhas = document.querySelectorAll('#tabelaClientes>tbody tr');
    linhas.forEach(linha => linha.parentNode.removeChild(linha));
}

const atualizarTabela = () => {
    limparTabela();
    todoCliente.forEach(oneCliente);
}

const editExistente = (identificador) => {
    const esseExistente = todoCliente[identificador];
    esseExistente.identificador = identificador;
    document.getElementById('nome').value = esseExistente.nome;
    document.getElementById('email').value = esseExistente.email;
    document.getElementById('celular').value = esseExistente.celular;
    document.getElementById('cidade').value = esseExistente.cidade;
    document.getElementById('nome').dataset.status = esseExistente.identificador;
    openModal();
}

const editarOuExcuir = (evento) =>{
    if (evento.target.type == 'button') {

        const [acao, identificador] = evento.target.id.split('-');

        if (acao == 'editar') {
            editExistente(identificador);
        } else {
            const confirmDelete = confirm (`Deseja realmente excluir o cliente ${todoCliente[identificador].nome}`);
            if (confirmDelete) {
                eliminarClient(identificador);
                atualizarTabela();
            }
        };

    }
}

document.querySelector('#tabelaClientes>tbody').addEventListener('click', editarOuExcuir);

atualizarTabela();