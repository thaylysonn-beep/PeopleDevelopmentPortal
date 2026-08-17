const DashboardGap = {

    montar(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        const habilidades =
            areaAtual.habilidades || [];


        const avaliacoes =
            areaAtual.avaliacoes || {};


        const matrizEsperada =
            areaAtual.matrizEsperada || {};


        const rankingGap = [];


        // =====================================================
        // CALCULAR GAP POR HABILIDADE
        // =====================================================

        habilidades.forEach(
            (habilidade, index) => {

                let gapTotal = 0;


                colaboradores.forEach(
                    colaborador => {


                        // =================================================
                        // NÍVEL ESPERADO
                        // =================================================

                        const esperado =
                            matrizEsperada[
                                colaborador.cargo
                            ] || [];


                        const nivelEsperado =
                            Number(
                                esperado[index]
                            ) || 0;


                        // =================================================
                        // RECUPERAR AVALIAÇÃO
                        // =================================================

                        const registro =
                            avaliacoes[
                                colaborador.id
                            ];


                        let niveis =
                            [];


                        // =================================================
                        // NOVO FORMATO
                        // =================================================
                        //
                        // {
                        //     data: "2026-08-11",
                        //     niveis: [0,1,2,3]
                        // }
                        //

                        if (
                            registro &&
                            typeof registro === "object" &&
                            !Array.isArray(registro)
                        ) {

                            if (
                                Array.isArray(
                                    registro.niveis
                                )
                            ) {

                                niveis =
                                    registro.niveis;

                            }

                        }


                        // =================================================
                        // FORMATO ANTIGO
                        // =================================================

                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            niveis =
                                registro;

                        }


                        // =================================================
                        // NÍVEL ATUAL
                        // =================================================

                        const nivelAtual =
                            Number(
                                niveis[index]
                            ) || 0;


                        // =================================================
                        // CÁLCULO DO GAP
                        // =================================================

                        const gap =
                            Math.max(
                                0,
                                nivelEsperado -
                                nivelAtual
                            );


                        gapTotal +=
                            gap;

                    }
                );


                // =================================================
                // ADICIONAR AO RANKING
                // =================================================

                rankingGap.push({

                    habilidade:
                        habilidade,

                    gap:
                        gapTotal

                });

            }
        );


        // =====================================================
        // ORDENAR DO MAIOR PARA O MENOR
        // =====================================================

        rankingGap.sort(
            (a, b) =>
                b.gap - a.gap
        );


        // =====================================================
        // HTML
        // =====================================================

        let html = `

        <div class="card">

            <h3>
                📈 Competências com Maior GAP
            </h3>


            <table>

                <thead>

                    <tr>

                        <th>
                            Competência
                        </th>


                        <th>
                            GAP
                        </th>

                    </tr>

                </thead>


                <tbody>

        `;


        // =====================================================
        // RESULTADOS
        // =====================================================

        rankingGap.forEach(
            item => {

                html += `

                    <tr>

                        <td>
                            ${item.habilidade}
                        </td>


                        <td>

                            <span class="gapBadge">

                                ${item.gap}

                            </span>

                        </td>

                    </tr>

                `;

            }
        );


        // =====================================================
        // FINALIZAR HTML
        // =====================================================

        html += `

                </tbody>

            </table>

        </div>

        `;


        return html;

    }

};

