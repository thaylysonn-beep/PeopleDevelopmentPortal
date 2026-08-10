const DashboardGap = {

    montar(areaAtual){

        const colaboradores =
            areaAtual.colaboradores || [];

        const habilidades =
            areaAtual.habilidades || [];

        const avaliacoes =
            areaAtual.avaliacoes || {};

        const matrizEsperada =
            areaAtual.matrizEsperada || {};

        const rankingGap = [];

        habilidades.forEach((habilidade,index)=>{

            let gapTotal = 0;

            colaboradores.forEach(colaborador=>{

                const esperado =
                    matrizEsperada[colaborador.cargo] || [];

                const avaliacao =
                    avaliacoes[colaborador.id] ||
                    habilidades.map(()=>0);

                const nivelEsperado =
                    Number(esperado[index]) || 0;

                const nivelAtual =
                    Number(avaliacao[index]) || 0;

                gapTotal += Math.max(
                    0,
                    nivelEsperado - nivelAtual
                );

            });

            rankingGap.push({

                habilidade,

                gap: gapTotal

            });

        });

        rankingGap.sort((a,b)=>b.gap-a.gap);

        let html = `

        <div class="card">

            <h3>📈 Competências com Maior GAP</h3>

            <table>

                <thead>

                    <tr>

                        <th>Competência</th>

                        <th>GAP</th>

                    </tr>

                </thead>

                <tbody>

        `;

        rankingGap.forEach(item=>{

            html += `

                <tr>

                    <td>${item.habilidade}</td>

                    <td>

                        <span class="gapBadge">

                            ${item.gap}

                        </span>

                    </td>

                </tr>

            `;

        });

        html += `

                </tbody>

            </table>

        </div>

        `;

        return html;

    }

};