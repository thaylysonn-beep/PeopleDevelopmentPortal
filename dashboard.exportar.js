const DashboardExportar = {


// =====================================================
// MONTAR BOTÃO
// =====================================================

montar() {

    return `

        <div class="barraDashboard">

            <button
                id="btnExportarExcel"
                class="btnAcao">

                📊 Exportar Competências

            </button>

        </div>

    `;

},


// =====================================================
// INICIALIZAR
// =====================================================

iniciar(areaAtual) {

    const btnExcel =
        document.getElementById(
            "btnExportarExcel"
        );


    if (btnExcel) {

        btnExcel.onclick = () => {

            this.exportarCSV(
                areaAtual
            );

        };

    }

},


// =====================================================
// EXPORTAR
// =====================================================

exportarCSV(areaAtual) {

    const colaboradores =
        areaAtual.colaboradores || [];


    const habilidades =
        areaAtual.habilidades || [];


    const avaliacoes =
        areaAtual.avaliacoes || {};


    const matriz =
        areaAtual.matrizEsperada || {};


    const linhas = [];


    // =====================================================
    // PROCESSAR COLABORADORES
    // =====================================================

    colaboradores.forEach(
        colaborador => {

            const esperado =
                matriz[
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
            // CÁLCULOS
            // =================================================

            let soma =
                0;


            let quantidadeAvaliacoes =
                0;


            let gapTotal =
                0;


            let quantidadeGap =
                0;


            const treinamentosGap =
                [];


            const niveisAtuais =
                [];


            // =================================================
            // COMPETÊNCIAS
            // =================================================

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


                    niveisAtuais.push(
                        atual
                    );


                    soma +=
                        atual;


                    quantidadeAvaliacoes++;


                    const gap =
                        Math.max(
                            0,
                            meta - atual
                        );


                    gapTotal +=
                        gap;


                    if (
                        gap > 0
                    ) {

                        quantidadeGap++;


                        treinamentosGap.push(
                            habilidade
                        );

                    }

                }
            );


            // =================================================
            // SCORE
            // =================================================

            const score =
                quantidadeAvaliacoes > 0
                    ? Number(
                        (
                            soma /
                            quantidadeAvaliacoes
                        ).toFixed(2)
                    )
                    : 0;


            // =================================================
            // ATINGIMENTO
            // =================================================

            let totalMeta =
                0;


            let totalAtual =
                0;


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
                niveisAtuais.some(
                    nivel =>
                        Number(
                            nivel
                        ) > 0
                );


            if (
                possuiAvaliacao
            ) {

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
            // LINHA FINAL
            // =================================================

            linhas.push({

                area:
                    areaAtual.nome ||
                    "",

                colaborador:
                    colaborador.nome ||
                    "",

                cargo:
                    colaborador.cargo ||
                    "",

                dataAvaliacao:
                    dataFormatada,

                score,

                atingimento,

                situacao,

                gapTotal,

                quantidadeGap,

                treinamentosGap

            });

        }
    );


    // =====================================================
    // IDENTIFICAR MAIOR NÚMERO DE GAPS
    // =====================================================

    let maiorGap =
        0;


    linhas.forEach(
        linha => {

            if (
                linha.treinamentosGap.length >
                maiorGap
            ) {

                maiorGap =
                    linha.treinamentosGap.length;

            }

        }
    );


    // =====================================================
    // CABEÇALHO
    // =====================================================

    const cabecalho = [

        "Área",

        "Colaborador",

        "Cargo",

        "Data da Avaliação",

        "Score",

        "Atingimento %",

        "Situação",

        "GAP Total",

        "Quantidade GAP"

    ];


    // =====================================================
    // COLUNAS DINÂMICAS DE GAP
    // =====================================================

    for (
        let i = 1;
        i <= maiorGap;
        i++
    ) {

        cabecalho.push(
            `Competência GAP ${i}`
        );

    }


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

    linhas.forEach(
        linha => {

            const dados = [

                linha.area,

                linha.colaborador,

                linha.cargo,

                linha.dataAvaliacao,

                linha.score,

                linha.atingimento,

                linha.situacao,

                linha.gapTotal,

                linha.quantidadeGap

            ];


            for (
                let i = 0;
                i < maiorGap;
                i++
            ) {

                dados.push(

                    linha
                        .treinamentosGap[i] ||
                    ""

                );

            }


            csv +=
                dados
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
    // GERAR ARQUIVO
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
        "Relatorio_Competencias.csv";


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

}


};
