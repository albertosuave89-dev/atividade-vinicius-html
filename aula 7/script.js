
const botaoCalcular = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const finalizacao = document.getElementById("finalizacao");

botaoCalcular.addEventListener("click", function () {

    finalizacao.textContent = "";

    try {

        const texto1 = document.getElementById("nota1").value;
        const texto2 = document.getElementById("nota2").value;
        const texto3 = document.getElementById("nota3").value;

        const nota1 = Number(texto1);
        const nota2 = Number(texto2);
        const nota3 = Number(texto3);

        if (texto1 === "" || texto2 === "" || texto3 === "") {
            throw new Error("Preencha as três notas.");
        }

        if (
            nota1 < 0 || nota1 > 10 ||
            nota2 < 0 || nota2 > 10 ||
            nota3 < 0 || nota3 > 10
        ) {
            throw new Error("As notas devem estar entre 0 e 10.");
        }

        const media = (nota1 + nota2 + nota3) / 3;

        if (media >= 7) {
            resultado.textContent = "Média: " + media.toFixed(2) + " - Aprovado!";
        } 
        else if (media >= 5) {
            resultado.textContent = "Média: " + media.toFixed(2) + " - Recuperação!";
        } 
        else {
            resultado.textContent = "Média: " + media.toFixed(2) + " - Reprovado!";
        }

    } catch (erro) {

        resultado.textContent = "Erro: " + erro.message;

    } finally {

        finalizacao.textContent = "Cálculo finalizado.";

    }

});
