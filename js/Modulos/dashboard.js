const ModuloDashboard = {

    // =====================================================
    // ABRIR DASHBOARD
    // =====================================================

    abrir(usuario, banco) {

        const areaAtual =
            banco.matrizesPorArea?.[usuario.area];


        if (!areaAtual) {

            alert(
                "Área não encontrada."
            );

            return;

        }


        // =================================================
        // INDICADORES
        // =================================================

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


        // =================================================
        // RESUMO
        // =================================================

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


        // =================================================
        // HTML PRINCIPAL
        // =================================================

        let html = `

            <div class="sistema-layout dashboard-pagina">


                <!-- ==========================================
                     MENU LATERAL
                =========================================== -->

                <aside class="menu-lateral">


                    <div class="menu-lateral-logo">

                       <div class="menu-logo-box">
    <img
        src="assets/logo-corteva.png"
        alt="Corteva"
    >
</div>


                        <div class="menu-logo-texto">

                            <span>
                                People
                            </span>

                            <span>
                                Development
                            </span>

                        </div>

                    </div>


                    <div class="menu-lateral-area">

                        <span>
                            ÁREA
                        </span>

                        <strong>
                            ${this.escaparHTML(
                                usuario.area
                            )}
                        </strong>

                    </div>


                    <nav class="menu-lateral-itens">


                        <button
                            id="btnMatriz"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                🎯
                            </span>

                            <span>
                                Matriz por Cargo
                            </span>

                        </button>


                        <button
                            id="btnColaboradores"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                👥
                            </span>

                            <span>
                                Colaboradores
                            </span>

                        </button>


                        <button
                            id="btnAvaliacao"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                📝
                            </span>

                            <span>
                                Avaliação
                            </span>

                        </button>


                        <button
                            id="btnSucessao"
                            class="menu-lateral-item"
                            type="button"
                        >

                            <span class="menu-icone">
                                👑
                            </span>

                            <span>
                                Sucessão
                            </span>

                        </button>


                        <button
                            id="btnDashboard"
                            class="menu-lateral-item ativo"
                            type="button"
                        >

                            <span class="menu-icone">
                                📊
                            </span>

                            <span>
                                Dashboard
                            </span>

                        </button>


                    </nav>


                    <div class="menu-lateral-rodape">

                        <span>
                            People Development Portal
                        </span>

                    </div>


                </aside>



                <!-- ==========================================
                     ÁREA PRINCIPAL
                =========================================== -->

                <main class="area-principal">


                    <!-- ======================================
                         CABEÇALHO
                    ======================================= -->

                    <div class="cabecalho-pagina">

                        <div>

                            <h1>
                                Dashboard
                            </h1>

                            <p>

                                Área:
                                <strong>
                                    ${this.escaparHTML(
                                        usuario.area
                                    )}
                                </strong>

                            </p>

                        </div>


                        <div class="cabecalho-indicador">

                            <span>
                                Atingimento da matriz
                            </span>

                            <strong>
                                ${percentual.toFixed(2)}%
                            </strong>

                        </div>

                    </div>



                    <!-- ======================================
                         CONTEÚDO
                    ======================================= -->

                    <section class="conteudo-principal">


                        <!-- =================================
                             ÚLTIMA AVALIAÇÃO
                        ================================== -->

                        <div class="card dashboard-card-data">

                            <div>

                                <strong>
                                    📅 Última avaliação
                                </strong>

                            </div>


                            <div class="dashboard-data-valor">

                                ${this.escaparHTML(
                                    textoData
                                )}

                            </div>

                        </div>



                        <!-- =================================
                             ATINGIMENTO
                        ================================== -->

                        <div class="card dashboard-card-atingimento">

                            <div
                                class="dashboard-card-header"
                            >

                                <div>

                                    <h3>
                                        🎯 Atingimento da Matriz
                                    </h3>

                                    <span>

                                        Percentual das competências
                                        que atingiram o nível esperado

                                    </span>

                                </div>


                                <div
                                    class="dashboard-atingimento-valor"
                                >

                                    <div
                                        class="${classeAtingimento}"
                                    >
                                        ${percentual.toFixed(2)}%
                                    </div>

                                    <small>
                                        ${textoAtingimento}
                                    </small>

                                </div>

                            </div>


                            <div
                                class="dashboard-barra"
                            >

                                <div
                                    class="dashboard-barra-preenchida"
                                    style="
                                        width:${Math.min(
                                            percentual,
                                            100
                                        )}%;
                                    "
                                ></div>

                            </div>

                        </div>



                        <!-- =================================
                             EVOLUÇÃO
                        ================================== -->

                        ${this.montarEvolucaoAvaliacoes(
                            areaAtual
                        )}



                        <!-- =================================
                             SITUAÇÃO DOS COLABORADORES
                        ================================== -->

                        <div class="card dashboard-card-situacao">

                            <div
                                class="dashboard-card-header"
                            >

                                <div>

                                    <h3>
                                        👥 Situação dos Colaboradores
                                    </h3>

                                    <span>
                                        Distribuição atual por nível
                                        de atingimento
                                    </span>

                                </div>


                                <div class="dashboard-total">

                                    Total:
                                    <strong>
                                        ${situacoes.total}
                                    </strong>

                                </div>

                            </div>


                            <div
                                class="dashboard-situacoes-grid"
                            >


                                <div class="dashboard-situacao-item">

                                    <span>
                                        🟢 Atingiu
                                    </span>

                                    <strong>
                                        ${situacoes.atingiu}
                                    </strong>

                                    <small>
                                        ${Number(
                                            situacoes.percentualAtingiu || 0
                                        ).toFixed(2)}%
                                    </small>

                                </div>



                                <div class="dashboard-situacao-item">

                                    <span>
                                        🟡 Atenção
                                    </span>

                                    <strong>
                                        ${situacoes.atencao}
                                    </strong>

                                    <small>
                                        ${Number(
                                            situacoes.percentualAtencao || 0
                                        ).toFixed(2)}%
                                    </small>

                                </div>



                                <div class="dashboard-situacao-item">

                                    <span>
                                        🔴 Crítico
                                    </span>

                                    <strong>
                                        ${situacoes.critico}
                                    </strong>

                                    <small>
                                        ${Number(
                                            situacoes.percentualCritico || 0
                                        ).toFixed(2)}%
                                    </small>

                                </div>



                                <div class="dashboard-situacao-item">

                                    <span>
                                        ⚪ Sem avaliação
                                    </span>

                                    <strong>
                                        ${situacoes.semAvaliacao}
                                    </strong>

                                    <small>
                                        Pendentes
                                    </small>

                                </div>


                            </div>

                        </div>



                        <!-- =================================
                             CARDS EXISTENTES
                        ================================== -->

                        <div class="dashboard-modulo-card">

                            ${DashboardCards.montar(
                                indicadores
                            )}

                        </div>



                        <!-- =================================
                             EXPORTAÇÃO
                        ================================== -->

                        <div class="dashboard-modulo-card">

                            ${DashboardExportar.montar()}

                        </div>



                        <!-- =================================
                             RANKING
                        ================================== -->

                        <div class="dashboard-ranking-container">

                            ${DashboardRanking.montar(
                                areaAtual
                            )}

                        </div>



                        <!-- =================================
                             RADAR
                        ================================== -->

                        <div class="dashboard-radar-container">

                            ${DashboardRadar.montar(
                                areaAtual
                            )}

                        </div>



                        <!-- =================================
                             GAP
                        ================================== -->

                        <div class="dashboard-modulo-card">

                            ${DashboardGap.montar(
                                areaAtual
                            )}

                        </div>


                    </section>

                </main>

            </div>

        `;


        // =====================================================
        // CARREGAR
        // =====================================================

        UI.carregar(
            html
        );


        // =====================================================
        // ESTILOS
        // =====================================================

        this.inserirEstilos();


        // =====================================================
        // MENU
        // =====================================================

        this.configurarMenu(
            usuario,
            banco
        );


        // =====================================================
        // INICIALIZAÇÕES
        // =====================================================

        DashboardRadar.iniciar(
            areaAtual
        );


        DashboardExportar.iniciar(
            areaAtual
        );


        this.iniciarEvolucao(
            areaAtual
        );

    },



    // =====================================================
    // ESTILOS
    // =====================================================

    inserirEstilos() {

        if (
            document.getElementById(
                "estilosModuloDashboard"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "estilosModuloDashboard";


        style.textContent = `

            /* =================================================
               ÁREA PRINCIPAL
            ================================================= */

            .dashboard-pagina
            .area-principal {

                background:#f4f7fa;

                min-height:100vh;

            }


/* =================================================
   MENU LATERAL - PADRÃO CLARO
================================================= */

.dashboard-pagina
.menu-lateral {

    background:#ffffff !important;

    color:#344054 !important;

    border-right:1px solid #e4e9ef !important;

    box-shadow:
        2px 0 8px
        rgba(15,23,42,.04);

}


.dashboard-pagina
.menu-logo-box {

    background:#ffffff !important;

    color:#ffffff !important;

    border:1px solid #ffffff !important;

}
.dashboard-pagina
.menu-logo-box {

    display:flex !important;

    align-items:center !important;

    justify-content:center !important;

    overflow:hidden !important;

}

.dashboard-pagina .menu-logo-box img {
    display:block !important;
    width:auto !important;
    height:auto !important;
    max-width:38px !important;
    max-height:38px !important;
    object-fit:contain !important;
}

.dashboard-pagina
.menu-logo-texto strong,

.dashboard-pagina
.menu-logo-texto span {

    color:#256db5 !important;
    font-weight:400 !important;

}


.dashboard-pagina
.menu-lateral-area span {

    color:#98a2b3 !important;

}


.dashboard-pagina
.menu-lateral-area strong {

    color:#17365d !important;

}


.dashboard-pagina
.menu-lateral-rodape span {

    color:#98a2b3 !important;

}


.dashboard-pagina
.menu-lateral-item {

    background:transparent !important;

    color:#52616d !important;

    border-radius:8px !important;

}


.dashboard-pagina
.menu-lateral-item:hover {

    background:#f4f7fa !important;

    color:#005eb8 !important;

}


.dashboard-pagina
.menu-lateral-item.ativo {

    background:#edf4fb !important;

    color:#005eb8 !important;

    font-weight:600 !important;

}


.dashboard-pagina
.menu-lateral-item.ativo .menu-icone {

    color:#005eb8 !important;

}


            /* =================================================
               CABEÇALHO
            ================================================= */

            .dashboard-pagina
            .cabecalho-pagina {

                display:flex;

                align-items:center;

                justify-content:space-between;

                gap:20px;

                padding:
                    28px 32px 22px;

            }


            .dashboard-pagina
            .cabecalho-pagina h1 {

                margin:
                    0 0 6px;

                font-size:28px;

                color:#17365d;

            }


            .dashboard-pagina
            .cabecalho-pagina p {

                margin:0;

                color:#667085;

            }


            .dashboard-pagina
            .cabecalho-indicador {

                min-width:190px;

                padding:
                    14px 18px;

                background:#ffffff;

                border:
                    1px solid #e4e9ef;

                border-radius:12px;

                text-align:right;

                box-shadow:
                    0 2px 8px
                    rgba(15,23,42,.05);

            }


            .dashboard-pagina
            .cabecalho-indicador span {

                display:block;

                font-size:12px;

                color:#667085;

                margin-bottom:4px;

            }


            .dashboard-pagina
            .cabecalho-indicador strong {

                font-size:24px;

                color:#005eb8;

            }


            /* =================================================
               CONTEÚDO
            ================================================= */

            .dashboard-pagina
            .conteudo-principal {

                padding:
                    0 32px 40px;

                width:100%;

                box-sizing:border-box;

            }


            /* =================================================
               CARDS
            ================================================= */

            .dashboard-pagina
            .card {

                background:#ffffff;

                border:
                    1px solid #e4e9ef;

                border-radius:14px;

                box-shadow:
                    0 3px 12px
                    rgba(15,23,42,.05);

                padding:24px;

                box-sizing:border-box;

            }


            .dashboard-pagina
            .dashboard-card-data {

                display:flex;

                align-items:center;

                justify-content:space-between;

                gap:20px;

                flex-wrap:wrap;

                margin-bottom:20px;

                padding:
                    15px 18px;

            }


            .dashboard-pagina
            .dashboard-card-data strong {

                color:#17365d;

                font-size:14px;

            }


            .dashboard-pagina
            .dashboard-data-valor {

                color:#005eb8;

                font-weight:700;

            }


            /* =================================================
               ATINGIMENTO
            ================================================= */

            .dashboard-card-atingimento {

                margin-bottom:20px;

            }


            .dashboard-card-header {

                display:flex;

                justify-content:space-between;

                align-items:center;

                gap:20px;

                flex-wrap:wrap;

            }


            .dashboard-card-header h3 {

                margin:
                    0 0 5px;

                color:#17365d;

                font-size:20px;

            }


            .dashboard-card-header span {

                color:#667085;

                font-size:13px;

            }


            .dashboard-atingimento-valor {

                text-align:right;

            }


            .dashboard-atingimento-valor > div {

                font-size:28px;

                font-weight:700;

            }


            .dashboard-atingimento-valor small {

                display:block;

                margin-top:3px;

                color:#667085;

                font-size:12px;

            }


            .dashboard-barra {

                margin-top:18px;

                height:9px;

                background:#e9edf2;

                border-radius:10px;

                overflow:hidden;

            }


            .dashboard-barra-preenchida {

                height:100%;

                background:#005eb8;

                border-radius:10px;

                transition:
                    width .3s ease;

            }


            /* =================================================
               CORES
            ================================================= */

            .dashboard-pagina
            .atingimentoExcelente {

                color:#16803c;

            }


            .dashboard-pagina
            .atingimentoAtencao {

                color:#b54708;

            }


            .dashboard-pagina
            .atingimentoCritico {

                color:#b42318;

            }


            .dashboard-pagina
            .atingimentoNormal {

                color:#005eb8;

            }


            /* =================================================
               SEÇÕES
            ================================================= */

            .dashboard-secao {

                margin-bottom:20px;

            }


            .dashboard-secao-titulo {

                margin-bottom:12px;

            }


            .dashboard-secao-titulo h3 {

                margin:0 0 4px;

                color:#17365d;

                font-size:20px;

            }


            .dashboard-secao-titulo span {

                color:#667085;

                font-size:13px;

            }


            /* =================================================
               SITUAÇÃO
            ================================================= */

            .dashboard-card-situacao {

                margin-bottom:20px;

            }


            .dashboard-total {

                font-size:12px;

                color:#667085;

            }


            .dashboard-total strong {

                color:#17365d;

            }


            .dashboard-situacoes-grid {

                display:grid;

                grid-template-columns:
                    repeat(
                        4,
                        minmax(0,1fr)
                    );

                gap:12px;

                margin-top:20px;

            }


            .dashboard-situacao-item {

                padding:16px;

                background:#f8fafc;

                border:
                    1px solid #e4e9ef;

                border-radius:10px;

                box-sizing:border-box;

            }


            .dashboard-situacao-item span {

                display:block;

                font-size:12px;

                color:#667085;

            }


            .dashboard-situacao-item strong {

                display:block;

                font-size:24px;

                margin-top:5px;

                color:#17365d;

            }


            .dashboard-situacao-item small {

                display:block;

                font-size:11px;

                color:#98a2b3;

                margin-top:3px;

            }


            /* =================================================
               MÓDULOS
            ================================================= */

            .dashboard-modulo-card {

                width:100%;

                margin-bottom:20px;

                box-sizing:border-box;

            }


            .dashboard-pagina
            .dashboard-modulo-card
            .card {

                background:#ffffff !important;

                border:
                    1px solid #e4e9ef !important;

                border-radius:14px !important;

                box-shadow:
                    0 3px 12px
                    rgba(15,23,42,.05) !important;

                color:#344054;

            }


            /* =================================================
               RANKING
               OCUPAR TODA A ÁREA DISPONÍVEL
            ================================================= */

            .dashboard-ranking-container {

                width:100% !important;

                max-width:none !important;

                min-width:0 !important;

                margin-bottom:20px;

                box-sizing:border-box;

                display:block;

                position:relative;

                overflow:visible !important;

                background:#ffffff;

                border:
                    1px solid #e4e9ef;

                border-radius:14px;

                box-shadow:
                    0 3px 12px
                    rgba(15,23,42,.05);

            }


            .dashboard-ranking-container > * {

                width:100% !important;

                max-width:none !important;

                min-width:0 !important;

                box-sizing:border-box;

                background:#ffffff;

            }


            .dashboard-ranking-container .card {

                width:100% !important;

                max-width:none !important;

                min-width:0 !important;

                margin:0 !important;

                box-sizing:border-box;

                background:#ffffff !important;

                border-color:#e4e9ef !important;

                box-shadow:none !important;

            }


            .dashboard-ranking-container
            table {

                width:100% !important;

                max-width:100% !important;

                box-sizing:border-box;

            }


            /* =================================================
               RADAR
               MANTÉM O TAMANHO CONTROLADO PELO
               DASHBOARDRADAR
            ================================================= */

            .dashboard-radar-container {

                width:100%;

                max-width:none;

                min-width:0;

                margin-bottom:20px;

                box-sizing:border-box;

                display:block;

                position:relative;

                overflow:visible !important;

                background:#ffffff;

                border:
                    1px solid #e4e9ef;

                border-radius:14px;

                box-shadow:
                    0 3px 12px
                    rgba(15,23,42,.05);

            }


            .dashboard-radar-container > * {

                background:#ffffff;

            }


            .dashboard-radar-container .card {

                background:#ffffff !important;

                border-color:#e4e9ef !important;

                box-shadow:none !important;

                overflow:visible !important;

            }


            /* =================================================
               TEXTOS DO RADAR
               CORREÇÃO DO TEXTO BRANCO
            ================================================= */

            .dashboard-radar-container h1,
            .dashboard-radar-container h2,
            .dashboard-radar-container h3,
            .dashboard-radar-container h4,
            .dashboard-radar-container h5,
            .dashboard-radar-container h6 {

                color:#17365d !important;

            }


            .dashboard-radar-container p {

                color:#344054 !important;

            }


            .dashboard-radar-container span {

                color:#344054 !important;

            }


            .dashboard-radar-container label {

                color:#344054 !important;

            }


            .dashboard-radar-container small {

                color:#667085 !important;

            }


            .dashboard-radar-container strong {

                color:#17365d !important;

            }


            .dashboard-radar-container div {

                color:#344054;

            }


            /*
             * Corrige textos que possam estar
             * recebendo branco por estilo inline.
             */

            .dashboard-radar-container
            [style*="color:white"],

            .dashboard-radar-container
            [style*="color: white"],

            .dashboard-radar-container
            [style*="color:#fff"],

            .dashboard-radar-container
            [style*="color: #fff"],

            .dashboard-radar-container
            [style*="color:#ffffff"],

            .dashboard-radar-container
            [style*="color: #ffffff"] {

                color:#344054 !important;

            }


            /*
             * Não força tamanho do canvas.
             */

            .dashboard-radar-container canvas {

                display:block;

                max-width:100%;

                box-sizing:border-box;

            }


            .dashboard-radar-container svg {

                display:block;

                max-width:100%;

                height:auto;

                box-sizing:border-box;

            }


            .dashboard-radar-container
            .radar-container,

            .dashboard-radar-container
            .radar-chart,

            .dashboard-radar-container
            .grafico-radar,

            .dashboard-radar-container
            .dashboard-radar,

            .dashboard-radar-container
            .chart-container {

                max-width:100%;

                box-sizing:border-box;

            }


            /* =================================================
               TABELAS
            ================================================= */

            .dashboard-pagina
            table {

                width:100%;

                background:#ffffff;

                border-collapse:collapse;

                color:#344054;

            }


            .dashboard-pagina
            th {

                background:#edf4fb !important;

                color:#17365d !important;

            }


            .dashboard-pagina
            td {

                color:#344054 !important;

                border-color:#eaecf0 !important;

            }


            /* =================================================
               EVOLUÇÃO
            ================================================= */

            .dashboard-evolucao-card {

                width:100%;

                box-sizing:border-box;

            }


            .dashboard-select-colaborador {

                display:flex;

                flex-direction:column;

                gap:5px;

                min-width:230px;

            }


            .dashboard-select-colaborador label {

                font-size:11px;

                font-weight:600;

                color:#667085;

            }


            .dashboard-select-colaborador select {

                min-width:230px;

                padding:
                    9px 12px;

                border:
                    1px solid #d0d5dd;

                border-radius:8px;

                background:#ffffff;

                color:#344054;

                font-size:13px;

                outline:none;

            }


            .dashboard-select-colaborador select:focus {

                border-color:#005eb8;

                box-shadow:
                    0 0 0 3px
                    rgba(0,94,184,.10);

            }


            .dashboard-resumo-evolucao {

                display:none;

                grid-template-columns:
                    repeat(
                        4,
                        minmax(0,1fr)
                    );

                gap:12px;

                margin-bottom:20px;

            }


            .dashboard-resumo-item {

                background:#f8fafc;

                border:
                    1px solid #e4e9ef;

                border-radius:10px;

                padding:14px;

            }


            .dashboard-resumo-item span {

                display:block;

                color:#667085;

                font-size:11px;

                margin-bottom:5px;

            }


            .dashboard-resumo-item strong {

                display:block;

                color:#17365d;

                font-size:22px;

            }


            .dashboard-resumo-item small {

                display:block;

                color:#98a2b3;

                font-size:11px;

                margin-top:4px;

            }


            .dashboard-evolucao-alta {

                color:#16803c !important;

            }


            .dashboard-evolucao-baixa {

                color:#b42318 !important;

            }


            .dashboard-evolucao-estavel {

                color:#667085 !important;

            }


            .dashboard-grafico-container {

                width:100%;

                min-height:360px;

                position:relative;

                box-sizing:border-box;

                border-radius:10px;

                background:#ffffff;

                overflow:hidden;

            }


            .dashboard-grafico-container canvas {

                display:none;

                width:100%;

                max-width:100%;

                height:320px;

            }


            .dashboard-mensagem-evolucao {

                min-height:320px;

                display:flex;

                align-items:center;

                justify-content:center;

                text-align:center;

                color:#667085;

                font-size:13px;

                background:#f8fafc;

                border:
                    1px dashed #d0d5dd;

                border-radius:10px;

                padding:30px;

                box-sizing:border-box;

            }


            /* =================================================
               RESPONSIVO
            ================================================= */

            @media (
                max-width:1100px
            ) {

                .dashboard-situacoes-grid {

                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );

                }


                .dashboard-resumo-evolucao {

                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );

                }

            }


            @media (
                max-width:900px
            ) {

                .dashboard-pagina
                .cabecalho-pagina {

                    align-items:flex-start;

                }

            }


            @media (
                max-width:700px
            ) {

                .dashboard-pagina
                .conteudo-principal {

                    padding:
                        0 16px 30px;

                }


                .dashboard-pagina
                .cabecalho-pagina {

                    padding:
                        20px 16px;

                }


                .dashboard-pagina
                .cabecalho-indicador {

                    min-width:130px;

                }


                .dashboard-situacoes-grid {

                    grid-template-columns:1fr;

                }


                .dashboard-resumo-evolucao {

                    grid-template-columns:1fr;

                }


                .dashboard-pagina
                .dashboard-card-header {

                    align-items:flex-start;

                }


                .dashboard-pagina
                .dashboard-atingimento-valor {

                    text-align:left;

                }


                .dashboard-select-colaborador,

                .dashboard-select-colaborador select {

                    width:100%;

                    min-width:0;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    },



    // =====================================================
    // MENU LATERAL
    // =====================================================

    configurarMenu(
        usuario,
        banco
    ) {

        const btnMatriz =
            document.getElementById(
                "btnMatriz"
            );


        const btnColaboradores =
            document.getElementById(
                "btnColaboradores"
            );


        const btnAvaliacao =
            document.getElementById(
                "btnAvaliacao"
            );


        const btnSucessao =
            document.getElementById(
                "btnSucessao"
            );


        const btnDashboard =
            document.getElementById(
                "btnDashboard"
            );


        if (btnMatriz) {

            btnMatriz.onclick =
                () => {

                    mostrarDashboard(
                        usuario
                    );

                };

        }


        if (btnColaboradores) {

            btnColaboradores.onclick =
                () => {

                    ModuloColaboradores.abrir(
                        usuario,
                        banco
                    );

                };

        }


        if (btnAvaliacao) {

            btnAvaliacao.onclick =
                () => {

                    ModuloAvaliacao.abrir(
                        usuario,
                        banco
                    );

                };

        }


      if (btnSucessao) {

    btnSucessao.onclick =
        () => {

            solicitarSenhaSucessao(
                usuario
            );

        };

}


        if (btnDashboard) {

            btnDashboard.onclick =
                () => {

                    ModuloDashboard.abrir(
                        usuario,
                        banco
                    );

                };

        }

    },



    // =====================================================
    // MONTAR EVOLUÇÃO DAS AVALIAÇÕES
    // =====================================================

    montarEvolucaoAvaliacoes(
        areaAtual
    ) {

        const colaboradores =
            areaAtual.colaboradores || [];


        return `

            <div
                class="card dashboard-evolucao-card"
                style="
                    margin-bottom:20px;
                "
            >

                <div
                    class="dashboard-card-header"
                    style="
                        align-items:flex-end;
                        margin-bottom:18px;
                    "
                >

                    <div>

                        <h3>
                            📈 Evolução das Avaliações
                        </h3>

                        <span>
                            Acompanhe a evolução da avaliação
                            ao longo do tempo
                        </span>

                    </div>


                    <div
                        class="dashboard-select-colaborador"
                    >

                        <label>
                            Colaborador
                        </label>


                        <select
                            id="cmbEvolucaoColaborador"
                        >

                            <option value="">
                                Selecione um colaborador...
                            </option>

                            ${colaboradores.map(
                                colaborador => `

                                    <option
                                        value="${this.escaparAtributo(
                                            colaborador.id
                                        )}"
                                    >

                                        ${this.escaparHTML(
                                            colaborador.nome
                                        )}

                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>


                <div
                    id="resumoEvolucao"
                    class="dashboard-resumo-evolucao"
                >
                </div>


                <div
                    id="graficoEvolucaoContainer"
                    class="dashboard-grafico-container"
                >

                    <div
                        id="mensagemEvolucao"
                        class="dashboard-mensagem-evolucao"
                    >

                        Selecione um colaborador para visualizar
                        a evolução das avaliações.

                    </div>


                    <canvas
                        id="canvasEvolucao"
                    ></canvas>

                </div>

            </div>

        `;

    },



    // =====================================================
    // INICIAR EVOLUÇÃO
    // =====================================================

    iniciarEvolucao(
        areaAtual
    ) {

        const select =
            document.getElementById(
                "cmbEvolucaoColaborador"
            );


        if (!select) {

            return;

        }


        select.onchange =
            () => {

                const id =
                    select.value;


                if (!id) {

                    this.limparEvolucao();

                    return;

                }


                this.desenharEvolucao(
                    areaAtual,
                    id
                );

            };

    },



    // =====================================================
    // LIMPAR EVOLUÇÃO
    // =====================================================

    limparEvolucao() {

        const canvas =
            document.getElementById(
                "canvasEvolucao"
            );


        const mensagem =
            document.getElementById(
                "mensagemEvolucao"
            );


        const resumo =
            document.getElementById(
                "resumoEvolucao"
            );


        if (canvas) {

            canvas.style.display =
                "none";

        }


        if (mensagem) {

            mensagem.style.display =
                "flex";

            mensagem.innerHTML =
                `
                    Selecione um colaborador para visualizar
                    a evolução das avaliações.
                `;

        }


        if (resumo) {

            resumo.style.display =
                "none";

            resumo.innerHTML =
                "";

        }

    },



    // =====================================================
    // DESENHAR EVOLUÇÃO
    // =====================================================

    desenharEvolucao(
        areaAtual,
        id
    ) {

        const canvas =
            document.getElementById(
                "canvasEvolucao"
            );


        const mensagem =
            document.getElementById(
                "mensagemEvolucao"
            );


        const resumo =
            document.getElementById(
                "resumoEvolucao"
            );


        if (
            !canvas ||
            !mensagem ||
            !resumo
        ) {

            return;

        }


        // =================================================
        // COLABORADOR
        // =================================================

        const colaborador =
            (
                areaAtual.colaboradores || []
            )
            .find(
                c =>
                    String(c.id) ===
                    String(id)
            );


        if (!colaborador) {

            mensagem.style.display =
                "flex";

            mensagem.innerHTML =
                "Colaborador não encontrado.";

            canvas.style.display =
                "none";

            return;

        }


        // =================================================
        // HISTÓRICO
        // =================================================

        const historicoCompleto =
            areaAtual.historicoAvaliacoes
                ? areaAtual.historicoAvaliacoes[id]
                : null;


        let historico =
            Array.isArray(
                historicoCompleto
            )
                ? [...historicoCompleto]
                : [];


        // =================================================
        // COMPATIBILIDADE
        // =================================================

        historico =
            historico
                .filter(
                    registro =>
                        registro &&
                        registro.data
                )
                .map(
                    registro => {

                        let media =
                            Number(
                                registro.media
                            );


                        if (
                            !Number.isFinite(
                                media
                            )
                        ) {

                            const niveis =
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : [];


                            if (
                                niveis.length
                            ) {

                                const soma =
                                    niveis.reduce(
                                        (
                                            total,
                                            nivel
                                        ) =>
                                            total +
                                            Number(
                                                nivel || 0
                                            ),
                                        0
                                    );


                                media =
                                    soma /
                                    niveis.length;

                            }

                            else {

                                media =
                                    0;

                            }

                        }


                        return {

                            data:
                                String(
                                    registro.data
                                ),

                            media:
                                Number(
                                    media.toFixed(2)
                                ),

                            niveis:
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : []

                        };

                    }
                );


        // =================================================
        // ORDENAR
        // =================================================

        historico.sort(
            (a, b) =>
                String(a.data)
                    .localeCompare(
                        String(b.data)
                    )
        );


        // =================================================
        // SEM HISTÓRICO
        // =================================================

        if (
            !historico.length
        ) {

            canvas.style.display =
                "none";


            mensagem.style.display =
                "flex";


            mensagem.innerHTML = `

                <div>

                    <div
                        style="
                            font-size:30px;
                            margin-bottom:8px;
                        "
                    >
                        📊
                    </div>

                    <strong>
                        Ainda não há histórico de avaliações.
                    </strong>

                    <div
                        style="
                            margin-top:6px;
                            font-size:12px;
                        "
                    >
                        As próximas avaliações salvas
                        aparecerão aqui automaticamente.
                    </div>

                </div>

            `;


            resumo.style.display =
                "none";


            return;

        }


        // =================================================
        // RESUMO
        // =================================================

        const primeira =
            historico[0];


        const ultima =
            historico[
                historico.length - 1
            ];


        const variacao =
            Number(
                (
                    ultima.media -
                    primeira.media
                ).toFixed(2)
            );


        let textoEvolucao =
            "➡️ Estável";


        let classeEvolucao =
            "dashboard-evolucao-estavel";


        if (
            variacao > 0
        ) {

            textoEvolucao =
                "⬆️ Evolução";

            classeEvolucao =
                "dashboard-evolucao-alta";

        }

        else if (
            variacao < 0
        ) {

            textoEvolucao =
                "⬇️ Queda";

            classeEvolucao =
                "dashboard-evolucao-baixa";

        }


        resumo.style.display =
            "grid";


        resumo.innerHTML = `

            <div
                class="dashboard-resumo-item"
            >

                <span>
                    Primeira avaliação
                </span>

                <strong>
                    ${primeira.media.toFixed(2)}
                </strong>

                <small>
                    ${this.formatarData(
                        primeira.data
                    )}
                </small>

            </div>


            <div
                class="dashboard-resumo-item"
            >

                <span>
                    Última avaliação
                </span>

                <strong>
                    ${ultima.media.toFixed(2)}
                </strong>

                <small>
                    ${this.formatarData(
                        ultima.data
                    )}
                </small>

            </div>


            <div
                class="dashboard-resumo-item"
            >

                <span>
                    Variação
                </span>

                <strong
                    class="${classeEvolucao}"
                >
                    ${variacao > 0 ? "+" : ""}
                    ${variacao.toFixed(2)}
                </strong>

                <small
                    class="${classeEvolucao}"
                >
                    ${textoEvolucao}
                </small>

            </div>


            <div
                class="dashboard-resumo-item"
            >

                <span>
                    Avaliações
                </span>

                <strong>
                    ${historico.length}
                </strong>

                <small>
                    Registros históricos
                </small>

            </div>

        `;


        // =================================================
        // MOSTRAR
        // =================================================

        mensagem.style.display =
            "none";


        canvas.style.display =
            "block";


        // =================================================
        // DESENHAR
        // =================================================

        this.desenharGraficoCanvas(
            canvas,
            historico,
            colaborador
        );

    },



    // =====================================================
    // DESENHAR GRÁFICO
    // =====================================================

    desenharGraficoCanvas(
        canvas,
        historico,
        colaborador
    ) {

        const container =
            canvas.parentElement;


        if (!container) {

            return;

        }


        const largura =
            container.clientWidth ||
            700;


        const altura =
            Math.max(
                320,
                Math.min(
                    420,
                    Math.round(
                        largura * 0.38
                    )
                )
            );


        const dpr =
            window.devicePixelRatio ||
            1;


        canvas.width =
            largura * dpr;


        canvas.height =
            altura * dpr;


        canvas.style.width =
            largura + "px";


        canvas.style.height =
            altura + "px";


        const ctx =
            canvas.getContext(
                "2d"
            );


        if (!ctx) {

            return;

        }


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr
        );


        ctx.clearRect(
            0,
            0,
            largura,
            altura
        );


        // =================================================
        // ÁREA
        // =================================================

        const margemEsquerda =
            55;


        const margemDireita =
            25;


        const margemTopo =
            25;


        const margemInferior =
            55;


        const graficoLargura =
            largura -
            margemEsquerda -
            margemDireita;


        const graficoAltura =
            altura -
            margemTopo -
            margemInferior;


        // =================================================
        // ESCALA
        // =================================================

        const maxNivel =
            4;


        const minNivel =
            0;


        // =================================================
        // LINHAS
        // =================================================

        ctx.font =
            "11px Arial";


        ctx.textAlign =
            "right";


        ctx.textBaseline =
            "middle";


        for (
            let nivel = minNivel;
            nivel <= maxNivel;
            nivel++
        ) {

            const y =
                margemTopo +
                graficoAltura -
                (
                    (
                        nivel -
                        minNivel
                    ) /
                    (
                        maxNivel -
                        minNivel
                    )
                ) *
                graficoAltura;


            ctx.beginPath();


            ctx.moveTo(
                margemEsquerda,
                y
            );


            ctx.lineTo(
                largura -
                margemDireita,
                y
            );


            ctx.strokeStyle =
                "#dce5ef";


            ctx.lineWidth =
                1;


            ctx.stroke();


            ctx.fillStyle =
                "#667085";


            ctx.fillText(
                nivel.toString(),
                margemEsquerda - 10,
                y
            );

        }


        // =================================================
        // EIXO Y
        // =================================================

        ctx.beginPath();


        ctx.moveTo(
            margemEsquerda,
            margemTopo
        );


        ctx.lineTo(
            margemEsquerda,
            altura -
            margemInferior
        );


        ctx.strokeStyle =
            "#b8c2cc";


        ctx.stroke();


        // =================================================
        // PONTOS
        // =================================================

        const pontos =
            historico.map(
                (
                    item,
                    index
                ) => {

                    let x;


                    if (
                        historico.length === 1
                    ) {

                        x =
                            margemEsquerda +
                            graficoLargura / 2;

                    }

                    else {

                        x =
                            margemEsquerda +
                            (
                                index /
                                (
                                    historico.length -
                                    1
                                )
                            ) *
                            graficoLargura;

                    }


                    const media =
                        Math.max(
                            minNivel,
                            Math.min(
                                maxNivel,
                                Number(
                                    item.media || 0
                                )
                            )
                        );


                    const y =
                        margemTopo +
                        graficoAltura -
                        (
                            (
                                media -
                                minNivel
                            ) /
                            (
                                maxNivel -
                                minNivel
                            )
                        ) *
                        graficoAltura;


                    return {

                        x,
                        y,
                        media,
                        data:
                            item.data

                    };

                }
            );


        // =================================================
        // LINHA
        // =================================================

        if (
            pontos.length > 1
        ) {

            ctx.beginPath();


            pontos.forEach(
                (
                    ponto,
                    index
                ) => {

                    if (
                        index === 0
                    ) {

                        ctx.moveTo(
                            ponto.x,
                            ponto.y
                        );

                    }

                    else {

                        ctx.lineTo(
                            ponto.x,
                            ponto.y
                        );

                    }

                }
            );


            ctx.strokeStyle =
                "#005eb8";


            ctx.lineWidth =
                3;


            ctx.lineJoin =
                "round";


            ctx.lineCap =
                "round";


            ctx.stroke();

        }


        // =================================================
        // PONTOS
        // =================================================

        pontos.forEach(
            ponto => {

                ctx.beginPath();


                ctx.arc(
                    ponto.x,
                    ponto.y,
                    5,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "#005eb8";


                ctx.fill();


                ctx.strokeStyle =
                    "#ffffff";


                ctx.lineWidth =
                    2;


                ctx.stroke();


                // -----------------------------------------
                // VALOR
                // -----------------------------------------

                ctx.font =
                    "bold 11px Arial";


                ctx.textAlign =
                    "center";


                ctx.textBaseline =
                    "bottom";


                ctx.fillStyle =
                    "#17365d";


                ctx.fillText(
                    ponto.media.toFixed(2),
                    ponto.x,
                    ponto.y - 10
                );


                // -----------------------------------------
                // DATA
                // -----------------------------------------

                ctx.font =
                    "10px Arial";


                ctx.textBaseline =
                    "top";


                ctx.fillStyle =
                    "#667085";


                ctx.fillText(
                    this.formatarData(
                        ponto.data
                    ),
                    ponto.x,
                    altura -
                    margemInferior +
                    12
                );

            }
        );


        // =================================================
        // TÍTULO EIXO
        // =================================================

        ctx.save();


        ctx.translate(
            14,
            altura / 2
        );


        ctx.rotate(
            -Math.PI / 2
        );


        ctx.font =
            "11px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#667085";


        ctx.fillText(
            "Nota média",
            0,
            0
        );


        ctx.restore();


        // =================================================
        // NOME COLABORADOR
        // =================================================

        ctx.font =
            "bold 12px Arial";


        ctx.textAlign =
            "left";


        ctx.textBaseline =
            "top";


        ctx.fillStyle =
            "#17365d";


        ctx.fillText(
            colaborador.nome || "",
            margemEsquerda,
            8
        );

    },



    // =====================================================
    // FORMATAR DATA
    // =====================================================

    formatarData(
        data
    ) {

        if (!data) {

            return "";

        }


        const partes =
            String(data)
                .split("-");


        if (
            partes.length === 3
        ) {

            return `
                ${partes[2]}/
                ${partes[1]}/
                ${partes[0]}
            `.replace(
                /\s+/g,
                ""
            );

        }


        return String(
            data
        );

    },



    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    escaparHTML(
        valor
    ) {

        return String(
            valor ?? ""
        )
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
    // ESCAPAR ATRIBUTO
    // =====================================================

    escaparAtributo(
        valor
    ) {

        return this.escaparHTML(
            valor
        );

    }

};