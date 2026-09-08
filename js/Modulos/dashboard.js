const ModuloDashboard = {


// =====================================================
// ABRIR DASHBOARD
// =====================================================

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
                        Área: ${this.escaparHTML(usuario.area)}
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


            <!-- =================================================
                 ÚLTIMA AVALIAÇÃO
            ================================================== -->

            <div
                style="
                    margin-bottom:20px;
                    padding:12px 16px;
                    background:#1c2026;
                    border:1px solid #333a42;
                    border-radius:8px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:15px;
                    flex-wrap:wrap;
                "
            >

                <div>

                    <strong>
                        📅 Última avaliação
                    </strong>

                </div>


                <div
                    style="
                        font-weight:600;
                        color:#e8b923;
                    "
                >

                    ${textoData}

                </div>

            </div>



            <!-- =================================================
                 ATINGIMENTO DA MATRIZ
            ================================================== -->

            <div
                class="card"
                style="
                    margin-bottom:20px;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:20px;
                        flex-wrap:wrap;
                    "
                >

                    <div>

                        <h3 style="margin-bottom:5px;">
                            🎯 Atingimento da Matriz
                        </h3>

                        <span
                            style="
                                color:#9ca3af;
                                font-size:13px;
                            "
                        >
                            Percentual das competências
                            que atingiram o nível esperado
                        </span>

                    </div>


                    <div
                        style="
                            text-align:right;
                        "
                    >

                        <div
                            class="${classeAtingimento}"
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >

                            ${percentual.toFixed(2)}%

                        </div>


                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-top:3px;
                            "
                        >

                            ${textoAtingimento}

                        </div>

                    </div>

                </div>


                <div
                    style="
                        margin-top:15px;
                        height:8px;
                        background:#303640;
                        border-radius:10px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            width:${Math.min(
                                percentual,
                                100
                            )}%;
                            height:100%;
                            background:#e8b923;
                            border-radius:10px;
                            transition:width 0.3s ease;
                        "
                    ></div>

                </div>

            </div>



            <!-- =================================================
                 NOVO - EVOLUÇÃO DAS AVALIAÇÕES
            ================================================== -->

            ${this.montarEvolucaoAvaliacoes(areaAtual)}



            <!-- =================================================
                 INDICADORES ESTRATÉGICOS
            ================================================== -->

            <div style="margin-bottom:20px;">

                <div style="margin-bottom:12px;">

                    <h3 style="margin:0;">
                        📈 Indicadores Estratégicos
                    </h3>

                    <span
                        style="
                            color:#9ca3af;
                            font-size:13px;
                        "
                    >
                        Visão geral da matriz de habilidades
                    </span>

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(190px,1fr)
                            );
                        gap:14px;
                    "
                >


                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            👥 Colaboradores
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${resumo.totalColaboradores}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            Total cadastrado
                        </div>

                    </div>



                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            ✅ Avaliados
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${resumo.avaliados}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            ${resumo.percentualAvaliados.toFixed(2)}% do total
                        </div>

                    </div>



                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            ⏳ Sem avaliação
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${resumo.semAvaliacao}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            Colaboradores pendentes
                        </div>

                    </div>



                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            ⭐ Score médio
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${Number(
                                resumo.scoreMedio || 0
                            ).toFixed(2)}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            Nível médio atual
                        </div>

                    </div>



                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            ⚠️ GAP total
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${resumo.gapTotal}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            Necessidade de desenvolvimento
                        </div>

                    </div>



                    <div
                        class="card"
                        style="
                            margin:0;
                            min-height:105px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                                margin-bottom:8px;
                            "
                        >
                            🧩 Habilidades
                        </div>


                        <div
                            style="
                                font-size:28px;
                                font-weight:700;
                            "
                        >
                            ${resumo.totalHabilidades}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                                margin-top:4px;
                            "
                        >
                            Competências na matriz
                        </div>

                    </div>


                </div>

            </div>



            <!-- =================================================
                 SITUAÇÃO DOS COLABORADORES
            ================================================== -->

            <div
                class="card"
                style="
                    margin-bottom:20px;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:16px;
                        flex-wrap:wrap;
                        gap:10px;
                    "
                >

                    <div>

                        <h3 style="margin:0;">
                            👥 Situação dos Colaboradores
                        </h3>

                        <span
                            style="
                                color:#9ca3af;
                                font-size:12px;
                            "
                        >
                            Distribuição atual por nível de atingimento
                        </span>

                    </div>


                    <div
                        style="
                            font-size:12px;
                            color:#9ca3af;
                        "
                    >

                        Total:
                        <strong>
                            ${situacoes.total}
                        </strong>

                    </div>

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(150px,1fr)
                            );
                        gap:12px;
                    "
                >


                    <div
                        style="
                            padding:15px;
                            background:#20262d;
                            border:1px solid #303840;
                            border-radius:8px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                            "
                        >
                            🟢 Atingiu
                        </div>


                        <div
                            style="
                                font-size:24px;
                                font-weight:700;
                                margin-top:5px;
                            "
                        >
                            ${situacoes.atingiu}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                            "
                        >
                            ${situacoes.percentualAtingiu.toFixed(2)}%
                        </div>

                    </div>



                    <div
                        style="
                            padding:15px;
                            background:#20262d;
                            border:1px solid #303840;
                            border-radius:8px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                            "
                        >
                            🟡 Atenção
                        </div>


                        <div
                            style="
                                font-size:24px;
                                font-weight:700;
                                margin-top:5px;
                            "
                        >
                            ${situacoes.atencao}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                            "
                        >
                            ${situacoes.percentualAtencao.toFixed(2)}%
                        </div>

                    </div>



                    <div
                        style="
                            padding:15px;
                            background:#20262d;
                            border:1px solid #303840;
                            border-radius:8px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                            "
                        >
                            🔴 Crítico
                        </div>


                        <div
                            style="
                                font-size:24px;
                                font-weight:700;
                                margin-top:5px;
                            "
                        >
                            ${situacoes.critico}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                            "
                        >
                            ${situacoes.percentualCritico.toFixed(2)}%
                        </div>

                    </div>



                    <div
                        style="
                            padding:15px;
                            background:#20262d;
                            border:1px solid #303840;
                            border-radius:8px;
                        "
                    >

                        <div
                            style="
                                font-size:12px;
                                color:#9ca3af;
                            "
                        >
                            ⚪ Sem avaliação
                        </div>


                        <div
                            style="
                                font-size:24px;
                                font-weight:700;
                                margin-top:5px;
                            "
                        >
                            ${situacoes.semAvaliacao}
                        </div>


                        <div
                            style="
                                font-size:11px;
                                color:#777f89;
                            "
                        >
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


    // =====================================================
    // NOVO - INICIALIZAR EVOLUÇÃO
    // =====================================================

    this.iniciarEvolucao(
        areaAtual
    );

},



