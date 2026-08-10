const ModuloDashboard = {

    abrir(usuario, banco) {

        const areaAtual = banco.matrizesPorArea[usuario.area];

        if (!areaAtual) {

            alert("Área não encontrada.");

            return;

        }

        // Indicadores
        const indicadores = DashboardUtils.calcularIndicadores(areaAtual);

        let html = `

        <div class="portal">

            <header class="topo">

                <div class="logo-area">

                    <div class="logo-box">
                        📊
                    </div>

                    <div>

                        <h2>Dashboard</h2>

                        <span>
                            Área: ${usuario.area}
                        </span>

                    </div>

                </div>

                <div>

                    <button
                        id="btnVoltar"
                        class="btnSecundario">

                        ← Voltar

                    </button>

                </div>

            </header>

            <section class="conteudo">

        `;

        // Cards
        html += DashboardCards.montar(indicadores);

        // Exportação
        html += DashboardExportar.montar();

        // Ranking + Radar
        html += `
            <div class="dashboardLinha">
        `;

        html += DashboardRanking.montar(areaAtual);

        html += DashboardRadar.montar(areaAtual);

        html += `
            </div>
        `;

        // GAP
        html += DashboardGap.montar(areaAtual);

        html += `

            </section>

        </div>

        `;

        UI.carregar(html);

        // Voltar
        document.getElementById("btnVoltar").onclick = () => {

            mostrarDashboard(usuario);

        };

        // Inicializações
        DashboardRadar.iniciar(areaAtual);

        DashboardExportar.iniciar(areaAtual);

    }

};