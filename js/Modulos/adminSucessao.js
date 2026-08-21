const ModuloAdminSucessao = {

    // =====================================================
    // ABRIR PAINEL ESTRATÉGICO DE SUCESSÃO
    // =====================================================

    abrir(usuario, banco) {


        // =================================================
        // GARANTIR ESTRUTURA
        // =================================================

        const matrizesPorArea =
            banco.matrizesPorArea || {};


        // =================================================
        // BUSCAR TODAS AS AVALIAÇÕES DE SUCESSÃO
        // =================================================

        function buscarAvaliacoes() {

            const lista = [];


            Object.entries(
                matrizesPorArea
            )
            .forEach(
                ([nomeAreaOrigem, area]) => {

                    const colaboradores =
                        Array.isArray(
                            area.colaboradores
                        )
                            ? area.colaboradores
                            : [];


                    const avaliacoesSucessao =
                        area.avaliacoesSucessao &&
                        typeof area.avaliacoesSucessao ===
                            "object"
                            ? area.avaliacoesSucessao
                            : {};


                    Object.entries(
                        avaliacoesSucessao
                    )
                    .forEach(
                        ([
                            chave,
                            avaliacao
                        ]) => {

                            if (
                                !avaliacao ||
                                typeof avaliacao !==
                                    "object"
                            ) {

                                return;

                            }


                            const colaborador =
                                colaboradores.find(
                                    item =>
                                        String(
                                            item.id
                                        ).trim() ===
                                        String(
                                            avaliacao.colaboradorId
                                        ).trim()
                                );


                            lista.push({

                                chave,

                                areaOrigem:
                                    nomeAreaOrigem,


                                colaboradorId:
                                    avaliacao.colaboradorId ||
                                    "",


                                colaborador:
                                    colaborador
                                        ? colaborador.nome
                                        : "Colaborador não encontrado",


                                cargoAtual:
                                    colaborador
                                        ? (
                                            colaborador.cargo ||
                                            "-"
                                        )
                                        : "-",


                                cargoAlvo:
                                    avaliacao.cargoAlvo ||
                                    "-",


                                areaCargoAlvo:
                                    avaliacao.areaCargoAlvo ||
                                    nomeAreaOrigem,


                                aderencia:
                                    Number(
                                        avaliacao.aderencia
                                    ) || 0,


                                quantidadeGaps:
                                    Number(
                                        avaliacao.quantidadeGaps
                                    ) || 0,


                                prontidao:
                                    avaliacao.prontidao ||
                                    "Em desenvolvimento",


                                observacao:
                                    avaliacao.observacao ||
                                    "",


                                data:
                                    avaliacao.data ||
                                    "",


                                competencias:
                                    avaliacao.competencias ||
                                    {}

                            });

                        }
                    );

                }
            );


            return lista;

        }


        // =================================================
        // BUSCAR TODOS OS CARGOS CADASTRADOS
        // =================================================

        function buscarCargos() {

            const lista = [];


            Object.entries(
                matrizesPorArea
            )
            .forEach(
                ([nomeArea, area]) => {

                    const cargos =
                        Array.isArray(
                            area.cargos
                        )
                            ? area.cargos
                            : [];


                    cargos.forEach(
                        cargo => {

                            lista.push({

                                area:
                                    nomeArea,

                                cargo:
                                    cargo

                            });

                        }
                    );

                }
            );


            return lista;

        }


        // =================================================
        // BUSCAR COMPETÊNCIAS DO CARGO ALVO
        // =================================================

        function buscarCompetenciasCargo(
            nomeArea,
            cargo
        ) {

            const area =
                matrizesPorArea[
                    nomeArea
                ];


            if (!area) {

                return [];

            }


            const habilidades =
                Array.isArray(
                    area.habilidades
                )
                    ? area.habilidades
                    : [];


            const matrizEsperada =
                area.matrizEsperada ||
                {};


            const niveis =
                Array.isArray(
                    matrizEsperada[
                        cargo
                    ]
                )
                    ? matrizEsperada[
                        cargo
                    ]
                    : [];


            const competencias = [];


            habilidades.forEach(
                (
                    habilidade,
                    index
                ) => {

                    const esperado =
                        Number(
                            niveis[index] ?? 0
                        );


                    if (
                        esperado > 0
                    ) {

                        competencias.push({

                            nome:
                                habilidade,

                            esperado:
                                esperado

                        });

                    }

                }
            );


            return competencias;

        }


        // =================================================
        // CLASSIFICAR ADERÊNCIA PARA O 9 BOX
        // =================================================

        function classificarAderencia(
            aderencia
        ) {

            const valor =
                Number(
                    aderencia
                ) || 0;


            if (
                valor >= 80
            ) {

                return "ALTA";

            }


            if (
                valor >= 60
            ) {

                return "MEDIA";

            }


            return "BAIXA";

        }


        // =================================================
        // CLASSIFICAR POTENCIAL PARA O 9 BOX
        // =================================================

        function classificarPotencial(
            prontidao
        ) {

            if (
                prontidao ===
                "Pronto agora"
            ) {

                return "ALTO";

            }


            if (
                prontidao ===
                "Pronto em até 1 ano"
            ) {

                return "ALTO";

            }


            if (
                prontidao ===
                "Pronto em até 2 anos"
            ) {

                return "MEDIO";

            }


            return "BAIXO";

        }


        // =================================================
        // CLASSIFICAÇÃO ESTRATÉGICA DO 9 BOX
        // =================================================

        function classificar9Box(
            aderencia,
            prontidao
        ) {

            const desempenho =
                classificarAderencia(
                    aderencia
                );


            const potencial =
                classificarPotencial(
                    prontidao
                );


            const chave =
                desempenho +
                "_" +
                potencial;


            const classificacoes = {

                "ALTA_ALTO":
                    "👑 Alta Prioridade",

                "ALTA_MEDIO":
                    "🌟 Forte Potencial",

                "ALTA_BAIXO":
                    "🎯 Especialista",

                "MEDIA_ALTO":
                    "🚀 Acelerar Desenvolvimento",

                "MEDIA_MEDIO":
                    "📈 Em Desenvolvimento",

                "MEDIA_BAIXO":
                    "🔧 Consolidar Competências",

                "BAIXA_ALTO":
                    "⚠️ Potencial com GAPs",

                "BAIXA_MEDIO":
                    "🛠️ Desenvolvimento Necessário",

                "BAIXA_BAIXO":
                    "🔴 Prioridade de Desenvolvimento"

            };


            return {

                desempenho,

                potencial,

                classificacao:
                    classificacoes[chave] ||
                    "Em avaliação"

            };

        }


        // =================================================
        // CALCULAR DADOS ESTRATÉGICOS
        // =================================================

        function calcularDados(
            areaFiltro = "TODAS"
        ) {

            let avaliacoes =
                buscarAvaliacoes();


            let cargos =
                buscarCargos();


            // =============================================
            // FILTRAR POR ÁREA
            // =============================================

            if (
                areaFiltro !== "TODAS"
            ) {

                avaliacoes =
                    avaliacoes.filter(
                        item =>

                            item.areaOrigem ===
                                areaFiltro ||

                            item.areaCargoAlvo ===
                                areaFiltro
                    );


                cargos =
                    cargos.filter(
                        item =>
                            item.area ===
                            areaFiltro
                    );

            }


            // =============================================
            // CONTADORES
            // =============================================

            const total =
                avaliacoes.length;


            const prontosAgora =
                avaliacoes.filter(
                    item =>
                        item.prontidao ===
                        "Pronto agora"
                ).length;


            const pronto1Ano =
                avaliacoes.filter(
                    item =>
                        item.prontidao ===
                        "Pronto em até 1 ano"
                ).length;


            const pronto2Anos =
                avaliacoes.filter(
                    item =>
                        item.prontidao ===
                        "Pronto em até 2 anos"
                ).length;


            const desenvolvimento =
                avaliacoes.filter(
                    item =>
                        item.prontidao ===
                        "Em desenvolvimento"
                ).length;


            // =============================================
            // MÉDIA DE ADERÊNCIA
            // =============================================

            const mediaAderencia =
                total > 0
                    ? Number(
                        (
                            avaliacoes.reduce(
                                (
                                    total,
                                    item
                                ) => {

                                    return total +
                                        (
                                            Number(
                                                item.aderencia
                                            ) || 0
                                        );

                                },
                                0
                            ) / total
                        )
                        .toFixed(1)
                    )
                    : 0;


            // =============================================
            // DADOS DO 9 BOX
            // =============================================

            const noveBox = {

                BAIXA_BAIXO: [],
                BAIXA_MEDIO: [],
                BAIXA_ALTO: [],

                MEDIA_BAIXO: [],
                MEDIA_MEDIO: [],
                MEDIA_ALTO: [],

                ALTA_BAIXO: [],
                ALTA_MEDIO: [],
                ALTA_ALTO: []

            };


            avaliacoes.forEach(
                avaliacao => {

                    const desempenho =
                        classificarAderencia(
                            avaliacao.aderencia
                        );


                    const potencial =
                        classificarPotencial(
                            avaliacao.prontidao
                        );


                    const chave =
                        desempenho +
                        "_" +
                        potencial;


                    if (
                        noveBox[chave]
                    ) {

                        noveBox[chave].push({

                            ...avaliacao,

                            classificacao:
                                classificar9Box(
                                    avaliacao.aderencia,
                                    avaliacao.prontidao
                                ).classificacao

                        });

                    }

                }
            );


            // =============================================
            // MAPA DE COBERTURA DOS CARGOS
            // =============================================

            const cobertura =
                cargos.map(
                    item => {

                        const sucessores =
                            avaliacoes.filter(
                                avaliacao =>

                                    avaliacao.cargoAlvo ===
                                        item.cargo &&

                                    avaliacao.areaCargoAlvo ===
                                        item.area
                            );


                        const quantidade =
                            sucessores.length;


                        let melhorAderencia =
                            0;


                        if (
                            quantidade > 0
                        ) {

                            melhorAderencia =
                                Math.max(
                                    ...sucessores.map(
                                        sucessor =>
                                            sucessor.aderencia
                                    )
                                );

                        }


                        const temProntoAgora =
                            sucessores.some(
                                sucessor =>
                                    sucessor.prontidao ===
                                    "Pronto agora"
                            );


                        let situacao =
                            "";


                        if (
                            quantidade === 0
                        ) {

                            situacao =
                                "🔴 Sem sucessor";

                        }
                        else if (
                            temProntoAgora
                        ) {

                            situacao =
                                "🟢 Coberto";

                        }
                        else if (
                            melhorAderencia >= 75
                        ) {

                            situacao =
                                "🟡 Em preparação";

                        }
                        else {

                            situacao =
                                "🔴 Alto risco";

                        }


                        return {

                            area:
                                item.area,

                            cargo:
                                item.cargo,

                            quantidade:
                                quantidade,

                            melhorAderencia:
                                melhorAderencia,

                            situacao:
                                situacao,

                            sucessores:
                                sucessores

                        };

                    }
                );


            // =============================================
            // CARGOS COM SUCESSORES
            // =============================================

            const cargosComSucessores =
                cobertura.filter(
                    item =>
                        item.quantidade > 0
                ).length;


            // =============================================
            // CARGOS SEM SUCESSORES
            // =============================================

            const cargosSemSucessores =
                cobertura.filter(
                    item =>
                        item.quantidade === 0
                ).length;


            // =============================================
            // PRINCIPAIS GAPS
            // =============================================

            const gaps = {};


            avaliacoes.forEach(
                avaliacao => {

                    const competencias =
                        buscarCompetenciasCargo(
                            avaliacao.areaCargoAlvo,
                            avaliacao.cargoAlvo
                        );


                    competencias.forEach(
                        competencia => {

                            const atual =
                                Number(
                                    avaliacao.competencias[
                                        competencia.nome
                                    ] ?? 0
                                );


                            const gap =
                                Math.max(
                                    0,
                                    competencia.esperado -
                                    atual
                                );


                            if (
                                gap > 0
                            ) {

                                if (
                                    !gaps[
                                        competencia.nome
                                    ]
                                ) {

                                    gaps[
                                        competencia.nome
                                    ] = {

                                        competencia:
                                            competencia.nome,

                                        quantidade:
                                            0,

                                        impacto:
                                            0

                                    };

                                }


                                gaps[
                                    competencia.nome
                                ].quantidade++;


                                gaps[
                                    competencia.nome
                                ].impacto +=
                                    gap;

                            }

                        }
                    );

                }
            );


            const rankingGaps =
                Object.values(
                    gaps
                )
                .sort(
                    (a, b) =>
                        b.impacto -
                        a.impacto
                );


            // =============================================
            // RANKING DE SUCESSORES
            // =============================================

            const rankingSucessores =
                [...avaliacoes]
                .sort(
                    (a, b) =>
                        b.aderencia -
                        a.aderencia
                );


            return {

                total,

                prontosAgora,

                pronto1Ano,

                pronto2Anos,

                desenvolvimento,

                mediaAderencia,

                cargosComSucessores,

                cargosSemSucessores,

                cobertura,

                rankingSucessores,

                rankingGaps,

                noveBox

            };

        }


        // =================================================
        // LISTA DE ÁREAS
        // =================================================

        const areas =
            Object.keys(
                matrizesPorArea
            )
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );


        // =================================================
        // FORMATAR DATA
        // =================================================

        function formatarData(
            data
        ) {

            if (!data) {

                return "-";

            }


            const dataObj =
                new Date(
                    data
                );


            if (
                Number.isNaN(
                    dataObj.getTime()
                )
            ) {

                return data;

            }


            return dataObj.toLocaleDateString(
                "pt-BR"
            );

        }


        // =================================================
        // GERAR CONTEÚDO DA CÉLULA DO 9 BOX
        // =================================================

        function gerarPessoas9Box(
            lista
        ) {

            if (
                !lista ||
                lista.length === 0
            ) {

                return `

                    <div
                        style="
                            font-size:11px;
                            opacity:0.55;
                            text-align:center;
                            padding:10px;
                        "
                    >

                        Nenhum sucessor

                    </div>

                `;

            }


            return lista
                .sort(
                    (a, b) =>
                        b.aderencia -
                        a.aderencia
                )
                .map(
                    item => `

                        <div
                            style="
                                padding:7px;
                                margin-bottom:6px;
                                border:1px solid rgba(255,255,255,0.12);
                                border-radius:6px;
                                font-size:11px;
                                line-height:1.3;
                            "
                        >

                            <strong>

                                ${item.colaborador}

                            </strong>


                            <div
                                style="
                                    margin-top:3px;
                                    opacity:0.75;
                                "
                            >

                                ${item.cargoAlvo}

                            </div>


                            <div
                                style="
                                    margin-top:3px;
                                    font-weight:bold;
                                "
                            >

                                ${item.aderencia.toFixed(1)}%

                            </div>

                        </div>

                    `
                )
                .join("");

        }


        // =================================================
        // RENDERIZAR PAINEL
        // =================================================

        function renderizar(
            areaFiltro = "TODAS"
        ) {

            const dados =
                calcularDados(
                    areaFiltro
                );


            // =============================================
            // OPÇÕES DAS ÁREAS
            // =============================================

            const opcoesAreas =
                areas
                    .map(
                        area => `

                            <option
                                value="${area}"
                                ${
                                    area === areaFiltro
                                        ? "selected"
                                        : ""
                                }
                            >

                                ${area}

                            </option>

                        `
                    )
                    .join("");


            // =============================================
            // TABELA DE COBERTURA
            // =============================================

            const tabelaCobertura =
                dados.cobertura
                    .map(
                        item => `

                            <tr>

                                <td>
                                    ${item.area}
                                </td>

                                <td>
                                    <strong>
                                        ${item.cargo}
                                    </strong>
                                </td>

                                <td>
                                    ${item.quantidade}
                                </td>

                                <td>
                                    ${item.melhorAderencia.toFixed(1)}%
                                </td>

                                <td>
                                    ${item.situacao}
                                </td>

                            </tr>

                        `
                    )
                    .join("") ||

                `

                    <tr>

                        <td colspan="5">

                            Nenhum cargo encontrado.

                        </td>

                    </tr>

                `;


            // =============================================
            // TABELA DE RANKING
            // =============================================

            const tabelaRanking =
                dados.rankingSucessores
                    .map(
                        (
                            item,
                            index
                        ) => `

                            <tr>

                                <td>
                                    ${index + 1}º
                                </td>

                                <td>
                                    <strong>
                                        ${item.colaborador}
                                    </strong>
                                </td>

                                <td>
                                    ${item.cargoAtual}
                                </td>

                                <td>
                                    ${item.cargoAlvo}
                                </td>

                                <td>
                                    ${item.areaCargoAlvo}
                                </td>

                                <td>
                                    ${item.aderencia.toFixed(1)}%
                                </td>

                                <td>
                                    ${item.quantidadeGaps}
                                </td>

                                <td>
                                    ${item.prontidao}
                                </td>

                                <td>
                                    ${formatarData(
                                        item.data
                                    )}
                                </td>

                            </tr>

                        `
                    )
                    .join("") ||

                `

                    <tr>

                        <td colspan="9">

                            Nenhum sucessor avaliado.

                        </td>

                    </tr>

                `;


            // =============================================
            // TABELA DE GAPS
            // =============================================

            const tabelaGaps =
                dados.rankingGaps
                    .slice(
                        0,
                        10
                    )
                    .map(
                        (
                            item,
                            index
                        ) => `

                            <tr>

                                <td>

                                    ${index + 1}º

                                </td>

                                <td>

                                    <strong>

                                        ${item.competencia}

                                    </strong>

                                </td>

                                <td>

                                    ${item.quantidade}

                                </td>

                                <td>

                                    ${item.impacto}

                                </td>

                            </tr>

                        `
                    )
                    .join("") ||

                `

                    <tr>

                        <td colspan="4">

                            Nenhum GAP identificado.

                        </td>

                    </tr>

                `;


            // =================================================
            // CARREGAR TELA
            // =================================================

            UI.carregar(`

                <div class="portal">


                    <!-- =========================================
                         CABEÇALHO
                    ========================================== -->

                    <header class="topo">

                        <div class="logo-area">

                            <div class="logo-box">

                                👑

                            </div>


                            <div>

                                <h2>

                                    Sucessão Estratégica

                                </h2>


                                <span>

                                    Visão global do pipeline
                                    de liderança e sucessão

                                </span>

                            </div>

                        </div>


                        <div class="acoes-topo">

                            <button
                                id="btnVoltarAdmin"
                                class="btnSecundario"
                            >

                                ← Administrativo

                            </button>

                        </div>

                    </header>


                    <section class="conteudo">


                        <!-- =====================================
                             FILTRO
                        ====================================== -->

                        <div class="card">

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:20px;
                                "
                            >

                                <div>

                                    <h3>

                                        Visão Executiva

                                    </h3>


                                    <p class="descricao">

                                        Analise a cobertura dos cargos,
                                        o nível de prontidão dos sucessores,
                                        os principais riscos estratégicos
                                        e a distribuição dos talentos
                                        no 9 Box.

                                    </p>

                                </div>


                                <div
                                    style="
                                        min-width:250px;
                                    "
                                >

                                    <label>

                                        Filtrar por área

                                    </label>


                                    <select
                                        id="filtroAreaSucessao"
                                    >

                                        <option
                                            value="TODAS"
                                            ${
                                                areaFiltro === "TODAS"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >

                                            Todas as áreas

                                        </option>

                                        ${opcoesAreas}

                                    </select>

                                </div>

                            </div>

                        </div>


                        <!-- =====================================
                             CARDS EXECUTIVOS
                        ====================================== -->

                        <div
                            style="
                                margin-top:20px;
                                display:grid;
                                grid-template-columns:
                                    repeat(7, minmax(0, 1fr));
                                gap:12px;
                                width:100%;
                            "
                        >


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    👥 Sucessores

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.total}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Avaliações realizadas

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    🟢 Prontos Agora

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.prontosAgora}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Disponíveis para sucessão

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    🟡 Até 1 Ano

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.pronto1Ano}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Em preparação

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    🔵 Até 2 Anos

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.pronto2Anos}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Pipeline de desenvolvimento

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    🔴 Desenvolvimento

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.desenvolvimento}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Necessitam evolução

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    🛡️ Cobertos

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.cargosComSucessores}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Cargos com sucessores

                                </p>

                            </div>


                            <div
                                class="card"
                                style="
                                    padding:15px 10px;
                                    min-height:145px;
                                    display:flex;
                                    flex-direction:column;
                                    justify-content:center;
                                    align-items:center;
                                    text-align:center;
                                    overflow:hidden;
                                "
                            >

                                <h3
                                    style="
                                        font-size:13px;
                                        margin:0 0 8px 0;
                                        line-height:1.2;
                                    "
                                >

                                    ⚠️ Sem Sucessor

                                </h3>


                                <strong
                                    style="
                                        font-size:28px;
                                        line-height:1;
                                    "
                                >

                                    ${dados.cargosSemSucessores}

                                </strong>


                                <p
                                    style="
                                        font-size:11px;
                                        margin:8px 0 0 0;
                                        line-height:1.25;
                                    "
                                >

                                    Risco de sucessão

                                </p>

                            </div>

                        </div>


                        <!-- =====================================
                             9 BOX
                        ====================================== -->

                        <div
                            class="card"
                            style="
                                margin-top:20px;
                            "
                        >

                            <div class="cabecalho-matriz">

                                <h3>

                                    🧭 9 Box de Sucessão

                                </h3>

                            </div>


                            <p class="descricao">

                                Posicionamento estratégico dos possíveis
                                sucessores considerando a aderência ao
                                cargo alvo e o potencial de sucessão.

                            </p>


                            <div
                                style="
                                    overflow-x:auto;
                                    margin-top:20px;
                                "
                            >

                                <div
                                    style="
                                        min-width:850px;
                                        display:grid;
                                        grid-template-columns:
                                            110px repeat(3, minmax(0, 1fr));
                                        grid-template-rows:
                                            40px repeat(3, minmax(150px, auto));
                                        gap:4px;
                                    "
                                >


                                    <!-- TOPO -->

                                    <div></div>


                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                        "
                                    >

                                        Baixo Potencial

                                    </div>


                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                        "
                                    >

                                        Médio Potencial

                                    </div>


                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                        "
                                    >

                                        Alto Potencial

                                    </div>


                                    <!-- ADERÊNCIA ALTA -->

                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                            writing-mode:
                                                vertical-rl;
                                            transform:
                                                rotate(180deg);
                                        "
                                    >

                                        Alta Aderência

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🎯 Especialista

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.ALTA_BAIXO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🌟 Forte Potencial

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.ALTA_MEDIO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            👑 Alta Prioridade

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.ALTA_ALTO
                                            )}

                                        </div>

                                    </div>


                                    <!-- ADERÊNCIA MÉDIA -->

                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                            writing-mode:
                                                vertical-rl;
                                            transform:
                                                rotate(180deg);
                                        "
                                    >

                                        Média Aderência

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🔧 Consolidar Competências

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.MEDIA_BAIXO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            📈 Em Desenvolvimento

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.MEDIA_MEDIO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🚀 Acelerar Desenvolvimento

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.MEDIA_ALTO
                                            )}

                                        </div>

                                    </div>


                                    <!-- ADERÊNCIA BAIXA -->

                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-weight:bold;
                                            writing-mode:
                                                vertical-rl;
                                            transform:
                                                rotate(180deg);
                                        "
                                    >

                                        Baixa Aderência

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🔴 Prioridade de Desenvolvimento

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.BAIXA_BAIXO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            🛠️ Desenvolvimento Necessário

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.BAIXA_MEDIO
                                            )}

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            border:1px solid
                                                rgba(255,255,255,0.12);
                                            border-radius:8px;
                                            padding:12px;
                                        "
                                    >

                                        <strong>

                                            ⚠️ Potencial com GAPs

                                        </strong>

                                        <div
                                            style="
                                                margin-top:10px;
                                            "
                                        >

                                            ${gerarPessoas9Box(
                                                dados.noveBox.BAIXA_ALTO
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div
                                class="legenda"
                                style="
                                    margin-top:20px;
                                "
                            >

                                <strong>

                                    Critérios:

                                </strong>

                                Aderência baixa:
                                abaixo de 60% |

                                Média:
                                60% a 79,9% |

                                Alta:
                                80% ou mais

                                <br><br>

                                Potencial baixo:
                                Em desenvolvimento |

                                Médio:
                                Pronto em até 2 anos |

                                Alto:
                                Pronto em até 1 ano
                                ou Pronto agora

                            </div>

                        </div>


                        <!-- =====================================
                             COBERTURA DOS CARGOS
                        ====================================== -->

                        <div
                            class="card"
                            style="
                                margin-top:20px;
                            "
                        >

                            <div class="cabecalho-matriz">

                                <h3>

                                    🛡️ Cobertura dos Cargos

                                </h3>

                            </div>


                            <p class="descricao">

                                Identifique quais cargos possuem
                                sucessores mapeados e onde existem
                                riscos de sucessão.

                            </p>


                            <div class="tabela-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Área
                                            </th>

                                            <th>
                                                Cargo
                                            </th>

                                            <th>
                                                Sucessores
                                            </th>

                                            <th>
                                                Melhor Aderência
                                            </th>

                                            <th>
                                                Situação
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        ${tabelaCobertura}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        <!-- =====================================
                             RANKING
                        ====================================== -->

                        <div
                            class="card"
                            style="
                                margin-top:20px;
                            "
                        >

                            <div class="cabecalho-matriz">

                                <h3>

                                    🏆 Ranking de Sucessores

                                </h3>

                            </div>


                            <p class="descricao">

                                Classificação dos possíveis
                                sucessores de acordo com
                                aderência e prontidão.

                            </p>


                            <div class="tabela-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Colaborador
                                            </th>

                                            <th>
                                                Cargo Atual
                                            </th>

                                            <th>
                                                Cargo Alvo
                                            </th>

                                            <th>
                                                Área Alvo
                                            </th>

                                            <th>
                                                Aderência
                                            </th>

                                            <th>
                                                GAPs
                                            </th>

                                            <th>
                                                Prontidão
                                            </th>

                                            <th>
                                                Avaliação
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        ${tabelaRanking}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        <!-- =====================================
                             PRINCIPAIS GAPS
                        ====================================== -->

                        <div
                            class="card"
                            style="
                                margin-top:20px;
                            "
                        >

                            <div class="cabecalho-matriz">

                                <h3>

                                    🎯 Principais GAPs Estratégicos

                                </h3>

                            </div>


                            <p class="descricao">

                                Competências que representam
                                os maiores GAPs para o pipeline
                                de sucessão e devem ser priorizadas
                                em ações de desenvolvimento.

                            </p>


                            <div class="tabela-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Ranking
                                            </th>

                                            <th>
                                                Competência
                                            </th>

                                            <th>
                                                Sucessores com GAP
                                            </th>

                                            <th>
                                                Impacto Total
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        ${tabelaGaps}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                    </section>

                </div>

            `);


            // =================================================
            // FILTRO POR ÁREA
            // =================================================

            const filtro =
                document.getElementById(
                    "filtroAreaSucessao"
                );


            if (
                filtro
            ) {

                filtro.onchange =
                    () => {

                        renderizar(
                            filtro.value
                        );

                    };

            }


            // =================================================
            // VOLTAR PARA ADMIN
            // =================================================

            const btnVoltarAdmin =
                document.getElementById(
                    "btnVoltarAdmin"
                );


            if (
                btnVoltarAdmin
            ) {

                btnVoltarAdmin.onclick =
                    () => {

                        ModuloAdmin.abrir(
                            usuario,
                            banco
                        );

                    };

            }

        }


        // =================================================
        // INICIAR TELA
        // =================================================

        renderizar();

    }

};