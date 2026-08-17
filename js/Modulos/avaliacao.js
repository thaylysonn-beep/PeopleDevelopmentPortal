const ModuloAvaliacao = {

// =====================================================
// ABRIR MÓDULO
// =====================================================

abrir(usuario, banco) {

    const areaAtual =
        banco.matrizesPorArea &&
        banco.matrizesPorArea[usuario.area];

    if (!areaAtual) {

        alert("Área não encontrada.");
        return;

    }

    if (!areaAtual.colaboradores) {
        areaAtual.colaboradores = [];
    }

    if (!areaAtual.avaliacoes) {
        areaAtual.avaliacoes = {};
    }

    const colaboradores =
        areaAtual.colaboradores;

    let html = `

    <div class="portal">

        <header class="topo">

            <div class="logo-area">

                <div class="logo-box">
                    📝
                </div>

                <div>

                    <h2>
                        Avaliação de Competências
                    </h2>

                    <span>
                        Área: ${usuario.area}
                    </span>

                </div>

            </div>

        </header>


        <nav class="menu">

            <button id="btnVoltarMatriz">
                🎯 Matriz
            </button>

            <button class="ativo">
                📝 Avaliação
            </button>

        </nav>


        <section class="conteudo">

            <div class="card">

                <div class="barraAcoes">

                    <div class="grupoCampo">

                        <label>
                            Colaborador
                        </label>

                        <select id="cmbColaborador">

                            <option value="">
                                Selecione...
                            </option>

                            ${colaboradores.map(c => `

                                <option value="${c.id}">
                                    ${c.nome}
                                </option>

                            `).join("")}

                        </select>

                    </div>

                </div>


                <div id="painelAvaliacao">

                    <p class="textoCinza">
                        Selecione um colaborador para iniciar a avaliação.
                    </p>

                </div>

            </div>

        </section>

    </div>

    `;

    UI.carregar(html);


    // =====================================================
    // VOLTAR PARA MATRIZ
    // =====================================================

    const btnVoltar =
        document.getElementById(
            "btnVoltarMatriz"
        );

    if (btnVoltar) {

        btnVoltar.onclick = () => {

            mostrarDashboard(usuario);

        };

    }


    // =====================================================
    // SELECIONAR COLABORADOR
    // =====================================================

    const cmbColaborador =
        document.getElementById(
            "cmbColaborador"
        );

    if (cmbColaborador) {

        cmbColaborador.onchange = () => {

            const id =
                Number(
                    cmbColaborador.value
                );

            if (!id) {

                document.getElementById(
                    "painelAvaliacao"
                ).innerHTML = `

                    <p class="textoCinza">
                        Selecione um colaborador.
                    </p>

                `;

                return;

            }

            this.mostrarFormulario(
                id,
                usuario,
                banco
            );

        };

    }

},


// =====================================================
// MOSTRAR FORMULÁRIO
// =====================================================

mostrarFormulario(id, usuario, banco) {

    const areaAtual =
        banco.matrizesPorArea &&
        banco.matrizesPorArea[usuario.area];

    if (!areaAtual) {

        alert("Área não encontrada.");
        return;

    }


    const colaborador =
        (areaAtual.colaboradores || [])
            .find(
                c => Number(c.id) === Number(id)
            );

    if (!colaborador) {

        alert("Colaborador não encontrado.");
        return;

    }


    const habilidades =
        areaAtual.habilidades || [];


    const matrizEsperada =
        areaAtual.matrizEsperada || {};


    const esperados =
        matrizEsperada[
            colaborador.cargo
        ] || [];


    // =====================================================
    // RECUPERAR AVALIAÇÃO
    // =====================================================

    const registro =
        areaAtual.avaliacoes
            ? areaAtual.avaliacoes[id]
            : null;


    let niveis = [];
    let dataAvaliacao = "";


    // NOVO FORMATO

    if (
        registro &&
        typeof registro === "object" &&
        !Array.isArray(registro)
    ) {

        niveis =
            Array.isArray(
                registro.niveis
            )
                ? registro.niveis
                : [];

        dataAvaliacao =
            registro.data || "";

    }


    // FORMATO ANTIGO

    else if (
        Array.isArray(registro)
    ) {

        niveis =
            registro;

    }


    // GARANTIR UMA POSIÇÃO PARA CADA HABILIDADE

    niveis =
        habilidades.map(
            (habilidade, index) => {

                return Number(
                    niveis[index] ?? 0
                );

            }
        );


    // =====================================================
    // DATA
    // =====================================================

    let dataFormatada =
        "Ainda não avaliado";


    if (dataAvaliacao) {

        const partes =
            String(
                dataAvaliacao
            ).split("-");


        if (
            partes.length === 3
        ) {

            dataFormatada =
                `${partes[2]}/${partes[1]}/${partes[0]}`;

        }

        else {

            dataFormatada =
                dataAvaliacao;

        }

    }


    // =====================================================
    // CABEÇALHO
    // =====================================================

    let html = `

    <div class="cabecalhoColaborador">

        <div>

            <h3>
                ${colaborador.nome}
            </h3>

            <span>

                Cargo:
                <strong>
                    ${colaborador.cargo}
                </strong>

            </span>

        </div>

    </div>


    <div style="
        margin: 15px 0;
        padding: 12px 15px;
        background: #1c2026;
        border-radius: 8px;
        border: 1px solid #333a42;
    ">

        <strong>
            📅 Última avaliação:
        </strong>

        <span style="
            margin-left: 8px;
            color: #e8b923;
        ">

            ${dataFormatada}

        </span>

    </div>


    <div class="tabela-container">

        <table>

            <thead>

                <tr>

                    <th>
                        Habilidade
                    </th>

                    <th>
                        Esperado
                    </th>

                    <th>
                        Atual
                    </th>

                    <th>
                        GAP
                    </th>

                </tr>

            </thead>

            <tbody>

    `;


    // =====================================================
    // HABILIDADES
    // =====================================================

    habilidades.forEach(
        (habilidade, index) => {

            const esperado =
                Number(
                    esperados[index] ?? 0
                );


            const atual =
                Number(
                    niveis[index] ?? 0
                );


            const gap =
                Math.max(
                    0,
                    esperado - atual
                );


            let classe =
                "gapVerde";


            if (gap === 1) {

                classe =
                    "gapAmarelo";

            }

            else if (gap >= 2) {

                classe =
                    "gapVermelho";

            }


            html += `

                <tr>

                    <td class="colHabilidade">

                        ${habilidade}

                    </td>

                    <td>

                        ${esperado}

                    </td>

                    <td>

                        <select
                            class="nivelAtual"
                            data-index="${index}"
                        >

                            ${[0,1,2,3,4].map(
                                n => `

                                <option
                                    value="${n}"
                                    ${n === atual
                                        ? "selected"
                                        : ""}
                                >

                                    ${n}

                                </option>

                            `).join("")}

                        </select>

                    </td>

                    <td>

                        <span
                            id="gap${index}"
                            class="${classe}"
                        >

                            ${gap}

                        </span>

                    </td>

                </tr>

            `;

        }
    );


    html += `

            </tbody>

        </table>

    </div>


    <div class="rodapeAvaliacao">

        <button
            id="btnSalvarAvaliacao"
            class="btnAcao"
        >

            💾 Salvar Avaliação

        </button>

    </div>


    <!-- =================================================
         COMPETÊNCIAS COM MAIOR GAP
    ================================================== -->

    <div
        id="painelMaiorGap"
        style="margin-top:20px;"
    >

    </div>

    `;


    const painel =
        document.getElementById(
            "painelAvaliacao"
        );


    if (!painel) {
        return;
    }


    painel.innerHTML =
        html;


    // =====================================================
    // ATUALIZAR GAP
    // =====================================================

    document
        .querySelectorAll(".nivelAtual")
        .forEach(
            select => {

                select.onchange = () => {

                    this.atualizarGaps(
                        esperados
                    );

                };

            }
        );


    // =====================================================
    // MOSTRAR MAIORES GAPS
    // =====================================================

    this.atualizarGaps(
        esperados
    );


    // =====================================================
    // SALVAR
    // =====================================================

    const btnSalvar =
        document.getElementById(
            "btnSalvarAvaliacao"
        );


    if (!btnSalvar) {
        return;
    }


    btnSalvar.onclick =
        async () => {

            const novaAvaliacao =
                [];


            document
                .querySelectorAll(
                    ".nivelAtual"
                )
                .forEach(
                    select => {

                        novaAvaliacao.push(
                            Number(
                                select.value
                            ) || 0
                        );

                    }
                );


            // =================================================
            // DATA ATUAL
            // =================================================

            const hoje =
                new Date();


            const ano =
                hoje.getFullYear();


            const mes =
                String(
                    hoje.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const dia =
                String(
                    hoje.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const dataHoje =
                `${ano}-${mes}-${dia}`;


            // =================================================
            // GARANTIR OBJETO DE AVALIAÇÕES
            // =================================================

            if (
                !areaAtual.avaliacoes
            ) {

                areaAtual.avaliacoes = {};

            }


            // =================================================
            // SALVAR
            // =================================================

            areaAtual.avaliacoes[id] = {

                data:
                    dataHoje,

                niveis:
                    novaAvaliacao

            };


            try {

                await Storage.salvarBanco(
                    banco
                );


                alert(
                    "Avaliação salva com sucesso!"
                );


                // Atualiza a tela
                this.mostrarFormulario(
                    id,
                    usuario,
                    banco
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao salvar avaliação:",
                    erro
                );


                alert(
                    "Erro ao salvar a avaliação."
                );

            }

        };

},


// =====================================================
// ATUALIZAR GAPS
// =====================================================

atualizarGaps(esperados) {

    const selects =
        document.querySelectorAll(
            ".nivelAtual"
        );


    const gaps = [];


    selects.forEach(
        select => {

            const index =
                Number(
                    select.dataset.index
                );


            const esperado =
                Number(
                    esperados[index] ?? 0
                );


            const atual =
                Number(
                    select.value
                ) || 0;


            const gap =
                Math.max(
                    0,
                    esperado - atual
                );


            const span =
                document.getElementById(
                    "gap" + index
                );


            if (span) {

                span.textContent =
                    gap;


                span.classList.remove(
                    "gapVerde",
                    "gapAmarelo",
                    "gapVermelho"
                );


                if (gap <= 0) {

                    span.classList.add(
                        "gapVerde"
                    );

                }

                else if (gap === 1) {

                    span.classList.add(
                        "gapAmarelo"
                    );

                }

                else {

                    span.classList.add(
                        "gapVermelho"
                    );

                }

            }


            if (gap > 0) {

                gaps.push({

                    competencia:
                        document
                            .querySelector(
                                `.nivelAtual[data-index="${index}"]`
                            )
                            ?.closest("tr")
                            ?.querySelector(
                                ".colHabilidade"
                            )
                            ?.textContent
                            ?.trim() ||
                            "",

                    gap

                });

            }

        }
    );


    // =====================================================
    // ORDENAR DO MAIOR GAP PARA O MENOR
    // =====================================================

    gaps.sort(
        (a, b) =>
            b.gap - a.gap
    );


    // =====================================================
    // PAINEL
    // =====================================================

    const painel =
        document.getElementById(
            "painelMaiorGap"
        );


    if (!painel) {
        return;
    }


    if (!gaps.length) {

        painel.innerHTML = `

            <div class="card">

                <h3>
                    📈 Competências com Maior GAP
                </h3>

                <p>
                    Nenhuma competência possui GAP.
                </p>

            </div>

        `;

        return;

    }


    let html = `

        <div class="card">

            <h3>
                📈 Competências com Maior GAP
            </h3>

            <div class="tabela-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Competência
                            </th>

                            <th>
                                GAP
                            </th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    gaps.forEach(
        item => {

            html += `

                <tr>

                    <td>
                        ${item.competencia}
                    </td>

                    <td>
                        ${item.gap}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    painel.innerHTML =
        html;

}


};
