const ModuloSucessao = {

    abrir(usuario, banco) {


        // =====================================
        // ÁREA ATUAL DO USUÁRIO
        // =====================================

        const areaAtual =
            banco.matrizesPorArea?.[usuario.area];


        if (!areaAtual) {

            alert(
                "Área não encontrada no banco."
            );

            return;

        }


        // =====================================
        // GARANTIR ESTRUTURA DA ÁREA
        // =====================================

        if (!Array.isArray(areaAtual.colaboradores)) {

            areaAtual.colaboradores = [];

        }


        if (!areaAtual.avaliacoesSucessao) {

            areaAtual.avaliacoesSucessao = {};

        }


        const colaboradores =
            areaAtual.colaboradores;


        const avaliacoesSucessao =
            areaAtual.avaliacoesSucessao;


        // =====================================
        // BUSCAR TODOS OS CARGOS DE TODAS AS ÁREAS
        // E SUAS COMPETÊNCIAS
        // =====================================

        function buscarCargosGlobais() {

            const cargosGlobais = [];


            Object.entries(
                banco.matrizesPorArea || {}
            )
            .forEach(
                ([nomeArea, area]) => {

                    const cargos =
                        Array.isArray(area.cargos)
                            ? area.cargos
                            : [];


                    const habilidades =
                        Array.isArray(area.habilidades)
                            ? area.habilidades
                            : [];


                    const matrizEsperada =
                        area.matrizEsperada || {};


                    cargos.forEach(
                        cargo => {

                            const niveis =
                                Array.isArray(
                                    matrizEsperada[cargo]
                                )
                                    ? matrizEsperada[cargo]
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


                                    if (esperado > 0) {

                                        competencias.push({

                                            nome:
                                                habilidade,

                                            esperado

                                        });

                                    }

                                }
                            );


                            const idCargo =
                                encodeURIComponent(
                                    nomeArea
                                ) +
                                "|||" +
                                encodeURIComponent(
                                    cargo
                                );


                            cargosGlobais.push({

                                id:
                                    idCargo,

                                cargo,

                                area:
                                    nomeArea,

                                competencias

                            });

                        }
                    );

                }
            );


            cargosGlobais.sort(
                (a, b) => {

                    const resultadoArea =
                        a.area.localeCompare(
                            b.area,
                            "pt-BR"
                        );


                    if (
                        resultadoArea !== 0
                    ) {

                        return resultadoArea;

                    }


                    return a.cargo.localeCompare(
                        b.cargo,
                        "pt-BR"
                    );

                }
            );


            return cargosGlobais;

        }


        // =====================================
        // LISTA GLOBAL DE CARGOS
        // =====================================

        const cargosGlobais =
            buscarCargosGlobais();


        // =====================================
        // BUSCAR CARGO ALVO
        // =====================================

        function buscarCargoAlvo(
            idCargo
        ) {

            const idNormalizado =
                String(
                    idCargo || ""
                ).trim();


            return cargosGlobais.find(
                item =>
                    String(
                        item.id
                    ).trim() ===
                    idNormalizado
            );

        }


        // =====================================
        // CRIAR CHAVE DA AVALIAÇÃO
        // =====================================

        function criarChave(
            colaboradorId,
            idCargoAlvo
        ) {

            return (
                String(
                    colaboradorId
                ).trim() +
                "|||" +
                String(
                    idCargoAlvo
                ).trim()
            );

        }


        // =====================================
        // GARANTIR AVALIAÇÃO
        // =====================================

        function garantirAvaliacao(
            colaboradorId,
            idCargoAlvo
        ) {

            const chave =
                criarChave(
                    colaboradorId,
                    idCargoAlvo
                );


            const cargoAlvo =
                buscarCargoAlvo(
                    idCargoAlvo
                );


            if (!cargoAlvo) {

                return null;

            }


            if (
                !avaliacoesSucessao[chave]
            ) {

                avaliacoesSucessao[chave] = {

                    chave,

                    colaboradorId:
                        String(
                            colaboradorId
                        ).trim(),

                    cargoAlvo:
                        cargoAlvo.cargo,

                    areaCargoAlvo:
                        cargoAlvo.area,

                    competencias:
                        {},

                    aderencia:
                        0,

                    quantidadeGaps:
                        cargoAlvo.competencias.length,

                    prontidao:
                        "Em desenvolvimento",

                    // =====================================
                    // 9 BOX
                    // =====================================

                    performance:
                        0,

                    potencial:
                        0,

                    classificacao9Box:
                        "Não avaliado",

                    observacao:
                        "",

                    data:
                        null

                };

            }


            if (
                !avaliacoesSucessao[
                    chave
                ].competencias
            ) {

                avaliacoesSucessao[
                    chave
                ].competencias = {};

            }


            // =====================================
            // GARANTIR NOVOS CAMPOS
            // PARA AVALIAÇÕES ANTIGAS
            // =====================================

            if (
                avaliacoesSucessao[chave].performance ===
                undefined
            ) {

                avaliacoesSucessao[
                    chave
                ].performance = 0;

            }


            if (
                avaliacoesSucessao[chave].potencial ===
                undefined
            ) {

                avaliacoesSucessao[
                    chave
                ].potencial = 0;

            }


            if (
                !avaliacoesSucessao[
                    chave
                ].classificacao9Box
            ) {

                avaliacoesSucessao[
                    chave
                ].classificacao9Box =
                    "Não avaliado";

            }


            return avaliacoesSucessao[
                chave
            ];

        }


        // =====================================
        // CALCULAR RESULTADO
        // =====================================

        function calcularResultado(
            colaboradorId,
            idCargoAlvo
        ) {

            if (
                !colaboradorId ||
                !idCargoAlvo
            ) {

                return null;

            }


            const cargoAlvo =
                buscarCargoAlvo(
                    idCargoAlvo
                );


            if (!cargoAlvo) {

                return null;

            }


            const avaliacao =
                garantirAvaliacao(
                    colaboradorId,
                    idCargoAlvo
                );


            if (!avaliacao) {

                return null;

            }


            const competenciasAvaliadas =
                avaliacao.competencias ||
                {};


            let totalEsperado =
                0;


            let totalAtual =
                0;


            let quantidadeGaps =
                0;


            const gaps =
                [];


            cargoAlvo.competencias
                .forEach(
                    competencia => {

                        const nome =
                            competencia.nome;


                        const esperado =
                            Number(
                                competencia.esperado
                            );


                        const atual =
                            Number(
                                competenciasAvaliadas[
                                    nome
                                ] ?? 0
                            );


                        totalEsperado +=
                            esperado;


                        totalAtual +=
                            Math.min(
                                atual,
                                esperado
                            );


                        const gap =
                            Math.max(
                                0,
                                esperado - atual
                            );


                        if (gap > 0) {

                            quantidadeGaps++;


                            gaps.push({

                                competencia:
                                    nome,

                                atual,

                                esperado,

                                gap

                            });

                        }

                    }
                );


            let aderencia =
                0;


            if (
                totalEsperado > 0
            ) {

                aderencia =
                    (
                        totalAtual /
                        totalEsperado
                    ) * 100;

            }


            aderencia =
                Math.min(
                    100,
                    aderencia
                );


            aderencia =
                Number(
                    aderencia.toFixed(1)
                );


            // =================================
            // DEFINIR PRONTIDÃO
            // =================================

            let prontidao =
                "Em desenvolvimento";


            if (
                aderencia >= 90 &&
                quantidadeGaps === 0
            ) {

                prontidao =
                    "Pronto agora";

            }
            else if (
                aderencia >= 75
            ) {

                prontidao =
                    "Pronto em até 1 ano";

            }
            else if (
                aderencia >= 60
            ) {

                prontidao =
                    "Pronto em até 2 anos";

            }


            return {

                aderencia,

                quantidadeGaps,

                gaps,

                prontidao,

                totalAtual,

                totalEsperado

            };

        }


        // =====================================
        // CLASSIFICAÇÃO 9 BOX
        // =====================================

        function classificar9Box(
            performance,
            potencial
        ) {

            performance =
                Number(performance) || 0;


            potencial =
                Number(potencial) || 0;


            if (
                performance === 0 ||
                potencial === 0
            ) {

                return {

                    nome:
                        "Não avaliado",

                    linha:
                        0,

                    coluna:
                        0

                };

            }


            // =====================================
            // AGRUPAR 1 E 2 = BAIXO
            // 3 = MÉDIO
            // 4 = ALTO
            // =====================================

            let nivelPerformance =
                "baixo";


            let nivelPotencial =
                "baixo";


            if (performance === 3) {

                nivelPerformance =
                    "medio";

            }
            else if (performance >= 4) {

                nivelPerformance =
                    "alto";

            }


            if (potencial === 3) {

                nivelPotencial =
                    "medio";

            }
            else if (potencial >= 4) {

                nivelPotencial =
                    "alto";

            }


            const chave =
                nivelPotencial +
                "_" +
                nivelPerformance;


            const classificacoes = {


                // =================================
                // BAIXO POTENCIAL
                // =================================

                baixo_baixo: {

                    nome:
                        "Necessita desenvolvimento",

                    linha:
                        1,

                    coluna:
                        1

                },


                baixo_medio: {

                    nome:
                        "Contribuidor consistente",

                    linha:
                        1,

                    coluna:
                        2

                },


                baixo_alto: {

                    nome:
                        "Especialista de alto desempenho",

                    linha:
                        1,

                    coluna:
                        3

                },


                // =================================
                // MÉDIO POTENCIAL
                // =================================

                medio_baixo: {

                    nome:
                        "Desempenho a desenvolver",

                    linha:
                        2,

                    coluna:
                        1

                },


                medio_medio: {

                    nome:
                        "Talento em desenvolvimento",

                    linha:
                        2,

                    coluna:
                        2

                },


                medio_alto: {

                    nome:
                        "Alto desempenho e potencial",

                    linha:
                        2,

                    coluna:
                        3

                },


                // =================================
                // ALTO POTENCIAL
                // =================================

                alto_baixo: {

                    nome:
                        "Potencial a desenvolver",

                    linha:
                        3,

                    coluna:
                        1

                },


                alto_medio: {

                    nome:
                        "Alto potencial",

                    linha:
                        3,

                    coluna:
                        2

                },


                alto_alto: {

                    nome:
                        "Talento estratégico",

                    linha:
                        3,

                    coluna:
                        3

                }

            };


            return (
                classificacoes[chave] ||
                {

                    nome:
                        "Não avaliado",

                    linha:
                        0,

                    coluna:
                        0

                }
            );

        }


        // =====================================
        // GERAR TABELA DA AVALIAÇÃO
        // =====================================

        function gerarTabelaAvaliacao(
            colaboradorId,
            idCargoAlvo
        ) {

            if (
                !colaboradorId ||
                !idCargoAlvo
            ) {

                return `

                    <div class="footer">

                        Selecione um colaborador
                        e um cargo alvo.

                    </div>

                `;

            }


            const cargoAlvo =
                buscarCargoAlvo(
                    idCargoAlvo
                );


            if (!cargoAlvo) {

                return `

                    <div class="footer">

                        Cargo alvo não encontrado.

                    </div>

                `;

            }


            if (
                cargoAlvo.competencias.length === 0
            ) {

                return `

                    <div class="footer">

                        Este cargo não possui
                        competências com nível
                        esperado acima de 0.

                    </div>

                `;

            }


            const avaliacao =
                garantirAvaliacao(
                    colaboradorId,
                    idCargoAlvo
                );


            const competenciasAvaliadas =
                avaliacao.competencias ||
                {};


            let html = `

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>

                                    Competência

                                </th>

                                <th>

                                    Nível Atual

                                </th>

                                <th>

                                    Esperado

                                </th>

                                <th>

                                    GAP

                                </th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            cargoAlvo.competencias
                .forEach(
                    competencia => {

                        const nome =
                            competencia.nome;


                        const esperado =
                            Number(
                                competencia.esperado
                            );


                        const atual =
                            Number(
                                competenciasAvaliadas[
                                    nome
                                ] ?? 0
                            );


                        const gap =
                            Math.max(
                                0,
                                esperado - atual
                            );


                        html += `

                            <tr>

                                <td class="habilidade">

                                    ${nome}

                                </td>


                                <td>

                                    <select
                                        class="nivelSucessao"
                                        data-competencia="${encodeURIComponent(nome)}"
                                    >

                                        <option
                                            value="0"
                                            ${
                                                atual === 0
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            0
                                        </option>

                                        <option
                                            value="1"
                                            ${
                                                atual === 1
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            1
                                        </option>

                                        <option
                                            value="2"
                                            ${
                                                atual === 2
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            2
                                        </option>

                                        <option
                                            value="3"
                                            ${
                                                atual === 3
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            3
                                        </option>

                                        <option
                                            value="4"
                                            ${
                                                atual === 4
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            4
                                        </option>

                                    </select>

                                </td>


                                <td>

                                    <strong>

                                        ${esperado}

                                    </strong>

                                </td>


                                <td>

                                    ${gap}

                                </td>

                            </tr>

                        `;

                    }
                );


            html += `

                        </tbody>

                    </table>

                </div>

            `;


            return html;

        }


        // =====================================
        // GERAR MAPA DE SUCESSÃO
        // =====================================

        function gerarMapaSucessao() {

            const lista =
                Object.values(
                    avaliacoesSucessao
                );


            if (
                lista.length === 0
            ) {

                return `

                    <div class="footer">

                        Nenhum sucessor avaliado.

                    </div>

                `;

            }


            let html = `

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Colaborador</th>

                                <th>Cargo Atual</th>

                                <th>Cargo Alvo</th>

                                <th>Área</th>

                                <th>Aderência</th>

                                <th>GAPs</th>

                                <th>Prontidão</th>

                                <th>9 Box</th>

                                <th>Ações</th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            Object.entries(
                avaliacoesSucessao
            )
            .forEach(
                ([chave, avaliacao]) => {

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


                    if (!colaborador) {

                        return;

                    }


                    const classificacao =
                        classificar9Box(
                            avaliacao.performance,
                            avaliacao.potencial
                        );


                    html += `

                        <tr>

                            <td>

                                ${colaborador.nome}

                            </td>

                            <td>

                                ${
                                    colaborador.cargo ||
                                    "-"
                                }

                            </td>

                            <td>

                                ${
                                    avaliacao.cargoAlvo ||
                                    "-"
                                }

                            </td>

                            <td>

                                ${
                                    avaliacao.areaCargoAlvo ||
                                    "-"
                                }

                            </td>

                            <td>

                                ${
                                    Number(
                                        avaliacao.aderencia || 0
                                    ).toFixed(1)
                                }%

                            </td>

                            <td>

                                ${
                                    Number(
                                        avaliacao.quantidadeGaps || 0
                                    )
                                }

                            </td>

                            <td>

                                ${
                                    avaliacao.prontidao ||
                                    "Em desenvolvimento"
                                }

                            </td>

                            <td>

                                ${
                                    classificacao.nome
                                }

                            </td>

                            <td>

                                <button
                                    class="btnExcluirSucessao"
                                    data-chave="${encodeURIComponent(chave)}"
                                >

                                    🗑️

                                </button>

                            </td>

                        </tr>

                    `;

                }
            );


            html += `

                        </tbody>

                    </table>

                </div>

            `;


            return html;

        }


        // =====================================
        // GERAR 9 BOX
        // =====================================

        function gerar9Box() {


            const boxes = {

                "1-1": [],
                "1-2": [],
                "1-3": [],

                "2-1": [],
                "2-2": [],
                "2-3": [],

                "3-1": [],
                "3-2": [],
                "3-3": []

            };


            Object.values(
                avaliacoesSucessao
            )
            .forEach(
                avaliacao => {


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


                    if (!colaborador) {

                        return;

                    }


                    const classificacao =
                        classificar9Box(
                            avaliacao.performance,
                            avaliacao.potencial
                        );


                    if (
                        classificacao.linha === 0 ||
                        classificacao.coluna === 0
                    ) {

                        return;

                    }


                    const chaveBox =
                        classificacao.linha +
                        "-" +
                        classificacao.coluna;


                    boxes[chaveBox].push({

                        nome:
                            colaborador.nome,

                        cargo:
                            colaborador.cargo || "-",

                        cargoAlvo:
                            avaliacao.cargoAlvo || "-",

                        classificacao:
                            classificacao.nome

                    });

                }
            );


            function gerarBox(
                chave,
                titulo
            ) {


                const pessoas =
                    boxes[chave] || [];


                let pessoasHtml = "";


                if (
                    pessoas.length === 0
                ) {

                    pessoasHtml = `

                        <div
                            style="
                                font-size:12px;
                                opacity:.55;
                                margin-top:10px;
                            "
                        >

                            Nenhum colaborador

                        </div>

                    `;

                }
                else {

                    pessoas.forEach(
                        pessoa => {

                            pessoasHtml += `

                                <div
                                    style="
                                        background:rgba(255,255,255,.06);
                                        border-radius:8px;
                                        padding:8px;
                                        margin-top:8px;
                                        font-size:12px;
                                    "
                                >

                                    <strong>

                                        ${pessoa.nome}

                                    </strong>

                                    <br>

                                    <span
                                        style="
                                            opacity:.75;
                                        "
                                    >

                                        ${pessoa.cargo}

                                        →

                                        ${pessoa.cargoAlvo}

                                    </span>

                                </div>

                            `;

                        }
                    );

                }


                return `

                    <div
                        style="
                            min-height:160px;
                            border:1px solid rgba(255,255,255,.12);
                            border-radius:10px;
                            padding:12px;
                            box-sizing:border-box;
                        "
                    >

                        <strong
                            style="
                                font-size:13px;
                            "
                        >

                            ${titulo}

                        </strong>

                        ${pessoasHtml}

                    </div>

                `;

            }


            return `

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            80px
                            repeat(3, minmax(0, 1fr));
                        gap:10px;
                        align-items:stretch;
                        overflow-x:auto;
                    "
                >


                    <!-- CABEÇALHO -->

                    <div></div>

                    <div
                        style="
                            text-align:center;
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Performance Baixa

                    </div>

                    <div
                        style="
                            text-align:center;
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Performance Média

                    </div>

                    <div
                        style="
                            text-align:center;
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Performance Alta

                    </div>


                    <!-- ALTO POTENCIAL -->

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            writing-mode:vertical-rl;
                            transform:rotate(180deg);
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Alto Potencial

                    </div>

                    ${gerarBox(
                        "3-1",
                        "Potencial a desenvolver"
                    )}

                    ${gerarBox(
                        "3-2",
                        "Alto potencial"
                    )}

                    ${gerarBox(
                        "3-3",
                        "Talento estratégico"
                    )}


                    <!-- MÉDIO POTENCIAL -->

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            writing-mode:vertical-rl;
                            transform:rotate(180deg);
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Médio Potencial

                    </div>

                    ${gerarBox(
                        "2-1",
                        "Desempenho a desenvolver"
                    )}

                    ${gerarBox(
                        "2-2",
                        "Talento em desenvolvimento"
                    )}

                    ${gerarBox(
                        "2-3",
                        "Alto desempenho e potencial"
                    )}


                    <!-- BAIXO POTENCIAL -->

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            writing-mode:vertical-rl;
                            transform:rotate(180deg);
                            font-size:12px;
                            font-weight:bold;
                        "
                    >

                        Baixo Potencial

                    </div>

                    ${gerarBox(
                        "1-1",
                        "Necessita desenvolvimento"
                    )}

                    ${gerarBox(
                        "1-2",
                        "Contribuidor consistente"
                    )}

                    ${gerarBox(
                        "1-3",
                        "Especialista de alto desempenho"
                    )}

                </div>

            `;

        }


        // =====================================
        // TELA
        // =====================================

        UI.carregar(`

            <div class="portal">


                <header class="topo">

                    <div class="logo-area">

                        <div class="logo-box">

                            S

                        </div>


                        <div>

                            <h2>

                                Matriz de Sucessão

                            </h2>


                            <span>

                                Área:
                                ${usuario.area}

                            </span>

                        </div>

                    </div>


                    <div class="meta">

                        <small>

                            Sucessores avaliados

                        </small>


                        <div class="meta-edicao">

                            <strong>

                                ${
                                    Object.keys(
                                        avaliacoesSucessao
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>

                </header>


                <!-- MENU -->

                <nav class="menu">

                    <button
                        id="btnMatriz"
                    >

                        🎯 Matriz por Cargo

                    </button>


                    <button
                        id="btnColaboradores"
                    >

                        👥 Colaboradores

                    </button>


                    <button
                        id="btnAvaliacao"
                    >

                        📝 Avaliação

                    </button>


                    <button
                        id="btnSucessao"
                        class="ativo"
                    >

                        👑 Sucessão

                    </button>


                    <button
                        id="btnDashboard"
                    >

                        📊 Dashboard

                    </button>

                </nav>


                <section class="conteudo">


                    <!-- AVALIAÇÃO -->

                    <div class="card">

                        <div class="cabecalho-matriz">

                            <h3>

                                Avaliação de Sucessores

                            </h3>

                        </div>


                        <p class="descricao">

                            Selecione o colaborador e
                            o cargo alvo. Os cargos e
                            competências são buscados
                            automaticamente em todas
                            as áreas cadastradas.

                        </p>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(2, minmax(0, 1fr));
                                gap:20px;
                                margin-top:20px;
                                margin-bottom:20px;
                            "
                        >


                            <!-- COLABORADOR -->

                            <div>

                                <label>

                                    Colaborador

                                </label>


                                <select
                                    id="selectColaborador"
                                >

                                    <option value="">

                                        Selecione

                                    </option>

                                    ${
                                        colaboradores
                                            .map(
                                                colaborador => `

                                                    <option value="${colaborador.id}">

                                                        ${colaborador.nome}

                                                        ${
                                                            colaborador.cargo
                                                                ? " - " +
                                                                  colaborador.cargo
                                                                : ""
                                                        }

                                                    </option>

                                                `
                                            )
                                            .join("")
                                    }

                                </select>

                            </div>


                            <!-- CARGO ALVO -->

                            <div>

                                <label>

                                    Cargo Alvo

                                </label>


                                <select
                                    id="selectCargoAlvo"
                                >

                                    <option value="">

                                        Selecione

                                    </option>

                                    ${
                                        cargosGlobais
                                            .map(
                                                item => `

                                                    <option value="${item.id}">

                                                        ${item.cargo}
                                                        —
                                                        ${item.area}

                                                    </option>

                                                `
                                            )
                                            .join("")
                                    }

                                </select>

                            </div>

                        </div>


                        <!-- 9 BOX INPUTS -->

                        <div
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(2, minmax(0, 1fr));
                                gap:20px;
                                margin-bottom:25px;
                            "
                        >


                            <!-- PERFORMANCE -->

                            <div>

                                <label>

                                    Performance

                                </label>


                                <select
                                    id="selectPerformance"
                                >

                                    <option value="0">

                                        Selecione

                                    </option>

                                    <option value="1">

                                        1 - Baixa

                                    </option>

                                    <option value="2">

                                        2 - Em desenvolvimento

                                    </option>

                                    <option value="3">

                                        3 - Boa

                                    </option>

                                    <option value="4">

                                        4 - Alta

                                    </option>

                                </select>

                            </div>


                            <!-- POTENCIAL -->

                            <div>

                                <label>

                                    Potencial

                                </label>


                                <select
                                    id="selectPotencial"
                                >

                                    <option value="0">

                                        Selecione

                                    </option>

                                    <option value="1">

                                        1 - Baixo

                                    </option>

                                    <option value="2">

                                        2 - Em desenvolvimento

                                    </option>

                                    <option value="3">

                                        3 - Médio

                                    </option>

                                    <option value="4">

                                        4 - Alto

                                    </option>

                                </select>

                            </div>

                        </div>


                        <div
                            id="resultadoSucessao"
                        >

                            <div class="footer">

                                Selecione um colaborador
                                e um cargo alvo.

                            </div>

                        </div>

                    </div>


                    <!-- RESULTADO -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <h3>

                            Resultado da Avaliação

                        </h3>


                        <div
                            id="cardsSucessao"
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(4, minmax(0, 1fr));
                                gap:15px;
                                margin-top:20px;
                            "
                        >

                            <div class="footer">

                                Aguardando avaliação.

                            </div>

                        </div>

                    </div>


                    <!-- OBSERVAÇÃO -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <h3>

                            Observações

                        </h3>


                        <textarea
                            id="observacaoSucessao"
                            placeholder="Registre observações sobre o desenvolvimento do sucessor."
                            style="
                                width:100%;
                                min-height:100px;
                                margin-top:15px;
                            "
                        ></textarea>


                        <div
                            style="
                                display:flex;
                                justify-content:flex-end;
                                margin-top:15px;
                            "
                        >

                            <button
                                id="btnSalvarSucessao"
                            >

                                💾 Salvar Avaliação

                            </button>

                        </div>

                    </div>


                    <!-- MAPA -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <h3>

                            Mapa de Sucessão

                        </h3>


                        <p class="descricao">

                            Relação dos possíveis sucessores
                            avaliados na área.

                        </p>


                        <div
                            id="mapaSucessao"
                        >

                            ${gerarMapaSucessao()}

                        </div>

                    </div>


                    <!-- 9 BOX -->

                    <div
                        class="card"
                        style="
                            margin-top:20px;
                        "
                    >

                        <div class="cabecalho-matriz">

                            <h3>

                                9 Box da Área

                            </h3>

                        </div>


                        <p class="descricao">

                            Visão dos talentos da área
                            considerando Performance e
                            Potencial.

                        </p>


                        <div
                            style="
                                margin-top:25px;
                            "
                        >

                            <div
                                id="boxSucessao"
                            >

                                ${gerar9Box()}

                            </div>

                        </div>

                    </div>


                </section>

            </div>

        `);


        // =====================================
        // ELEMENTOS
        // =====================================

        const selectColaborador =
            document.getElementById(
                "selectColaborador"
            );


        const selectCargoAlvo =
            document.getElementById(
                "selectCargoAlvo"
            );


        const selectPerformance =
            document.getElementById(
                "selectPerformance"
            );


        const selectPotencial =
            document.getElementById(
                "selectPotencial"
            );


        const resultadoSucessao =
            document.getElementById(
                "resultadoSucessao"
            );


        const cardsSucessao =
            document.getElementById(
                "cardsSucessao"
            );


        const observacaoSucessao =
            document.getElementById(
                "observacaoSucessao"
            );


        // =====================================
        // ATUALIZAR RESULTADO
        // =====================================

        function atualizarResultado() {

            const colaboradorId =
                selectColaborador.value.trim();


            const idCargoAlvo =
                selectCargoAlvo.value.trim();


            if (
                !colaboradorId ||
                !idCargoAlvo
            ) {

                cardsSucessao.innerHTML = `

                    <div class="footer">

                        Aguardando avaliação.

                    </div>

                `;

                return;

            }


            const resultado =
                calcularResultado(
                    colaboradorId,
                    idCargoAlvo
                );


            if (!resultado) {

                cardsSucessao.innerHTML = `

                    <div class="footer">

                        Não foi possível calcular
                        o resultado.

                    </div>

                `;

                return;

            }


            const performance =
                Number(
                    selectPerformance.value
                ) || 0;


            const potencial =
                Number(
                    selectPotencial.value
                ) || 0;


            const classificacao =
                classificar9Box(
                    performance,
                    potencial
                );


            cardsSucessao.innerHTML = `

                <div
                    class="card"
                    style="margin:0"
                >

                    <small>

                        Aderência

                    </small>


                    <h2>

                        ${resultado.aderencia}%

                    </h2>

                </div>


                <div
                    class="card"
                    style="margin:0"
                >

                    <small>

                        GAPs

                    </small>


                    <h2>

                        ${resultado.quantidadeGaps}

                    </h2>

                </div>


                <div
                    class="card"
                    style="margin:0"
                >

                    <small>

                        Prontidão

                    </small>


                    <h2>

                        ${resultado.prontidao}

                    </h2>

                </div>


                <div
                    class="card"
                    style="margin:0"
                >

                    <small>

                        9 Box

                    </small>


                    <h2
                        style="
                            font-size:16px;
                        "
                    >

                        ${classificacao.nome}

                    </h2>

                </div>

            `;

        }


        // =====================================
        // CONFIGURAR NÍVEIS
        // =====================================

        function configurarEventosNiveis(
            colaboradorId,
            idCargoAlvo
        ) {

            document
                .querySelectorAll(
                    ".nivelSucessao"
                )
                .forEach(
                    select => {

                        select.onchange =
                            () => {

                                const competencia =
                                    decodeURIComponent(
                                        select.dataset.competencia
                                    );


                                const valor =
                                    Number(
                                        select.value
                                    );


                                const avaliacao =
                                    garantirAvaliacao(
                                        colaboradorId,
                                        idCargoAlvo
                                    );


                                if (!avaliacao) {

                                    return;

                                }


                                avaliacao.competencias[
                                    competencia
                                ] =
                                    valor;


                                atualizarResultado();


                                resultadoSucessao.innerHTML =
                                    gerarTabelaAvaliacao(
                                        colaboradorId,
                                        idCargoAlvo
                                    );


                                configurarEventosNiveis(
                                    colaboradorId,
                                    idCargoAlvo
                                );

                            };

                    }
                );

        }


        // =====================================
        // ATUALIZAR TELA
        // =====================================

        function atualizarTela() {

            const colaboradorId =
                selectColaborador.value.trim();


            const idCargoAlvo =
                selectCargoAlvo.value.trim();


            if (
                !colaboradorId ||
                !idCargoAlvo
            ) {

                resultadoSucessao.innerHTML = `

                    <div class="footer">

                        Selecione um colaborador
                        e um cargo alvo.

                    </div>

                `;


                cardsSucessao.innerHTML = `

                    <div class="footer">

                        Aguardando avaliação.

                    </div>

                `;


                observacaoSucessao.value =
                    "";


                selectPerformance.value =
                    "0";


                selectPotencial.value =
                    "0";


                return;

            }


            const cargoAlvo =
                buscarCargoAlvo(
                    idCargoAlvo
                );


            if (!cargoAlvo) {

                resultadoSucessao.innerHTML = `

                    <div class="footer">

                        Cargo alvo não encontrado.

                    </div>

                `;


                cardsSucessao.innerHTML = `

                    <div class="footer">

                        Não foi possível carregar
                        a matriz do cargo.

                    </div>

                `;

                return;

            }


            const avaliacao =
                garantirAvaliacao(
                    colaboradorId,
                    idCargoAlvo
                );


            if (!avaliacao) {

                return;

            }


            resultadoSucessao.innerHTML =
                gerarTabelaAvaliacao(
                    colaboradorId,
                    idCargoAlvo
                );


            observacaoSucessao.value =
                avaliacao.observacao ||
                "";


            selectPerformance.value =
                String(
                    avaliacao.performance || 0
                );


            selectPotencial.value =
                String(
                    avaliacao.potencial || 0
                );


            atualizarResultado();


            configurarEventosNiveis(
                colaboradorId,
                idCargoAlvo
            );

        }


        // =====================================
        // EVENTOS SELECT
        // =====================================

        selectColaborador.onchange =
            atualizarTela;


        selectCargoAlvo.onchange =
            atualizarTela;


        selectPerformance.onchange =
            atualizarResultado;


        selectPotencial.onchange =
            atualizarResultado;


        // =====================================
        // SALVAR
        // =====================================

        document
            .getElementById(
                "btnSalvarSucessao"
            )
            .onclick =
            async () => {

                const colaboradorId =
                    selectColaborador.value.trim();


                const idCargoAlvo =
                    selectCargoAlvo.value.trim();


                if (
                    !colaboradorId ||
                    !idCargoAlvo
                ) {

                    alert(
                        "Selecione um colaborador e um cargo alvo."
                    );

                    return;

                }


                const avaliacao =
                    garantirAvaliacao(
                        colaboradorId,
                        idCargoAlvo
                    );


                const resultado =
                    calcularResultado(
                        colaboradorId,
                        idCargoAlvo
                    );


                if (
                    !avaliacao ||
                    !resultado
                ) {

                    alert(
                        "Não foi possível salvar a avaliação."
                    );

                    return;

                }


                // =================================
                // RESULTADO DA SUCESSÃO
                // =================================

                avaliacao.aderencia =
                    resultado.aderencia;


                avaliacao.quantidadeGaps =
                    resultado.quantidadeGaps;


                avaliacao.prontidao =
                    resultado.prontidao;


                // =================================
                // PERFORMANCE E POTENCIAL
                // =================================

                avaliacao.performance =
                    Number(
                        selectPerformance.value
                    ) || 0;


                avaliacao.potencial =
                    Number(
                        selectPotencial.value
                    ) || 0;


                // =================================
                // 9 BOX
                // =================================

                const classificacao =
                    classificar9Box(
                        avaliacao.performance,
                        avaliacao.potencial
                    );


                avaliacao.classificacao9Box =
                    classificacao.nome;


                // =================================
                // OBSERVAÇÃO
                // =================================

                avaliacao.observacao =
                    observacaoSucessao.value;


                avaliacao.data =
                    new Date()
                        .toISOString();


                await Storage.salvarBanco(
                    banco
                );


                alert(
                    "Avaliação salva com sucesso."
                );


                // =================================
                // ATUALIZAR MAPA
                // =================================

                document
                    .getElementById(
                        "mapaSucessao"
                    )
                    .innerHTML =
                        gerarMapaSucessao();


                // =================================
                // ATUALIZAR 9 BOX
                // =================================

                document
                    .getElementById(
                        "boxSucessao"
                    )
                    .innerHTML =
                        gerar9Box();


                configurarBotoesExcluir();


                atualizarResultado();

            };


        // =====================================
        // EXCLUIR
        // =====================================

        function configurarBotoesExcluir() {

            document
                .querySelectorAll(
                    ".btnExcluirSucessao"
                )
                .forEach(
                    botao => {

                        botao.onclick =
                            async () => {

                                const chave =
                                    decodeURIComponent(
                                        botao.dataset.chave
                                    );


                                if (
                                    !confirm(
                                        "Deseja excluir esta avaliação?"
                                    )
                                ) {

                                    return;

                                }


                                delete avaliacoesSucessao[
                                    chave
                                ];


                                await Storage.salvarBanco(
                                    banco
                                );


                                document
                                    .getElementById(
                                        "mapaSucessao"
                                    )
                                    .innerHTML =
                                        gerarMapaSucessao();


                                document
                                    .getElementById(
                                        "boxSucessao"
                                    )
                                    .innerHTML =
                                        gerar9Box();


                                configurarBotoesExcluir();

                            };

                    }
                );

        }


        // =====================================
        // MENU
        // =====================================

        document
            .getElementById(
                "btnMatriz"
            )
            .onclick =
            () => {

                mostrarDashboard(
                    usuario
                );

            };


        document
            .getElementById(
                "btnColaboradores"
            )
            .onclick =
            () => {

                ModuloColaboradores.abrir(
                    usuario,
                    banco
                );

            };


        document
            .getElementById(
                "btnAvaliacao"
            )
            .onclick =
            () => {

                ModuloAvaliacao.abrir(
                    usuario,
                    banco
                );

            };


        document
            .getElementById(
                "btnDashboard"
            )
            .onclick =
            () => {

                ModuloDashboard.abrir(
                    usuario,
                    banco
                );

            };


        // =====================================
        // INICIAR
        // =====================================

        configurarBotoesExcluir();

    }

};