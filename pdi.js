const ModuloPDI = {

    abrir(usuario, banco){

        if(usuario.perfil === "ADMIN"){

            this.relatorioGeral(
                usuario,
                banco
            );

        }else{

            this.pdiIndividual(
                usuario,
                banco
            );

        }

    },



    relatorioGeral(usuario,banco){

        const colaboradores =
            banco.colaboradores || [];

        let linhas = "";

        let totalGap = 0;
        let somaScore = 0;
        let totalAvaliacoes = 0;

        colaboradores.forEach(colaborador=>{

            const matrizArea =
                banco.matrizesPorArea
                ? banco.matrizesPorArea[colaborador.area]
                : null;

            const matriz =
                matrizArea
                ? matrizArea.matrizEsperada
                : banco.matrizEsperada;

            const esperado =
                matriz[colaborador.cargo] || [];

            const avaliacao =
                banco.avaliacoes[colaborador.id] || [];

            let soma = 0;
            let gap = 0;
            let competencias = [];

            avaliacao.forEach((nota,index)=>{

                const atual = Number(nota) || 0;
                const meta = Number(esperado[index]) || 0;

                soma += atual;

                if(meta > atual){

                    gap++;

                    competencias.push(
                        banco.habilidades[index]
                    );

                }

            });

            totalGap += gap;

            const score =
                avaliacao.length
                ? soma / avaliacao.length
                : 0;

            somaScore += score;
            totalAvaliacoes++;

            linhas += `

<tr>

<td>${colaborador.area}</td>

<td>${colaborador.nome}</td>

<td>${colaborador.cargo}</td>

<td>${score.toFixed(2)}</td>

<td>${gap}</td>

<td>

${
competencias.length
? competencias.join(", ")
: "Sem GAP"
}

</td>

</tr>

`;

        });

        UI.carregar(`

<div class="portal">

<header class="topo">

<div class="logo-area">

<div class="logo-box">

📊

</div>

<div>

<h2>

Relatórios de Desenvolvimento

</h2>

<span>

Administrador: ${usuario.nome}

</span>

</div>

</div>

<div class="acoes-topo">

<button
id="btnVoltarPDI"
class="btnSecundario">

← Voltar

</button>

</div>

</header>

<section class="conteudo">

<div class="dashboardCards">

<div class="card">

<h3>👥 Colaboradores</h3>

<strong>

${colaboradores.length}

</strong>

</div>

<div class="card">

<h3>📈 Score Médio</h3>

<strong>

${
totalAvaliacoes
? (somaScore/totalAvaliacoes).toFixed(2)
: "0.00"
}

</strong>

</div>

<div class="card">

<h3>🎯 Total GAP</h3>

<strong>

${totalGap}

</strong>

</div>

<div class="card">

<h3>📊 Exportação</h3>

<p>

Exportar relatório completo de competências.

</p>

<button
id="btnExportarExcel"
class="btnAcao">

📊 Exportar Excel

</button>

</div>

</div>

<div class="card">

<h3>

Desenvolvimento por Colaborador

</h3>

<div class="tabela-container">

<table>

<thead>

<tr>

<th>Área</th>

<th>Colaborador</th>

<th>Cargo</th>

<th>Score</th>

<th>Quantidade GAP</th>

<th>Competências em Desenvolvimento</th>

</tr>

</thead>

<tbody>

${linhas}

</tbody>

</table>

</div>

</div>

</section>

</div>

`);
        // ==========================
        // EVENTOS
        // ==========================

        const btnVoltar =
            document.getElementById("btnVoltarPDI");

        if(btnVoltar){

            btnVoltar.onclick = ()=>{

                ModuloAdmin.abrir(
                    usuario,
                    banco
                );

            };

        }


        const btnExportar =
            document.getElementById("btnExportarExcel");

        if(btnExportar){

            btnExportar.onclick = ()=>{

                // Reutiliza o mesmo relatório do Dashboard
                DashboardExportar.exportarCSV(banco);

            };

        }

    },



    pdiIndividual(usuario,banco){

        // O gestor não utiliza mais este módulo.
        // Mantido apenas para compatibilidade.

        mostrarDashboard(usuario);

    }

};