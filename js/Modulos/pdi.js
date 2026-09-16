const ModuloPDI = {

    // =====================================================
    // ABRIR
    // =====================================================

    abrir(usuario, banco) {

        if (usuario.perfil === "ADMIN") {

            this.relatorioGeral(
                usuario,
                banco
            );

        } else {

            this.pdiIndividual(
                usuario,
                banco
            );

        }

    },


    // =====================================================
    // RELATÓRIO GERAL - ADMIN
    // =====================================================

    relatorioGeral(usuario, banco) {

        const matrizesPorArea =
            banco.matrizesPorArea || {};

        let totalColaboradores = 0;
        let totalAvaliacoes = 0;
        let totalGap = 0;
        let somaScore = 0;

        let linhas = "";


        // =====================================================
        // PERCORRER TODAS AS ÁREAS
        // =====================================================

        Object.keys(
            matrizesPorArea
        ).forEach(
            nomeArea => {

                const area =
                    matrizesPorArea[
                        nomeArea
                    ];

                if (!area) {
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
                        : (
                            Array.isArray(
                                banco.habilidades
                            )
                                ? banco.habilidades
                                : []
                        );


                const avaliacoes =
                    area.avaliacoes || {};


                const matrizEsperada =
                    area.matrizEsperada || {};


                // =================================================
                // COLABORADORES
                // =================================================

                colaboradores.forEach(
                    colaborador => {

                        totalColaboradores++;


                        const esperado =
                            matrizEsperada[
                                colaborador.cargo
                            ] || [];


                        const registro =
                            avaliacoes[
                                colaborador.id
                            ];


                        let avaliacao = [];

                        let dataAvaliacao = "";


                        // =================================================
                        // NOVO FORMATO
                        // =================================================

                        if (
                            registro &&
                            !Array.isArray(registro) &&
                            typeof registro === "object"
                        ) {

                            avaliacao =
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : habilidades.map(
                                        () => 0
                                    );


                            dataAvaliacao =
                                registro.data || "";

                        }


                        // =================================================
                        // FORMATO ANTIGO
                        // =================================================

                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            avaliacao =
                                registro;

                        }


                        // =================================================
                        // SEM AVALIAÇÃO
                        // =================================================

                        else {

                            avaliacao =
                                habilidades.map(
                                    () => 0
                                );

                        }


                        // =================================================
                        // CÁLCULOS
                        // =================================================

                        let soma = 0;

                        let quantidadeNotas = 0;

                        let gap = 0;

                        let competenciasGap = [];


                        habilidades.forEach(
                            (
                                habilidade,
                                index
                            ) => {

                                const atual =
                                    Number(
                                        avaliacao[index]
                                    ) || 0;


                                const meta =
                                    Number(
                                        esperado[index]
                                    ) || 0;


                                soma += atual;

                                quantidadeNotas++;


                                if (
                                    meta > atual
                                ) {

                                    gap +=
                                        meta - atual;


                                    competenciasGap.push(
                                        this.obterNomeCompetencia(
                                            habilidade
                                        )
                                    );

                                }

                            }
                        );


                        // =================================================
                        // SCORE
                        // =================================================

                        const score =
                            quantidadeNotas > 0
                                ? Number(
                                    (
                                        soma /
                                        quantidadeNotas
                                    ).toFixed(2)
                                )
                                : 0;


                        // =================================================
                        // ATINGIMENTO
                        // =================================================

                        let totalMeta = 0;

                        let totalAtual = 0;


                        habilidades.forEach(
                            (
                                habilidade,
                                index
                            ) => {

                                const meta =
                                    Number(
                                        esperado[index]
                                    ) || 0;


                                const atual =
                                    Number(
                                        avaliacao[index]
                                    ) || 0;


                                if (
                                    meta > 0
                                ) {

                                    totalMeta +=
                                        meta;


                                    totalAtual +=
                                        Math.min(
                                            atual,
                                            meta
                                        );

                                }

                            }
                        );


                        const atingimento =
                            totalMeta > 0
                                ? Number(
                                    (
                                        totalAtual /
                                        totalMeta *
                                        100
                                    ).toFixed(2)
                                )
                                : 0;


                        // =================================================
                        // SITUAÇÃO
                        // =================================================

                        let situacao =
                            "Sem avaliação";


                        const possuiAvaliacao =
                            avaliacao.some(
                                nivel =>
                                    Number(
                                        nivel
                                    ) > 0
                            );


                        if (
                            possuiAvaliacao
                        ) {

                            totalAvaliacoes++;

                            somaScore +=
                                score;

                            totalGap +=
                                gap;


                            if (
                                atingimento >= 90
                            ) {

                                situacao =
                                    "Atingiu";

                            }

                            else if (
                                atingimento >= 70
                            ) {

                                situacao =
                                    "Atenção";

                            }

                            else {

                                situacao =
                                    "Crítico";

                            }

                        }


                        // =================================================
                        // DATA
                        // =================================================

                        let dataFormatada =
                            dataAvaliacao;


                        if (
                            dataAvaliacao &&
                            String(
                                dataAvaliacao
                            ).includes("-")
                        ) {

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

                        }


                        // =================================================
                        // LINHA DA TABELA
                        // =================================================

                        linhas += `

                            <tr>

                                <td>
                                    ${this.escapeHTML(
                                        nomeArea
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHTML(
                                        colaborador.nome || ""
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHTML(
                                        colaborador.cargo || ""
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHTML(
                                        dataFormatada || "-"
                                    )}
                                </td>

                                <td>
                                    ${score.toFixed(2)}
                                </td>

                                <td>
                                    ${atingimento.toFixed(2)}%
                                </td>

                                <td>
                                    ${this.escapeHTML(
                                        situacao
                                    )}
                                </td>

                                <td>
                                    ${gap}
                                </td>

                                <td>
                                    ${
                                        competenciasGap.length
                                            ? this.escapeHTML(
                                                competenciasGap.join(
                                                    ", "
                                                )
                                            )
                                            : "-"
                                    }
                                </td>

                            </tr>

                        `;

                    }
                );

            }
        );


        // =====================================================
        // SCORE MÉDIO
        // =====================================================

        const scoreMedio =
            totalAvaliacoes > 0
                ? (
                    somaScore /
                    totalAvaliacoes
                ).toFixed(2)
                : "0.00";


        // =====================================================
        // HTML
        // =====================================================

        const html = `

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
                                Administrador:
                                ${this.escapeHTML(
                                    usuario.nome || ""
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="acoes-topo">

                        <button
                            id="btnVoltarPDI"
                            class="btnSecundario"
                        >
                            ← Voltar
                        </button>

                    </div>

                </header>


                <section class="conteudo">


                    <!-- =================================================
                         RESUMO
                    ================================================== -->

                    <div class="dashboardCards">


                        <div class="card">

                            <h3>
                                👥 Colaboradores
                            </h3>

                            <strong>
                                ${totalColaboradores}
                            </strong>

                            <p>
                                Total cadastrado
                            </p>

                        </div>


                        <div class="card">

                            <h3>
                                📋 Avaliações
                            </h3>

                            <strong>
                                ${totalAvaliacoes}
                            </strong>

                            <p>
                                Colaboradores avaliados
                            </p>

                        </div>


                        <div class="card">

                            <h3>
                                ⭐ Score Médio
                            </h3>

                            <strong>
                                ${scoreMedio}
                            </strong>

                            <p>
                                Média das avaliações
                            </p>

                        </div>


                        <div class="card">

                            <h3>
                                ⚠️ GAP Total
                            </h3>

                            <strong>
                                ${totalGap}
                            </strong>

                            <p>
                                Necessidades identificadas
                            </p>

                        </div>


                    </div>


                    <!-- =================================================
                         EXPORTAÇÃO
                    ================================================== -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <h3>
                            📥 Exportar Relatórios
                        </h3>


                        <p>
                            Baixe os relatórios disponíveis
                            para análise do desenvolvimento
                            e consulta do catálogo de competências.
                        </p>


                        <div
                            style="
                                display:flex;
                                gap:10px;
                                flex-wrap:wrap;
                                margin-top:15px;
                                align-items:center;
                            "
                        >


                            <!-- =========================================
                                 BOTÃO RELATÓRIO DE DESENVOLVIMENTO
                            ========================================== -->

                            <button
                                id="btnExportarRelatorioPDI"
                                class="btnAcao"
                                style="
                                    width:330px;
                                    min-width:330px;
                                    height:44px;
                                    box-sizing:border-box;
                                    display:inline-flex;
                                    align-items:center;
                                    justify-content:center;
                                    margin:0;
                                "
                            >

                                📊 Baixar Relatório de Desenvolvimento

                            </button>


                            <!-- =========================================
                                 BOTÃO COMPETÊNCIAS E REGRAS
                            ========================================== -->

                            <button
                                id="btnExportarCompetenciasRegras"
                                class="btnAcao"
                                style="
                                    width:330px;
                                    min-width:330px;
                                    height:44px;
                                    box-sizing:border-box;
                                    display:inline-flex;
                                    align-items:center;
                                    justify-content:center;
                                    margin:0;
                                "
                            >

                                📚 Baixar Competências e Regras

                            </button>


                        </div>


                    </div>


                    <!-- =================================================
                         TABELA DE DESENVOLVIMENTO
                    ================================================== -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <h3>
                            Desenvolvimento por Colaborador
                        </h3>


                        <div
                            class="tabela-container"
                            style="
                                overflow-x:auto;
                                margin-top:15px;
                            "
                        >

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Área
                                        </th>

                                        <th>
                                            Colaborador
                                        </th>

                                        <th>
                                            Cargo
                                        </th>

                                        <th>
                                            Data da Avaliação
                                        </th>

                                        <th>
                                            Score
                                        </th>

                                        <th>
                                            Atingimento
                                        </th>

                                        <th>
                                            Situação
                                        </th>

                                        <th>
                                            GAP
                                        </th>

                                        <th>
                                            Competências GAP
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    ${
                                        linhas ||
                                        `
                                        <tr>

                                            <td
                                                colspan="9"
                                                style="
                                                    text-align:center;
                                                    padding:20px;
                                                "
                                            >

                                                Nenhum dado
                                                encontrado.

                                            </td>

                                        </tr>
                                        `
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>


                </section>

            </div>

        `;


        // =====================================================
        // CARREGAR
        // =====================================================

        UI.carregar(
            html
        );


        // =====================================================
        // BOTÃO VOLTAR
        // =====================================================

        const btnVoltar =
            document.getElementById(
                "btnVoltarPDI"
            );


        if (
            btnVoltar
        ) {

            btnVoltar.onclick = () => {

                ModuloAdmin.abrir(
                    usuario,
                    banco
                );

            };

        }


        // =====================================================
        // BOTÃO RELATÓRIO DESENVOLVIMENTO
        // =====================================================

        const btnExportar =
            document.getElementById(
                "btnExportarRelatorioPDI"
            );


        if (
            btnExportar
        ) {

            btnExportar.onclick = () => {

                this.exportarRelatorio(
                    banco
                );

            };

        }


        // =====================================================
        // BOTÃO COMPETÊNCIAS E REGRAS
        // =====================================================

        const btnCompetencias =
            document.getElementById(
                "btnExportarCompetenciasRegras"
            );


        if (
            btnCompetencias
        ) {

            btnCompetencias.onclick = () => {

                this.exportarCompetenciasRegras(
                    banco
                );

            };

        }

    },


    // =====================================================
    // EXPORTAR RELATÓRIO DE DESENVOLVIMENTO
    // =====================================================

    exportarRelatorio(banco) {

        const matrizesPorArea =
            banco.matrizesPorArea || {};


        const linhas = [];


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
                    ];


                if (
                    !area
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
                        : (
                            Array.isArray(
                                banco.habilidades
                            )
                                ? banco.habilidades
                                : []
                        );


                const avaliacoes =
                    area.avaliacoes || {};


                const matrizEsperada =
                    area.matrizEsperada || {};


                // =================================================
                // COLABORADORES
                // =================================================

                colaboradores.forEach(
                    colaborador => {

                        const esperado =
                            matrizEsperada[
                                colaborador.cargo
                            ] || [];


                        const registro =
                            avaliacoes[
                                colaborador.id
                            ];


                        let avaliacao = [];

                        let dataAvaliacao = "";


                        // =================================================
                        // NOVO FORMATO
                        // =================================================

                        if (
                            registro &&
                            !Array.isArray(registro) &&
                            typeof registro === "object"
                        ) {

                            avaliacao =
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : habilidades.map(
                                        () => 0
                                    );


                            dataAvaliacao =
                                registro.data || "";

                        }


                        // =================================================
                        // FORMATO ANTIGO
                        // =================================================

                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            avaliacao =
                                registro;

                        }


                        // =================================================
                        // SEM AVALIAÇÃO
                        // =================================================

                        else {

                            avaliacao =
                                habilidades.map(
                                    () => 0
                                );

                        }


                        // =================================================
                        // DATA
                        // =================================================

                        let dataFormatada =
                            dataAvaliacao;


                        if (
                            dataAvaliacao &&
                            String(
                                dataAvaliacao
                            ).includes("-")
                        ) {

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
                                        avaliacao[index]
                                    ) || 0;


                                const gap =
                                    Math.max(
                                        0,
                                        nivelEsperado -
                                        nivelAtual
                                    );


                                linhas.push([

                                    nomeArea,

                                    colaborador.nome ||
                                    "",

                                    colaborador.cargo ||
                                    "",

                                    this.obterNomeCompetencia(
                                        habilidade
                                    ),

                                    nivelEsperado,

                                    nivelAtual,

                                    gap,

                                    dataFormatada

                                ]);

                            }
                        );

                    }
                );

            }
        );


        // =====================================================
        // CABEÇALHO
        // =====================================================

        const cabecalho = [

            "Área",

            "Colaborador",

            "Cargo",

            "Habilidade",

            "Nível Esperado",

            "Nível Atual",

            "GAP",

            "Data da Avaliação"

        ];


        // =====================================================
        // GERAR CSV
        // =====================================================

        let csv =
            cabecalho
                .map(
                    valor =>
                        this.formatarCSV(
                            valor
                        )
                )
                .join(";") +
            "\n";


        linhas.forEach(
            linha => {

                csv +=
                    linha
                        .map(
                            valor =>
                                this.formatarCSV(
                                    valor
                                )
                        )
                        .join(";") +
                    "\n";

            }
        );


        // =====================================================
        // DOWNLOAD
        // =====================================================

        this.baixarCSV(

            csv,

            "Relatorio_Desenvolvimento.csv"

        );

    },


    // =====================================================
    // EXPORTAR COMPETÊNCIAS E REGRAS
    // =====================================================

    exportarCompetenciasRegras(banco) {

        const mapa =
            new Map();


        // =====================================================
        // NORMALIZAR NOME
        // =====================================================

        const normalizarNome =
            valor => {

                if (
                    valor === null ||
                    valor === undefined
                ) {

                    return "";

                }


                return String(
                    valor
                )
                    .normalize(
                        "NFD"
                    )
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .trim()
                    .toLowerCase();

            };


        // =====================================================
        // OBTER NOME
        // =====================================================

        const obterNome =
            competencia => {

                // ---------------------------------------------
                // Texto
                // ---------------------------------------------

                if (
                    typeof competencia === "string"
                ) {

                    return competencia.trim();

                }


                // ---------------------------------------------
                // Objeto
                // ---------------------------------------------

                if (
                    competencia &&
                    typeof competencia === "object"
                ) {

                    return (

                        competencia.competencia ||

                        competencia.nome ||

                        competencia.habilidade ||

                        competencia.titulo ||

                        competencia["Competência"] ||

                        ""

                    )
                        .toString()
                        .trim();

                }


                return "";

            };


        // =====================================================
        // LOCALIZAR DETALHES NO CATÁLOGO
        // =====================================================

        const localizarDetalhes =
            nome => {

                if (
                    !nome
                ) {

                    return {};

                }


                const detalhes =
                    banco.detalhesHabilidades;


                if (
                    !detalhes ||
                    typeof detalhes !== "object"
                ) {

                    return {};

                }


                // ---------------------------------------------
                // 1. Busca exata
                // ---------------------------------------------

                if (
                    detalhes[nome]
                ) {

                    return detalhes[
                        nome
                    ];

                }


                // ---------------------------------------------
                // 2. Busca normalizada
                // ---------------------------------------------

                const chave =
                    normalizarNome(
                        nome
                    );


                const encontrada =
                    Object.keys(
                        detalhes
                    ).find(
                        chaveBanco =>
                            normalizarNome(
                                chaveBanco
                            ) === chave
                    );


                if (
                    encontrada
                ) {

                    return detalhes[
                        encontrada
                    ];

                }


                return {};

            };


        // =====================================================
        // NORMALIZAR DETALHES
        // =====================================================

        const normalizarDetalhes =
            (
                competencia,
                detalhes
            ) => {

                let dados =
                    detalhes || {};


                // Se a competência é um objeto
                // e já contém as regras.

                if (
                    competencia &&
                    typeof competencia === "object"
                ) {

                    dados = {

                        ...competencia,

                        ...dados

                    };

                }


                const niveis =
                    dados.niveis &&
                    typeof dados.niveis === "object"
                        ? dados.niveis
                        : {};


                return {

                    definicao:
                        dados.definicao ||

                        dados.definição ||

                        dados["Definição"] ||

                        "",


                    nivel1:
                        niveis[1] ||

                        niveis["1"] ||

                        dados.nivel1 ||

                        dados["Nível 1"] ||

                        dados["Nivel 1"] ||

                        dados.nivel_1 ||

                        "",


                    nivel2:
                        niveis[2] ||

                        niveis["2"] ||

                        dados.nivel2 ||

                        dados["Nível 2"] ||

                        dados["Nivel 2"] ||

                        dados.nivel_2 ||

                        "",


                    nivel3:
                        niveis[3] ||

                        niveis["3"] ||

                        dados.nivel3 ||

                        dados["Nível 3"] ||

                        dados["Nivel 3"] ||

                        dados.nivel_3 ||

                        "",


                    nivel4:
                        niveis[4] ||

                        niveis["4"] ||

                        dados.nivel4 ||

                        dados["Nível 4"] ||

                        dados["Nivel 4"] ||

                        dados.nivel_4 ||

                        ""

                };

            };


        // =====================================================
        // ADICIONAR COMPETÊNCIA
        // =====================================================

        const adicionarCompetencia =
            competencia => {

                const nome =
                    obterNome(
                        competencia
                    );


                if (
                    !nome
                ) {

                    return;

                }


                const chave =
                    normalizarNome(
                        nome
                    );


                if (
                    !chave
                ) {

                    return;

                }


                // ---------------------------------------------
                // Detalhes do próprio objeto
                // ---------------------------------------------

                let detalhes =
                    (
                        competencia &&
                        typeof competencia === "object"
                    )
                        ? competencia
                        : null;


                // ---------------------------------------------
                // Procurar no catálogo
                // ---------------------------------------------

                const detalhesCatalogo =
                    localizarDetalhes(
                        nome
                    );


                // ---------------------------------------------
                // Combinar informações
                // ---------------------------------------------

                const dados =
                    normalizarDetalhes(

                        competencia,

                        {

                            ...detalhesCatalogo,

                            ...(detalhes || {})

                        }

                    );


                // ---------------------------------------------
                // Criar registro
                // ---------------------------------------------

                if (
                    !mapa.has(
                        chave
                    )
                ) {

                    mapa.set(
                        chave,
                        {

                            competencia:
                                nome,

                            definicao:
                                dados.definicao,

                            nivel1:
                                dados.nivel1,

                            nivel2:
                                dados.nivel2,

                            nivel3:
                                dados.nivel3,

                            nivel4:
                                dados.nivel4

                        }
                    );


                    return;

                }


                // ---------------------------------------------
                // Completar registro existente
                // ---------------------------------------------

                const registro =
                    mapa.get(
                        chave
                    );


                if (
                    !registro.definicao &&
                    dados.definicao
                ) {

                    registro.definicao =
                        dados.definicao;

                }


                if (
                    !registro.nivel1 &&
                    dados.nivel1
                ) {

                    registro.nivel1 =
                        dados.nivel1;

                }


                if (
                    !registro.nivel2 &&
                    dados.nivel2
                ) {

                    registro.nivel2 =
                        dados.nivel2;

                }


                if (
                    !registro.nivel3 &&
                    dados.nivel3
                ) {

                    registro.nivel3 =
                        dados.nivel3;

                }


                if (
                    !registro.nivel4 &&
                    dados.nivel4
                ) {

                    registro.nivel4 =
                        dados.nivel4;

                }

            };


        // =====================================================
        // 1. CATÁLOGO GLOBAL
        // =====================================================

        if (
            Array.isArray(
                banco.habilidades
            )
        ) {

            banco.habilidades.forEach(
                habilidade => {

                    adicionarCompetencia(
                        habilidade
                    );

                }
            );

        }


        // =====================================================
        // 2. DETALHES DO CATÁLOGO GLOBAL
        // =====================================================

        if (
            banco.detalhesHabilidades &&
            typeof banco.detalhesHabilidades === "object"
        ) {

            Object.keys(
                banco.detalhesHabilidades
            ).forEach(
                nome => {

                    adicionarCompetencia(
                        {

                            competencia:
                                nome,

                            ...(
                                banco.detalhesHabilidades[
                                    nome
                                ] || {}
                            )

                        }
                    );

                }
            );

        }


        // =====================================================
        // 3. COMPETÊNCIAS DAS MATRIZES
        // =====================================================

        const matrizesPorArea =
            banco.matrizesPorArea || {};


        Object.keys(
            matrizesPorArea
        ).forEach(
            nomeArea => {

                const area =
                    matrizesPorArea[
                        nomeArea
                    ];


                if (
                    !area
                ) {

                    return;

                }


                // ---------------------------------------------
                // Habilidades da área
                // ---------------------------------------------

                if (
                    Array.isArray(
                        area.habilidades
                    )
                ) {

                    area.habilidades.forEach(
                        habilidade => {

                            let competencia =
                                habilidade;


                            // ---------------------------------
                            // Caso seja objeto
                            // ---------------------------------

                            if (
                                habilidade &&
                                typeof habilidade === "object"
                            ) {

                                adicionarCompetencia(
                                    habilidade
                                );

                            }

                            else {

                                // ---------------------------------
                                // Procurar detalhes da área
                                // ---------------------------------

                                let detalhesArea =
                                    null;


                                if (
                                    area.detalhesHabilidades &&
                                    typeof area.detalhesHabilidades === "object"
                                ) {

                                    const nome =
                                        obterNome(
                                            habilidade
                                        );


                                    if (
                                        area.detalhesHabilidades[
                                            nome
                                        ]
                                    ) {

                                        detalhesArea =
                                            area.detalhesHabilidades[
                                                nome
                                            ];

                                    }

                                }


                                // ---------------------------------
                                // Combinar objeto
                                // ---------------------------------

                                if (
                                    detalhesArea
                                ) {

                                    competencia = {

                                        competencia:
                                            habilidade,

                                        ...detalhesArea

                                    };

                                }


                                adicionarCompetencia(
                                    competencia
                                );

                            }

                        }
                    );

                }


                // ---------------------------------------------
                // Detalhes específicos da área
                // ---------------------------------------------

                if (
                    area.detalhesHabilidades &&
                    typeof area.detalhesHabilidades === "object"
                ) {

                    Object.keys(
                        area.detalhesHabilidades
                    ).forEach(
                        nome => {

                            adicionarCompetencia(
                                {

                                    competencia:
                                        nome,

                                    ...(
                                        area.detalhesHabilidades[
                                            nome
                                        ] || {}
                                    )

                                }
                            );

                        }
                    );

                }

            }
        );


        // =====================================================
        // NENHUMA COMPETÊNCIA
        // =====================================================

        if (
            mapa.size === 0
        ) {

            alert(
                "Nenhuma competência encontrada para exportação."
            );

            return;

        }


        // =====================================================
        // ORDENAR
        // =====================================================

        const registros =
            Array.from(
                mapa.values()
            )
            .sort(
                (
                    a,
                    b
                ) => {

                    return a.competencia.localeCompare(
                        b.competencia,
                        "pt-BR",
                        {
                            sensitivity:
                                "base"
                        }
                    );

                }
            );


        // =====================================================
        // CABEÇALHO
        //
        // SOMENTE AS INFORMAÇÕES NECESSÁRIAS
        // =====================================================

        const cabecalho = [

            "Competência",

            "Definição",

            "Nível 1",

            "Nível 2",

            "Nível 3",

            "Nível 4"

        ];


        // =====================================================
        // CSV
        // =====================================================

        let csv =
            cabecalho
                .map(
                    valor =>
                        this.formatarCSV(
                            valor
                        )
                )
                .join(";") +
            "\n";


        // =====================================================
        // DADOS
        // =====================================================

        registros.forEach(
            registro => {

                csv += [

                    registro.competencia,

                    registro.definicao,

                    registro.nivel1,

                    registro.nivel2,

                    registro.nivel3,

                    registro.nivel4

                ]
                    .map(
                        valor =>
                            this.formatarCSV(
                                valor
                            )
                    )
                    .join(";") +

                    "\n";

            }
        );


        // =====================================================
        // DOWNLOAD
        // =====================================================

        this.baixarCSV(

            csv,

            "Competencias_e_Regras.csv"

        );


        // =====================================================
        // CONFIRMAÇÃO
        // =====================================================

        alert(
            `${registros.length} competência(s) exportada(s) com sucesso.`
        );

    },


    // =====================================================
    // OBTER NOME DA COMPETÊNCIA
    // =====================================================

    obterNomeCompetencia(
        competencia
    ) {

        if (
            typeof competencia === "string"
        ) {

            return competencia;

        }


        if (
            competencia &&
            typeof competencia === "object"
        ) {

            return (

                competencia.competencia ||

                competencia.nome ||

                competencia.habilidade ||

                competencia.titulo ||

                competencia["Competência"] ||

                ""

            );

        }


        return "";

    },


    // =====================================================
    // BAIXAR CSV
    // =====================================================

    baixarCSV(
        csv,
        nomeArquivo
    ) {

        const blob =
            new Blob(
                [
                    "\ufeff" +
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            nomeArquivo;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            100
        );

    },


    // =====================================================
    // FORMATAR CSV
    // =====================================================

    formatarCSV(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return '""';

        }


        return (

            '"' +

            String(
                valor
            )
                .replace(
                    /"/g,
                    '""'
                )
                .replace(
                    /\r?\n|\r/g,
                    " "
                )
                .trim() +

            '"'

        );

    },


    // =====================================================
    // SEGURANÇA HTML
    // =====================================================

    escapeHTML(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(
            valor
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
    // PDI INDIVIDUAL
    // =====================================================

    pdiIndividual(
        usuario,
        banco
    ) {

        // Mantido para compatibilidade.
        // O gestor continua utilizando
        // o Dashboard.

        mostrarDashboard(
            usuario
        );

    }

};