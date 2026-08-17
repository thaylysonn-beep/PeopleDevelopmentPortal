const DashboardUtils = {

    // =====================================================
    // OBTER NÍVEIS DA AVALIAÇÃO
    // =====================================================

    obterNiveis(avaliacao, quantidadeHabilidades = 0) {

        if (!avaliacao) {

            return Array(
                quantidadeHabilidades
            ).fill(0);

        }


        // Novo formato da avaliação:
        //
        // {
        //     data: "2026-08-11",
        //     niveis: [2, 3, 4, 3]
        // }

        if (
            !Array.isArray(avaliacao) &&
            typeof avaliacao === "object"
        ) {

            if (
                Array.isArray(
                    avaliacao.niveis
                )
            ) {

                return avaliacao.niveis;

            }

        }


        // Formato antigo:
        //
        // [2, 3, 4, 3]

        if (
            Array.isArray(avaliacao)
        ) {

            return avaliacao;

        }


        return Array(
            quantidadeHabilidades
        ).fill(0);

    },


    // =====================================================
    // OBTER DATA DA AVALIAÇÃO
    // =====================================================

    obterDataAvaliacao(avaliacao) {

        if (!avaliacao) {

            return "";

        }


        if (
            !Array.isArray(avaliacao) &&
            typeof avaliacao === "object"
        ) {

            return avaliacao.data || "";

        }


        return "";

    },


    // =====================================================
    // FORMATAR DATA
    // =====================================================

    formatarData(data) {

        if (!data) {

            return "";

        }


        // Já está no formato brasileiro

        if (
            typeof data === "string" &&
            data.includes("/")
        ) {

            return data;

        }


        const partes =
            String(data).split("-");


        // YYYY-MM-DD
        // para DD/MM/YYYY

        if (
            partes.length === 3
        ) {

            return (
                partes[2] +
                "/" +
                partes[1] +
                "/" +
                partes[0]
            );

        }


        return data;

    },


    // =====================================================
    // CALCULAR INDICADORES
    // =====================================================

    calcularIndicadores(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        const habilidades =
            areaAtual.habilidades || [];


        const avaliacoes =
            areaAtual.avaliacoes || {};


        const matriz =
            areaAtual.matrizEsperada || {};


        let totalGap = 0;

        let somaNotas = 0;

        let totalNotas = 0;


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


                const avaliacao =
                    this.obterNiveis(
                        registro,
                        habilidades.length
                    );


                avaliacao.forEach(
                    (nota, index) => {

                        const atual =
                            Number(nota) || 0;


                        const nivelEsperado =
                            Number(
                                esperado[index]
                            ) || 0;


                        somaNotas += atual;

                        totalNotas++;


                        totalGap += Math.max(
                            0,
                            nivelEsperado - atual
                        );

                    }
                );

            }
        );


        return {

            colaboradores:
                colaboradores.length,

            habilidades:
                habilidades.length,

            totalGap,

            scoreMedio:
                totalNotas
                    ? (
                        somaNotas /
                        totalNotas
                    ).toFixed(2)
                    : "0.00"

        };

    },


    // =====================================================
    // ATINGIMENTO DA MATRIZ
    // =====================================================
    //
    // Cálculo proporcional:
    //
    // Total dos níveis atuais
    // ----------------------- x 100
    // Total dos níveis esperados
    //
    // Exemplo:
    //
    // Meta 4 / Atual 3 = 75%
    // Meta 4 / Atual 2 = 50%
    //
    // =====================================================

    calcularAtingimento(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        const habilidades =
            areaAtual.habilidades || [];


        const avaliacoes =
            areaAtual.avaliacoes || {};


        const matriz =
            areaAtual.matrizEsperada || {};


        let totalEsperado = 0;

        let totalAtual = 0;


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


                const avaliacao =
                    this.obterNiveis(
                        registro,
                        habilidades.length
                    );


                habilidades.forEach(
                    (habilidade, index) => {

                        const nivelEsperado =
                            Number(
                                esperado[index]
                            ) || 0;


                        const nivelAtual =
                            Number(
                                avaliacao[index]
                            ) || 0;


                        // Só considera habilidades
                        // que possuem uma meta definida.

                        if (
                            nivelEsperado > 0
                        ) {

                            totalEsperado +=
                                nivelEsperado;


                            // Nunca deixa o atual
                            // ultrapassar a meta.

                            totalAtual +=
                                Math.min(
                                    nivelAtual,
                                    nivelEsperado
                                );

                        }

                    }
                );

            }
        );


        if (
            totalEsperado === 0
        ) {

            return "0.00";

        }


        const percentual =
            (
                totalAtual /
                totalEsperado
            ) * 100;


        return percentual.toFixed(2);

    },


    // =====================================================
    // CALCULAR RANKING
    // =====================================================

    calcularRanking(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        const habilidades =
            areaAtual.habilidades || [];


        const avaliacoes =
            areaAtual.avaliacoes || {};


        const matriz =
            areaAtual.matrizEsperada || {};


        return colaboradores

            .map(
                colaborador => {

                    const esperado =
                        matriz[
                            colaborador.cargo
                        ] || [];


                    const registro =
                        avaliacoes[
                            colaborador.id
                        ];


                    const avaliacao =
                        this.obterNiveis(
                            registro,
                            habilidades.length
                        );


                    let soma = 0;

                    let gap = 0;

                    let treinamentosGap = [];


                    // Data da avaliação

                    const data =
                        this.obterDataAvaliacao(
                            registro
                        );


                    avaliacao.forEach(
                        (nota, index) => {

                            const atual =
                                Number(nota) || 0;


                            const nivelEsperado =
                                Number(
                                    esperado[index]
                                ) || 0;


                            soma += atual;


                            if (
                                nivelEsperado >
                                atual
                            ) {

                                gap +=
                                    nivelEsperado -
                                    atual;


                                treinamentosGap.push(
                                    habilidades[index]
                                );

                            }

                        }
                    );


                    return {

                        colaborador,

                        score:
                            avaliacao.length
                                ? (
                                    soma /
                                    avaliacao.length
                                )
                                : 0,

                        gap,

                        treinamentosGap,

                        dataAvaliacao:
                            this.formatarData(
                                data
                            )

                    };

                }
            )

            .sort(
                (a, b) => {

                    // Maior score primeiro

                    if (
                        b.score !==
                        a.score
                    ) {

                        return (
                            b.score -
                            a.score
                        );

                    }


                    // Em caso de empate:
                    // menor GAP primeiro

                    return (
                        a.gap -
                        b.gap
                    );

                }
            );

    },


    // =====================================================
    // ÚLTIMA DATA DE AVALIAÇÃO
    // =====================================================

    obterUltimaDataAvaliacao(areaAtual) {

        const avaliacoes =
            areaAtual.avaliacoes || {};


        const datas = [];


        Object.values(
            avaliacoes
        ).forEach(
            avaliacao => {

                const data =
                    this.obterDataAvaliacao(
                        avaliacao
                    );


                if (data) {

                    datas.push(data);

                }

            }
        );


        if (
            !datas.length
        ) {

            return "";

        }


        datas.sort();


        return this.formatarData(
            datas[
                datas.length - 1
            ]
        );

    },


    // =====================================================
    // CONTAR COLABORADORES AVALIADOS
    // =====================================================

    contarAvaliados(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        const avaliacoes =
            areaAtual.avaliacoes || {};


        const habilidades =
            areaAtual.habilidades || [];


        let total = 0;


        colaboradores.forEach(
            colaborador => {

                const avaliacao =
                    avaliacoes[
                        colaborador.id
                    ];


                if (!avaliacao) {

                    return;

                }


                const niveis =
                    this.obterNiveis(
                        avaliacao,
                        habilidades.length
                    );


                if (
                    niveis.length &&
                    niveis.some(
                        nivel =>
                            Number(nivel) > 0
                    )
                ) {

                    total++;

                }

            }
        );


        return total;

    },


    // =====================================================
    // PERCENTUAL DE COLABORADORES AVALIADOS
    // =====================================================

    percentualAvaliados(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        if (
            !colaboradores.length
        ) {

            return "0.00";

        }


        const avaliados =
            this.contarAvaliados(
                areaAtual
            );


        return (
            (
                avaliados /
                colaboradores.length
            ) * 100
        ).toFixed(2);

    }

};