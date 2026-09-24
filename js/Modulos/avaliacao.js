const ModuloAvaliacao = {

    // =====================================================
    // ABRIR MÓDULO
    // =====================================================

    abrir(usuario, banco) {

        const areaAtual =
            banco.matrizesPorArea &&
            banco.matrizesPorArea[usuario.area];

        if (!areaAtual) {

            alert("Área não encontrada.");
            return;

        }

        // =================================================
        // GARANTIR ESTRUTURAS
        // =================================================

        if (!areaAtual.colaboradores)
            areaAtual.colaboradores = [];

        if (!areaAtual.avaliacoes)
            areaAtual.avaliacoes = {};

        if (!areaAtual.historicoAvaliacoes)
            areaAtual.historicoAvaliacoes = {};

        if (!areaAtual.habilidades)
            areaAtual.habilidades = [];

        if (!areaAtual.detalhesHabilidades)
            areaAtual.detalhesHabilidades = {};

        if (!areaAtual.matrizEsperada)
            areaAtual.matrizEsperada = {};


        const colaboradores =
            areaAtual.colaboradores;


        // =================================================
        // ESTRUTURA PRINCIPAL
        // =================================================

        let html = `

<div id="moduloAvaliacao" class="sistema-layout">

    <!-- =================================================
         MENU LATERAL
    ================================================== -->

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
                ${this.escaparHTML(usuario.area)}
            </strong>

        </div>


        <nav class="menu-lateral-itens">

            <!-- MATRIZ -->

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


            <!-- COLABORADORES -->

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


            <!-- AVALIAÇÃO -->

            <button
                class="menu-lateral-item ativo"
                type="button"
            >

                <span class="menu-icone">
                    📝
                </span>

                <span>
                    Avaliação
                </span>

            </button>


            <!-- DASHBOARD -->

            <button
                id="btnDashboard"
                class="menu-lateral-item"
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


    <!-- =================================================
         ÁREA PRINCIPAL
    ================================================== -->

    <main class="area-principal">


        <!-- =================================================
             CABEÇALHO
        ================================================== -->

        <div class="cabecalho-pagina">

            <div>

                <h1>
                    Avaliação de Competências
                </h1>

                <p>

                    Área:

                    <strong>
                        ${this.escaparHTML(usuario.area)}
                    </strong>

                </p>

            </div>

        </div>


        <!-- =================================================
             CONTEÚDO
        ================================================== -->

        <section class="conteudo-principal">

            <div class="card">


                <!-- =================================================
                     CABEÇALHO DO CARD
                ================================================== -->

                <div class="cabecalho-matriz">

                    <div>

                        <h3>
                            Avaliação de Competências
                        </h3>

                        <p class="subtituloAvaliacao">

                            Selecione um colaborador para
                            iniciar ou atualizar a avaliação.

                        </p>

                    </div>

                </div>


                <!-- =================================================
                     SELEÇÃO DO COLABORADOR
                ================================================== -->

                <div class="selecao-colaborador">

                    <div class="grupoCampo">

                        <label>
                            Colaborador
                        </label>

                        <select id="cmbColaborador">

                            <option value="">
                                Selecione...
                            </option>

                            ${colaboradores.map(c => `

                                <option
                                    value="${this.escaparAtributo(c.id)}"
                                >
                                    ${this.escaparHTML(c.nome)}
                                </option>

                            `).join("")}

                        </select>

                    </div>

                </div>


                <!-- =================================================
                     PAINEL DA AVALIAÇÃO
                ================================================== -->

                <div id="painelAvaliacao">

                    <p class="textoInicialAvaliacao">

                        Selecione um colaborador para
                        iniciar a avaliação.

                    </p>

                </div>


            </div>

        </section>

    </main>

</div>

`;


        // =================================================
        // CARREGAR
        // =================================================

        UI.carregar(html);

        this.aplicarEstilos();


        // =================================================
        // MENU LATERAL
        // =================================================

        const btnMatriz =
            document.getElementById("btnMatriz");

        if (btnMatriz) {

            btnMatriz.onclick = () => {

                mostrarDashboard(usuario);

            };

        }


        const btnColaboradores =
            document.getElementById("btnColaboradores");

        if (btnColaboradores) {

            btnColaboradores.onclick = () => {

                ModuloColaboradores.abrir(
                    usuario,
                    banco
                );

            };

        }


        const btnDashboard =
            document.getElementById("btnDashboard");

        if (btnDashboard) {

            btnDashboard.onclick = () => {

                ModuloDashboard.abrir(
                    usuario,
                    banco
                );

            };

        }


        // =================================================
        // SELEÇÃO DO COLABORADOR
        // =================================================

        const cmbColaborador =
            document.getElementById("cmbColaborador");


        if (cmbColaborador) {

            cmbColaborador.onchange = () => {

                const id =
                    Number(cmbColaborador.value);


                if (!id) {

                    document.getElementById(
                        "painelAvaliacao"
                    ).innerHTML = `

                        <p class="textoInicialAvaliacao">

                            Selecione um colaborador.

                        </p>

                    `;

                    return;

                }


                this.mostrarFormulario(
                    id,
                    usuario,
                    banco
                );

            };

        }

    },


    // =====================================================
    // ESTILOS
    // =====================================================

    aplicarEstilos() {

        if (
            document.getElementById(
                "estilosModuloAvaliacao"
            )
        )
            return;


        const style =
            document.createElement("style");


        style.id =
            "estilosModuloAvaliacao";


        style.textContent = `


/* =====================================================
   BASE
===================================================== */

#moduloAvaliacao {

    width:100%;

    min-height:100vh;

    background:#f4f7fa;

    color:#263238;

}


/* =====================================================
   ÁREA PRINCIPAL
===================================================== */

#moduloAvaliacao .area-principal {

    min-height:100vh;

    background:#f4f7fa;

}


/* =====================================================
   CABEÇALHO DA PÁGINA
===================================================== */

#moduloAvaliacao .cabecalho-pagina {

    padding:28px 34px 22px 34px;

    background:#ffffff;

    border-bottom:1px solid #e1e6eb;

}


#moduloAvaliacao .cabecalho-pagina h1 {

    margin:0 0 7px 0;

    color:#17365d;

    font-size:28px;

    font-weight:700;

}


#moduloAvaliacao .cabecalho-pagina p {

    margin:0;

    color:#65717d;

    font-size:14px;

}


#moduloAvaliacao .cabecalho-pagina strong {

    color:#17365d;

}


/* =====================================================
   CONTEÚDO
===================================================== */

#moduloAvaliacao .conteudo-principal {

    padding:26px 34px 40px 34px;

}


#moduloAvaliacao .card {

    background:#ffffff;

    border:1px solid #e1e6eb;

    border-radius:12px;

    box-shadow:
        0 2px 8px rgba(0,0,0,.04);

    overflow:hidden;

}


/* =====================================================
   CABEÇALHO DO CARD
===================================================== */

#moduloAvaliacao .cabecalho-matriz {

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:24px;

    border-bottom:1px solid #e5e9ed;

}


#moduloAvaliacao .cabecalho-matriz h3 {

    margin:0;

    color:#17365d;

    font-size:19px;

}


#moduloAvaliacao .subtituloAvaliacao {

    margin:6px 0 0 0;

    color:#71808e;

    font-size:13px;

}


/* =====================================================
   SELEÇÃO DO COLABORADOR
===================================================== */

#moduloAvaliacao .selecao-colaborador {

    padding:22px 24px;

    background:#f8fafc;

    border-bottom:1px solid #e5e9ed;

}


#moduloAvaliacao .grupoCampo {

    max-width:520px;

}


#moduloAvaliacao .grupoCampo label {

    display:block;

    margin-bottom:8px;

    color:#263746;

    font-size:13px;

    font-weight:600;

}


#moduloAvaliacao .grupoCampo select {

    width:100%;

    min-height:42px;

    padding:9px 12px;

    border:1px solid #cbd5df;

    border-radius:7px;

    background:#ffffff;

    color:#263746;

    font-size:14px;

    outline:none;

}


#moduloAvaliacao .grupoCampo select:focus {

    border-color:#005eb8;

    box-shadow:
        0 0 0 3px rgba(0,94,184,.10);

}


/* =====================================================
   TEXTO INICIAL
===================================================== */

#moduloAvaliacao .textoInicialAvaliacao {

    margin:0;

    padding:50px 24px;

    text-align:center;

    color:#7a8793;

    font-size:14px;

}


/* =====================================================
   CABEÇALHO DO COLABORADOR
===================================================== */

#moduloAvaliacao .cabecalhoColaborador {

    margin:24px;

    padding:20px;

    background:#f4f8fc;

    border:1px solid #dce6ef;

    border-radius:10px;

    text-align:left;

}


#moduloAvaliacao .cabecalhoColaborador h2 {

    margin:0 0 5px 0;

    color:#17365d;

    font-size:21px;

    font-weight:700;

    text-align:left;

}


#moduloAvaliacao .cabecalhoColaborador p {

    margin:0;

    color:#61707e;

    font-size:14px;

    text-align:left;

}


/* =====================================================
   ÚLTIMA AVALIAÇÃO
===================================================== */

#moduloAvaliacao .ultimaAvaliacao {

    margin:0 24px 18px 24px;

    padding:13px 16px;

    background:#f7f9fb;

    border-left:4px solid #005eb8;

    border-radius:6px;

    color:#53616e;

    font-size:13px;

}


/* =====================================================
   ORIENTAÇÃO
===================================================== */

#moduloAvaliacao .orientacaoAvaliacao {

    margin:0 24px 22px 24px;

    padding:14px 16px;

    background:#eef6fd;

    border:1px solid #cfe4f7;

    border-radius:8px;

    color:#315b7c;

    font-size:13px;

    line-height:1.5;

}


/* =====================================================
   COMPETÊNCIAS
===================================================== */

#moduloAvaliacao .competenciaCard {

    margin:0 24px 20px 24px;

    border:1px solid #dce2e8;

    border-radius:10px;

    overflow:hidden;

    background:#ffffff;

}


#moduloAvaliacao .competenciaCabecalho {

    padding:16px 18px;

    background:#edf4fa;

    border-bottom:1px solid #dce6ef;

}


#moduloAvaliacao .competenciaTituloArea {

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:15px;

}


#moduloAvaliacao .competenciaNome {

    margin:0;

    color:#17365d;

    font-size:17px;

    font-weight:700;

}


#moduloAvaliacao .direcionador {

    margin-top:5px;

    color:#4d6273;

    font-size:12px;

}


#moduloAvaliacao .indicadores {

    display:grid;

    grid-template-columns:
        repeat(3,minmax(0,1fr));

    gap:12px;

    padding:18px;

}


#moduloAvaliacao .indicador {

    padding:13px;

    background:#f7f9fb;

    border:1px solid #e0e5ea;

    border-radius:8px;

}


#moduloAvaliacao .indicador strong {

    display:block;

    margin-bottom:7px;

    color:#435361;

    font-size:11px;

    text-transform:uppercase;

}


#moduloAvaliacao .indicador span {

    color:#263746;

    font-size:14px;

}


/* =====================================================
   SELECT NÍVEL ATUAL
===================================================== */

#moduloAvaliacao .nivelAtual {

    width:100%;

    min-height:38px;

    padding:7px 10px;

    border:1px solid #c8d2dc;

    border-radius:6px;

    background:#ffffff;

    color:#263746;

    font-size:14px;

    font-weight:600;

    outline:none;

}


#moduloAvaliacao .nivelAtual:focus {

    border-color:#005eb8;

    box-shadow:
        0 0 0 3px rgba(0,94,184,.10);

}


/* =====================================================
   VALOR ESPERADO
===================================================== */

#moduloAvaliacao .valorEsperado {

    display:flex;

    align-items:center;

    gap:10px;

    padding:15px 18px;

    border-top:1px solid #e5e9ed;

    border-bottom:1px solid #e5e9ed;

    background:#fafbfd;

}


#moduloAvaliacao .valorEsperado strong {

    color:#435361;

    font-size:13px;

}


#moduloAvaliacao .valorEsperado span {

    display:inline-flex;

    align-items:center;

    justify-content:center;

    min-width:32px;

    height:28px;

    padding:0 8px;

    background:#e8f1fa;

    border-radius:6px;

    color:#174f80;

    font-weight:700;

}


/* =====================================================
   DEFINIÇÃO
===================================================== */

#moduloAvaliacao .definicao {

    padding:17px 18px;

    color:#566572;

    font-size:13px;

    line-height:1.55;

    background:#ffffff;

}


#moduloAvaliacao .tituloDefinicao {

    display:block;

    margin-bottom:5px;

    color:#34495a;

    font-weight:700;

}


/* =====================================================
   BALIZADORES
===================================================== */

#moduloAvaliacao .balizadores {

    padding:18px;

    background:#f7f9fb;

    border-top:1px solid #e5e9ed;

}


#moduloAvaliacao .balizadores h4 {

    margin:0 0 12px 0;

    color:#34495a;

    font-size:13px;

}


#moduloAvaliacao .listaBalizadores {

    display:grid;

    grid-template-columns:
        repeat(4,minmax(0,1fr));

    gap:10px;

}


#moduloAvaliacao .listaBalizadores > div {

    padding:12px;

    background:#ffffff;

    border:1px solid #dfe5ea;

    border-radius:7px;

}


#moduloAvaliacao .listaBalizadores strong {

    display:block;

    margin-bottom:6px;

    color:#17365d;

    font-size:12px;

}


#moduloAvaliacao .listaBalizadores span {

    color:#596875;

    font-size:12px;

    line-height:1.45;

}


/* =====================================================
   GAP
===================================================== */

#moduloAvaliacao .gapValor {

    display:inline-flex;

    align-items:center;

    justify-content:center;

    min-width:48px;

    padding:5px 9px;

    border-radius:6px;

    font-weight:700;

    font-size:12px;

}


#moduloAvaliacao .gapVerde {

    background:#e7f6ec;

    color:#16803c;

}


#moduloAvaliacao .gapAmarelo {

    background:#fff5d6;

    color:#9a6700;

}


#moduloAvaliacao .gapVermelho {

    background:#fdeaea;

    color:#b42318;

}


/* =====================================================
   PAINEL MAIORES GAPS
===================================================== */

#moduloAvaliacao .painelGapCard {

    margin:26px 24px;

    border:1px solid #dce2e8;

    border-radius:10px;

    overflow:hidden;

    background:#ffffff;

}


#moduloAvaliacao .painelGapCabecalho {

    padding:15px 18px;

    background:#f3f6f9;

    border-bottom:1px solid #e1e6eb;

}


#moduloAvaliacao .painelGapCabecalho h3 {

    margin:0;

    color:#17365d;

    font-size:16px;

}


#moduloAvaliacao .painelGapVazio {

    padding:20px;

    color:#16803c;

    font-size:13px;

}


#moduloAvaliacao .gapTabela {

    width:100%;

    border-collapse:collapse;

}


#moduloAvaliacao .gapTabela th {

    padding:11px 15px;

    background:#f8fafc;

    border-bottom:1px solid #e1e6eb;

    text-align:left;

    color:#53616e;

    font-size:12px;

}


#moduloAvaliacao .gapTabela td {

    padding:11px 15px;

    border-bottom:1px solid #edf0f2;

    color:#34424f;

    font-size:13px;

}


#moduloAvaliacao .gapTabela tr:last-child td {

    border-bottom:none;

}


/* =====================================================
   BOTÃO SALVAR
===================================================== */

#moduloAvaliacao .acoesAvaliacao {

    display:flex;

    justify-content:flex-end;

    gap:10px;

    margin:0 24px 24px 24px;

}


#moduloAvaliacao .btnSalvarAvaliacao {

    padding:11px 20px;

    border:none;

    border-radius:7px;

    background:#005eb8;

    color:#ffffff;

    font-weight:600;

    cursor:pointer;

}


#moduloAvaliacao .btnSalvarAvaliacao:hover {

    background:#004b91;

}


/* =====================================================
   RESPONSIVO
===================================================== */

@media(max-width:1100px){

    #moduloAvaliacao .indicadores {

        grid-template-columns:
            repeat(2,minmax(0,1fr));

    }


    #moduloAvaliacao .listaBalizadores {

        grid-template-columns:
            repeat(2,minmax(0,1fr));

    }

}


@media(max-width:800px){

    #moduloAvaliacao .conteudo-principal {

        padding:18px;

    }


    #moduloAvaliacao .cabecalho-pagina {

        padding:20px;

    }


    #moduloAvaliacao .indicadores {

        grid-template-columns:1fr;

    }


    #moduloAvaliacao .listaBalizadores {

        grid-template-columns:1fr;

    }

}

`;

        document.head.appendChild(style);

    },


    // =====================================================
    // MOSTRAR FORMULÁRIO
    // =====================================================

    mostrarFormulario(id, usuario, banco) {

        const areaAtual =
            banco.matrizesPorArea[usuario.area];


        if (!areaAtual)
            return;


        // =================================================
        // GARANTIR ESTRUTURAS
        // =================================================

        if (!areaAtual.habilidades)
            areaAtual.habilidades = [];

        if (!areaAtual.detalhesHabilidades)
            areaAtual.detalhesHabilidades = {};

        if (!areaAtual.matrizEsperada)
            areaAtual.matrizEsperada = {};

        if (!areaAtual.historicoAvaliacoes)
            areaAtual.historicoAvaliacoes = {};

        if (!areaAtual.avaliacoes)
            areaAtual.avaliacoes = {};


        // =================================================
        // COLABORADOR
        // =================================================

        const colaborador =
            areaAtual.colaboradores.find(
                c => Number(c.id) === Number(id)
            );


        if (!colaborador) {

            alert("Colaborador não encontrado.");

            return;

        }


        const habilidades =
            areaAtual.habilidades || [];


        const esperados =
            areaAtual.matrizEsperada[
                colaborador.cargo
            ] || [];


        // =================================================
        // AVALIAÇÃO ATUAL
        // =================================================

        const registroAtual =
            areaAtual.avaliacoes[id];


        let niveisAtuais = [];

        let dataAvaliacao = "";


        if (
            registroAtual &&
            typeof registroAtual === "object" &&
            !Array.isArray(registroAtual)
        ) {

            niveisAtuais =
                Array.isArray(registroAtual.niveis)
                    ? [...registroAtual.niveis]
                    : [];

            dataAvaliacao =
                registroAtual.data || "";

        }

        else if (Array.isArray(registroAtual)) {

            niveisAtuais =
                [...registroAtual];

        }


        while (
            niveisAtuais.length <
            habilidades.length
        ) {

            niveisAtuais.push(0);

        }


        niveisAtuais =
            niveisAtuais.slice(
                0,
                habilidades.length
            );


        // =================================================
        // FORMATAR DATA
        // =================================================

        let dataFormatada = "";


        if (dataAvaliacao) {

            const partes =
                dataAvaliacao.split("-");


            if (partes.length === 3) {

                dataFormatada =
                    `${partes[2]}/${partes[1]}/${partes[0]}`;

            }

            else {

                dataFormatada =
                    dataAvaliacao;

            }

        }


        // =================================================
        // HISTÓRICO
        // =================================================

        const historico =
            areaAtual.historicoAvaliacoes[id] || [];


        let ultimaMedia = null;


        if (historico.length) {

            const ultimo =
                historico[historico.length - 1];

            if (
                ultimo &&
                typeof ultimo.media === "number"
            ) {

                ultimaMedia =
                    ultimo.media;

            }

        }


        // =================================================
        // HTML
        // =================================================

        let html = `


        <!-- =================================================
             COLABORADOR
        ================================================== -->

        <div class="cabecalhoColaborador">

            <h2>
                ${this.escaparHTML(colaborador.nome)}
            </h2>

            <p>

                Cargo:

                <strong>
                    ${this.escaparHTML(colaborador.cargo)}
                </strong>

            </p>

        </div>


        <!-- =================================================
             ÚLTIMA AVALIAÇÃO
        ================================================== -->

        ${
            dataFormatada
            ? `

            <div class="ultimaAvaliacao">

                Última avaliação registrada em

                <strong>
                    ${this.escaparHTML(
                        dataFormatada
                    )}
                </strong>

                ${
                    ultimaMedia !== null
                    ? `

                    — Média:

                    <strong>
                        ${ultimaMedia.toFixed(2)}
                    </strong>

                    `
                    : ""
                }

            </div>

            `
            : ""
        }


        <!-- =================================================
             ORIENTAÇÃO
        ================================================== -->

        <div class="orientacaoAvaliacao">

            <strong>
                Orientação:
            </strong>

            Avalie o nível atual do colaborador
            considerando os balizadores de cada
            competência. O sistema calculará
            automaticamente o GAP em relação
            ao nível esperado para o cargo.

        </div>


        <!-- =================================================
             COMPETÊNCIAS
        ================================================== -->

        ${
            habilidades.length === 0
            ? `

            <div class="textoInicialAvaliacao">

                Nenhuma competência cadastrada
                para esta área.

            </div>

            `
            : ""
        }


        ${habilidades.map(
            (habilidade, index) => {

                const detalhe =
                    areaAtual.detalhesHabilidades[
                        habilidade
                    ] || {};


                const esperado =
                    Number(
                        esperados[index] || 0
                    );


                const atual =
                    Number(
                        niveisAtuais[index] || 0
                    );


                const gap =
                    Math.max(
                        0,
                        esperado - atual
                    );


                const classeGap =
                    gap === 0
                        ? "gapVerde"
                        : gap === 1
                            ? "gapAmarelo"
                            : "gapVermelho";


                const balizadores =
                    detalhe.niveis || {};


                return `

                <div class="competenciaCard">


                    <!-- =================================================
                         CABEÇALHO DA COMPETÊNCIA
                    ================================================== -->

                    <div class="competenciaCabecalho">

                        <div class="competenciaTituloArea">

                            <div>

                                <h3 class="competenciaNome">

                                    ${this.escaparHTML(
                                        habilidade
                                    )}

                                </h3>


                                ${
                                    detalhe.direcionador
                                    ? `

                                    <div class="direcionador">

                                        Direcionador:

                                        <strong>

                                            ${this.escaparHTML(
                                                detalhe.direcionador
                                            )}

                                        </strong>

                                    </div>

                                    `
                                    : ""
                                }

                            </div>


                            <span
                                class="gapValor ${classeGap}"
                                id="gap${index}"
                            >

                                GAP:
                                ${gap}

                            </span>

                        </div>

                    </div>


                    <!-- =================================================
                         INDICADORES
                    ================================================== -->

                    <div class="indicadores">


                        <!-- NÍVEL ESPERADO -->

                        <div class="indicador">

                            <strong>
                                Nível esperado
                            </strong>

                            <span>
                                ${esperado}
                            </span>

                        </div>


                        <!-- NÍVEL ATUAL -->

                        <div class="indicador">

                            <strong>
                                Nível atual
                            </strong>

                            <select
                                class="nivelAtual"
                                data-index="${index}"
                            >

                                <option
                                    value="0"
                                    ${atual === 0 ? "selected" : ""}
                                >
                                    0
                                </option>

                                <option
                                    value="1"
                                    ${atual === 1 ? "selected" : ""}
                                >
                                    1
                                </option>

                                <option
                                    value="2"
                                    ${atual === 2 ? "selected" : ""}
                                >
                                    2
                                </option>

                                <option
                                    value="3"
                                    ${atual === 3 ? "selected" : ""}
                                >
                                    3
                                </option>

                                <option
                                    value="4"
                                    ${atual === 4 ? "selected" : ""}
                                >
                                    4
                                </option>

                            </select>

                        </div>


                        <!-- GAP -->

                        <div class="indicador">

                            <strong>
                                GAP
                            </strong>

                            <span
                                class="gapValor ${classeGap}"
                                data-gap-indicador="${index}"
                            >

                                ${gap}

                            </span>

                        </div>


                    </div>


                    <!-- =================================================
                         DEFINIÇÃO
                    ================================================== -->

                    ${
                        detalhe.definicao
                        ? `

                        <div class="definicao">

                            <span class="tituloDefinicao">

                                Definição

                            </span>

                            ${this.escaparHTML(
                                detalhe.definicao
                            )}

                        </div>

                        `
                        : ""
                    }


                    <!-- =================================================
                         BALIZADORES
                    ================================================== -->

                    ${
                        Object.keys(
                            balizadores
                        ).length
                        ? `

                        <div class="balizadores">

                            <h4>
                                Balizadores por nível
                            </h4>


                            <div class="listaBalizadores">


                                <div>

                                    <strong>
                                        Nível 1
                                    </strong>

                                    <span>

                                        ${this.escaparHTML(
                                            balizadores[1] || ""
                                        )}

                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Nível 2
                                    </strong>

                                    <span>

                                        ${this.escaparHTML(
                                            balizadores[2] || ""
                                        )}

                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Nível 3
                                    </strong>

                                    <span>

                                        ${this.escaparHTML(
                                            balizadores[3] || ""
                                        )}

                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Nível 4
                                    </strong>

                                    <span>

                                        ${this.escaparHTML(
                                            balizadores[4] || ""
                                        )}

                                    </span>

                                </div>


                            </div>

                        </div>

                        `
                        : ""
                    }


                </div>

                `;

            }

        ).join("")}


        <!-- =================================================
             PAINEL DE GAPS + SALVAR
        ================================================== -->

        ${
            habilidades.length
            ? `

            <div
                id="painelMaiorGap"
                class="painelGapCard"
            >

            </div>


            <div class="acoesAvaliacao">

                <button
                    id="btnSalvarAvaliacao"
                    class="btnSalvarAvaliacao"
                    type="button"
                >

                    💾 Salvar Avaliação

                </button>

            </div>

            `
            : ""
        }

        `;


        // =================================================
        // INSERIR
        // =================================================

        const painel =
            document.getElementById(
                "painelAvaliacao"
            );


        if (!painel)
            return;


        painel.innerHTML =
            html;


        this.aplicarEstilos();


        // =================================================
        // ATUALIZAÇÃO DOS GAPS
        // =================================================

        document
            .querySelectorAll(
                "#moduloAvaliacao .nivelAtual"
            )
            .forEach(
                select => {

                    select.onchange = () => {

                        this.atualizarGaps(
                            esperados
                        );

                    };

                }
            );


        this.atualizarGaps(
            esperados
        );


        // =================================================
        // SALVAR
        // =================================================

        const btnSalvar =
            document.getElementById(
                "btnSalvarAvaliacao"
            );


        if (btnSalvar) {

            btnSalvar.onclick =
                async () => {

                    try {

                        const selects =
                            document.querySelectorAll(
                                "#moduloAvaliacao .nivelAtual"
                            );


                        const novaAvaliacao =
                            Array.from(
                                selects
                            ).map(
                                select =>
                                    Number(
                                        select.value
                                    )
                            );


                        const hoje =
                            new Date();


                        const dataHoje =
                            hoje
                                .toISOString()
                                .split("T")[0];


                        const soma =
                            novaAvaliacao.reduce(
                                (
                                    total,
                                    valor
                                ) =>
                                    total + valor,
                                0
                            );


                        const media =
                            novaAvaliacao.length
                                ? soma /
                                  novaAvaliacao.length
                                : 0;


                        if (
                            !areaAtual.avaliacoes
                        ) {

                            areaAtual.avaliacoes =
                                {};

                        }


                        if (
                            !areaAtual.historicoAvaliacoes
                        ) {

                            areaAtual.historicoAvaliacoes =
                                {};

                        }


                        // =================================================
                        // AVALIAÇÃO ATUAL
                        // =================================================

                        areaAtual.avaliacoes[id] = {

                            data:
                                dataHoje,

                            niveis:
                                [
                                    ...novaAvaliacao
                                ]

                        };


                        // =================================================
                        // HISTÓRICO
                        // =================================================

                        if (
                            !Array.isArray(
                                areaAtual.historicoAvaliacoes[id]
                            )
                        ) {

                            areaAtual.historicoAvaliacoes[id] =
                                [];

                        }


                        areaAtual
                            .historicoAvaliacoes[id]
                            .push({

                                data:
                                    dataHoje,

                                niveis:
                                    [
                                        ...novaAvaliacao
                                    ],

                                media:
                                    media

                            });


                        // =================================================
                        // ORDENAR HISTÓRICO
                        // =================================================

                        areaAtual
                            .historicoAvaliacoes[id]
                            .sort(
                                (a, b) =>
                                    String(
                                        a.data
                                    ).localeCompare(
                                        String(
                                            b.data
                                        )
                                    )
                            );


                        // =================================================
                        // SALVAR BANCO
                        // =================================================

                        await Storage.salvarBanco(
                            banco
                        );


                        alert(
                            "Avaliação salva com sucesso."
                        );


                        // =================================================
                        // RECARREGAR
                        // =================================================

                        this.mostrarFormulario(
                            id,
                            usuario,
                            banco
                        );


                    }

                    catch (erro) {

                        console.error(
                            erro
                        );

                        alert(
                            "Erro ao salvar a avaliação."
                        );

                    }

                };

        }

    },


    // =====================================================
    // ATUALIZAR GAPS
    // =====================================================

    atualizarGaps(esperados) {

        const selects =
            document.querySelectorAll(
                "#moduloAvaliacao .nivelAtual"
            );


        const gaps = [];


        selects.forEach(
            (select, index) => {

                const atual =
                    Number(
                        select.value || 0
                    );


                const esperado =
                    Number(
                        esperados[index] || 0
                    );


                const gap =
                    Math.max(
                        0,
                        esperado - atual
                    );


                // =================================================
                // GAP PRINCIPAL
                // =================================================

                const elemento =
                    document.getElementById(
                        `gap${index}`
                    );


                if (elemento) {

                    elemento.textContent =
                        `GAP: ${gap}`;


                    elemento.classList.remove(
                        "gapVerde",
                        "gapAmarelo",
                        "gapVermelho"
                    );


                    if (gap === 0) {

                        elemento.classList.add(
                            "gapVerde"
                        );

                    }

                    else if (gap === 1) {

                        elemento.classList.add(
                            "gapAmarelo"
                        );

                    }

                    else {

                        elemento.classList.add(
                            "gapVermelho"
                        );

                    }

                }


                // =================================================
                // GAP INDICADOR
                // =================================================

                const indicador =
                    document.querySelector(
                        `[data-gap-indicador="${index}"]`
                    );


                if (indicador) {

                    indicador.textContent =
                        gap;


                    indicador.classList.remove(
                        "gapVerde",
                        "gapAmarelo",
                        "gapVermelho"
                    );


                    if (gap === 0) {

                        indicador.classList.add(
                            "gapVerde"
                        );

                    }

                    else if (gap === 1) {

                        indicador.classList.add(
                            "gapAmarelo"
                        );

                    }

                    else {

                        indicador.classList.add(
                            "gapVermelho"
                        );

                    }

                }


                // =================================================
                // MAIORES GAPS
                // =================================================

                if (gap > 0) {

                    const card =
                        select.closest(
                            ".competenciaCard"
                        );


                    const titulo =
                        card
                            ? card.querySelector(
                                ".competenciaNome"
                            )
                            : null;


                    gaps.push({

                        competencia:
                            titulo
                                ? titulo
                                    .textContent
                                    .trim()
                                : `Competência ${index + 1}`,

                        gap:
                            gap

                    });

                }

            }
        );


        // =================================================
        // ORDENAR
        // =================================================

        gaps.sort(
            (a, b) =>
                b.gap - a.gap
        );


        // =================================================
        // PAINEL
        // =================================================

        const painel =
            document.getElementById(
                "painelMaiorGap"
            );


        if (!painel)
            return;


        if (gaps.length === 0) {

            painel.innerHTML = `

                <div class="painelGapCabecalho">

                    <h3>
                        Maiores GAPs
                    </h3>

                </div>

                <div class="painelGapVazio">

                    ✓ Nenhuma competência possui GAP.

                </div>

            `;

            return;

        }


        painel.innerHTML = `

            <div class="painelGapCabecalho">

                <h3>
                    Maiores GAPs
                </h3>

            </div>


            <table class="gapTabela">

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

                    ${gaps.map(
                        item => `

                        <tr>

                            <td>

                                ${this.escaparHTML(
                                    item.competencia
                                )}

                            </td>

                            <td>

                                <span
                                    class="
                                        gapValor
                                        ${
                                            item.gap === 1
                                                ? "gapAmarelo"
                                                : "gapVermelho"
                                        }
                                    "
                                >

                                    ${item.gap}

                                </span>

                            </td>

                        </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        `;

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