// =====================================================
// MONTAR EVOLUÇÃO DAS AVALIAÇÕES
// =====================================================

montarEvolucaoAvaliacoes(areaAtual) {

    const colaboradores =
        areaAtual.colaboradores || [];


    return `

    <div
        class="card"
        style="
            margin-bottom:20px;
        "
    >

        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:flex-end;
                gap:15px;
                flex-wrap:wrap;
                margin-bottom:18px;
            "
        >

            <div>

                <h3 style="margin:0 0 5px 0;">
                    📈 Evolução das Avaliações
                </h3>

                <span
                    style="
                        color:#9ca3af;
                        font-size:13px;
                    "
                >
                    Acompanhe a evolução da avaliação
                    ao longo do tempo
                </span>

            </div>


            <div
                style="
                    min-width:250px;
                    max-width:350px;
                    width:100%;
                "
            >

                <label
                    style="
                        display:block;
                        color:#9ca3af;
                        font-size:12px;
                        margin-bottom:6px;
                    "
                >
                    Colaborador
                </label>


                <select
                    id="cmbEvolucaoColaborador"
                    style="
                        width:100%;
                        box-sizing:border-box;
                    "
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
            style="
                display:none;
                grid-template-columns:
                    repeat(
                        auto-fit,
                        minmax(150px,1fr)
                    );
                gap:10px;
                margin-bottom:18px;
            "
        >
        </div>


        <div
            id="graficoEvolucaoContainer"
            style="
                position:relative;
                width:100%;
                min-height:320px;
                background:#171b20;
                border:1px solid #333a42;
                border-radius:8px;
                overflow:hidden;
            "
        >

            <div
                id="mensagemEvolucao"
                style="
                    min-height:320px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    text-align:center;
                    color:#777f89;
                    padding:20px;
                    box-sizing:border-box;
                "
            >

                Selecione um colaborador para visualizar
                a evolução das avaliações.

            </div>


            <canvas
                id="canvasEvolucao"
                style="
                    display:none;
                    width:100%;
                    height:320px;
                "
            ></canvas>

        </div>

    </div>

    `;

},



// =====================================================
// INICIAR EVOLUÇÃO
// =====================================================

