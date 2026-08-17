const DashboardTD = {

    // =========================================================
    // ABRIR DASHBOARD
    // =========================================================

    abrir(usuario, banco) {

        console.log("DASHBOARD T&D:", banco);

        const dados = this.analisarBanco(banco);

        const html = `

            <div class="portal dashboard-td">

                <!-- =====================================================
                     CABEÇALHO
                ====================================================== -->

                <header class="topo">

                    <div class="logo-area">

                        <div class="logo-box">
                            🎯
                        </div>

                        <div>

                            <h2>
                                Inteligência de T&D
                            </h2>

                            <span>
                                Radar estratégico de desenvolvimento
                            </span>

                        </div>

                    </div>


                    <div class="acoes-topo">

                        <button
                            id="btnVoltarDashboardTD"
                            class="btnSecundario">

                            ← Voltar

                        </button>

                    </div>

                </header>


                <!-- =====================================================
                     CONTEÚDO
                ====================================================== -->

                <section class="conteudo">

                    <!-- =================================================
                         INTRO
                    ================================================== -->

                    <div class="td-intro">

                        <div>

                            <h1>
                                Radar de Desenvolvimento
                            </h1>

                            <p>
                                Identifique onde Treinamento e Desenvolvimento
                                precisa atuar para reduzir os principais GAPs
                                de competências.
                            </p>

                        </div>


                        <div class="td-filtro">

                            <label>
                                Área
                            </label>

                            <select id="filtroAreaTD">

                                <option value="TODAS">
                                    Todas as áreas
                                </option>

                                ${dados.areas.map(area => `

                                    <option value="${this.escaparHTML(area)}">

                                        ${this.escaparHTML(area)}

                                    </option>

                                `).join("")}

                            </select>

                        </div>

                    </div>


                    <!-- =================================================
                         KPIs EXECUTIVOS
                    ================================================== -->

                    <div
                        id="cardsTD"
                        class="dashboardCards">

                        ${this.renderCards(dados)}

                    </div>


                    <!-- =================================================
                         PRIORIDADES
                    ================================================== -->

                    <div class="card td-prioridades">

                        <div class="td-card-header">

                            <div>

                                <h3>
                                    🚨 Prioridades de T&D
                                </h3>

                                <p>
                                    Onde a área deve concentrar sua atuação.
                                </p>

                            </div>

                        </div>


                        <div id="prioridadesTD">

                            ${this.renderPrioridades(
                                dados.competencias
                            )}

                        </div>

                    </div>


                    <!-- =================================================
                         COMPETÊNCIAS + ÁREAS
                    ================================================== -->

                    <div class="td-grid-principal">


                        <!-- =================================================
                             COMPETÊNCIAS
                        ================================================== -->

                        <div class="card">

                            <div class="td-card-header">

                                <div>

                                    <h3>
                                        📚 Competências críticas
                                    </h3>

                                    <p>
                                        Competências que mais pressionam
                                        o desenvolvimento.
                                    </p>

                                </div>

                            </div>


                            <div id="rankingCompetenciasTD">

                                ${this.renderRankingCompetencias(
                                    dados.competencias
                                )}

                            </div>

                        </div>


                        <!-- =================================================
                             ÁREAS
                        ================================================== -->

                        <div class="card">

                            <div class="td-card-header">

                                <div>

                                    <h3>
                                        🏭 Áreas mais impactadas
                                    </h3>

                                    <p>
                                        Concentração de necessidades
                                        por área.
                                    </p>

                                </div>

                            </div>


                            <div id="rankingAreasTD">

                                ${this.renderRankingAreas(
                                    dados.areasAnalise
                                )}

                            </div>

                        </div>

                    </div>


                    <!-- =================================================
                         PLANO DE ATUAÇÃO
                    ================================================== -->

                    <div class="card td-plano-atuacao">

                        <div class="td-card-header">

                            <div>

                                <h3>
                                    🎯 Plano de atuação recomendado
                                </h3>

                                <p>
                                    Sugestão de atuação para T&D com base
                                    nos GAPs identificados.
                                </p>

                            </div>

                        </div>


                        <div id="planoAtuacaoTD">

                            ${this.renderPlanoAtuacao(
                                dados.competencias
                            )}

                        </div>

                    </div>


                    <!-- =================================================
                         CARGOS
                    ================================================== -->

                    <div class="card td-cargos">

                        <div class="td-card-header">

                            <div>

                                <h3>
                                    👥 Cargos impactados
                                </h3>

                                <p>
                                    Informação complementar para apoiar
                                    o planejamento das ações.
                                </p>

                            </div>

                        </div>


                        <div id="rankingCargosTD">

                            ${this.renderRankingCargos(
                                dados.cargos
                            )}

                        </div>

                    </div>

                </section>

            </div>

        `;


        UI.carregar(html);


        // =========================================================
        // VOLTAR
        // =========================================================

        const btnVoltar =
            document.getElementById(
                "btnVoltarDashboardTD"
            );


        if (btnVoltar) {

            btnVoltar.onclick = () => {

                if (
                    typeof ModuloAdmin !== "undefined"
                ) {

                    ModuloAdmin.abrir(
                        usuario,
                        banco
                    );

                }

            };

        }


        // =========================================================
        // FILTRO DE ÁREA
        // =========================================================

        const filtro =
            document.getElementById(
                "filtroAreaTD"
            );


        if (filtro) {

            filtro.onchange = () => {

                const areaSelecionada =
                    filtro.value;


                const dadosFiltrados =
                    this.analisarBanco(
                        banco,
                        areaSelecionada
                    );


                const cards =
                    document.getElementById(
                        "cardsTD"
                    );

                if (cards) {

                    cards.innerHTML =
                        this.renderCards(
                            dadosFiltrados
                        );

                }


                const prioridades =
                    document.getElementById(
                        "prioridadesTD"
                    );

                if (prioridades) {

                    prioridades.innerHTML =
                        this.renderPrioridades(
                            dadosFiltrados.competencias
                        );

                }


                const competencias =
                    document.getElementById(
                        "rankingCompetenciasTD"
                    );

                if (competencias) {

                    competencias.innerHTML =
                        this.renderRankingCompetencias(
                            dadosFiltrados.competencias
                        );

                }


                const areas =
                    document.getElementById(
                        "rankingAreasTD"
                    );

                if (areas) {

                    areas.innerHTML =
                        this.renderRankingAreas(
                            dadosFiltrados.areasAnalise
                        );

                }


                const plano =
                    document.getElementById(
                        "planoAtuacaoTD"
                    );

                if (plano) {

                    plano.innerHTML =
                        this.renderPlanoAtuacao(
                            dadosFiltrados.competencias
                        );

                }


                const cargos =
                    document.getElementById(
                        "rankingCargosTD"
                    );

                if (cargos) {

                    cargos.innerHTML =
                        this.renderRankingCargos(
                            dadosFiltrados.cargos
                        );

                }

            };

        }

    },


    // =========================================================
    // ANALISAR BANCO
    // =========================================================

    analisarBanco(
        banco,
        filtroArea = "TODAS"
    ) {

        const matrizesPorArea =
            banco?.matrizesPorArea || {};


        const registros = [];

        const areasEncontradas = [];


        // =====================================================
        // ÁREAS
        // =====================================================

        Object.keys(
            matrizesPorArea
        ).forEach(
            nomeArea => {

                const area =
                    matrizesPorArea[
                        nomeArea
                    ] || {};


                const nome =
                    area.nome ||
                    nomeArea ||
                    "Área não informada";


                areasEncontradas.push(
                    nome
                );


                if (
                    filtroArea !== "TODAS" &&
                    nome !== filtroArea
                ) {

                    return;

                }


                const colaboradores =
                    Array.isArray(
                        area.colaboradores
                    )
                        ? area.colaboradores
                        : [];


                const habilidades =
                    Array.isArray(
                        area.habilidades
                    )
                        ? area.habilidades
                        : [];


                const avaliacoes =
                    area.avaliacoes &&
                    typeof area.avaliacoes === "object"
                        ? area.avaliacoes
                        : {};


                const matrizEsperada =
                    area.matrizEsperada &&
                    typeof area.matrizEsperada === "object"
                        ? area.matrizEsperada
                        : {};


                const criticidade =
                    area.criticidadeHabilidades &&
                    typeof area.criticidadeHabilidades === "object"
                        ? area.criticidadeHabilidades
                        : {};


                // =================================================
                // COLABORADORES
                // =================================================

                colaboradores.forEach(
                    colaborador => {

                        const cargo =
                            colaborador.cargo ||
                            "Cargo não informado";


                        const esperado =
                            Array.isArray(
                                matrizEsperada[cargo]
                            )
                                ? matrizEsperada[cargo]
                                : [];


                        const registro =
                            avaliacoes[
                                colaborador.id
                            ];


                        let niveis = [];


                        // =================================================
                        // NOVO FORMATO
                        // =================================================

                        if (
                            registro &&
                            !Array.isArray(registro) &&
                            typeof registro === "object"
                        ) {

                            niveis =
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : [];

                        }


                        // =================================================
                        // FORMATO ANTIGO
                        // =================================================

                        else if (
                            Array.isArray(registro)
                        ) {

                            niveis =
                                registro;

                        }


                        // =================================================
                        // HABILIDADES
                        // =================================================

                        habilidades.forEach(
                            (
                                habilidade,
                                index
                            ) => {

                                const nivelEsperado =
                                    Number(
                                        esperado[index]
                                    ) || 0;


                                const nivelAtual =
                                    Number(
                                        niveis[index]
                                    ) || 0;


                                const gap =
                                    Math.max(
                                        0,
                                        nivelEsperado -
                                        nivelAtual
                                    );


                                const nivelCriticidade =
                                    this.obterCriticidade(
                                        criticidade,
                                        habilidade,
                                        index
                                    );


                                registros.push({

                                    area:
                                        nome,

                                    colaborador:
                                        colaborador.nome ||
                                        "Não informado",

                                    colaboradorId:
                                        colaborador.id,

                                    cargo,

                                    habilidade,

                                    nivelEsperado,

                                    nivelAtual,

                                    gap,

                                    criticidade:
                                        nivelCriticidade

                                });

                            }
                        );

                    }
                );

            }
        );


        // =========================================================
        // COLABORADORES
        // =========================================================

        const colaboradoresSet =
            new Set();


        const avaliadosSet =
            new Set();


        registros.forEach(
            registro => {

                const chave =
                    `${registro.area}|${registro.colaboradorId}`;


                colaboradoresSet.add(
                    chave
                );


                if (
                    registro.nivelAtual > 0
                ) {

                    avaliadosSet.add(
                        chave
                    );

                }

            }
        );


        const totalColaboradores =
            colaboradoresSet.size;


        const colaboradoresAvaliados =
            avaliadosSet.size;


        // =========================================================
        // COMPETÊNCIAS
        // =========================================================

        const competenciasComMeta =
            registros.filter(
                r =>
                    r.nivelEsperado > 0
            );


        const totalCompetencias =
            competenciasComMeta.length;


        const competenciasNaMeta =
            competenciasComMeta.filter(
                r =>
                    r.gap === 0
            ).length;


        const registrosComGap =
            competenciasComMeta.filter(
                r =>
                    r.gap > 0
            );


        const gapsCriticos =
            registrosComGap.filter(
                r =>
                    r.gap >= 2 ||
                    r.criticidade === "alta"
            );


        const percentualNaMeta =
            totalCompetencias > 0
                ? Math.round(
                    (
                        competenciasNaMeta /
                        totalCompetencias
                    ) * 100
                )
                : 0;


        const percentualGap =
            totalCompetencias > 0
                ? Math.round(
                    (
                        registrosComGap.length /
                        totalCompetencias
                    ) * 100
                )
                : 0;


        // =========================================================
        // MAPA DE COMPETÊNCIAS
        // =========================================================

        const competenciasMap = {};


        registrosComGap.forEach(
            registro => {

                const chave =
                    registro.habilidade;


                if (
                    !competenciasMap[chave]
                ) {

                    competenciasMap[chave] = {

                        nome:
                            registro.habilidade,

                        ocorrencias:
                            0,

                        gapTotal:
                            0,

                        gapMaximo:
                            0,

                        colaboradores:
                            new Set(),

                        areas:
                            new Set(),

                        cargos:
                            new Set(),

                        criticos:
                            0

                    };

                }


                const item =
                    competenciasMap[chave];


                item.ocorrencias++;


                item.gapTotal +=
                    registro.gap;


                item.gapMaximo =
                    Math.max(
                        item.gapMaximo,
                        registro.gap
                    );


                item.colaboradores.add(
                    `${registro.area}|${registro.colaboradorId}`
                );


                item.areas.add(
                    registro.area
                );


                item.cargos.add(
                    registro.cargo
                );


                if (
                    registro.criticidade === "alta"
                ) {

                    item.criticos++;

                }

            }
        );


        const competencias =
            Object.values(
                competenciasMap
            )
                .map(
                    item => {

                        const pessoas =
                            item.colaboradores.size;


                        const gapMedio =
                            item.ocorrencias > 0
                                ? item.gapTotal /
                                  item.ocorrencias
                                : 0;


                        /*
                         * Score de prioridade.
                         *
                         * Quanto maior:
                         *
                         * - número de pessoas
                         * - GAP
                         * - criticidade
                         *
                         * maior a prioridade para T&D.
                         */

                        const score =
                            (
                                pessoas * 2
                            ) +
                            (
                                gapMedio * 5
                            ) +
                            (
                                item.criticos * 3
                            );


                        return {

                            ...item,

                            pessoas,

                            areasQtd:
                                item.areas.size,

                            cargosQtd:
                                item.cargos.size,

                            gapMedio,

                            score

                        };

                    }
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.score -
                        a.score
                );


        // =========================================================
        // ÁREAS
        // =========================================================

        const areasMap = {};


        registrosComGap.forEach(
            registro => {

                if (
                    !areasMap[
                        registro.area
                    ]
                ) {

                    areasMap[
                        registro.area
                    ] = {

                        nome:
                            registro.area,

                        pessoas:
                            new Set(),

                        gaps:
                            0,

                        gapTotal:
                            0,

                        criticos:
                            0

                    };

                }


                const item =
                    areasMap[
                        registro.area
                    ];


                item.pessoas.add(
                    registro.colaboradorId
                );


                item.gaps++;


                item.gapTotal +=
                    registro.gap;


                if (
                    registro.gap >= 2 ||
                    registro.criticidade === "alta"
                ) {

                    item.criticos++;

                }

            }
        );


        const areasAnalise =
            Object.values(
                areasMap
            )
                .map(
                    item => ({

                        nome:
                            item.nome,

                        pessoas:
                            item.pessoas.size,

                        gaps:
                            item.gaps,

                        criticos:
                            item.criticos,

                        gapMedio:
                            item.gaps > 0
                                ? item.gapTotal /
                                  item.gaps
                                : 0

                    })
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        (
                            b.criticos * 3 +
                            b.gaps
                        ) -
                        (
                            a.criticos * 3 +
                            a.gaps
                        )
                );


        // =========================================================
        // CARGOS
        // =========================================================

        const cargosMap = {};


        registrosComGap.forEach(
            registro => {

                if (
                    !cargosMap[
                        registro.cargo
                    ]
                ) {

                    cargosMap[
                        registro.cargo
                    ] = {

                        nome:
                            registro.cargo,

                        pessoas:
                            new Set(),

                        gaps:
                            0,

                        gapTotal:
                            0

                    };

                }


                const item =
                    cargosMap[
                        registro.cargo
                    ];


                item.pessoas.add(
                    `${registro.area}|${registro.colaboradorId}`
                );


                item.gaps++;


                item.gapTotal +=
                    registro.gap;

            }
        );


        const cargos =
            Object.values(
                cargosMap
            )
                .map(
                    item => ({

                        nome:
                            item.nome,

                        pessoas:
                            item.pessoas.size,

                        gaps:
                            item.gaps,

                        gapMedio:
                            item.gaps > 0
                                ? item.gapTotal /
                                  item.gaps
                                : 0

                    })
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.gaps -
                        a.gaps
                );


        return {

            registros,

            areas:
                [
                    ...new Set(
                        areasEncontradas
                    )
                ].sort(),

            totalColaboradores,

            colaboradoresAvaliados,

            totalCompetencias,

            competenciasNaMeta,

            registrosComGap:
                registrosComGap.length,

            gapsCriticos:
                gapsCriticos.length,

            percentualNaMeta,

            percentualGap,

            competencias,

            areasAnalise,

            cargos

        };

    },


    // =========================================================
    // CRITICIDADE
    // =========================================================

    obterCriticidade(
        criticidade,
        habilidade,
        index
    ) {

        let valor =
            criticidade[
                habilidade
            ];


        if (
            valor === undefined
        ) {

            valor =
                criticidade[
                    index
                ];

        }


        if (
            valor === undefined ||
            valor === null
        ) {

            return "normal";

        }


        const texto =
            String(
                valor
            )
                .toLowerCase()
                .trim();


        if (
            texto.includes("alta") ||
            texto.includes("crítica") ||
            texto.includes("critica") ||
            texto === "3"
        ) {

            return "alta";

        }


        if (
            texto.includes("média") ||
            texto.includes("media") ||
            texto === "2"
        ) {

            return "media";

        }


        return "normal";

    },


    // =========================================================
    // CARDS EXECUTIVOS
    // =========================================================

    renderCards(
        dados
    ) {

        return `

            <div class="card td-kpi">

                <div class="td-kpi-icon">
                    👥
                </div>

                <div>

                    <strong>
                        ${dados.totalColaboradores}
                    </strong>

                    <p>
                        Colaboradores
                    </p>

                </div>

            </div>


            <div class="card td-kpi">

                <div class="td-kpi-icon">
                    🎯
                </div>

                <div>

                    <strong>
                        ${dados.colaboradoresAvaliados}
                    </strong>

                    <p>
                        Avaliados
                    </p>

                </div>

            </div>


            <div class="card td-kpi">

                <div class="td-kpi-icon">
                    🟢
                </div>

                <div>

                    <strong>
                        ${dados.percentualNaMeta}%
                    </strong>

                    <p>
                        Competências na meta
                    </p>

                </div>

            </div>


            <div class="card td-kpi">

                <div class="td-kpi-icon">
                    🔴
                </div>

                <div>

                    <strong>
                        ${dados.gapsCriticos}
                    </strong>

                    <p>
                        GAPs críticos
                    </p>

                </div>

            </div>


            <div class="card td-kpi">

                <div class="td-kpi-icon">
                    ⚠️
                </div>

                <div>

                    <strong>
                        ${dados.competencias.length}
                    </strong>

                    <p>
                        Competências com GAP
                    </p>

                </div>

            </div>

        `;

    },


    // =========================================================
    // PRIORIDADES
    // =========================================================

    renderPrioridades(
        competencias
    ) {

        if (
            !competencias ||
            competencias.length === 0
        ) {

            return `

                <div class="td-vazio">

                    🟢 Nenhuma prioridade de desenvolvimento
                    identificada.

                </div>

            `;

        }


        const lista =
            competencias.slice(
                0,
                5
            );


        return `

            <div class="td-prioridades-lista">

                ${lista.map(
                    (
                        item,
                        index
                    ) => {

                        const prioridade =
                            this.classificarPrioridade(
                                item
                            );


                        const recomendacao =
                            this.gerarRecomendacao(
                                item
                            );


                        return `

                            <div class="td-prioridade-item">

                                <div class="td-prioridade-numero">

                                    ${String(
                                        index + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}

                                </div>


                                <div class="td-prioridade-conteudo">

                                    <div class="td-prioridade-titulo">

                                        <strong>

                                            ${this.escaparHTML(
                                                item.nome
                                            )}

                                        </strong>


                                        <span
                                            class="td-prioridade-badge ${prioridade.classe}">

                                            ${prioridade.icone}
                                            ${prioridade.nome}

                                        </span>

                                    </div>


                                    <div class="td-prioridade-dados">

                                        <span>
                                            👤 ${item.pessoas}
                                            pessoa(s)
                                        </span>

                                        <span>
                                            🏭 ${item.areasQtd}
                                            área(s)
                                        </span>

                                        <span>
                                            📊 GAP médio
                                            ${this.formatarNumero(
                                                item.gapMedio
                                            )}
                                        </span>

                                        <span>
                                            ⚠️ GAP máximo
                                            ${item.gapMaximo}
                                        </span>

                                    </div>


                                    <div class="td-prioridade-acao">

                                        <strong>
                                            T&D deve atuar:
                                        </strong>

                                        <span>
                                            ${recomendacao.acao}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    },


    // =========================================================
    // COMPETÊNCIAS CRÍTICAS
    // =========================================================

    renderRankingCompetencias(
        competencias
    ) {

        if (
            !competencias ||
            competencias.length === 0
        ) {

            return `

                <div class="td-vazio">

                    🟢 Nenhuma competência com GAP.

                </div>

            `;

        }


        const lista =
            competencias.slice(
                0,
                8
            );


        return `

            <div class="td-ranking">

                ${lista.map(
                    (
                        item,
                        index
                    ) => {

                        const prioridade =
                            this.classificarPrioridade(
                                item
                            );


                        return `

                            <div class="td-ranking-item">

                                <div class="td-ranking-posicao">

                                    ${index + 1}

                                </div>


                                <div class="td-ranking-info">

                                    <strong>

                                        ${this.escaparHTML(
                                            item.nome
                                        )}

                                    </strong>


                                    <span>

                                        ${item.pessoas}
                                        pessoa(s)

                                        •
                                        ${item.areasQtd}
                                        área(s)

                                        •
                                        GAP médio
                                        ${this.formatarNumero(
                                            item.gapMedio
                                        )}

                                    </span>

                                </div>


                                <div
                                    class="td-ranking-status ${prioridade.classe}">

                                    ${prioridade.icone}
                                    ${prioridade.nome}

                                </div>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    },


    // =========================================================
    // ÁREAS
    // =========================================================

    renderRankingAreas(
        areas
    ) {

        if (
            !areas ||
            areas.length === 0
        ) {

            return `

                <div class="td-vazio">

                    🟢 Nenhuma área com GAP.

                </div>

            `;

        }


        return `

            <div class="td-ranking">

                ${areas.slice(
                    0,
                    8
                ).map(
                    (
                        area,
                        index
                    ) => {

                        const prioridade =
                            area.criticos > 0
                                ? "td-prioridade-alta"
                                : area.gaps >= 5
                                    ? "td-prioridade-media"
                                    : "td-prioridade-baixa";


                        return `

                            <div class="td-ranking-item">

                                <div class="td-ranking-posicao">

                                    ${index + 1}

                                </div>


                                <div class="td-ranking-info">

                                    <strong>

                                        ${this.escaparHTML(
                                            area.nome
                                        )}

                                    </strong>


                                    <span>

                                        ${area.pessoas}
                                        pessoa(s)

                                        •
                                        ${area.gaps}
                                        GAP(s)

                                        •
                                        ${area.criticos}
                                        crítico(s)

                                    </span>

                                </div>


                                <div
                                    class="td-area-impacto ${prioridade}">

                                    GAP
                                    ${this.formatarNumero(
                                        area.gapMedio
                                    )}

                                </div>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    },


    // =========================================================
    // PLANO DE ATUAÇÃO
    // =========================================================

    renderPlanoAtuacao(
        competencias
    ) {

        if (
            !competencias ||
            competencias.length === 0
        ) {

            return `

                <div class="td-plano-vazio">

                    <strong>
                        🟢 Nenhuma ação imediata necessária.
                    </strong>

                    <span>
                        Continue monitorando a evolução das competências.
                    </span>

                </div>

            `;

        }


        const lista =
            competencias.slice(
                0,
                6
            );


        return `

            <div class="td-plano-grid">

                ${lista.map(
                    item => {

                        const prioridade =
                            this.classificarPrioridade(
                                item
                            );


                        const recomendacao =
                            this.gerarRecomendacao(
                                item
                            );


                        const areas =
                            Array.from(
                                item.areas || []
                            );


                        const cargos =
                            Array.from(
                                item.cargos || []
                            );


                        return `

                            <div class="td-plano-item">

                                <div class="td-plano-topo">

                                    <div>

                                        <span class="td-plano-label">
                                            COMPETÊNCIA
                                        </span>

                                        <h4>

                                            ${this.escaparHTML(
                                                item.nome
                                            )}

                                        </h4>

                                    </div>


                                    <span
                                        class="td-prioridade-badge ${prioridade.classe}">

                                        ${prioridade.icone}
                                        ${prioridade.nome}

                                    </span>

                                </div>


                                <div class="td-plano-metricas">

                                    <div>

                                        <strong>
                                            ${item.pessoas}
                                        </strong>

                                        <span>
                                            pessoas
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            ${this.formatarNumero(
                                                item.gapMedio
                                            )}
                                        </strong>

                                        <span>
                                            GAP médio
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            ${item.areasQtd}
                                        </strong>

                                        <span>
                                            área(s)
                                        </span>

                                    </div>

                                </div>


                                <div class="td-plano-detalhes">

                                    <p>

                                        <strong>
                                            Área(s):
                                        </strong>

                                        ${areas.length
                                            ? areas.map(
                                                area =>
                                                    this.escaparHTML(
                                                        area
                                                    )
                                              ).join(", ")
                                            : "Não informada"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Cargo(s):
                                        </strong>

                                        ${cargos.length
                                            ? cargos.map(
                                                cargo =>
                                                    this.escaparHTML(
                                                        cargo
                                                    )
                                              ).join(", ")
                                            : "Não informado"
                                        }

                                    </p>

                                </div>


                                <div class="td-plano-acao">

                                    <strong>
                                        Próximo passo
                                    </strong>

                                    <span>
                                        ${recomendacao.acao}
                                    </span>

                                </div>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    },


    // =========================================================
    // CARGOS
    // =========================================================

    renderRankingCargos(
        cargos
    ) {

        if (
            !cargos ||
            cargos.length === 0
        ) {

            return `

                <div class="td-vazio">

                    Nenhum cargo com GAP identificado.

                </div>

            `;

        }


        return `

            <div class="td-tabela-wrapper">

                <table class="td-tabela">

                    <thead>

                        <tr>

                            <th>
                                Cargo
                            </th>

                            <th>
                                Colaboradores
                            </th>

                            <th>
                                GAPs
                            </th>

                            <th>
                                GAP médio
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${cargos.slice(
                            0,
                            10
                        ).map(
                            cargo => `

                                <tr>

                                    <td>

                                        <strong>

                                            ${this.escaparHTML(
                                                cargo.nome
                                            )}

                                        </strong>

                                    </td>


                                    <td>
                                        ${cargo.pessoas}
                                    </td>


                                    <td>
                                        ${cargo.gaps}
                                    </td>


                                    <td>

                                        <span class="td-badge">

                                            ${this.formatarNumero(
                                                cargo.gapMedio
                                            )}

                                        </span>

                                    </td>

                                </tr>

                            `
                        ).join("")}

                    </tbody>

                </table>

            </div>

        `;

    },


    // =========================================================
    // RECOMENDAÇÃO
    // =========================================================

    gerarRecomendacao(
        item
    ) {

        // =====================================================
        // PRIORIDADE ALTA
        // =====================================================

        if (
            item.gapMedio >= 1.7 ||
            item.gapMaximo >= 3 ||
            item.criticos >= 3
        ) {

            return {

                prioridade:
                    "AÇÃO PRIORITÁRIA",

                icone:
                    "🔴",

                acao:
                    "Estruturar treinamento específico e realizar nova avaliação após a capacitação."

            };

        }


        // =====================================================
        // MUITAS PESSOAS
        // =====================================================

        if (
            item.pessoas >= 10
        ) {

            return {

                prioridade:
                    "AÇÃO EM ESCALA",

                icone:
                    "🟠",

                acao:
                    "Avaliar treinamento em escala ou trilha corporativa para atender o volume de colaboradores."

            };

        }


        // =====================================================
        // GAP MODERADO
        // =====================================================

        if (
            item.gapMedio >= 1
        ) {

            return {

                prioridade:
                    "AÇÃO DIRECIONADA",

                icone:
                    "🟡",

                acao:
                    "Avaliar reciclagem, prática acompanhada ou treinamento direcionado aos colaboradores impactados."

            };

        }


        // =====================================================
        // MONITORAMENTO
        // =====================================================

        return {

            prioridade:
                "MONITORAR",

            icone:
                "🟢",

            acao:
                "Monitorar a competência e verificar evolução na próxima avaliação."

        };

    },


    // =========================================================
    // CLASSIFICAR PRIORIDADE
    // =========================================================

    classificarPrioridade(
        item
    ) {

        if (
            item.gapMedio >= 1.7 ||
            item.gapMaximo >= 3 ||
            item.criticos >= 3
        ) {

            return {

                nome:
                    "Alta",

                classe:
                    "td-prioridade-alta",

                icone:
                    "🔴"

            };

        }


        if (
            item.gapMedio >= 1 ||
            item.pessoas >= 5 ||
            item.criticos >= 1
        ) {

            return {

                nome:
                    "Média",

                classe:
                    "td-prioridade-media",

                icone:
                    "🟠"

            };

        }


        return {

            nome:
                "Baixa",

            classe:
                "td-prioridade-baixa",

            icone:
                "🟢"

        };

    },


    // =========================================================
    // FORMATAR NÚMERO
    // =========================================================

    formatarNumero(
        valor
    ) {

        const numero =
            Number(
                valor
            ) || 0;


        return numero
            .toFixed(1)
            .replace(
                ".",
                ","
            );

    },


    // =========================================================
    // ESCAPAR HTML
    // =========================================================

    escaparHTML(
        valor
    ) {

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

    }

};