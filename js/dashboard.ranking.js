const DashboardRanking = {

    montar(areaAtual) {

        const ranking = DashboardUtils.calcularRanking(areaAtual);

        let html = `

        <div class="card cardRanking">

            <h3>🏆 Ranking dos Colaboradores</h3>

            <div class="ranking-scroll">

                <table>

                    <thead>

                        <tr>
                            <th>Posição</th>
                            <th>Colaborador</th>
                            <th>Cargo</th>
                            <th>Score</th>
                            <th>GAP</th>
                        </tr>

                    </thead>

                    <tbody>
        `;

        ranking.forEach((item,index)=>{

            let medalha="";

            if(index===0) medalha="🥇";
            else if(index===1) medalha="🥈";
            else if(index===2) medalha="🥉";
            else medalha=`${index+1}º`;

            html += `

                <tr>

                    <td>${medalha}</td>

                    <td>${item.colaborador.nome}</td>

                    <td>${item.colaborador.cargo}</td>

                    <td>${item.score.toFixed(2)}</td>

                    <td>${item.gap}</td>

                </tr>

            `;

        });

        html += `

                    </tbody>

                </table>

            </div>

        </div>

        `;

        return html;

    }

};