iniciarEvolucao(areaAtual) {

    const select =
        document.getElementById(
            "cmbEvolucaoColaborador"
        );


    if (!select) {
        return;
    }


    select.onchange = () => {

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

desenharEvolucao(areaAtual, id) {

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
    // RECUPERAR COLABORADOR
    // =================================================

    const colaborador =
        (areaAtual.colaboradores || [])
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
    // RECUPERAR HISTÓRICO
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


                    // Se registros antigos não
                    // possuírem média, calcula aqui.

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


                        if (niveis.length) {

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
    // ORDENAR POR DATA
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

    if (!historico.length) {

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
    // MOSTRAR RESUMO
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
        "color:#9ca3af;";


    if (variacao > 0) {

        textoEvolucao =
            "⬆️ Evolução";

        classeEvolucao =
            "color:#65c466;";

    }

    else if (variacao < 0) {

        textoEvolucao =
            "⬇️ Queda";

        classeEvolucao =
            "color:#ff6b6b;";

    }


    resumo.style.display =
        "grid";


    resumo.innerHTML = `

        <div
            style="
                padding:12px;
                background:#20262d;
                border:1px solid #303840;
                border-radius:8px;
            "
        >

            <div
                style="
                    color:#9ca3af;
                    font-size:11px;
                    margin-bottom:5px;
                "
            >
                Primeira avaliação
            </div>

            <strong
                style="
                    font-size:20px;
                "
            >
                ${primeira.media.toFixed(2)}
            </strong>

            <div
                style="
                    color:#777f89;
                    font-size:10px;
                    margin-top:3px;
                "
            >
                ${this.formatarData(
                    primeira.data
                )}
            </div>

        </div>


        <div
            style="
                padding:12px;
                background:#20262d;
                border:1px solid #303840;
                border-radius:8px;
            "
        >

            <div
                style="
                    color:#9ca3af;
                    font-size:11px;
                    margin-bottom:5px;
                "
            >
                Última avaliação
            </div>

            <strong
                style="
                    font-size:20px;
                "
            >
                ${ultima.media.toFixed(2)}
            </strong>

            <div
                style="
                    color:#777f89;
                    font-size:10px;
                    margin-top:3px;
                "
            >
                ${this.formatarData(
                    ultima.data
                )}
            </div>

        </div>


        <div
            style="
                padding:12px;
                background:#20262d;
                border:1px solid #303840;
                border-radius:8px;
            "
        >

            <div
                style="
                    color:#9ca3af;
                    font-size:11px;
                    margin-bottom:5px;
                "
            >
                Variação
            </div>

            <strong
                style="
                    font-size:20px;
                    ${classeEvolucao}
                "
            >
                ${variacao > 0 ? "+" : ""}
                ${variacao.toFixed(2)}
            </strong>

            <div
                style="
                    font-size:10px;
                    margin-top:3px;
                    ${classeEvolucao}
                "
            >
                ${textoEvolucao}
            </div>

        </div>


        <div
            style="
                padding:12px;
                background:#20262d;
                border:1px solid #303840;
                border-radius:8px;
            "
        >

            <div
                style="
                    color:#9ca3af;
                    font-size:11px;
                    margin-bottom:5px;
                "
            >
                Avaliações
            </div>

            <strong
                style="
                    font-size:20px;
                "
            >
                ${historico.length}
            </strong>

            <div
                style="
                    color:#777f89;
                    font-size:10px;
                    margin-top:3px;
                "
            >
                Registros históricos
            </div>

        </div>

    `;


    // =================================================
    // MOSTRAR CANVAS
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
// DESENHAR GRÁFICO CANVAS
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
        320;


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
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        largura,
        altura
    );


    // =================================================
    // ÁREA DO GRÁFICO
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


    const passos =
        4;


    // =================================================
    // LINHAS HORIZONTAIS
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
            "#303840";


        ctx.lineWidth =
            1;


        ctx.stroke();


        ctx.fillStyle =
            "#9ca3af";


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
        "#4a525c";


    ctx.stroke();


    // =================================================
    // POSIÇÕES
    // =================================================

    const pontos =
        historico.map(
            (item, index) => {

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
            (ponto, index) => {

                if (index === 0) {

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
            "#e8b923";


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
                "#e8b923";


            ctx.fill();


            ctx.strokeStyle =
                "#171b20";


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
                "#ffffff";


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
                "#9ca3af";


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
    // TÍTULO DO EIXO
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
        "#777f89";


    ctx.fillText(
        "Nota média",
        0,
        0
    );


    ctx.restore();


    // =================================================
    // NOME DO COLABORADOR
    // =================================================

    ctx.font =
        "bold 12px Arial";


    ctx.textAlign =
        "left";


    ctx.textBaseline =
        "top";


    ctx.fillStyle =
        "#c5cad0";


    ctx.fillText(
        colaborador.nome || "",
        margemEsquerda,
        8
    );

},



// =====================================================
// FORMATAR DATA
// =====================================================

formatarData(data) {

    if (!data) {
        return "";
    }


    const partes =
        String(data).split("-");


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


    return String(data);

},



// =====================================================
// ESCAPAR HTML
// =====================================================

escaparHTML(valor) {

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

escaparAtributo(valor) {

    return this.escaparHTML(
        valor
    );

}


};