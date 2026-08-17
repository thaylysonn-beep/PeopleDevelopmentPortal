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


        // =================================================
        // PERCORRER TODAS AS ÁREAS
        // =================================================

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
                    area.colaboradores || [];


                const habilidades =
                    area.habilidades ||
                    banco.habilidades ||
                    [];


                const avaliacoes =
                    area.avaliacoes || {};


                const matrizEsperada =
                    area.matrizEsperada || {};


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


                        // =====================================
                        // NOVO FORMATO
                        // =====================================

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


                        // =====================================
                        // FORMATO ANTIGO
                        // =====================================

                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            avaliacao =
                                registro;

                        }


                        // =====================================
                        // SEM AVALIAÇÃO
                        // =====================================

                        else {

                            avaliacao =
                                habilidades.map(
                                    () => 0
                                );

                        }


                        // =====================================
                        // CÁLCULOS
                        // =====================================

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
                                        habilidade
                                    );

                                }

                            }
                        );


                        // =====================================
                        // SCORE
                        // =====================================

                        const score =
                            quantidadeNotas > 0
                                ? Number(
                                    (
                                        soma /
                                        quantidadeNotas
                                    ).toFixed(2)
                                )
                                : 0;


                        // =====================================
                        // ATINGIMENTO
                        // =====================================

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


                        // =====================================
                        // SITUAÇÃO
                        // =====================================

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


                        // =====================================
                        // DATA
                        // =====================================

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


                        // =====================================
                        // HTML
                        // =====================================

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
                                    ${dataFormatada || "-"}
                                </td>

                                <td>
                                    ${score.toFixed(2)}
                                </td>

                                <td>
                                    ${atingimento.toFixed(2)}%
                                </td>

                                <td>
                                    ${situacao}
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
        // RESUMO
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
                            class="btnSecundario">

                            ← Voltar

                        </button>

                    </div>

                </header>


                <section class="conteudo">


                    <!-- =================================
                         RESUMO
                    ================================== -->

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


                    <!-- =================================
                         EXPORTAÇÃO
                    ================================== -->

                    <div
                        class="card"
                        style="margin-top:20px;"
                    >

                        <h3>
                            📥 Exportar Relatório
                        </h3>

                        <p>
                            Baixe o relatório completo
                            de desenvolvimento dos
                            colaboradores.
                        </p>


                        <button
                            id="btnExportarRelatorioPDI"
                            class="btnAcao"
                        >

                            📊 Baixar Relatório

                        </button>

                    </div>


                    <!-- =================================
                         TABELA
                    ================================== -->

                    <div
                        class="card"
                        style="margin-top:20px;"
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


        UI.carregar(
            html
        );


        // =====================================================
        // VOLTAR
        // =====================================================

        const btnVoltar =
            document.getElementById(
                "btnVoltarPDI"
            );


        if (btnVoltar) {

            btnVoltar.onclick = () => {

                ModuloAdmin.abrir(
                    usuario,
                    banco
                );

            };

        }


        // =====================================================
        // EXPORTAR
        // =====================================================

        const btnExportar =
            document.getElementById(
                "btnExportarRelatorioPDI"
            );


        if (btnExportar) {

            btnExportar.onclick = () => {

                this.exportarRelatorio(
                    banco
                );

            };

        }

    },


    // =====================================================
    // EXPORTAR RELATÓRIO
    // =====================================================

    exportarRelatorio(banco) {

        const matrizesPorArea =
            banco.matrizesPorArea || {};


        const linhas = [];


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
                    area.colaboradores || [];


                const habilidades =
                    area.habilidades ||
                    banco.habilidades ||
                    [];


                const avaliacoes =
                    area.avaliacoes || {};


                const matrizEsperada =
                    area.matrizEsperada || {};


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
                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            avaliacao =
                                registro;

                        }
                        else {

                            avaliacao =
                                habilidades.map(
                                    () => 0
                                );

                        }


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

                                    habilidade,

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
        // ARQUIVO
        // =====================================================

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
            "Relatorio_Desenvolvimento.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    },


    // =====================================================
    // FORMATAR CSV
    // =====================================================

    formatarCSV(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(valor)
            .replace(
                /;/g,
                ","
            )
            .replace(
                /\r?\n|\r/g,
                " "
            )
            .trim();

    },


    // =====================================================
    // SEGURANÇA HTML
    // =====================================================

    escapeHTML(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(valor)
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

    pdiIndividual(usuario, banco) {

        // Mantido para compatibilidade.
        // O gestor continua utilizando
        // o Dashboard.

        mostrarDashboard(
            usuario
        );

    }

};