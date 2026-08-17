const ModuloDashboard = {


abrir(usuario, banco) {

    const areaAtual =
        banco.matrizesPorArea[usuario.area];

    if (!areaAtual) {

        alert("Área não encontrada.");

        return;

    }

    const indicadores =
        DashboardUtils.calcularIndicadores(
            areaAtual
        );

    const atingimento =
        DashboardUtils.calcularAtingimento
            ? DashboardUtils.calcularAtingimento(
                areaAtual
            )
            : "0.00";

    const ultimaData =
        DashboardUtils.obterUltimaDataAvaliacao(
            areaAtual
        );

    const textoData =
        ultimaData
            ? ultimaData
            : "Nenhuma avaliação registrada";

    const percentual =
        Number(atingimento) || 0;

    let classeAtingimento =
        "atingimentoNormal";

    let textoAtingimento =
        "Atenção";

    if (percentual >= 90) {

        classeAtingimento =
            "atingimentoExcelente";

        textoAtingimento =
            "Excelente";

    }
    else if (percentual >= 75) {

        classeAtingimento =
            "atingimentoAtencao";

        textoAtingimento =
            "Atenção";

    }
    else {

        classeAtingimento =
            "atingimentoCritico";

        textoAtingimento =
            "Crítico";

    }

    const resumo =
        DashboardIndicadores.gerarResumo(
            areaAtual
        );

    const situacoes =
        resumo.situacoes || {
            atingiu: 0,
            atencao: 0,
            critico: 0,
            semAvaliacao: 0,
            total: 0,
            percentualAtingiu: 0,
            percentualAtencao: 0,
            percentualCritico: 0
        };

    let html = `

    <div class="portal">

        <header class="topo">

            <div class="logo-area">

                <div class="logo-box">
                    📊
                </div>

                <div>

                    <h2>
                        Dashboard
                    </h2>

                    <span>
                        Área: ${usuario.area}
                    </span>

                </div>

            </div>

            <div>

                <button
                    id="btnVoltar"
                    class="btnSecundario"
                >
                    ← Voltar
                </button>

            </div>

        </header>

        <section class="conteudo">

            <div
                style="
                    margin-bottom: 20px;
                    padding: 12px 16px;
                    background: #1c2026;
                    border: 1px solid #333a42;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    flex-wrap: wrap;
                "
            >

                <div>

                    <strong>
                        📅 Última avaliação
                    </strong>

                </div>

                <div
                    style="
                        font-weight: 600;
                        color: #e8b923;
                    "
                >

                    ${textoData}

                </div>

            </div>

            <div
                class="card"
                style="
                    margin-bottom: 20px;
                "
            >

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        flex-wrap: wrap;
                    "
                >

                    <div>

                        <h3 style="margin-bottom: 5px;">
                            🎯 Atingimento da Matriz
                        </h3>

                        <span
                            style="
                                color: #9ca3af;
                                font-size: 13px;
                            "
                        >
                            Percentual das competências
                            que atingiram o nível esperado
                        </span>

                    </div>

                    <div
                        style="
                            text-align: right;
                        "
                    >

                        <div
                            class="${classeAtingimento}"
                            style="
                                font-size: 28px;
                                font-weight: 700;
                            "
                        >
                            ${percentual.toFixed(2)}%
                        </div>

                        <div
                            style="
                                font-size: 12px;
                                color: #9ca3af;
                                margin-top: 3px;
                            "
                        >
                            ${textoAtingimento}
                        </div>

                    </div>

                </div>

                <div
                    style="
                        margin-top: 15px;
                        height: 8px;
                        background: #303640;
                        border-radius: 10px;
                        overflow: hidden;
                    "
                >

                    <div
                        style="
                            width: ${Math.min(percentual, 100)}%;
                            height: 100%;
                            background: #e8b923;
                            border-radius: 10px;
                            transition: width 0.3s ease;
                        "
                    ></div>

                </div>

            </div>

            <div style="margin-bottom: 20px;">

                <div style="margin-bottom: 12px;">

                    <h3 style="margin: 0;">
                        📈 Indicadores Estratégicos
                    </h3>

                    <span
                        style="
                            color: #9ca3af;
                            font-size: 13px;
                        "
                    >
                        Visão geral da matriz de habilidades
                    </span>

                </div>

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(190px, 1fr)
                            );
                        gap: 14px;
                    "
                >

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            👥 Colaboradores
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${resumo.totalColaboradores}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            Total cadastrado
                        </div>

                    </div>

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            ✅ Avaliados
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${resumo.avaliados}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            ${resumo.percentualAvaliados.toFixed(2)}% do total
                        </div>

                    </div>

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            ⏳ Sem avaliação
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${resumo.semAvaliacao}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            Colaboradores pendentes
                        </div>

                    </div>

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            ⭐ Score médio
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${Number(resumo.scoreMedio || 0).toFixed(2)}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            Nível médio atual
                        </div>

                    </div>

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            ⚠️ GAP total
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${resumo.gapTotal}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            Necessidade de desenvolvimento
                        </div>

                    </div>

                    <div class="card" style="margin: 0; min-height: 105px;">

                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                            🧩 Habilidades
                        </div>

                        <div style="font-size: 28px; font-weight: 700;">
                            ${resumo.totalHabilidades}
                        </div>

                        <div style="font-size: 11px; color: #777f89; margin-top: 4px;">
                            Competências na matriz
                        </div>

                    </div>

                </div>

            </div>

            <div class="card" style="margin-bottom: 20px;">

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 16px;
                        flex-wrap: wrap;
                        gap: 10px;
                    "
                >

                    <div>

                        <h3 style="margin: 0;">
                            👥 Situação dos Colaboradores
                        </h3>

                        <span
                            style="
                                color: #9ca3af;
                                font-size: 12px;
                            "
                        >
                            Distribuição atual por nível de atingimento
                        </span>

                    </div>

                    <div style="font-size: 12px; color: #9ca3af;">

                        Total:
                        <strong>
                            ${situacoes.total}
                        </strong>

                    </div>

                </div>

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(150px, 1fr)
                            );
                        gap: 12px;
                    "
                >

                    <div style="padding: 15px; background: #20262d; border: 1px solid #303840; border-radius: 8px;">

                        <div style="font-size: 12px; color: #9ca3af;">
                            🟢 Atingiu
                        </div>

                        <div style="font-size: 24px; font-weight: 700; margin-top: 5px;">
                            ${situacoes.atingiu}
                        </div>

                        <div style="font-size: 11px; color: #777f89;">
                            ${situacoes.percentualAtingiu.toFixed(2)}%
                        </div>

                    </div>

                    <div style="padding: 15px; background: #20262d; border: 1px solid #303840; border-radius: 8px;">

                        <div style="font-size: 12px; color: #9ca3af;">
                            🟡 Atenção
                        </div>

                        <div style="font-size: 24px; font-weight: 700; margin-top: 5px;">
                            ${situacoes.atencao}
                        </div>

                        <div style="font-size: 11px; color: #777f89;">
                            ${situacoes.percentualAtencao.toFixed(2)}%
                        </div>

                    </div>

                    <div style="padding: 15px; background: #20262d; border: 1px solid #303840; border-radius: 8px;">

                        <div style="font-size: 12px; color: #9ca3af;">
                            🔴 Crítico
                        </div>

                        <div style="font-size: 24px; font-weight: 700; margin-top: 5px;">
                            ${situacoes.critico}
                        </div>

                        <div style="font-size: 11px; color: #777f89;">
                            ${situacoes.percentualCritico.toFixed(2)}%
                        </div>

                    </div>

                    <div style="padding: 15px; background: #20262d; border: 1px solid #303840; border-radius: 8px;">

                        <div style="font-size: 12px; color: #9ca3af;">
                            ⚪ Sem avaliação
                        </div>

                        <div style="font-size: 24px; font-weight: 700; margin-top: 5px;">
                            ${situacoes.semAvaliacao}
                        </div>

                        <div style="font-size: 11px; color: #777f89;">
                            Pendentes
                        </div>

                    </div>

                </div>

            </div>

    `;


    // =====================================================
    // CARDS EXISTENTES
    // =====================================================

    html +=
        DashboardCards.montar(
            indicadores
        );


    // =====================================================
    // EXPORTAÇÃO
    // =====================================================

    html +=
        DashboardExportar.montar();


    // =====================================================
    // RANKING + RADAR
    // =====================================================

    html += `

        <div class="dashboardLinha">

    `;


    html +=
        DashboardRanking.montar(
            areaAtual
        );


    html +=
        DashboardRadar.montar(
            areaAtual
        );


    html += `

        </div>

    `;


    // =====================================================
    // GAP
    // =====================================================

    html +=
        DashboardGap.montar(
            areaAtual
        );


    // =====================================================
    // FECHAMENTO
    // =====================================================

    html += `

        </section>

    </div>

    `;


    // =====================================================
    // CARREGAR
    // =====================================================

    UI.carregar(
        html
    );


    // =====================================================
    // VOLTAR
    // =====================================================

    const btnVoltar =
        document.getElementById(
            "btnVoltar"
        );


    if (btnVoltar) {

        btnVoltar.onclick = () => {

            mostrarDashboard(
                usuario
            );

        };

    }


    // =====================================================
    // INICIALIZAÇÕES
    // =====================================================

    DashboardRadar.iniciar(
        areaAtual
    );


    DashboardExportar.iniciar(
        areaAtual
    );

}


};
