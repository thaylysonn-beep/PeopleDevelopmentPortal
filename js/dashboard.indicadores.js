const DashboardIndicadores = {

    // =====================================================
    // FUNÇÕES AUXILIARES
    // =====================================================

    obterColaboradores(areaAtual) {

        return areaAtual.colaboradores || [];

    },


    obterHabilidades(areaAtual) {

        return areaAtual.habilidades || [];

    },


    obterAvaliacoes(areaAtual) {

        return areaAtual.avaliacoes || {};

    },


    obterMatriz(areaAtual) {

        return areaAtual.matrizEsperada || {};

    },


    obterNiveis(avaliacao, quantidadeHabilidades) {

        if (!avaliacao) {

            return Array(
                quantidadeHabilidades
            ).fill(0);

        }


        // Novo formato

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


        // Formato antigo

        if (
            Array.isArray(avaliacao)
        ) {

            return avaliacao;

        }


        return Array(
            quantidadeHabilidades
        ).fill(0);

    },


    obterData(avaliacao) {

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


    formatarData(data) {

        if (!data) {

            return "";

        }


        if (
            typeof data === "string" &&
            data.includes("/")
        ) {

            return data;

        }


        const partes =
            String(data).split("-");


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
    // INDICADOR 1
    // TOTAL DE COLABORADORES
    // =====================================================

    totalColaboradores(areaAtual) {

        return this
            .obterColaboradores(areaAtual)
            .length;

    },


    // =====================================================
    // INDICADOR 2
    // TOTAL DE HABILIDADES
    // =====================================================

    totalHabilidades(areaAtual) {

        return this
            .obterHabilidades(areaAtual)
            .length;

    },


    // =====================================================
    // INDICADOR 3
    // COLABORADORES AVALIADOS
    // =====================================================

    colaboradoresAvaliados(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


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
    // INDICADOR 4
    // COLABORADORES SEM AVALIAÇÃO
    // =====================================================

    colaboradoresSemAvaliacao(areaAtual) {

        const total =
            this.totalColaboradores(
                areaAtual
            );


        const avaliados =
            this.colaboradoresAvaliados(
                areaAtual
            );


        return Math.max(
            0,
            total - avaliados
        );

    },


    // =====================================================
    // INDICADOR 5
    // PERCENTUAL DE AVALIADOS
    // =====================================================

    percentualAvaliados(areaAtual) {

        const total =
            this.totalColaboradores(
                areaAtual
            );


        if (!total) {

            return 0;

        }


        const avaliados =
            this.colaboradoresAvaliados(
                areaAtual
            );


        return Number(
            (
                avaliados /
                total *
                100
            ).toFixed(2)
        );

    },


    // =====================================================
    // INDICADOR 6
    // SCORE MÉDIO
    // =====================================================

    scoreMedio(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        let soma = 0;

        let quantidade = 0;


        colaboradores.forEach(
            colaborador => {

                const avaliacao =
                    avaliacoes[
                        colaborador.id
                    ];


                const niveis =
                    this.obterNiveis(
                        avaliacao,
                        habilidades.length
                    );


                niveis.forEach(
                    nivel => {

                        soma +=
                            Number(nivel) || 0;

                        quantidade++;

                    }
                );

            }
        );


        if (!quantidade) {

            return 0;

        }


        return Number(
            (
                soma /
                quantidade
            ).toFixed(2)
        );

    },


    // =====================================================
    // INDICADOR 7
    // GAP TOTAL
    // =====================================================

    gapTotal(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const matriz =
            this.obterMatriz(
                areaAtual
            );


        let totalGap = 0;


        colaboradores.forEach(
            colaborador => {

                const esperado =
                    matriz[
                        colaborador.cargo
                    ] || [];


                const avaliacao =
                    this.obterNiveis(
                        avaliacoes[
                            colaborador.id
                        ],
                        habilidades.length
                    );


                habilidades.forEach(
                    (habilidade, index) => {

                        const meta =
                            Number(
                                esperado[index]
                            ) || 0;


                        const atual =
                            Number(
                                avaliacao[index]
                            ) || 0;


                        totalGap +=
                            Math.max(
                                0,
                                meta - atual
                            );

                    }
                );

            }
        );


        return totalGap;

    },


    // =====================================================
    // INDICADOR 8
    // ATINGIMENTO DA MATRIZ
    // =====================================================

    atingimentoMatriz(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const matriz =
            this.obterMatriz(
                areaAtual
            );


        let totalEsperado = 0;

        let totalAtual = 0;


        colaboradores.forEach(
            colaborador => {

                const esperado =
                    matriz[
                        colaborador.cargo
                    ] || [];


                const avaliacao =
                    this.obterNiveis(
                        avaliacoes[
                            colaborador.id
                        ],
                        habilidades.length
                    );


                habilidades.forEach(
                    (habilidade, index) => {

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

                            totalEsperado +=
                                meta;


                            totalAtual +=
                                Math.min(
                                    atual,
                                    meta
                                );

                        }

                    }
                );

            }
        );


        if (
            totalEsperado === 0
        ) {

            return 0;

        }


        return Number(
            (
                totalAtual /
                totalEsperado *
                100
            ).toFixed(2)
        );

    },


    // =====================================================
    // INDICADOR 9
    // ÚLTIMA AVALIAÇÃO
    // =====================================================

    ultimaAvaliacao(areaAtual) {

        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const datas = [];


        Object.values(
            avaliacoes
        ).forEach(
            avaliacao => {

                const data =
                    this.obterData(
                        avaliacao
                    );


                if (data) {

                    datas.push(data);

                }

            }
        );


        if (!datas.length) {

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
    // INDICADOR 10
    // GAP POR HABILIDADE
    // =====================================================

    gapPorHabilidade(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const matriz =
            this.obterMatriz(
                areaAtual
            );


        const resultado =
            habilidades.map(
                (
                    habilidade,
                    index
                ) => {

                    let gapAcumulado = 0;

                    let colaboradoresGap = 0;

                    let maiorGap = 0;


                    colaboradores.forEach(
                        colaborador => {

                            const esperado =
                                matriz[
                                    colaborador.cargo
                                ] || [];


                            const avaliacao =
                                this.obterNiveis(
                                    avaliacoes[
                                        colaborador.id
                                    ],
                                    habilidades.length
                                );


                            const meta =
                                Number(
                                    esperado[index]
                                ) || 0;


                            const atual =
                                Number(
                                    avaliacao[index]
                                ) || 0;


                            const gap =
                                Math.max(
                                    0,
                                    meta - atual
                                );


                            if (
                                gap > 0
                            ) {

                                colaboradoresGap++;

                            }


                            gapAcumulado +=
                                gap;


                            maiorGap =
                                Math.max(
                                    maiorGap,
                                    gap
                                );

                        }
                    );


                    return {

                        habilidade,

                        colaboradoresGap,

                        gapAcumulado,

                        maiorGap

                    };

                }
            );


        return resultado.sort(
            (a, b) => {

                if (
                    b.gapAcumulado !==
                    a.gapAcumulado
                ) {

                    return (
                        b.gapAcumulado -
                        a.gapAcumulado
                    );

                }


                return (
                    b.colaboradoresGap -
                    a.colaboradoresGap
                );

            }
        );

    },


    // =====================================================
    // INDICADOR 11
    // SITUAÇÃO DOS COLABORADORES
    // =====================================================

    situacaoColaboradores(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const matriz =
            this.obterMatriz(
                areaAtual
            );


        return colaboradores.map(
            colaborador => {

                const esperado =
                    matriz[
                        colaborador.cargo
                    ] || [];


                const avaliacao =
                    this.obterNiveis(
                        avaliacoes[
                            colaborador.id
                        ],
                        habilidades.length
                    );


                let gap = 0;

                let totalMeta = 0;

                let totalAtual = 0;


                habilidades.forEach(
                    (habilidade, index) => {

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


                        gap +=
                            Math.max(
                                0,
                                meta - atual
                            );

                    }
                );


                const atingimento =
                    totalMeta > 0
                        ? (
                            totalAtual /
                            totalMeta *
                            100
                        )
                        : 0;


                let situacao =
                    "Sem avaliação";


                if (
                    totalAtual > 0 ||
                    avaliacao.some(
                        nivel =>
                            Number(nivel) > 0
                    )
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


                return {

                    colaborador,

                    score:
                        avaliacao.length
                            ? Number(
                                (
                                    avaliacao.reduce(
                                        (
                                            total,
                                            valor
                                        ) =>
                                            total +
                                            (
                                                Number(
                                                    valor
                                                ) || 0
                                            ),
                                        0
                                    ) /
                                    avaliacao.length
                                ).toFixed(2)
                            )
                            : 0,

                    gap,

                    atingimento:
                        Number(
                            atingimento.toFixed(2)
                        ),

                    situacao

                };

            }
        );

    },


    // =====================================================
    // INDICADOR 12
    // RESUMO DAS SITUAÇÕES
    // =====================================================

    resumoSituacoes(areaAtual) {

        const lista =
            this.situacaoColaboradores(
                areaAtual
            );


        let atingiu = 0;

        let atencao = 0;

        let critico = 0;

        let semAvaliacao = 0;


        lista.forEach(
            item => {

                switch (
                    item.situacao
                ) {

                    case "Atingiu":

                        atingiu++;

                        break;


                    case "Atenção":

                        atencao++;

                        break;


                    case "Crítico":

                        critico++;

                        break;


                    default:

                        semAvaliacao++;

                        break;

                }

            }
        );


        const total =
            lista.length;


        return {

            atingiu,

            atencao,

            critico,

            semAvaliacao,

            total,

            percentualAtingiu:
                total
                    ? Number(
                        (
                            atingiu /
                            total *
                            100
                        ).toFixed(2)
                    )
                    : 0,

            percentualAtencao:
                total
                    ? Number(
                        (
                            atencao /
                            total *
                            100
                        ).toFixed(2)
                    )
                    : 0,

            percentualCritico:
                total
                    ? Number(
                        (
                            critico /
                            total *
                            100
                        ).toFixed(2)
                    )
                    : 0

        };

    },


    // =====================================================
    // INDICADOR 13
    // RANKING DE COLABORADORES
    // =====================================================

    ranking(areaAtual) {

        const lista =
            this.situacaoColaboradores(
                areaAtual
            );


        return lista
            .filter(
                item =>
                    item.situacao !==
                    "Sem avaliação"
            )
            .sort(
                (a, b) => {

                    if (
                        b.atingimento !==
                        a.atingimento
                    ) {

                        return (
                            b.atingimento -
                            a.atingimento
                        );

                    }


                    if (
                        b.score !==
                        a.score
                    ) {

                        return (
                            b.score -
                            a.score
                        );

                    }


                    return (
                        a.gap -
                        b.gap
                    );

                }
            );

    },


    // =====================================================
    // INDICADOR 14
    // MAIORES GAPS INDIVIDUAIS
    // =====================================================

    maioresGaps(areaAtual) {

        const lista =
            this.situacaoColaboradores(
                areaAtual
            );


        return lista
            .filter(
                item =>
                    item.situacao !==
                    "Sem avaliação"
            )
            .sort(
                (a, b) => {

                    return (
                        b.gap -
                        a.gap
                    );

                }
            );

    },


    // =====================================================
    // INDICADOR 15
    // RESUMO GERAL
    // =====================================================

    gerarResumo(areaAtual) {

        const totalColaboradores =
            this.totalColaboradores(
                areaAtual
            );


        const totalHabilidades =
            this.totalHabilidades(
                areaAtual
            );


        const avaliados =
            this.colaboradoresAvaliados(
                areaAtual
            );


        const semAvaliacao =
            this.colaboradoresSemAvaliacao(
                areaAtual
            );


        const percentualAvaliados =
            this.percentualAvaliados(
                areaAtual
            );


        const scoreMedio =
            this.scoreMedio(
                areaAtual
            );


        const gapTotal =
            this.gapTotal(
                areaAtual
            );


        const atingimento =
            this.atingimentoMatriz(
                areaAtual
            );


        const ultimaAvaliacao =
            this.ultimaAvaliacao(
                areaAtual
            );


        const situacoes =
            this.resumoSituacoes(
                areaAtual
            );


        return {

            totalColaboradores,

            totalHabilidades,

            avaliados,

            semAvaliacao,

            percentualAvaliados,

            scoreMedio,

            gapTotal,

            atingimento,

            ultimaAvaliacao,

            situacoes

        };

    },


    // =====================================================
    // EXPORTAR DADOS PARA POWER BI
    // =====================================================
    //
    // Esta função prepara os dados em formato de linhas.
    // Não faz download.
    //
    // Futuramente podemos usar exatamente esta estrutura
    // para gerar CSV/Excel para o Power BI.
    //
    // =====================================================

    gerarDadosBI(areaAtual) {

        const colaboradores =
            this.obterColaboradores(
                areaAtual
            );


        const habilidades =
            this.obterHabilidades(
                areaAtual
            );


        const avaliacoes =
            this.obterAvaliacoes(
                areaAtual
            );


        const matriz =
            this.obterMatriz(
                areaAtual
            );


        const linhas = [];


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


                const data =
                    this.formatarData(
                        this.obterData(
                            registro
                        )
                    );


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


                        const gap =
                            Math.max(
                                0,
                                meta - atual
                            );


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

                            habilidade,

                            nivelEsperado:
                                meta,

                            nivelAtual:
                                atual,

                            gap,

                            dataAvaliacao:
                                data

                        });

                    }
                );

            }
        );


        return linhas;

    }

};