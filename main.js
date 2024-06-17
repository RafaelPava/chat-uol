let nomeUsuario;
login();

function login() {
    nomeUsuario = prompt('Qual seu nome?\n');
    axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', { name: nomeUsuario }).then(() => {
        resgatarMensagens();
        enviarMensagemStatus();
    }).catch((error) => {
        alert('Nome já está em uso!');
        login();
    })
}

function enviarMensagem() {
    const mensagem = document.querySelector('.caixa-resposta__items__mensagem').value;
    axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', { from: nomeUsuario, to: 'Todos', text: mensagem, type: 'message' }).then().catch((error) => {
        console.log(error);
    });
    resgatarMensagens();
    mensagem.textContent = '';
}

function enviarMensagemStatus() {
    const mensagemStatus = document.querySelector('.chat__mensagens');
    axios.get('https://mock-api.driven.com.br/api/v4/uol/participants').then((usuario) => {
        mensagemStatus.innerHTML += `<p class="chat__mensagens__status mensagem"><span class="hora">(09:25:38)</span> <strong>${usuario.data.name}</strong> entra na sala...</p>`;
    });
}

function resgatarMensagens() {
    axios.get('https://mock-api.driven.com.br/api/v4/uol/messages').then((mensagens) => {
        let historicoMensagens = document.querySelector('.chat__mensagens');
        historicoMensagens.innerHTML = '';
        for (let i = 0; i < mensagens.data.length; i++) {
            if (mensagens.data[i].type === 'status') {
                historicoMensagens.innerHTML += `<p class="chat__mensagens__status mensagem"><span class="hora">(${mensagens.data[i].time})</span> <strong>${mensagens.data[i].from}</strong> ${mensagens.data[i].text}</p>`
            } else if (mensagens.data[i].type === 'private_message') {
                if (mensagens.data[i].from === nomeUsuario || mensagens.data[i].to === nomeUsuario) {
                    historicoMensagens.innerHTML += `<p class="chat__mensagens__reservado mensagem"><span class="hora">(${mensagens.data[i].time})</span> <strong>${mensagens.data[i].from}</strong> reservadamente para <strong>${mensagens.data[i].to}</strong>:  ${mensagens.data.text}</p>`
                }
            } else {
                historicoMensagens.innerHTML += `<p class="chat__mensagens__todos mensagem"><span class="hora">(${mensagens.data[i].time})</span> <strong>${mensagens.data[i].from}</strong> para <strong>Todos</strong>:  ${mensagens.data[i].text}</p>`

            }

        }
        let arrayMensagem = document.querySelectorAll('.mensagem')
        arrayMensagem[arrayMensagem.length - 1].scrollIntoView();
    });
}

function manterConexao() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', { name: nomeUsuario });
}

setInterval(manterConexao, 5000);

function manterAtualizado() {
    resgatarMensagens()
}

setInterval(manterAtualizado, 3000);