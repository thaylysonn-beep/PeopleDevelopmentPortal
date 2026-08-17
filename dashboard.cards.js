const DashboardCards = {

    montar(indicadores) {

        return `

            <div class="cardsDashboard">

                <div class="cardIndicador">

                    <small>👥 Colaboradores</small>

                    <strong>${indicadores.colaboradores}</strong>

                </div>

                <div class="cardIndicador">

                    <small>📚 Habilidades</small>

                    <strong>${indicadores.habilidades}</strong>

                </div>

                <div class="cardIndicador">

                    <small>⭐ Score Médio</small>

                    <strong>${indicadores.scoreMedio}</strong>

                </div>

                <div class="cardIndicador">

                    <small>📉 GAP Total</small>

                    <strong>${indicadores.totalGap}</strong>

                </div>

            </div>

        `;

    }

};