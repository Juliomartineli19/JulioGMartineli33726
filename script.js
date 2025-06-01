const API = {
    entrada: 'http://cnms-parking-api.net.uztec.com.br/api/v1/entry',
    tempo: 'http://cnms-parking-api.net.uztec.com.br/api/v1/time/',
    saida: 'http://cnms-parking-api.net.uztec.com.br/api/v1/exit/',
    situacao: 'http://cnms-parking-api.net.uztec.com.br/api/v1/check/',
    atualizar: 'http://cnms-parking-api.net.uztec.com.br/api/v1/update/',
    excluir: 'http://cnms-parking-api.net.uztec.com.br/api/v1/cancel/',
    ativos: 'http://cnms-parking-api.net.uztec.com.br/api/v1/active',
    vagas: 'http://cnms-parking-api.net.uztec.com.br/api/v1/slots',
    relatorio: 'http://cnms-parking-api.net.uztec.com.br/api/v1/report'
};

function requisicao(url, metodo = 'GET', corpo = null) {
    return fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: corpo ? JSON.stringify(corpo) : null
    }).then(resp => {
        if (!resp.ok) throw new Error('Erro na comunicação com o servidor.');
        return resp.json();
    });
}

// Entrada de veículo
document.getElementById('formEntrada').addEventListener('submit', evento => {
    evento.preventDefault();

    const modelo = document.getElementById('modeloEntrada').value;
    const placa = document.getElementById('placaEntrada').value;

    requisicao(API.entrada, 'POST', { model: modelo, plate: placa })
        .then(() => {
            document.getElementById('resEntrada').textContent = 'Veículo registrado com sucesso!';
        })
        .catch(erro => {
            document.getElementById('resEntrada').textContent = 'Falha ao registrar entrada.';
            console.error(erro);
        });
});

// Saída de veículo
document.getElementById('formSaida').addEventListener('submit', evento => {
    evento.preventDefault();

    const placa = document.getElementById('placaSaida').value;

    requisicao(API.saida + placa, 'PATCH')
        .then(() => {
            document.getElementById('resSaida').textContent = 'Saída confirmada.';
        })
        .catch(erro => {
            document.getElementById('resSaida').textContent = 'Erro ao registrar saída.';
            console.error(erro);
        });
});

// Cancelar registro
document.getElementById('formExclusao').addEventListener('submit', evento => {
    evento.preventDefault();

    const placa = document.getElementById('placaExclusao').value;

    requisicao(API.excluir + placa, 'DELETE')
        .then(() => {
            document.getElementById('resExclusao').textContent = 'Registro cancelado.';
        })
        .catch(erro => {
            document.getElementById('resExclusao').textContent = 'Erro ao cancelar registro.';
            console.error(erro);
        });
});

// Verificar se veículo está presente
document.getElementById('formVerificacao').addEventListener('submit', evento => {
    evento.preventDefault();

    const placa = document.getElementById('placaVerificacao').value;

    fetch(API.situacao + placa)
        .then(resp => {
            if (!resp.ok) throw new Error('Erro na verificação.');
            return resp.json();
        })
        .then(info => {
            const presente = info.entryTime ? 'Sim' : 'Não';
            document.getElementById('resVerificacao').textContent = `Veículo presente? ${presente}`;
        })
        .catch(erro => {
            document.getElementById('resVerificacao').textContent = 'Erro ao verificar presença.';
            console.error(erro);
        });
});

// Tempo de permanência
document.getElementById('formTempo').addEventListener('submit', evento => {
    evento.preventDefault();

    const placa = document.getElementById('placaTempo').value;

    fetch(API.tempo + placa)
        .then(resp => {
            if (!resp.ok) throw new Error('Erro ao consultar tempo.');
            return resp.json();
        })
        .then(info => {
            document.getElementById('resTempo').textContent = `Tempo no local: ${info.parkedTime.toFixed(2)} minutos.`;
        })
        .catch(erro => {
            document.getElementById('resTempo').textContent = 'Falha ao buscar tempo.';
            console.error(erro);
        });
});

// Atualizar dados do veículo
document.getElementById('formAtualizar').addEventListener('submit', evento => {
    evento.preventDefault();

    const placa = document.getElementById('placaAtualizar').value;
    const novoModelo = document.getElementById('modeloAtualizar').value;

    requisicao(API.atualizar + placa, 'PUT', { plate: placa, model: novoModelo })
        .then(() => {
            document.getElementById('resAtualizar').textContent = 'Informações atualizadas.';
        })
        .catch(erro => {
            document.getElementById('resAtualizar').textContent = 'Erro na atualização.';
            console.error(erro);
        });
});

// Listar veículos ativos
document.getElementById('formAtivos').addEventListener('submit', evento => {
    evento.preventDefault();

    requisicao(API.ativos)
        .then(lista => {
            document.getElementById('resAtivos').textContent = JSON.stringify(lista, null, 2);
        })
        .catch(erro => {
            document.getElementById('resAtivos').textContent = 'Erro ao carregar veículos ativos.';
            console.error(erro);
        });
});

// Verificar vagas
document.getElementById('formVagas').addEventListener('submit', evento => {
    evento.preventDefault();

    requisicao(API.vagas)
        .then(info => {
            document.getElementById('resVagas').textContent = `Vagas livres: ${info.availableSlots}`;
        })
        .catch(erro => {
            document.getElementById('resVagas').textContent = 'Erro ao consultar vagas.';
            console.error(erro);
        });
});

// Relatório diário
document.getElementById('formRelatorio').addEventListener('submit', evento => {
    evento.preventDefault();

    requisicao(API.relatorio)
        .then(dados => {
            document.getElementById('resRelatorio').textContent = JSON.stringify(dados, null, 2);
        })
        .catch(erro => {
            document.getElementById('resRelatorio').textContent = 'Erro ao gerar relatório.';
            console.error(erro);
        });
});