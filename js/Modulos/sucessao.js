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

                                    <br>

                                    <small
                                        style="
                                            opacity:.7;
                                        "
                                    >

                                        ${
                                            existeNoCargoAtual
                                                ? "Competência encontrada na matriz atual"
                                                : "Nova competência para o colaborador"
                                        }

                                    </small>

                                </td>


                                <td>

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


                                <td>

                                    <strong>

                                        ${esperado}

                                    </strong>

                                </td>


                                <td>

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
        //
        // EIXO X = DESEMPENHO
        //
        // EIXO Y = POTENCIAL
        //
        // DESEMPENHO:
        //
        // BAIXO = aderência < 60%
        // MÉDIO = aderência >= 60%
        // ALTO  = aderência >= 90%
        //
        // POTENCIAL:
        //
        // BAIXO = Em desenvolvimento
        // MÉDIO = Pronto em até 2 anos
        // ALTO  = Pronto em até 1 ano
        //         ou Pronto agora
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


            // =================================
            // OS 9 QUADRANTES
            // =================================

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


                    // =============================
                    // DESEMPENHO
                    // =============================

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


                    // =============================
                    // POTENCIAL AUTOMÁTICO
                    // =============================

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

                    else {

                        potencial =
                            "baixo";

                    }


                    // =============================
                    // CHAVE DO QUADRANTE
                    // =============================

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


            // =================================
            // RENDERIZAR PESSOAS
            // =================================

            function renderizarPessoas(
                pessoas
            ) {


                if (
                    pessoas.length === 0
                ) {

                    return `

                        <div
                            class="box9-vazio"
                        >

                            -

                        </div>

                    `;

                }


                return pessoas
                    .map(
                        pessoa => `

                            <div
                                class="pessoa9Box"
                                title="
                                    ${pessoa.nome}
                                    | Cargo atual: ${pessoa.cargoAtual}
                                    | Cargo alvo: ${pessoa.cargoAlvo}
                                "
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


            // =================================
            // RETORNAR 9 BOX
            // =================================

            return `

                <div
                    class="box9-wrapper"
                >


                    <div
                        class="box9-y-title"
                    >

                        POTENCIAL

                    </div>


                    <div
                        class="box9-main"
                    >


                        <!-- EIXO Y -->

                        <div
                            class="box9-y-labels"
                        >

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


                        <!-- GRID -->

                        <div
                            class="box9-grid"
                        >


                            <!-- LINHA 1 -->

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


                            <!-- LINHA 2 -->

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


                            <!-- LINHA 3 -->

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


                    <!-- EIXO X -->

                    <div
                        class="box9-x-area"
                    >

                        <div
                            class="box9-x-title"
                        >

                            DESEMPENHO

                        </div>


                        <div
                            class="box9-x-labels"
                        >

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

                            Selecione o colaborador e o cargo alvo.
                            As competências do novo cargo serão buscadas
                            automaticamente.

                            Quando uma competência também existir
                            na matriz atual do colaborador,
                            o sistema aproveitará automaticamente
                            o nível já avaliado.

                        </p>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(2, minmax(0, 1fr));
                                gap:20px;
                                margin-top:20px;
                                margin-bottom:25px;
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
                                    repeat(3, minmax(0, 1fr));
                                gap:20px;
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
                            avaliados.

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

                        <h3>

                            📊 9 Box de Sucessão

                        </h3>


                        <p class="descricao">

                            Visão estratégica baseada em
                            Desempenho × Potencial.

                            Ambos os indicadores são calculados
                            automaticamente pelo sistema com base
                            nas avaliações do colaborador e nos
                            resultados da sucessão.

                        </p>


                        <div
                            id="noveBoxSucessao"
                        >

                            ${gerar9Box()}

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