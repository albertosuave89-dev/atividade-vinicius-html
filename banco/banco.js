// ===== Dados em memória =====
let saldo = 1000;
let historico = [];
historico.push({ tipo: "abertura", valor: 1000 });

// Aviso engraçado após as operações. Coloque false para desligar.
const MOSTRAR_MEME = true;

// ===== Elementos da página =====
const campoSaldo = document.getElementById("saldo");
const campoOperacao = document.getElementById("operacao");
const campoValor = document.getElementById("valor");
const botao = document.getElementById("executar");
const areaMensagem = document.getElementById("mensagem");
const meme = document.getElementById("meme");
const memeFoto = document.getElementById("meme-foto");
const memeAviso = document.getElementById("meme-aviso");

// ===== Funções auxiliares =====
function formatar(valor) {
  return "R$ " + valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Reinicia uma animação CSS em um elemento
function animar(elemento, classe) {
  elemento.classList.remove(classe);
  void elemento.offsetWidth;
  elemento.classList.add(classe);
}

function atualizarSaldo() {
  campoSaldo.textContent = formatar(saldo);
  animar(campoSaldo, "pulsar");
}

function mostrar(texto, tipo) {
  areaMensagem.textContent = texto;
  areaMensagem.className = "mensagem " + tipo;
  animar(areaMensagem, "entrar");
}

// Retorna o valor digitado ou -1 se for inválido (if/else)
function lerValor() {
  const texto = campoValor.value;
  if (texto === "") {
    mostrar("Erro: informe um valor.", "erro");
    return -1;
  }
  const valor = Number(texto);
  if (!Number.isInteger(valor) || valor <= 0) {
    mostrar("Erro: o valor deve ser um número inteiro maior que zero.", "erro");
    return -1;
  }
  return valor;
}

// ===== Operações (retornam true se deu certo e false se deu erro) =====
function consultarSaldo() {
  mostrar("Saldo disponível: " + formatar(saldo), "info");
  return true;
}

function depositar() {
  const valor = lerValor();
  if (valor === -1) {
    return false;
  }
  saldo = saldo + valor;
  historico.push({ tipo: "deposito", valor: valor });
  atualizarSaldo();
  mostrar(
    "Depósito de " + formatar(valor) + " realizado com sucesso!\n" +
    "Novo saldo: " + formatar(saldo),
    "sucesso"
  );
  return true;
}

function sacar() {
  const valor = lerValor();
  if (valor === -1) {
    return false;
  }
  if (valor % 10 !== 0) {
    mostrar("Erro: o valor do saque deve ser múltiplo de 10.", "erro");
    return false;
  }
  if (valor > saldo) {
    mostrar("Erro: saldo insuficiente.", "erro");
    return false;
  }

  // Cálculo das notas com while (sem Math.floor), da maior para a menor
  const notas = [100, 50, 20, 10];
  let restante = valor;
  let totalNotas = 0;
  let textoNotas = "";
  let i = 0;
  while (i < notas.length) {
    let quantidade = 0;
    while (restante >= notas[i]) {
      restante = restante - notas[i];
      quantidade = quantidade + 1;
    }
    if (quantidade > 0) {
      textoNotas = textoNotas + quantidade + " nota(s) de R$ " + notas[i] + "\n";
      totalNotas = totalNotas + quantidade;
    }
    i = i + 1;
  }

  saldo = saldo - valor;
  historico.push({ tipo: "saque", valor: valor });
  atualizarSaldo();
  mostrar(
    "Saque de " + formatar(valor) + " realizado com sucesso!\n" +
    "Notas entregues:\n" + textoNotas +
    "Total de notas: " + totalNotas + "\n" +
    "Saldo restante: " + formatar(saldo),
    "sucesso"
  );
  return true;
}

function verExtrato() {
  let texto = "EXTRATO\n";
  // for percorre o histórico na ordem em que aconteceu
  for (let i = 0; i < historico.length; i++) {
    const mov = historico[i];
    let linha = (i + 1) + ". ";
    if (mov.tipo === "abertura") {
      linha = linha + "Abertura da conta: " + formatar(mov.valor);
    } else if (mov.tipo === "deposito") {
      linha = linha + "Depósito: +" + formatar(mov.valor);
    } else {
      linha = linha + "Saque: -" + formatar(mov.valor);
    }
    texto = texto + linha + "\n";
  }
  texto = texto + "\nSaldo atual: " + formatar(saldo);
  mostrar(texto, "info");
  return true;
}

// ===== Aviso após as operações =====
function abrirMeme() {
  memeFoto.hidden = false;
  memeAviso.hidden = true;
  meme.hidden = false;
}

memeFoto.addEventListener("error", function () {
  memeFoto.hidden = true;
  memeAviso.hidden = false;
});

document.getElementById("meme-fechar").addEventListener("click", function () {
  meme.hidden = true;
});

// ===== Botão principal =====
botao.addEventListener("click", function () {
  const operacao = campoOperacao.value;
  let deuCerto = false;
  switch (operacao) {
    case "saldo":
      deuCerto = consultarSaldo();
      break;
    case "depositar":
      deuCerto = depositar();
      break;
    case "sacar":
      deuCerto = sacar();
      break;
    case "extrato":
      deuCerto = verExtrato();
      break;
    default:
      mostrar("Erro: operação desconhecida.", "erro");
      break;
  }
  campoValor.value = "";
  if (deuCerto && MOSTRAR_MEME) {
    abrirMeme();
  }
});

// ===== Início =====
atualizarSaldo();
mostrar("Escolha uma operação para começar.", "info");