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
        // GARANTIR ESTRUTURA
        // =====================================

        if (
            !Array.isArray(
                areaAtual.colaboradores
            )
        ) {

            areaAtual.colaboradores = [];

        }


        if (
            !areaAtual.avaliacoes ||
            typeof areaAtual.avaliacoes !== "object"
        ) {

            areaAtual.avaliacoes = {};

        }


        if (
            !areaAtual.avaliacoesSucessao ||
            typeof areaAtual.avaliacoesSucessao !== "object"
        ) {

            areaAtual.avaliacoesSucessao = {};

        }


        const colaboradores =
            areaAtual.colaboradores;


        const avaliacoes =
            areaAtual.avaliacoes;


        const avaliacoesSucessao =
            areaAtual.avaliacoesSucessao;


        // =====================================
        // NORMALIZAR TEXTO
        // =====================================

        function normalizarTexto(texto) {

            return String(
                texto || ""
            )
                .trim()
                .replace(
                    /\s+/g,
                    " "
                )
                .toLowerCase();

        }


        // =====================================
        // BUSCAR TODOS OS CARGOS
        // DE TODAS AS ÁREAS
        // =====================================

        function buscarCargosGlobais() {

            const cargosGlobais = [];


            Object.entries(
                banco.matrizesPorArea || {}
            )
            .forEach(
                ([nomeArea, area]) => {

                    const cargos =
                        Array.isArray(
                            area.cargos
                        )
                            ? area.cargos
                            : [];


                    const habilidades =
                        Array.isArray(
                            area.habilidades
                        )
                            ? area.habilidades
                            : [];


                    const matrizEsperada =
                        area.matrizEsperada &&
                        typeof area.matrizEsperada ===
                            "object"
                            ? area.matrizEsperada
                            : {};


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

                                cargo:
                                    cargo,

                                area:
                                    nomeArea,

                                competencias:
                                    competencias

                            });

                        }
                    );

                }
            );


            cargosGlobais.sort(
                (a, b) => {

                    const resultadoArea =
                        String(
                            a.area
                        )
                        .localeCompare(
                            String(
                                b.area
                            ),
                            "pt-BR"
                        );


                    if (
                        resultadoArea !== 0
                    ) {

                        return resultadoArea;

                    }


                    return String(
                        a.cargo
                    )
                    .localeCompare(
                        String(
                            b.cargo
                        ),
                        "pt-BR"
                    );

                }
            );


            return cargosGlobais;

        }


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
                item => {

                    return (
                        String(
                            item.id
                        ).trim() ===
                        idNormalizado
                    );

                }
            );

        }


        // =====================================
        // BUSCAR COLABORADOR
        // =====================================

        function buscarColaborador(
            colaboradorId
        ) {

            return colaboradores.find(
                colaborador => {

                    return (
                        String(
                            colaborador.id
                        ).trim() ===
                        String(
                            colaboradorId
                        ).trim()
                    );

                }
            );

        }


        // =====================================
        // BUSCAR NÍVEIS DA AVALIAÇÃO
        // =====================================

        function buscarNiveisAvaliacao(
            colaboradorId
        ) {

            const registro =
                avaliacoes[
                    colaboradorId
                ];


            if (
                registro &&
                !Array.isArray(
                    registro
                ) &&
                typeof registro === "object"
            ) {

                if (
                    Array.isArray(
                        registro.niveis
                    )
                ) {

                    return registro.niveis;

                }

            }


            if (
                Array.isArray(
                    registro
                )
            ) {

                return registro;

            }


            return [];

        }


        // =====================================
        // MAPEAR COMPETÊNCIAS ATUAIS
        // =====================================

        function buscarCompetenciasAtuais(
            colaboradorId
        ) {

            const colaborador =
                buscarColaborador(
                    colaboradorId
                );


            if (!colaborador) {

                return {};

            }


            const habilidadesAtuais =
                Array.isArray(
                    areaAtual.habilidades
                )
                    ? areaAtual.habilidades
                    : [];


            const niveisAtuais =
                buscarNiveisAvaliacao(
                    colaboradorId
                );


            const mapaCompetencias =
                {};


            habilidadesAtuais.forEach(
                (
                    habilidade,
                    index
                ) => {

                    const chave =
                        normalizarTexto(
                            habilidade
                        );


                    const nivel =
                        Number(
                            niveisAtuais[index] ?? 0
                        );


                    mapaCompetencias[
                        chave
                    ] =
                        nivel;

                }
            );


            return mapaCompetencias;

        }


        // =====================================
        // BUSCAR NÍVEL ATUAL
        // =====================================

        function buscarNivelAtualCompetencia(
            colaboradorId,
            nomeCompetencia
        ) {

            const competenciasAtuais =
                buscarCompetenciasAtuais(
                    colaboradorId
                );


            const chave =
                normalizarTexto(
                    nomeCompetencia
                );


            if (
                competenciasAtuais[
                    chave
                ] === undefined
            ) {

                return 0;

            }


            return Number(
                competenciasAtuais[
                    chave
                ]
            ) || 0;

        }


        // =====================================
        // CRIAR CHAVE
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
                !avaliacoesSucessao[
                    chave
                ]
            ) {

                const competencias =
                    {};


                cargoAlvo.competencias
                    .forEach(
                        competencia => {

                            const nivelAtual =
                                buscarNivelAtualCompetencia(
                                    colaboradorId,
                                    competencia.nome
                                );


                            competencias[
                                competencia.nome
                            ] =
                                nivelAtual;

                        }
                    );


                avaliacoesSucessao[
                    chave
                ] = {

                    chave:
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
                        competencias,

                    aderencia:
                        0,

                    quantidadeGaps:
                        cargoAlvo.competencias.length,

                    prontidao:
                        "Em desenvolvimento",

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
                ].competencias =
                    {};

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
                            ) || 0;


                        const atual =
                            Number(
                                competenciasAvaliadas[
                                    nome
                                ] ?? 0
                            ) || 0;


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


                        if (
                            gap > 0
                        ) {

                            quantidadeGaps++;


                            gaps.push({

                                competencia:
                                    nome,

                                atual:
                                    atual,

                                esperado:
                                    esperado,

                                gap:
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
                    aderencia.toFixed(
                        1
                    )
                );


            // =================================
            // CALCULAR PRONTIDÃO
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

                aderencia:
                    aderencia,

                quantidadeGaps:
                    quantidadeGaps,

                gaps:
                    gaps,

                prontidao:
                    prontidao,

                totalAtual:
                    totalAtual,

                totalEsperado:
                    totalEsperado

            };

        }


        // =====================================
        // GERAR TABELA DE AVALIAÇÃO
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
                cargoAlvo.competencias
                    .length === 0
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


            const competenciasAtuais =
                buscarCompetenciasAtuais(
                    colaboradorId
                );


            let html = `

                <div class="tabela-container">

                    <table class="tabela-sucessao">

                        <colgroup>

                            <!--
                                COMPETÊNCIA:
                                recebe todo o espaço restante
                            -->
                            <col class="col-competencia">

                            <!--
                                NÍVEL ATUAL:
                                largura fixa
                            -->
                            <col class="col-nivel-atual">

                            <!--
                                ESPERADO:
                                largura fixa
                            -->
                            <col class="col-esperado">

                            <!--
                                GAP:
                                largura fixa
                            -->
                            <col class="col-gap">

                        </colgroup>

                        <thead>

                            <tr>

                                <th>
                                    Competência
                                </th>

                                <th class="th-centralizado">
                                    Nível Atual
                                </th>

                                <th class="th-centralizado">
                                    Esperado
                                </th>

                                <th class="th-centralizado">
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
                            ) || 0;


                        const atual =
                            Number(
                                competenciasAvaliadas[
                                    nome
                                ] ?? 0
                            ) || 0;


                        const gap =
                            Math.max(
                                0,
                                esperado - atual
                            );


                        const existeNoCargoAtual =
                            competenciasAtuais[
                                normalizarTexto(
                                    nome
                                )
                            ] !== undefined;


                        html += `

                            <tr>

                                <td class="habilidade">

                                    <strong>
                                        ${nome}
                                    </strong>

                                    <small>

                                        ${
                                            existeNoCargoAtual
                                                ? "Competência encontrada na matriz atual"
                                                : "Nova competência para o colaborador"
                                        }

                                    </small>

                                </td>


                                <td class="td-nivel-atual">

                                    <select
                                        class="nivelSucessao"
                                        data-competencia="${encodeURIComponent(nome)}"
                                    >

                                        ${[0, 1, 2, 3, 4]
                                            .map(
                                                nivel => `

                                                    <option
                                                        value="${nivel}"
                                                        ${
                                                            atual === nivel
                                                                ? "selected"
                                                                : ""
                                                        }
                                                    >
                                                        ${nivel}
                                                    </option>

                                                `
                                            )
                                            .join("")
                                        }

                                    </select>

                                </td>


                                <td class="td-centralizado">

                                    <strong>
                                        ${esperado}
                                    </strong>

                                </td>


                                <td class="td-centralizado">

                                    <strong>
                                        ${gap}
                                    </strong>

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
                                    Área
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
                                    Ações
                                </th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            lista.forEach(
                avaliacao => {

                    const colaborador =
                        buscarColaborador(
                            avaliacao.colaboradorId
                        );


                    if (!colaborador) {

                        return;

                    }


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

                                <button
                                    class="btnExcluirSucessao"
                                    data-chave="${encodeURIComponent(avaliacao.chave)}"
                                    type="button"
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
        // GERAR 9 BOX AUTOMÁTICO
        // =====================================

        function gerar9Box() {

            const lista =
                Object.values(
                    avaliacoesSucessao
                );


            if (
                lista.length === 0
            ) {

                return `

                    <div class="footer">

                        Nenhuma avaliação disponível
                        para o 9 Box.

                    </div>

                `;

            }


            const caixas = {

                altoAlto: [],
                altoMedio: [],
                altoBaixo: [],

                medioAlto: [],
                medioMedio: [],
                medioBaixo: [],

                baixoAlto: [],
                baixoMedio: [],
                baixoBaixo: []

            };


            lista.forEach(
                avaliacao => {

                    const colaborador =
                        buscarColaborador(
                            avaliacao.colaboradorId
                        );


                    if (!colaborador) {

                        return;

                    }


                    const aderencia =
                        Number(
                            avaliacao.aderencia || 0
                        );


                    let desempenho =
                        "baixo";


                    if (
                        aderencia >= 90
                    ) {

                        desempenho =
                            "alto";

                    }

                    else if (
                        aderencia >= 60
                    ) {

                        desempenho =
                            "medio";

                    }


                    let potencial =
                        "baixo";


                    if (
                        avaliacao.prontidao ===
                        "Pronto agora"
                    ) {

                        potencial =
                            "alto";

                    }

                    else if (
                        avaliacao.prontidao ===
                        "Pronto em até 1 ano"
                    ) {

                        potencial =
                            "alto";

                    }

                    else if (
                        avaliacao.prontidao ===
                        "Pronto em até 2 anos"
                    ) {

                        potencial =
                            "medio";

                    }


                    const chave =

                        potencial +

                        desempenho
                            .charAt(0)
                            .toUpperCase() +

                        desempenho
                            .slice(1);


                    if (
                        caixas[chave]
                    ) {

                        caixas[
                            chave
                        ].push({

                            nome:
                                colaborador.nome,

                            cargoAtual:
                                colaborador.cargo || "-",

                            cargoAlvo:
                                avaliacao.cargoAlvo || "-",

                            aderencia:
                                aderencia,

                            prontidao:
                                avaliacao.prontidao ||
                                "Em desenvolvimento"

                        });

                    }

                }
            );


            function renderizarPessoas(
                pessoas
            ) {

                if (
                    pessoas.length === 0
                ) {

                    return `

                        <div class="box9-vazio">
                            -
                        </div>

                    `;

                }


                return pessoas
                    .map(
                        pessoa => `

                            <div
                                class="pessoa9Box"
                                title="${pessoa.nome} | Cargo atual: ${pessoa.cargoAtual} | Cargo alvo: ${pessoa.cargoAlvo}"
                            >

                                <strong>
                                    ${pessoa.nome}
                                </strong>

                                <small>

                                    ${pessoa.aderencia.toFixed(1)}%
                                    •
                                    ${pessoa.prontidao}

                                </small>

                            </div>

                        `
                    )
                    .join("");

            }


            return `

                <div class="box9-wrapper">

                    <div class="box9-y-title">
                        POTENCIAL
                    </div>


                    <div class="box9-main">

                        <div class="box9-y-labels">

                            <div>
                                ALTO
                            </div>

                            <div>
                                MÉDIO
                            </div>

                            <div>
                                BAIXO
                            </div>

                        </div>


                        <div class="box9-grid">

                            <div class="box9-cell potencial-alto">

                                <div class="box9-titulo">
                                    Alto Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Baixo Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.altoBaixo
                                )}

                            </div>


                            <div class="box9-cell potencial-alto">

                                <div class="box9-titulo">
                                    Alto Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Médio Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.altoMedio
                                )}

                            </div>


                            <div class="box9-cell potencial-alto">

                                <div class="box9-titulo">
                                    Alto Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Alto Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.altoAlto
                                )}

                            </div>


                            <div class="box9-cell potencial-medio">

                                <div class="box9-titulo">
                                    Médio Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Baixo Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.medioBaixo
                                )}

                            </div>


                            <div class="box9-cell potencial-medio">

                                <div class="box9-titulo">
                                    Médio Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Médio Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.medioMedio
                                )}

                            </div>


                            <div class="box9-cell potencial-medio">

                                <div class="box9-titulo">
                                    Médio Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Alto Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.medioAlto
                                )}

                            </div>


                            <div class="box9-cell potencial-baixo">

                                <div class="box9-titulo">
                                    Baixo Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Baixo Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.baixoBaixo
                                )}

                            </div>


                            <div class="box9-cell potencial-baixo">

                                <div class="box9-titulo">
                                    Baixo Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Médio Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.baixoMedio
                                )}

                            </div>


                            <div class="box9-cell potencial-baixo">

                                <div class="box9-titulo">
                                    Baixo Potencial
                                </div>

                                <div class="box9-subtitulo">
                                    Alto Desempenho
                                </div>

                                ${renderizarPessoas(
                                    caixas.baixoAlto
                                )}

                            </div>

                        </div>

                    </div>


                    <div class="box9-x-area">

                        <div class="box9-x-title">
                            DESEMPENHO
                        </div>


                        <div class="box9-x-labels">

                            <span>
                                BAIXO
                            </span>

                            <span>
                                MÉDIO
                            </span>

                            <span>
                                ALTO
                            </span>

                        </div>

                    </div>

                </div>

            `;

        }


        // =====================================
        // TELA
        // =====================================

        UI.carregar(`

            <div class="sistema-layout">


                <!-- ==========================================
                     MENU LATERAL
                =========================================== -->

                <aside class="menu-lateral">


                    <div class="menu-lateral-logo">

                        <div class="menu-logo-box">
    <img
        src="assets/logo-corteva.png"
        alt="Corteva"
    >
</div>


                        <div class="menu-logo-texto">

                            <span>
                                People
                            </span>

                            <span>
                                Development
                            </span>

                        </div>

                    </div>


                    <div class="menu-lateral-area">

                        <span>
                            ÁREA
                        </span>

                        <strong>
                            ${usuario.area}
                        </strong>

                    </div>


                    <nav class="menu-lateral-itens">


                        <button
                            id="btnMatriz"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                🎯
                            </span>

                            <span>
                                Matriz por Cargo
                            </span>

                        </button>


                        <button
                            id="btnColaboradores"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                👥
                            </span>

                            <span>
                                Colaboradores
                            </span>

                        </button>


                        <button
                            id="btnAvaliacao"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                📝
                            </span>

                            <span>
                                Avaliação
                            </span>

                        </button>


                        <button
                            id="btnSucessao"
                            class="menu-lateral-item ativo"
                            type="button"
                        >

                            <span class="menu-icone">
                                👑
                            </span>

                            <span>
                                Sucessão
                            </span>

                        </button>


                        <button
                            id="btnDashboard"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                📊
                            </span>

                            <span>
                                Dashboard
                            </span>

                        </button>


                    </nav>


                    <div class="menu-lateral-rodape">

                        <span>
                            People Development Portal
                        </span>

                    </div>


                </aside>


                <!-- ==========================================
                     ÁREA PRINCIPAL
                =========================================== -->

                <main class="area-principal">


                    <div class="cabecalho-pagina">

                        <div>

                            <h1>
                                Matriz de Sucessão
                            </h1>

                            <p>

                                Área:
                                <strong>
                                    ${usuario.area}
                                </strong>

                            </p>

                        </div>


                        <div class="cabecalho-indicador">

                            <span>
                                Sucessores avaliados
                            </span>

                            <strong
                                id="totalSucessores"
                            >

                                ${
                                    Object.keys(
                                        avaliacoesSucessao
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                    <section class="conteudo-principal">


                        <!-- =================================
                             AVALIAÇÃO
                        ================================== -->

                        <div class="card">


                            <div class="cabecalho-matriz">

                                <div>

                                    <h3>
                                        Avaliação de Sucessores
                                    </h3>

                                </div>

                            </div>


                            <p class="descricao">

                                Selecione o colaborador e o cargo
                                alvo. As competências do novo cargo
                                serão carregadas automaticamente.

                                Quando uma competência também existir
                                na matriz atual do colaborador, o nível
                                já avaliado será aproveitado.

                            </p>


                            <div class="campos-sucessao">


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

                                                        <option
                                                            value="${colaborador.id}"
                                                        >

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

                                                        <option
                                                            value="${item.id}"
                                                        >

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


                            <div
                                id="resultadoSucessao"
                            >

                                <div class="footer">

                                    Selecione um colaborador
                                    e um cargo alvo.

                                </div>

                            </div>


                        </div>


                        <!-- =================================
                             RESULTADO
                        ================================== -->

                        <div class="card card-espacado">


                            <h3>
                                Resultado da Avaliação
                            </h3>


                            <div
                                id="cardsSucessao"
                                class="cards-resultado-sucessao"
                            >

                                <div class="footer">

                                    Aguardando avaliação.

                                </div>

                            </div>


                        </div>


                        <!-- =================================
                             OBSERVAÇÃO
                        ================================== -->

                        <div class="card card-espacado">


                            <h3>
                                Observações
                            </h3>


                            <textarea
                                id="observacaoSucessao"
                                class="textarea-sucessao"
                                placeholder="Registre observações sobre o desenvolvimento do sucessor."
                            ></textarea>


                            <div class="acoes-final-sucessao">

                                <button
                                    id="btnSalvarSucessao"
                                    type="button"
                                >

                                    💾 Salvar Avaliação

                                </button>

                            </div>


                        </div>


                        <!-- =================================
                             MAPA
                        ================================== -->

                        <div class="card card-espacado">


                            <h3>
                                Mapa de Sucessão
                            </h3>


                            <p class="descricao">

                                Relação dos possíveis sucessores
                                avaliados.

                            </p>


                            <div
                                id="mapaSucessao"
                            >

                                ${gerarMapaSucessao()}

                            </div>


                        </div>


                        <!-- =================================
                             9 BOX
                        ================================== -->

                        <div class="card card-espacado">


                            <h3>
                                📊 9 Box de Sucessão
                            </h3>


                            <p class="descricao">

                                Visão estratégica baseada em
                                Desempenho × Potencial.

                                Os indicadores são calculados
                                automaticamente com base nas
                                avaliações do colaborador e nos
                                resultados da sucessão.

                            </p>


                            <div
                                id="noveBoxSucessao"
                            >

                                ${gerar9Box()}

                            </div>


                        </div>


                    </section>


                </main>


            </div>

        `);


        // =====================================
        // ESTILOS ESPECÍFICOS
        // =====================================

        if (
            !document.getElementById(
                "estilosModuloSucessao"
            )
        ) {

            const style =
                document.createElement("style");

            style.id =
                "estilosModuloSucessao";

            style.textContent = `

                /* =====================================
                   ÁREA PRINCIPAL
                ===================================== */

                .area-principal {

                    background:
                        #f4f7fa;

                }


                .cabecalho-pagina {

                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:28px 32px 22px;

                }


                .cabecalho-pagina h1 {

                    margin:0 0 6px;

                    font-size:28px;

                    color:#17365d;

                }


                .cabecalho-pagina p {

                    margin:0;

                    color:#667085;

                }


                .cabecalho-indicador {

                    min-width:170px;

                    padding:14px 18px;

                    background:#ffffff;

                    border:1px solid #e4e9ef;

                    border-radius:12px;

                    text-align:right;

                    box-shadow:
                        0 2px 8px
                        rgba(15,23,42,.05);

                }


                .cabecalho-indicador span {

                    display:block;

                    font-size:12px;

                    color:#667085;

                    margin-bottom:4px;

                }


                .cabecalho-indicador strong {

                    font-size:24px;

                    color:#005eb8;

                }


                /* =====================================
                   CONTEÚDO
                ===================================== */

                .conteudo-principal {

                    padding:
                        0 32px 40px;

                }


                .conteudo-principal .card {

                    background:#ffffff;

                    border:
                        1px solid #e4e9ef;

                    border-radius:14px;

                    box-shadow:
                        0 3px 12px
                        rgba(15,23,42,.05);

                    padding:24px;

                }


                .card-espacado {

                    margin-top:20px;

                }


                .cabecalho-matriz h3 {

                    margin:0;

                    color:#17365d;

                    font-size:20px;

                }


                .descricao {

                    color:#667085;

                    line-height:1.55;

                }


                /* =====================================
                   CAMPOS
                ===================================== */

                .campos-sucessao {

                    display:grid;

                    grid-template-columns:
                        repeat(2, minmax(0,1fr));

                    gap:20px;

                    margin-top:22px;

                    margin-bottom:25px;

                }


                .campos-sucessao label {

                    display:block;

                    margin-bottom:7px;

                    font-weight:600;

                    color:#344054;

                    font-size:14px;

                }


                .campos-sucessao select {

                    width:100%;

                    min-height:44px;

                    padding:
                        10px 12px;

                    border:
                        1px solid #d0d5dd;

                    border-radius:8px;

                    background:#ffffff;

                    color:#101828;

                    font-size:14px;

                    outline:none;

                }


                .campos-sucessao select:focus {

                    border-color:#005eb8;

                    box-shadow:
                        0 0 0 3px
                        rgba(0,94,184,.10);

                }


                /* =====================================
                   RESULTADO
                ===================================== */

                .cards-resultado-sucessao {

                    display:grid;

                    grid-template-columns:
                        repeat(3, minmax(0,1fr));

                    gap:20px;

                    margin-top:20px;

                }


                .cards-resultado-sucessao > .card {

                    padding:20px;

                    margin:0;

                    border:
                        1px solid #e4e9ef;

                    box-shadow:none;

                    text-align:center;

                }


                .cards-resultado-sucessao small {

                    display:block;

                    color:#667085;

                    font-weight:600;

                    margin-bottom:8px;

                }


                .cards-resultado-sucessao h2 {

                    margin:0;

                    color:#005eb8;

                    font-size:28px;

                }


                /* =====================================
                   TABELAS
                ===================================== */

                .tabela-container {

                    width:100%;

                    overflow-x:auto;

                    margin-top:20px;

                }


                /* =================================================
                   TABELA DE AVALIAÇÃO DE SUCESSÃO
                   
                   TODAS AS COLUNAS SÃO FIXADAS.
                   O TAMANHO DA COMPETÊNCIA NÃO MOVE
                   AS OUTRAS COLUNAS.
                   ================================================= */

                .tabela-sucessao {

                    width:100% !important;

                    min-width:700px;

                    max-width:none;

                    border-collapse:collapse;

                    border-spacing:0;

                    background:#ffffff;

                    table-layout:fixed !important;

                }


                /* =================================================
                   COLGROUP
                   ================================================= */

                .tabela-sucessao
                col.col-competencia {

                    width:auto !important;

                }


                .tabela-sucessao
                col.col-nivel-atual {

                    width:120px !important;

                }


                .tabela-sucessao
                col.col-esperado {

                    width:100px !important;

                }


                .tabela-sucessao
                col.col-gap {

                    width:90px !important;

                }


                /* =================================================
                   CABEÇALHO
                   ================================================= */

                .tabela-sucessao th {

                    background:#edf4fb;

                    color:#17365d;

                    font-weight:700;

                    text-align:left;

                    padding:13px 14px;

                    border-bottom:
                        1px solid #dce5ef;

                    box-sizing:border-box;

                    white-space:nowrap;

                }


                /* =================================================
                   CÉLULAS
                   ================================================= */

                .tabela-sucessao td {

                    padding:13px 14px;

                    border-bottom:
                        1px solid #eaecf0;

                    color:#344054;

                    vertical-align:middle;

                    box-sizing:border-box;

                }


                .tabela-sucessao tbody tr:hover {

                    background:#f8fafc;

                }


                /* =================================================
                   COMPETÊNCIA
                   
                   ESTA COLUNA É A ÚNICA QUE PODE
                   CRESCER/OCUPAR O ESPAÇO RESTANTE.
                   ================================================= */

                .tabela-sucessao
                th:nth-child(1),

                .tabela-sucessao
                td:nth-child(1) {

                    width:auto !important;

                    min-width:0 !important;

                    max-width:none !important;

                    text-align:left;

                    vertical-align:middle;

                    overflow:hidden;

                }


                .tabela-sucessao
                .habilidade {

                    overflow:hidden;

                    min-width:0;

                }


                .tabela-sucessao
                .habilidade strong {

                    display:block;

                    color:#17365d;

                    overflow:hidden;

                    text-overflow:ellipsis;

                    white-space:nowrap;

                    max-width:100%;

                }


                .tabela-sucessao
                .habilidade small {

                    display:block;

                    margin-top:4px;

                    color:#667085;

                    font-size:12px;

                    overflow:hidden;

                    text-overflow:ellipsis;

                    white-space:nowrap;

                    max-width:100%;

                }


                /* =================================================
                   NÍVEL ATUAL
                   
                   POSIÇÃO FIXA.
                   ================================================= */

                .tabela-sucessao
                th:nth-child(2),

                .tabela-sucessao
                td:nth-child(2) {

                    width:120px !important;

                    min-width:120px !important;

                    max-width:120px !important;

                    text-align:center !important;

                    vertical-align:middle;

                    box-sizing:border-box;

                }


                .tabela-sucessao
                .td-nivel-atual {

                    padding-left:10px !important;

                    padding-right:10px !important;

                }


                /* =================================================
                   SELECT NÍVEL ATUAL
                   
                   TAMANHO FIXO E CENTRALIZADO.
                   ================================================= */

                .tabela-sucessao
                .nivelSucessao {

                    width:78px !important;

                    min-width:78px !important;

                    max-width:78px !important;

                    height:36px;

                    padding:
                        5px 8px;

                    margin:0 auto;

                    display:block;

                    box-sizing:border-box;

                    border:
                        1px solid #d0d5dd;

                    border-radius:7px;

                    background:#ffffff;

                    color:#101828;

                    text-align:center;

                    font-size:14px;

                    cursor:pointer;

                }


                .tabela-sucessao
                .nivelSucessao:focus {

                    outline:none;

                    border-color:#005eb8;

                    box-shadow:
                        0 0 0 3px
                        rgba(0,94,184,.10);

                }


                /* =================================================
                   ESPERADO
                   ================================================= */

                .tabela-sucessao
                th:nth-child(3),

                .tabela-sucessao
                td:nth-child(3) {

                    width:100px !important;

                    min-width:100px !important;

                    max-width:100px !important;

                    text-align:center !important;

                    vertical-align:middle;

                    box-sizing:border-box;

                }


                /* =================================================
                   GAP
                   ================================================= */

                .tabela-sucessao
                th:nth-child(4),

                .tabela-sucessao
                td:nth-child(4) {

                    width:90px !important;

                    min-width:90px !important;

                    max-width:90px !important;

                    text-align:center !important;

                    vertical-align:middle;

                    box-sizing:border-box;

                }


                /* =================================================
                   CENTRALIZAÇÃO
                   ================================================= */

                .tabela-sucessao
                .th-centralizado {

                    text-align:center !important;

                }


                .tabela-sucessao
                .td-centralizado {

                    text-align:center !important;

                }


                /* =================================================
                   TABELA DO MAPA
                   ================================================= */

                .tabela-container
                table:not(.tabela-sucessao) {

                    width:100%;

                    border-collapse:collapse;

                    background:#ffffff;

                }


                .tabela-container
                table:not(.tabela-sucessao) th {

                    background:#edf4fb;

                    color:#17365d;

                    font-weight:700;

                    text-align:left;

                    padding:13px 14px;

                    border-bottom:
                        1px solid #dce5ef;

                    white-space:nowrap;

                }


                .tabela-container
                table:not(.tabela-sucessao) td {

                    padding:13px 14px;

                    border-bottom:
                        1px solid #eaecf0;

                    color:#344054;

                    vertical-align:middle;

                }


                .tabela-container
                table:not(.tabela-sucessao)
                tbody tr:hover {

                    background:#f8fafc;

                }


                .btnExcluirSucessao {

                    border:none;

                    background:#fff1f0;

                    color:#b42318;

                    border-radius:7px;

                    padding:7px 9px;

                    cursor:pointer;

                }


                .btnExcluirSucessao:hover {

                    background:#fee4e2;

                }


                /* =====================================
                   OBSERVAÇÕES
                ===================================== */

                .textarea-sucessao {

                    width:100%;

                    min-height:110px;

                    margin-top:15px;

                    padding:12px;

                    border:
                        1px solid #d0d5dd;

                    border-radius:8px;

                    resize:vertical;

                    font-family:inherit;

                    font-size:14px;

                    color:#101828;

                    box-sizing:border-box;

                    outline:none;

                }


                .textarea-sucessao:focus {

                    border-color:#005eb8;

                    box-shadow:
                        0 0 0 3px
                        rgba(0,94,184,.10);

                }


                .acoes-final-sucessao {

                    display:flex;

                    justify-content:flex-end;

                    margin-top:15px;

                }


                .acoes-final-sucessao button {

                    border:none;

                    background:#005eb8;

                    color:#ffffff;

                    padding:
                        11px 18px;

                    border-radius:8px;

                    cursor:pointer;

                    font-weight:600;

                }


                .acoes-final-sucessao button:hover {

                    background:#004b91;

                }


                /* =====================================
                   9 BOX
                ===================================== */

                .box9-wrapper {

                    margin-top:25px;

                    width:100%;

                    overflow-x:auto;

                }


                .box9-main {

                    display:flex;

                    min-width:760px;

                }


                .box9-y-title {

                    writing-mode:
                        vertical-rl;

                    transform:
                        rotate(180deg);

                    font-weight:700;

                    color:#17365d;

                    letter-spacing:1px;

                    margin-right:10px;

                    display:flex;

                    align-items:center;

                    justify-content:center;

                }


                .box9-y-labels {

                    width:70px;

                    display:grid;

                    grid-template-rows:
                        repeat(3,1fr);

                    align-items:center;

                    text-align:center;

                    font-size:11px;

                    font-weight:700;

                    color:#667085;

                    padding:2px 8px;

                }


                .box9-grid {

                    flex:1;

                    display:grid;

                    grid-template-columns:
                        repeat(3,minmax(180px,1fr));

                    grid-template-rows:
                        repeat(3,minmax(150px,1fr));

                    gap:8px;

                }


                .box9-cell {

                    border:
                        1px solid #dce5ef;

                    border-radius:10px;

                    padding:12px;

                    min-height:150px;

                    box-sizing:border-box;

                    background:#f8fafc;

                }


                .potencial-alto {

                    background:#eef8f1;

                }


                .potencial-medio {

                    background:#fff8e8;

                }


                .potencial-baixo {

                    background:#fff1f0;

                }


                .box9-titulo {

                    font-size:13px;

                    font-weight:700;

                    color:#17365d;

                }


                .box9-subtitulo {

                    font-size:11px;

                    color:#667085;

                    margin-top:3px;

                    margin-bottom:10px;

                }


                .pessoa9Box {

                    background:#ffffff;

                    border:
                        1px solid #dce5ef;

                    border-radius:7px;

                    padding:7px 8px;

                    margin-top:6px;

                }


                .pessoa9Box strong {

                    display:block;

                    font-size:12px;

                    color:#17365d;

                    overflow:hidden;

                    text-overflow:ellipsis;

                    white-space:nowrap;

                }


                .pessoa9Box small {

                    display:block;

                    margin-top:3px;

                    color:#667085;

                    font-size:10px;

                    line-height:1.3;

                }


                .box9-vazio {

                    color:#98a2b3;

                    font-size:20px;

                    text-align:center;

                    margin-top:25px;

                }


                .box9-x-area {

                    min-width:760px;

                    margin-left:118px;

                    margin-top:10px;

                }


                .box9-x-title {

                    text-align:center;

                    font-weight:700;

                    color:#17365d;

                    letter-spacing:1px;

                    margin-bottom:5px;

                }


                .box9-x-labels {

                    display:grid;

                    grid-template-columns:
                        repeat(3,1fr);

                    text-align:center;

                    font-size:11px;

                    font-weight:700;

                    color:#667085;

                }


                /* =====================================
                   FOOTER / VAZIOS
                ===================================== */

                .footer {

                    padding:25px;

                    text-align:center;

                    color:#667085;

                    background:#f8fafc;

                    border:
                        1px dashed #d0d5dd;

                    border-radius:8px;

                    margin-top:20px;

                }


                /* =====================================
                   RESPONSIVO
                ===================================== */

                @media (
                    max-width:900px
                ) {

                    .campos-sucessao {

                        grid-template-columns:1fr;

                    }


                    .cards-resultado-sucessao {

                        grid-template-columns:1fr;

                    }


                    .cabecalho-pagina {

                        align-items:flex-start;

                    }

                }


                @media (
                    max-width:700px
                ) {

                    .conteudo-principal {

                        padding:
                            0 16px 30px;

                    }


                    .cabecalho-pagina {

                        padding:
                            20px 16px;

                    }


                    .cabecalho-indicador {

                        min-width:130px;

                    }

                }

            `;

            document.head.appendChild(
                style
            );

        }


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

                return;

            }


            cardsSucessao.innerHTML = `

                <div class="card">

                    <small>
                        Aderência
                    </small>

                    <h2>
                        ${resultado.aderencia}%
                    </h2>

                </div>


                <div class="card">

                    <small>
                        GAPs
                    </small>

                    <h2>
                        ${resultado.quantidadeGaps}
                    </h2>

                </div>


                <div class="card">

                    <small>
                        Prontidão
                    </small>

                    <h2>
                        ${resultado.prontidao}
                    </h2>

                </div>

            `;

        }


        // =====================================
        // EVENTOS DOS NÍVEIS
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


                                resultadoSucessao.innerHTML =
                                    gerarTabelaAvaliacao(
                                        colaboradorId,
                                        idCargoAlvo
                                    );


                                atualizarResultado();


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


            atualizarResultado();


            configurarEventosNiveis(
                colaboradorId,
                idCargoAlvo
            );

        }


        // =====================================
        // EVENTOS DOS SELECTS
        // =====================================

        selectColaborador.onchange =
            atualizarTela;


        selectCargoAlvo.onchange =
            atualizarTela;


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


                avaliacao.aderencia =
                    resultado.aderencia;


                avaliacao.quantidadeGaps =
                    resultado.quantidadeGaps;


                avaliacao.prontidao =
                    resultado.prontidao;


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


                document
                    .getElementById(
                        "mapaSucessao"
                    )
                    .innerHTML =
                    gerarMapaSucessao();


                document
                    .getElementById(
                        "noveBoxSucessao"
                    )
                    .innerHTML =
                    gerar9Box();


                const totalSucessores =
                    document.getElementById(
                        "totalSucessores"
                    );


                if (
                    totalSucessores
                ) {

                    totalSucessores.textContent =
                        Object.keys(
                            avaliacoesSucessao
                        ).length;

                }


                configurarBotoesExcluir();

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
                                        "noveBoxSucessao"
                                    )
                                    .innerHTML =
                                    gerar9Box();


                                const totalSucessores =
                                    document.getElementById(
                                        "totalSucessores"
                                    );


                                if (
                                    totalSucessores
                                ) {

                                    totalSucessores.textContent =
                                        Object.keys(
                                            avaliacoesSucessao
                                        ).length;

                                }


                                configurarBotoesExcluir();

                            };

                    }
                );

        }


        // =====================================
        // MENU LATERAL
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