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

    // =================================================
    // NOVO - HISTÓRICO DE AVALIAÇÕES
    // =================================================

    if (!areaAtual.historicoAvaliacoes) {
        areaAtual.historicoAvaliacoes = {};
    }

    if (!areaAtual.habilidades) {
        areaAtual.habilidades = [];
    }

    if (!areaAtual.detalhesHabilidades) {
        areaAtual.detalhesHabilidades = {};
    }

    if (!areaAtual.matrizEsperada) {
        areaAtual.matrizEsperada = {};
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
                        Área: ${this.escaparHTML(usuario.area)}
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

                                <option
                                    value="${this.escaparAtributo(c.id)}"
                                >
                                    ${this.escaparHTML(c.nome)}
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


    if (!areaAtual.habilidades) {
        areaAtual.habilidades = [];
    }


    if (!areaAtual.detalhesHabilidades) {
        areaAtual.detalhesHabilidades = {};
    }


    if (!areaAtual.matrizEsperada) {
        areaAtual.matrizEsperada = {};
    }


    // =====================================================
    // NOVO - GARANTIR HISTÓRICO
    // =====================================================

    if (!areaAtual.historicoAvaliacoes) {
        areaAtual.historicoAvaliacoes = {};
    }


    const colaborador =
        (areaAtual.colaboradores || [])
            .find(
                c =>
                    Number(c.id) === Number(id)
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
    // RECUPERAR AVALIAÇÃO ATUAL
    // =====================================================

    const registro =
        areaAtual.avaliacoes
            ? areaAtual.avaliacoes[id]
            : null;


    let niveis = [];
    let dataAvaliacao = "";


    // =====================================================
    // NOVO FORMATO
    // =====================================================

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


    // =====================================================
    // FORMATO ANTIGO
    // =====================================================

    else if (
        Array.isArray(registro)
    ) {

        niveis =
            registro;

    }


    // =====================================================
    // GARANTIR UMA POSIÇÃO PARA CADA HABILIDADE
    // =====================================================

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
                ${this.escaparHTML(colaborador.nome)}
            </h3>

            <span>

                Cargo:
                <strong>
                    ${this.escaparHTML(colaborador.cargo)}
                </strong>

            </span>

        </div>

    </div>


    <div style="
        margin:15px 0;
        padding:12px 15px;
        background:#1c2026;
        border-radius:8px;
        border:1px solid #333a42;
    ">

        <strong>
            📅 Última avaliação:
        </strong>

        <span style="
            margin-left:8px;
            color:#e8b923;
        ">

            ${dataFormatada}

        </span>

    </div>


    <!-- =================================================
         ORIENTAÇÃO
    ================================================== -->

    <div
        style="
            margin-bottom:20px;
            padding:14px 16px;
            background:#171b20;
            border:1px solid #333a42;
            border-radius:8px;
        "
    >

        <strong>
            💡 Orientação para avaliação
        </strong>

        <p
            class="textoCinza"
            style="margin:6px 0 0 0;"
        >
            Consulte os balizadores de cada competência
            antes de definir o nível atual do colaborador.
        </p>

    </div>


    <!-- =================================================
         COMPETÊNCIAS
    ================================================== -->

    <div id="listaCompetenciasAvaliacao">

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


            // =================================================
            // DETALHES DA COMPETÊNCIA
            // =================================================

            const detalhes =
                areaAtual.detalhesHabilidades &&
                areaAtual.detalhesHabilidades[
                    habilidade
                ]
                    ? areaAtual.detalhesHabilidades[
                        habilidade
                    ]
                    : {};


            const direcionador =
                detalhes.direcionador ||
                "Não informado";


            const definicao =
                detalhes.definicao ||
                "Não informada";


            const niveisCompetencia =
                detalhes.niveis ||
                {};


            const nivel1 =
                niveisCompetencia[1] ||
                "Não informado";


            const nivel2 =
                niveisCompetencia[2] ||
                "Não informado";


            const nivel3 =
                niveisCompetencia[3] ||
                "Não informado";


            const nivel4 =
                niveisCompetencia[4] ||
                "Não informado";


            html += `

            <div
                class="card"
                style="
                    margin-bottom:18px;
                    border:1px solid #333a42;
                    overflow:hidden;
                "
            >

                <!-- =====================================
                     CABEÇALHO DA COMPETÊNCIA
                ====================================== -->

                <div
                    style="
                        padding:16px 18px;
                        background:#1c2026;
                        border-bottom:1px solid #333a42;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:flex-start;
                            gap:20px;
                            flex-wrap:wrap;
                        "
                    >

                        <div>

                            <h3
                                style="
                                    margin:0 0 7px 0;
                                "
                            >
                                ${this.escaparHTML(habilidade)}
                            </h3>

                            <div
                                style="
                                    color:#e8b923;
                                    font-weight:600;
                                "
                            >
                                🎯 Direcionador:
                                <span
                                    style="
                                        color:#ffffff;
                                        font-weight:400;
                                    "
                                >
                                    ${this.escaparHTML(
                                        direcionador
                                    )}
                                </span>
                            </div>

                        </div>


                        <div
                            style="
                                display:flex;
                                gap:20px;
                                align-items:center;
                                flex-wrap:wrap;
                            "
                        >

                            <div>

                                <small
                                    style="
                                        display:block;
                                        color:#9da4ad;
                                        margin-bottom:4px;
                                    "
                                >
                                    Esperado
                                </small>

                                <strong
                                    style="
                                        font-size:22px;
                                    "
                                >
                                    ${esperado}
                                </strong>

                            </div>


                            <div>

                                <small
                                    style="
                                        display:block;
                                        color:#9da4ad;
                                        margin-bottom:4px;
                                    "
                                >
                                    Atual
                                </small>

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

                            </div>


                            <div>

                                <small
                                    style="
                                        display:block;
                                        color:#9da4ad;
                                        margin-bottom:4px;
                                    "
                                >
                                    GAP
                                </small>

                                <span
                                    id="gap${index}"
                                    class="${classe}"
                                    style="
                                        display:inline-flex;
                                        min-width:32px;
                                        height:32px;
                                        align-items:center;
                                        justify-content:center;
                                        border-radius:6px;
                                        font-weight:700;
                                    "
                                >
                                    ${gap}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- =====================================
                     DEFINIÇÃO
                ====================================== -->

                <div
                    style="
                        padding:15px 18px;
                        border-bottom:1px solid #333a42;
                    "
                >

                    <div
                        style="
                            font-weight:600;
                            margin-bottom:5px;
                        "
                    >
                        📖 Definição
                    </div>

                    <div
                        style="
                            color:#c5cad0;
                            line-height:1.5;
                        "
                    >
                        ${this.escaparHTML(definicao)}
                    </div>

                </div>


                <!-- =====================================
                     BALIZADORES
                ====================================== -->

                <div
                    style="
                        padding:15px 18px;
                    "
                >

                    <div
                        style="
                            font-weight:600;
                            margin-bottom:12px;
                        "
                    >
                        📊 Balizadores de Proficiência
                    </div>


                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(210px,1fr)
                                );
                            gap:10px;
                        "
                    >

                        <!-- NÍVEL 1 -->

                        <div
                            style="
                                padding:12px;
                                background:#171b20;
                                border:1px solid #333a42;
                                border-radius:7px;
                            "
                        >

                            <div
                                style="
                                    font-weight:700;
                                    margin-bottom:6px;
                                "
                            >
                                Nível 1
                            </div>

                            <div
                                style="
                                    color:#bfc5cc;
                                    line-height:1.4;
                                "
                            >
                                ${this.escaparHTML(nivel1)}
                            </div>

                        </div>


                        <!-- NÍVEL 2 -->

                        <div
                            style="
                                padding:12px;
                                background:#171b20;
                                border:1px solid #333a42;
                                border-radius:7px;
                            "
                        >

                            <div
                                style="
                                    font-weight:700;
                                    margin-bottom:6px;
                                "
                            >
                                Nível 2
                            </div>

                            <div
                                style="
                                    color:#bfc5cc;
                                    line-height:1.4;
                                "
                            >
                                ${this.escaparHTML(nivel2)}
                            </div>

                        </div>


                        <!-- NÍVEL 3 -->

                        <div
                            style="
                                padding:12px;
                                background:#171b20;
                                border:1px solid #333a42;
                                border-radius:7px;
                            "
                        >

                            <div
                                style="
                                    font-weight:700;
                                    margin-bottom:6px;
                                "
                            >
                                Nível 3
                            </div>

                            <div
                                style="
                                    color:#bfc5cc;
                                    line-height:1.4;
                                "
                            >
                                ${this.escaparHTML(nivel3)}
                            </div>

                        </div>


                        <!-- NÍVEL 4 -->

                        <div
                            style="
                                padding:12px;
                                background:#171b20;
                                border:1px solid #333a42;
                                border-radius:7px;
                            "
                        >

                            <div
                                style="
                                    font-weight:700;
                                    margin-bottom:6px;
                                "
                            >
                                Nível 4
                            </div>

                            <div
                                style="
                                    color:#bfc5cc;
                                    line-height:1.4;
                                "
                            >
                                ${this.escaparHTML(nivel4)}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            `;

        }
    );


    html += `

    </div>


    <!-- =================================================
         SALVAR
    ================================================== -->

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
    // SALVAR AVALIAÇÃO
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
            // CALCULAR MÉDIA
            // =================================================

            let soma =
                0;


            if (
                novaAvaliacao.length
            ) {

                soma =
                    novaAvaliacao.reduce(
                        (
                            total,
                            nivel
                        ) =>
                            total +
                            Number(nivel || 0),
                        0
                    );

            }


            const media =
                novaAvaliacao.length
                    ? Number(
                        (
                            soma /
                            novaAvaliacao.length
                        ).toFixed(2)
                    )
                    : 0;


            // =================================================
            // GARANTIR OBJETOS
            // =================================================

            if (
                !areaAtual.avaliacoes
            ) {

                areaAtual.avaliacoes = {};

            }


            if (
                !areaAtual.historicoAvaliacoes
            ) {

                areaAtual.historicoAvaliacoes =
                    {};

            }


            if (
                !Array.isArray(
                    areaAtual
                    .historicoAvaliacoes[id]
                )
            ) {

                areaAtual
                    .historicoAvaliacoes[id] =
                    [];

            }


            // =================================================
            // SALVAR AVALIAÇÃO ATUAL
            // =================================================

            areaAtual.avaliacoes[id] = {

                data:
                    dataHoje,

                niveis:
                    novaAvaliacao

            };


            // =================================================
            // REGISTRAR HISTÓRICO
            // =================================================

            const historico =
                areaAtual
                    .historicoAvaliacoes[id];


            historico.push({

                data:
                    dataHoje,

                niveis:
                    [...novaAvaliacao],

                media:
                    media

            });


            // =================================================
            // ORDENAR HISTÓRICO POR DATA
            // =================================================

            historico.sort(
                (a, b) => {

                    return String(
                        a.data || ""
                    ).localeCompare(
                        String(
                            b.data || ""
                        )
                    );

                }
            );


            // =================================================
            // SALVAR BANCO
            // =================================================

            try {

                await Storage.salvarBanco(
                    banco
                );


                alert(
                    "Avaliação salva com sucesso!"
                );


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

                const linha =
                    select.closest(
                        ".card"
                    );


                const competencia =
                    linha
                        ?.querySelector("h3")
                        ?.textContent
                        ?.trim() ||
                        "";


                gaps.push({

                    competencia:
                        competencia,

                    gap

                });

            }

        }
    );


    // =====================================================
    // ORDENAR
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
                        ${this.escaparHTML(
                            item.competencia
                        )}
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

},


// =====================================================
// ESCAPAR HTML
// =====================================================

escaparHTML(valor) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

},


// =====================================================
// ESCAPAR ATRIBUTO
// =====================================================

escaparAtributo(valor) {

    return this.escaparHTML(
        valor
    );

}

};