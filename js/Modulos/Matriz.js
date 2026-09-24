const ModuloMatriz = {

    abrir(usuario, banco) {

        // =========================================================
        // PREPARAÇÃO DO BANCO
        // =========================================================

        banco.colaboradores = banco.colaboradores || [];
        banco.habilidades = banco.habilidades || [];
        banco.avaliacoes = banco.avaliacoes || {};
        banco.matrizEsperada = banco.matrizEsperada || {};
        banco.detalhesHabilidades = banco.detalhesHabilidades || {};
        banco.matrizesPorArea = banco.matrizesPorArea || {};

        const colaboradores = banco.colaboradores;
        const habilidades = banco.habilidades;
        const avaliacoes = banco.avaliacoes;
        const matrizEsperada = banco.matrizEsperada;

        const areaUsuario = usuario.area || "";

        // =========================================================
        // GARANTE MATRIZ DA ÁREA
        // =========================================================

        if (!banco.matrizesPorArea[areaUsuario]) {

            banco.matrizesPorArea[areaUsuario] = {

                nome: areaUsuario,

                cargos: [],

                habilidades: [],

                matrizEsperada: {},

                detalhesHabilidades: {}

            };

        }

        const matrizArea = banco.matrizesPorArea[areaUsuario];

        matrizArea.cargos = matrizArea.cargos || [];
        matrizArea.habilidades = matrizArea.habilidades || [];
        matrizArea.matrizEsperada = matrizArea.matrizEsperada || {};
        matrizArea.detalhesHabilidades =
            matrizArea.detalhesHabilidades || {};

        // =========================================================
        // COMPATIBILIDADE COM BANCO ANTIGO
        // =========================================================

        if (
            matrizArea.habilidades.length === 0 &&
            habilidades.length > 0
        ) {

            matrizArea.habilidades = [...habilidades];

        }

        // =========================================================
        // FUNÇÕES AUXILIARES
        // =========================================================

        const escaparHTML = valor => {

            return String(valor ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        };

        const normalizar = texto => {

            return String(texto || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();

        };

        const obterDetalhes = habilidade => {

            return (

                matrizArea.detalhesHabilidades[habilidade]

                ||

                banco.detalhesHabilidades[habilidade]

                ||

                {

                    nome: habilidade,

                    direcionador: "",

                    definicao: "",

                    niveis: {

                        1: "",
                        2: "",
                        3: "",
                        4: ""

                    }

                }

            );

        };

        // =========================================================
        // OBTÉM CARGOS
        // =========================================================

        const obterCargos = () => {

            const lista = [];

            colaboradores.forEach(c => {

                if (c.cargo) {

                    if (!lista.includes(c.cargo)) {

                        lista.push(c.cargo);

                    }

                }

            });

            if (Array.isArray(banco.cargos)) {

                banco.cargos.forEach(c => {

                    const nome =
                        typeof c === "string"
                            ? c
                            : c?.nome || c?.cargo || "";

                    if (
                        nome &&
                        !lista.includes(nome)
                    ) {

                        lista.push(nome);

                    }

                });

            }

            matrizArea.cargos.forEach(c => {

                const nome =
                    typeof c === "string"
                        ? c
                        : c?.nome || c?.cargo || "";

                if (
                    nome &&
                    !lista.includes(nome)
                ) {

                    lista.push(nome);

                }

            });

            return lista.sort(
                (a, b) =>
                    String(a).localeCompare(
                        String(b),
                        "pt-BR"
                    )
            );

        };

        const cargos = obterCargos();

        // =========================================================
        // ESTILO EXCLUSIVO DA MATRIZ
        // =========================================================

        const estiloMatriz = `

<style id="estiloModuloMatrizCargo">

/* ============================================================
   MATRIZ DE HABILIDADES
   ESTILO LOCAL DO MÓDULO
   ============================================================ */

#moduloMatrizCargo {

    width: 100%;
    box-sizing: border-box;

    color: #dbe3eb;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

}


/* ============================================================
   RESET DOS CAMPOS
   ============================================================ */

#moduloMatrizCargo input,
#moduloMatrizCargo select,
#moduloMatrizCargo textarea {

    box-sizing: border-box !important;

    background: #ffffff !important;

    background-color: #ffffff !important;

    color: #17324d !important;

    border: 1px solid #cbd5e1 !important;

    border-radius: 7px !important;

    box-shadow: none !important;

    opacity: 1 !important;

    -webkit-appearance: auto;

}


/* ============================================================
   INPUT
   ============================================================ */

#moduloMatrizCargo input {

    min-height: 40px;

    padding: 9px 12px !important;

    font-size: 14px;

}


/* ============================================================
   SELECT
   ============================================================ */

#moduloMatrizCargo select {

    min-height: 40px;

    padding: 7px 34px 7px 12px !important;

    font-size: 14px;

    cursor: pointer;

}


/* ============================================================
   SELECT NÍVEL ESPERADO
   ============================================================ */

#moduloMatrizCargo .selectNivelEsperado {

    display: block !important;

    width: 76px !important;
    min-width: 76px !important;
    max-width: 76px !important;

    height: 38px !important;
    min-height: 38px !important;
    max-height: 38px !important;

    box-sizing: border-box !important;

    padding: 6px 24px 6px 10px !important;

    background: #ffffff !important;
    background-color: #ffffff !important;

    color: #17324d !important;

    border: 1px solid #cbd5e1 !important;

    border-radius: 7px !important;

    box-shadow: none !important;

    opacity: 1 !important;

    font-family: Arial, Helvetica, sans-serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;

    text-align: center !important;

    cursor: pointer !important;

    -webkit-appearance: auto !important;
    appearance: auto !important;
}


/* OPÇÕES DO SELECT */

#moduloMatrizCargo .selectNivelEsperado option {

    background: #ffffff !important;

    background-color: #ffffff !important;

    color: #17324d !important;

    font-family: Arial, Helvetica, sans-serif !important;

    font-size: 14px !important;

    font-weight: 600 !important;

}


/* ============================================================
   TEXTAREA
   ============================================================ */

#moduloMatrizCargo textarea {

    width: 100% !important;

    min-height: 80px;

    padding: 10px 12px !important;

    resize: vertical;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    font-size: 14px;

    line-height: 1.45;

}


/* ============================================================
   PLACEHOLDER
   ============================================================ */

#moduloMatrizCargo input::placeholder,
#moduloMatrizCargo textarea::placeholder {

    color: #64748b !important;

    opacity: 1 !important;

}


/* ============================================================
   FOCO
   ============================================================ */

#moduloMatrizCargo input:focus,
#moduloMatrizCargo select:focus,
#moduloMatrizCargo textarea:focus {

    outline: none !important;

    border-color: #2563eb !important;

    box-shadow:
        0 0 0 3px rgba(37, 99, 235, .10)
        !important;

}


/* ============================================================
   TABELA
   ============================================================ */

#moduloMatrizCargo .matrizTabela {

    width: 100%;

    border-collapse: separate;

    border-spacing: 0;

    table-layout: fixed;

    background: #ffffff;

    border: 1px solid #e2e8f0;

    border-radius: 9px;

    overflow: hidden;

}


/* ============================================================
   CABEÇALHO
   ============================================================ */

#moduloMatrizCargo .matrizTabela thead th {

    background: #f1f5f9 !important;

    color: #334155 !important;

    border-bottom: 1px solid #dbe3ec;

    padding: 13px 10px;

    font-size: 12px;

    font-weight: 700;

    text-align: left;

    vertical-align: middle;

}


/* ============================================================
   COLUNA COMPETÊNCIA
   ============================================================ */

#moduloMatrizCargo .matrizTabela th.colunaCompetencia,
#moduloMatrizCargo .matrizTabela td.colunaCompetencia {

    width: 42% !important;

    min-width: 260px !important;

    box-sizing: border-box !important;

    text-align: left;

}


/* ============================================================
   COLUNAS DE CARGO
   DIRECIONADOR + NÍVEL ESPERADO
   ============================================================ */

#moduloMatrizCargo .matrizTabela th.colunaCargo,
#moduloMatrizCargo .matrizTabela td.colunaCargo {

    width: 24% !important;

    min-width: 0 !important;

    box-sizing: border-box !important;

    text-align: center;

    vertical-align: middle;

}


/* ============================================================
   COLUNA AÇÃO
   ============================================================ */

#moduloMatrizCargo .matrizTabela th.colunaAcao,
#moduloMatrizCargo .matrizTabela td.colunaAcao {

    width: 10% !important;

    min-width: 70px !important;
    max-width: 100px !important;

    box-sizing: border-box !important;

    text-align: center;

    vertical-align: middle;

}


/* ============================================================
   LINHAS
   ============================================================ */

#moduloMatrizCargo .matrizTabela tbody tr {

    background: #ffffff;

}


#moduloMatrizCargo .matrizTabela tbody tr:hover {

    background: #f8fafc;

}


/* ============================================================
   CÉLULAS
   ============================================================ */

#moduloMatrizCargo .matrizTabela tbody td {

    padding: 10px;

    border-bottom: 1px solid #e8edf3;

    vertical-align: middle;

    color: #243b53;

    font-size: 13px;

}


/* ============================================================
   ÚLTIMA LINHA
   ============================================================ */

#moduloMatrizCargo .matrizTabela tbody tr:last-child td {

    border-bottom: none;

}


/* ============================================================
   NOME DA COMPETÊNCIA
   ============================================================ */

#moduloMatrizCargo .nomeCompetencia {

    font-weight: 600;

    color: #17324d;

    line-height: 1.35;

}


/* ============================================================
   NOME DO CARGO
   ============================================================ */

#moduloMatrizCargo .nomeCargo {

    display: block;

    color: #17324d;

    font-weight: 700;

    line-height: 1.25;

    text-align: center;

    word-break: normal;

    overflow-wrap: anywhere;

}


/* ============================================================
   CÉLULA DO NÍVEL ESPERADO
   ============================================================ */

#moduloMatrizCargo .celulaNivel {

    display: flex !important;

    align-items: center !important;

    justify-content: center !important;

    width: 100% !important;

    min-width: 0 !important;

    box-sizing: border-box !important;

}


/* ============================================================
   BOTÕES
   ============================================================ */

#moduloMatrizCargo button {

    box-sizing: border-box;

    border: 1px solid #cbd5e1;

    background: #ffffff;

    color: #dbe3eb;

    border-radius: 7px;

    padding: 9px 13px;

    min-height: 38px;

    cursor: pointer;

    font-size: 13px;

    font-weight: 600;

    transition:
        background .15s ease,
        border-color .15s ease,
        box-shadow .15s ease;

}


#moduloMatrizCargo button:hover {

    background: #f1f5f9;

    border-color: #94a3b8;

}


/* ============================================================
   BOTÕES PRINCIPAIS
   ============================================================ */

#moduloMatrizCargo .btnPrincipal {

    background: #ffffff !important;

    color: #174a7c !important;

    border: 1px solid #b9cce0 !important;

}


#moduloMatrizCargo .btnPrincipal:hover {

    background: #eef6ff !important;

    border-color: #7da7d1 !important;

}


/* ============================================================
   BOTÃO EXCLUIR / LIXEIRA
   PADRÃO AZUL CORTEVA
   ============================================================ */

#moduloMatrizCargo .btnExcluir {

    display: inline-flex !important;

    align-items: center !important;

    justify-content: center !important;

    min-width: 38px !important;

    width: 38px !important;

    height: 38px !important;

    min-height: 38px !important;

    max-height: 38px !important;

    padding: 0 !important;

    box-sizing: border-box !important;

    background: #174a7c !important;

    background-color: #174a7c !important;

    color: #ffffff !important;

    border: 1px solid #174a7c !important;

    border-radius: 7px !important;

    font-size: 16px !important;

    line-height: 1 !important;

    cursor: pointer !important;

}


#moduloMatrizCargo .btnExcluir:hover {

    background: #0f3b63 !important;

    background-color: #0f3b63 !important;

    color: #ffffff !important;

    border-color: #0f3b63 !important;

}


#moduloMatrizCargo .btnExcluir:hover {

    background: #fff5f4 !important;

}


/* ============================================================
   BOTÃO DETALHES
   ============================================================ */

#moduloMatrizCargo .btnDetalhesCompetencia {

    min-width: 38px;

    padding: 8px 10px;

}


/* ============================================================
   CARD
   ============================================================ */

#moduloMatrizCargo .matrizCard {

    background: #ffffff;

    border: 1px solid #e2e8f0;

    border-radius: 10px;

    padding: 20px;

}


/* ============================================================
   CARD DE INFORMAÇÃO
   ============================================================ */

#moduloMatrizCargo .matrizInfo {

    background: #f8fafc;

    border: 1px solid #dbe3ec;

    border-radius: 8px;

    padding: 14px 16px;

    margin-bottom: 20px;

    color: #475569;

}


/* ============================================================
   ÁREA DE PESQUISA
   ============================================================ */

#moduloMatrizCargo .barraPesquisa {

    display: flex;

    gap: 10px;

    align-items: center;

    width: 100%;

    margin-bottom: 18px;

}


#moduloMatrizCargo .barraPesquisa input {

    flex: 1;

}


/* ============================================================
   RESULTADO DE PESQUISA
   ============================================================ */

#moduloMatrizCargo .resultadoPesquisa {

    background: #ffffff;

    border: 1px solid #e2e8f0;

    border-radius: 8px;

    margin-bottom: 18px;

    overflow: hidden;

}


/* ============================================================
   ITEM DE PESQUISA
   ============================================================ */

#moduloMatrizCargo .itemPesquisa {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    padding: 12px 14px;

    border-bottom: 1px solid #e8edf3;

    background: #ffffff;

}


#moduloMatrizCargo .itemPesquisa:last-child {

    border-bottom: none;

}


#moduloMatrizCargo .itemPesquisa:hover {

    background: #f8fafc;

}


/* ============================================================
   FORMULÁRIO NOVA COMPETÊNCIA
   ============================================================ */

#moduloMatrizCargo .formNovaCompetencia {

    margin-top: 20px;

    padding: 20px;

    background: #f8fafc !important;

    border: 1px solid #dbe3ec !important;

    border-radius: 10px;

}


#moduloMatrizCargo .formNovaCompetencia h3 {

    margin-top: 0;

    color: #dbe3eb;

}


/* ============================================================
   LABELS
   ============================================================ */

#moduloMatrizCargo label {

    display: block;

    margin-top: 12px;

    margin-bottom: 6px;

    color: #334155 !important;

    font-size: 13px;

    font-weight: 600;

}


/* ============================================================
   AVALIAÇÃO
   ============================================================ */

#moduloMatrizCargo .campoNivel {

    background: #ffffff !important;

    border: 1px solid #e2e8f0 !important;

    color: #dbe3eb !important;

}


#moduloMatrizCargo .campoNivel p {

    color: #dbe3eb;

}


#moduloMatrizCargo .inputNivelAtual {

    background: #ffffff !important;

    background-color: #ffffff !important;

    color: #dbe3eb !important;

    border: 1px solid #cbd5e1 !important;

    min-width: 75px;

}


/* ============================================================
   RESPONSIVO
   ============================================================ */

@media (max-width: 1100px) {

    #moduloMatrizCargo .matrizTabela {

        table-layout: auto;

        min-width: 900px;

    }

    #moduloMatrizCargo .matrizTabelaWrapper {

        overflow-x: auto;

        width: 100%;

    }

}

</style>
`;

        // =========================================================
        // INTERFACE PRINCIPAL
        // =========================================================

        let html = `

        ${estiloMatriz}

        <div
            id="moduloMatrizCargo"
            class="portal"
            style="
                width:100%;
                box-sizing:border-box;
            "
        >

            <header
                class="topo"
                style="
                    box-sizing:border-box;
                "
            >

                <div class="logo-area">

                    <div class="logo-box">
                        M
                    </div>

                    <div>

                        <h2>
                            Matriz de Habilidades
                        </h2>

                        <span>
                            Área:
                            ${escaparHTML(
                                areaUsuario || "-"
                            )}
                        </span>

                    </div>

                </div>

            </header>


            <nav class="menu">

                <button
                    id="btnAbaMatrizCargo"
                    class="ativo"
                >
                    🎯 Matriz por Cargo
                </button>


                <button
                    id="btnAbaAvaliacao"
                >
                    👤 Avaliação
                </button>


                <button
                    id="btnDashboard"
                >
                    📊 Dashboard
                </button>

            </nav>


            <section class="conteudo">

                <!-- =================================================
                     ABA MATRIZ POR CARGO
                ================================================== -->

                <div id="abaMatrizCargo">

                    <div class="card">

                        <h3>
                            Matriz por Cargo
                        </h3>

                        <p>
                            Defina as competências e o nível esperado
                            para cada cargo da sua área.
                        </p>


                        <label>
                            Cargo
                        </label>


                        <select
                            id="cmbCargoMatriz"
                            style="
                                background:#fff !important;
                                background-color:#fff !important;
                                color:#17324d !important;
                            "
                        >

                            <option value="">
                                Selecione um cargo...
                            </option>

                            ${cargos.map(c => `

                                <option
                                    value="${escaparHTML(c)}"
                                >

                                    ${escaparHTML(c)}

                                </option>

                            `).join("")}

                        </select>


                    </div>


                    <div
                        id="areaMatrizCargo"
                        style="
                            margin-top:20px;
                        "
                    >
                    </div>

                </div>


                <!-- =================================================
                     ABA AVALIAÇÃO
                ================================================== -->

                <div
                    id="abaAvaliacao"
                    style="display:none;"
                >

                    <div class="card">

                        <h3>
                            Avaliação de Competências
                        </h3>


                        <label>
                            Selecione o colaborador:
                        </label>


                        <select
                            id="cmbColaborador"
                            style="
                                background:#fff !important;
                                background-color:#fff !important;
                                color:#17324d !important;
                            "
                        >

                            <option value="">
                                Escolha...
                            </option>

                            ${colaboradores.map(c => `

                                <option
                                    value="${c.id}"
                                >

                                    ${escaparHTML(c.nome)}

                                </option>

                            `).join("")}

                        </select>


                        <div
                            id="areaAvaliacao"
                            style="
                                margin-top:20px;
                            "
                        >
                        </div>

                    </div>

                </div>

            </section>

        </div>

        `;


        UI.carregar(html);


        // =========================================================
        // ELEMENTOS DE NAVEGAÇÃO
        // =========================================================

        const btnAbaMatrizCargo =
            document.getElementById(
                "btnAbaMatrizCargo"
            );


        const btnAbaAvaliacao =
            document.getElementById(
                "btnAbaAvaliacao"
            );


        const abaMatrizCargo =
            document.getElementById(
                "abaMatrizCargo"
            );


        const abaAvaliacao =
            document.getElementById(
                "abaAvaliacao"
            );


        // =========================================================
        // NAVEGAÇÃO
        // =========================================================

        if (btnAbaMatrizCargo) {

            btnAbaMatrizCargo.onclick = () => {

                abaMatrizCargo.style.display =
                    "block";

                abaAvaliacao.style.display =
                    "none";

                btnAbaMatrizCargo.classList.add(
                    "ativo"
                );

                btnAbaAvaliacao.classList.remove(
                    "ativo"
                );

            };

        }


        if (btnAbaAvaliacao) {

            btnAbaAvaliacao.onclick = () => {

                abaMatrizCargo.style.display =
                    "none";

                abaAvaliacao.style.display =
                    "block";

                btnAbaAvaliacao.classList.add(
                    "ativo"
                );

                btnAbaMatrizCargo.classList.remove(
                    "ativo"
                );

            };

        }


        // =========================================================
        // DASHBOARD
        // =========================================================

        const btnDashboard =
            document.getElementById(
                "btnDashboard"
            );


        if (btnDashboard) {

            btnDashboard.onclick = () => {

                ModuloDashboard.abrir(
                    usuario,
                    banco
                );

            };

        }


        // =========================================================
        // MATRIZ POR CARGO
        // =========================================================

        const cmbCargoMatriz =
            document.getElementById(
                "cmbCargoMatriz"
            );


        const areaMatrizCargo =
            document.getElementById(
                "areaMatrizCargo"
            );


        const renderizarMatrizCargo =
            cargo => {

                if (!cargo) {

                    areaMatrizCargo.innerHTML = "";

                    return;

                }


                const competencias =
                    matrizArea.habilidades || [];


                const esperados =
                    matrizArea.matrizEsperada[cargo]
                    ||
                    matrizEsperada[cargo]
                    ||
                    [];


                areaMatrizCargo.innerHTML = `

                    <div
                        class="matrizCard"
                    >

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                gap:15px;
                                flex-wrap:wrap;
                                margin-bottom:18px;
                            "
                        >

                            <div>

                                <h3
                                    style="
                                        margin:0 0 5px 0;
                                        color:#dbe3eb;
                                    "
                                >
                                    Competências do cargo:
                                    ${escaparHTML(cargo)}
                                </h3>

                                <div
                                    style="
                                        font-size:13px;
                                        color:#64748b;
                                    "
                                >
                                    Defina o nível esperado para cada competência.
                                </div>

                            </div>

                        </div>


                        <div
                            class="barraPesquisa"
                        >

                            <input
                                type="text"
                                id="pesquisaCompetencia"
                                placeholder="🔎 Pesquisar competência existente..."
                                style="
                                    background:#fff !important;
                                    background-color:#fff !important;
                                    color:#17324d !important;
                                "
                            >


                            <button
                                id="btnNovaCompetencia"
                                class="btnPrincipal"
                            >
                                ➕ Nova Competência
                            </button>

                        </div>


                        <div
                            id="resultadoPesquisaCompetencia"
                        >
                        </div>


                        <div
                            id="listaCompetenciasCargo"
                            style="
                                margin-top:10px;
                            "
                        >
                        </div>


                        <div
                            id="formNovaCompetencia"
                            class="formNovaCompetencia"
                            style="display:none;"
                        >
                        </div>

                    </div>

                `;


                const lista =
                    document.getElementById(
                        "listaCompetenciasCargo"
                    );


                // =================================================
                // RENDERIZA LISTA
                // =================================================

                const renderizarLista =
                    filtro => {

                        const termo =
                            normalizar(filtro);


                        const listaFiltrada =
                            competencias.filter(
                                h => {

                                    if (!termo)
                                        return true;

                                    return normalizar(h)
                                        .includes(termo);

                                }
                            );


                        if (
                            listaFiltrada.length === 0
                        ) {

                            lista.innerHTML = `

                                <div
                                    style="
                                        padding:30px;
                                        text-align:center;
                                        color:#64748b;
                                        background:#fff;
                                        border:1px solid #e2e8f0;
                                        border-radius:8px;
                                    "
                                >

                                    Nenhuma competência encontrada.

                                </div>

                            `;

                            return;

                        }


                        lista.innerHTML = `

                            <div
                                class="matrizTabelaWrapper"
                                style="
                                    width:100%;
                                    overflow-x:auto;
                                "
                            >

                                <table
                                    class="matrizTabela"
                                >

                                    <thead>

                                        <tr>

                                            <th
                                                class="colunaCompetencia"
                                            >
                                                Competência
                                            </th>


                                            <th
                                                class="colunaCargo"
                                            >
                                                Direcionador
                                            </th>


                                            <th
                                                class="colunaCargo"
                                            >
                                                Nível esperado
                                            </th>


                                            <th
                                                class="colunaAcao"
                                            >
                                                Ação
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        ${listaFiltrada.map(
                                            habilidade => {

                                                const detalhes =
                                                    obterDetalhes(
                                                        habilidade
                                                    );


                                                const index =
                                                    competencias.indexOf(
                                                        habilidade
                                                    );


                                                const esperado =
                                                    Number(
                                                        esperados[index]
                                                    ) || 0;


                                                return `

                                                    <tr>

                                                        <td
                                                            class="colunaCompetencia"
                                                        >

                                                            <div
                                                                class="nomeCompetencia"
                                                            >
                                                                ${escaparHTML(
                                                                    habilidade
                                                                )}
                                                            </div>

                                                        </td>


                                                        <td
                                                            class="colunaCargo"
                                                        >

                                                            ${
                                                                escaparHTML(
                                                                    detalhes.direcionador ||
                                                                    "-"
                                                                )
                                                            }

                                                        </td>


                                                        <td
                                                            class="colunaCargo"
                                                        >

                                                            <div
                                                                class="celulaNivel"
                                                            >

                                                                <select
                                                                    class="selectNivelEsperado"
                                                                    data-index="${index}"
                                                                    style="
                                                                        background:#fff !important;
                                                                        background-color:#fff !important;
                                                                        color:#17324d !important;
                                                                    "
                                                                >

                                                                    ${[
                                                                        0,
                                                                        1,
                                                                        2,
                                                                        3,
                                                                        4
                                                                    ].map(
                                                                        n => `

                                                                            <option
                                                                                value="${n}"
                                                                                ${
                                                                                    n === esperado
                                                                                        ? "selected"
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                ${n}
                                                                            </option>

                                                                        `
                                                                    ).join("")}

                                                                </select>

                                                            </div>

                                                        </td>


                                                        <td
                                                            class="colunaAcao"
                                                        >

                                                            <button
                                                                class="btnDetalhesCompetencia"
                                                                data-habilidade="${escaparHTML(habilidade)}"
                                                                title="Ver detalhes"
                                                            >
                                                                👁️
                                                            </button>

                                                        </td>

                                                    </tr>

                                                `;

                                            }
                                        ).join("")}

                                    </tbody>

                                </table>

                            </div>

                        `;


                        // =================================================
                        // ALTERAÇÃO NÍVEL ESPERADO
                        // =================================================

                        document
                            .querySelectorAll(
                                "#moduloMatrizCargo .selectNivelEsperado"
                            )
                            .forEach(
                                select => {

                                    select.onchange =
                                        () => {

                                            const index =
                                                Number(
                                                    select.dataset.index
                                                );


                                            if (
                                                !Array.isArray(
                                                    matrizArea
                                                        .matrizEsperada[
                                                            cargo
                                                        ]
                                                )
                                            ) {

                                                matrizArea
                                                    .matrizEsperada[
                                                        cargo
                                                    ] = [];

                                            }


                                            matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ][index] =
                                                    Number(
                                                        select.value
                                                    );


                                            matrizEsperada[
                                                cargo
                                            ] =
                                                matrizArea
                                                    .matrizEsperada[
                                                        cargo
                                                    ];


                                            Storage.salvarBanco(
                                                banco
                                            );

                                        };

                                }
                            );


                        // =================================================
                        // DETALHES
                        // =================================================

                        document
                            .querySelectorAll(
                                "#moduloMatrizCargo .btnDetalhesCompetencia"
                            )
                            .forEach(
                                btn => {

                                    btn.onclick = () => {

                                        const habilidade =
                                            btn.dataset.habilidade;


                                        const detalhes =
                                            obterDetalhes(
                                                habilidade
                                            );


                                        alert(

                                            "COMPETÊNCIA\n\n" +

                                            habilidade +

                                            "\n\nDIRECIONADOR\n" +

                                            (
                                                detalhes.direcionador ||
                                                "-"
                                            ) +

                                            "\n\nDEFINIÇÃO\n" +

                                            (
                                                detalhes.definicao ||
                                                "-"
                                            ) +

                                            "\n\nNÍVEL 1\n" +

                                            (
                                                detalhes.niveis?.[1] ||
                                                "-"
                                            ) +

                                            "\n\nNÍVEL 2\n" +

                                            (
                                                detalhes.niveis?.[2] ||
                                                "-"
                                            ) +

                                            "\n\nNÍVEL 3\n" +

                                            (
                                                detalhes.niveis?.[3] ||
                                                "-"
                                            ) +

                                            "\n\nNÍVEL 4\n" +

                                            (
                                                detalhes.niveis?.[4] ||
                                                "-"
                                            )

                                        );

                                    };

                                }
                            );

                    };


                // =================================================
                // PRIMEIRA RENDERIZAÇÃO
                // =================================================

                renderizarLista("");


                // =================================================
                // PESQUISA
                // =================================================

                const pesquisa =
                    document.getElementById(
                        "pesquisaCompetencia"
                    );


                const resultadoPesquisa =
                    document.getElementById(
                        "resultadoPesquisaCompetencia"
                    );


                if (pesquisa) {

                    pesquisa.oninput = () => {

                        const termo =
                            normalizar(
                                pesquisa.value
                            );


                        if (!termo) {

                            resultadoPesquisa.innerHTML =
                                "";

                            renderizarLista("");

                            return;

                        }


                        const encontrados =
                            competencias.filter(
                                h =>
                                    normalizar(h)
                                        .includes(termo)
                            );


                        if (
                            encontrados.length === 0
                        ) {

                            resultadoPesquisa.innerHTML = `

                                <div
                                    class="resultadoPesquisa"
                                >

                                    <div
                                        style="
                                            padding:15px;
                                            color:#64748b;
                                        "
                                    >
                                        Nenhuma competência encontrada.
                                    </div>

                                </div>

                            `;

                            renderizarLista(
                                pesquisa.value
                            );

                            return;

                        }


                        resultadoPesquisa.innerHTML = `

                            <div
                                class="resultadoPesquisa"
                            >

                                ${encontrados.map(
                                    habilidade => `

                                        <div
                                            class="itemPesquisa"
                                        >

                                            <div>

                                                <strong>
                                                    ${escaparHTML(
                                                        habilidade
                                                    )}
                                                </strong>

                                            </div>


                                            <button
                                                class="btnUsarCompetencia"
                                                data-habilidade="${escaparHTML(habilidade)}"
                                            >
                                                ➕ Adicionar
                                            </button>

                                        </div>

                                    `
                                ).join("")}

                            </div>

                        `;


                        document
                            .querySelectorAll(
                                "#moduloMatrizCargo .btnUsarCompetencia"
                            )
                            .forEach(
                                btn => {

                                    btn.onclick = () => {

                                        const habilidade =
                                            btn.dataset.habilidade;


                                        if (
                                            !matrizArea
                                                .habilidades
                                                .some(
                                                    h =>
                                                        normalizar(h) ===
                                                        normalizar(
                                                            habilidade
                                                        )
                                                )
                                        ) {

                                            matrizArea
                                                .habilidades
                                                .push(
                                                    habilidade
                                                );

                                        }


                                        if (
                                            !Array.isArray(
                                                matrizArea
                                                    .matrizEsperada[
                                                        cargo
                                                    ]
                                            )
                                        ) {

                                            matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ] = [];

                                        }


                                        const index =
                                            matrizArea
                                                .habilidades
                                                .indexOf(
                                                    habilidade
                                                );


                                        if (
                                            typeof matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ][index]
                                                ===
                                                "undefined"
                                        ) {

                                            matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ][index] = 0;

                                        }


                                        matrizEsperada[
                                            cargo
                                        ] =
                                            matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ];


                                        Storage.salvarBanco(
                                            banco
                                        );


                                        alert(
                                            "Competência adicionada ao cargo."
                                        );


                                        renderizarMatrizCargo(
                                            cargo
                                        );

                                    };

                                }
                            );

                    };

                }


                // =================================================
                // NOVA COMPETÊNCIA
                // =================================================

                const btnNova =
                    document.getElementById(
                        "btnNovaCompetencia"
                    );


                const form =
                    document.getElementById(
                        "formNovaCompetencia"
                    );


                if (btnNova && form) {

                    btnNova.onclick = () => {

                        form.style.display =
                            "block";


                       form.innerHTML = `

    <div
        style="
            background:#ffffff !important;
            color:#344054 !important;
            padding:20px;
            border-top:1px solid #d0d5dd;
            border-radius:10px;
            box-sizing:border-box;
        "
    >

        <h3
            style="
                color:#17324d !important;
                background:#ffffff !important;
                margin:0 0 8px 0;
                font-size:20px;
                font-weight:700;
            "
        >
            Nova Competência
        </h3>


        <p
            style="
                color:#64748b !important;
                background:#ffffff !important;
                font-size:13px;
                margin:0 0 18px 0;
            "
        >
            Cadastre uma nova competência e defina
            o nível esperado para este cargo.
        </p>


        <!-- ================================================
             NOME DA COMPETÊNCIA
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nome da competência
        </label>


        <input
            id="novaNomeCompetencia"
            type="text"
            placeholder="Ex.: Comunicação"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                margin-bottom:10px;
            "
        >


        <!-- ================================================
             DIRECIONADOR
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Direcionador
        </label>


        <input
            id="novaDirecionador"
            type="text"
            placeholder="Qual comportamento/resultado essa competência direciona?"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                margin-bottom:10px;
            "
        >


        <!-- ================================================
             DEFINIÇÃO
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Definição
        </label>


        <textarea
            id="novaDefinicao"
            rows="3"
            placeholder="Descreva o que significa essa competência."
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                resize:vertical;
                margin-bottom:10px;
            "
        ></textarea>


        <!-- ================================================
             BALIZADORES
        ================================================= -->

        <h4
            style="
                color:#17324d !important;
                background:#ffffff !important;
                margin:22px 0 10px 0;
                font-size:16px;
                font-weight:700;
            "
        >
            Balizadores de comportamento
        </h4>


        <!-- ================================================
             NÍVEL 1
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nível 1
        </label>


        <textarea
            id="novaNivel1"
            rows="2"
            placeholder="O que caracteriza o nível 1?"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                resize:vertical;
                margin-bottom:10px;
            "
        ></textarea>


        <!-- ================================================
             NÍVEL 2
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nível 2
        </label>


        <textarea
            id="novaNivel2"
            rows="2"
            placeholder="O que caracteriza o nível 2?"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                resize:vertical;
                margin-bottom:10px;
            "
        ></textarea>


        <!-- ================================================
             NÍVEL 3
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nível 3
        </label>


        <textarea
            id="novaNivel3"
            rows="2"
            placeholder="O que caracteriza o nível 3?"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                resize:vertical;
                margin-bottom:10px;
            "
        ></textarea>


        <!-- ================================================
             NÍVEL 4
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nível 4
        </label>


        <textarea
            id="novaNivel4"
            rows="2"
            placeholder="O que caracteriza o nível 4?"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                resize:vertical;
                margin-bottom:10px;
            "
        ></textarea>


        <!-- ================================================
             NÍVEL ESPERADO
        ================================================= -->

        <label
            style="
                display:block;
                color:#344054 !important;
                background:#ffffff !important;
                font-weight:600;
                margin:14px 0 6px 0;
            "
        >
            Nível esperado para este cargo
        </label>


        <select
            id="novaNivelEsperado"
            style="
                display:block;
                width:100%;
                box-sizing:border-box;
                padding:11px 12px;
                background:#ffffff !important;
                background-color:#ffffff !important;
                color:#17324d !important;
                border:1px solid #d0d5dd !important;
                border-radius:8px;
                outline:none;
                margin-bottom:10px;
            "
        >

            <option value="0">
                0
            </option>

            <option value="1">
                1
            </option>

            <option value="2">
                2
            </option>

            <option value="3">
                3
            </option>

            <option value="4">
                4
            </option>

        </select>


        <!-- ================================================
             BOTÕES
        ================================================= -->

        <div
            style="
                display:flex;
                gap:10px;
                margin-top:20px;
                flex-wrap:wrap;
                background:#ffffff !important;
            "
        >

            <button
                id="btnSalvarNovaCompetencia"
                class="btnPrincipal"
                style="
                    cursor:pointer;
                "
            >
                💾 Salvar
            </button>


            <button
                id="btnCancelarNovaCompetencia"
                style="
                    cursor:pointer;
                "
            >
                Cancelar
            </button>

        </div>

    </div>

`;

                        // =================================================
                        // CANCELAR
                        // =================================================

                        document
                            .getElementById(
                                "btnCancelarNovaCompetencia"
                            )
                            .onclick = () => {

                                form.style.display =
                                    "none";

                                form.innerHTML =
                                    "";

                            };


                        // =================================================
                        // SALVAR NOVA COMPETÊNCIA
                        // =================================================

                        document
                            .getElementById(
                                "btnSalvarNovaCompetencia"
                            )
                            .onclick = () => {


                                const nome =
                                    document
                                        .getElementById(
                                            "novaNomeCompetencia"
                                        )
                                        .value
                                        .trim();


                                const direcionador =
                                    document
                                        .getElementById(
                                            "novaDirecionador"
                                        )
                                        .value
                                        .trim();


                                const definicao =
                                    document
                                        .getElementById(
                                            "novaDefinicao"
                                        )
                                        .value
                                        .trim();


                                const nivel1 =
                                    document
                                        .getElementById(
                                            "novaNivel1"
                                        )
                                        .value
                                        .trim();


                                const nivel2 =
                                    document
                                        .getElementById(
                                            "novaNivel2"
                                        )
                                        .value
                                        .trim();


                                const nivel3 =
                                    document
                                        .getElementById(
                                            "novaNivel3"
                                        )
                                        .value
                                        .trim();


                                const nivel4 =
                                    document
                                        .getElementById(
                                            "novaNivel4"
                                        )
                                        .value
                                        .trim();


                                const nivelEsperado =
                                    Number(
                                        document
                                            .getElementById(
                                                "novaNivelEsperado"
                                            )
                                            .value
                                    ) || 0;


                                if (!nome) {

                                    alert(
                                        "Informe o nome da competência."
                                    );

                                    return;

                                }


                                // =========================================
                                // PROCURA EXISTENTE
                                // =========================================

                                const existente =
                                    banco.habilidades.find(
                                        h =>
                                            normalizar(h) ===
                                            normalizar(nome)
                                    );


                                // =========================================
                                // SE EXISTIR
                                // =========================================

                                if (existente) {

                                    const confirmar =
                                        confirm(

                                            "Essa competência já existe:\n\n" +

                                            existente +

                                            "\n\nDeseja reutilizá-la neste cargo?"

                                        );


                                    if (!confirmar) {

                                        return;

                                    }


                                    if (
                                        !matrizArea
                                            .habilidades
                                            .some(
                                                h =>
                                                    normalizar(h) ===
                                                    normalizar(
                                                        existente
                                                    )
                                            )
                                    ) {

                                        matrizArea
                                            .habilidades
                                            .push(
                                                existente
                                            );

                                    }


                                    if (
                                        !Array.isArray(
                                            matrizArea
                                                .matrizEsperada[
                                                    cargo
                                                ]
                                        )
                                    ) {

                                        matrizArea
                                            .matrizEsperada[
                                                cargo
                                            ] = [];

                                    }


                                    const index =
                                        matrizArea
                                            .habilidades
                                            .indexOf(
                                                existente
                                            );


                                    matrizArea
                                        .matrizEsperada[
                                            cargo
                                        ][index] =
                                            nivelEsperado;


                                    matrizEsperada[
                                        cargo
                                    ] =
                                        matrizArea
                                            .matrizEsperada[
                                                cargo
                                            ];


                                    Storage.salvarBanco(
                                        banco
                                    );


                                    alert(
                                        "Competência reutilizada com sucesso!"
                                    );


                                    renderizarMatrizCargo(
                                        cargo
                                    );


                                    return;

                                }


                                // =========================================
                                // NOVA COMPETÊNCIA
                                // =========================================

                                banco.habilidades.push(
                                    nome
                                );


                                const detalhes = {

                                    nome: nome,

                                    direcionador:
                                        direcionador,

                                    definicao:
                                        definicao,

                                    niveis: {

                                        1: nivel1,

                                        2: nivel2,

                                        3: nivel3,

                                        4: nivel4

                                    }

                                };


                                banco.detalhesHabilidades[
                                    nome
                                ] = detalhes;


                                matrizArea
                                    .detalhesHabilidades[
                                        nome
                                    ] = detalhes;


                                matrizArea
                                    .habilidades
                                    .push(
                                        nome
                                    );


                                if (
                                    !Array.isArray(
                                        matrizArea
                                            .matrizEsperada[
                                                cargo
                                            ]
                                    )
                                ) {

                                    matrizArea
                                        .matrizEsperada[
                                            cargo
                                        ] = [];

                                }


                                const novoIndex =
                                    matrizArea
                                        .habilidades
                                        .length - 1;


                                matrizArea
                                    .matrizEsperada[
                                        cargo
                                    ][novoIndex] =
                                        nivelEsperado;


                                matrizEsperada[
                                    cargo
                                ] =
                                    matrizArea
                                        .matrizEsperada[
                                            cargo
                                        ];


                                Storage.salvarBanco(
                                    banco
                                );


                                alert(
                                    "Competência criada com sucesso!"
                                );


                                renderizarMatrizCargo(
                                    cargo
                                );

                            };

                    }

                }

            };


        // =========================================================
        // SELEÇÃO DO CARGO
        // =========================================================

        if (cmbCargoMatriz) {

            cmbCargoMatriz.onchange = () => {

                renderizarMatrizCargo(
                    cmbCargoMatriz.value
                );

            };

        }


        // =========================================================
        // AVALIAÇÃO
        // =========================================================

        const cmbColaborador =
            document.getElementById(
                "cmbColaborador"
            );


        const areaAvaliacao =
            document.getElementById(
                "areaAvaliacao"
            );


        if (cmbColaborador) {

            cmbColaborador.onchange = () => {

                const id =
                    Number(
                        cmbColaborador.value
                    );


                if (!id) {

                    areaAvaliacao.innerHTML =
                        "";

                    return;

                }


                const colaborador =
                    colaboradores.find(
                        c =>
                            Number(c.id) === id
                    );


                if (!colaborador)
                    return;


                const cargo =
                    colaborador.cargo || "";


                const habilidadesArea =
                    matrizArea.habilidades || [];


                const esperado =
                    matrizArea
                        .matrizEsperada[
                            cargo
                        ]

                    ||

                    matrizEsperada[
                        cargo
                    ]

                    ||

                    [];


                const registro =
                    avaliacoes[id];


                const avaliacaoAtual =

                    Array.isArray(registro)

                        ? registro

                        :

                        (
                            registro?.niveis

                            ||

                            habilidadesArea.map(
                                () => 0
                            )
                        );


                areaAvaliacao.innerHTML = `

                    <h4>

                        ${escaparHTML(
                            colaborador.nome
                        )}

                    </h4>


                    <p>

                        <strong>
                            Cargo:
                        </strong>

                        ${escaparHTML(
                            cargo || "-"
                        )}

                    </p>


                    <div
                        id="painelGaps"
                        style="
                            margin-bottom:20px;
                        "
                    >
                    </div>


                    <div
                        class="formAvaliacao"
                        id="formAvaliacao"
                    >

                        ${habilidadesArea.map(
                            (
                                habilidade,
                                index
                            ) => {

                                const detalhes =
                                    obterDetalhes(
                                        habilidade
                                    );


                                const nivelAtual =
                                    Number(
                                        avaliacaoAtual[
                                            index
                                        ]
                                    ) || 0;


                                const nivelEsperado =
                                    Number(
                                        esperado[
                                            index
                                        ]
                                    ) || 0;


                                const gap =
                                    Math.max(
                                        0,
                                        nivelEsperado -
                                        nivelAtual
                                    );


                                return `

                                    <div
                                        class="campoNivel"
                                        style="
                                            padding:18px;
                                            margin-bottom:15px;
                                            border-radius:10px;
                                        "
                                    >

                                        <h4>
                                            ${escaparHTML(
                                                habilidade
                                            )}
                                        </h4>


                                        <p>

                                            <strong>
                                                🎯 Direcionador:
                                            </strong>

                                            ${escaparHTML(
                                                detalhes.direcionador ||
                                                "-"
                                            )}

                                        </p>


                                        <p>

                                            <strong>
                                                📖 Definição:
                                            </strong>

                                            ${escaparHTML(
                                                detalhes.definicao ||
                                                "-"
                                            )}

                                        </p>


                                        <div
                                            style="
                                                margin:10px 0;
                                            "
                                        >

                                            <strong>
                                                Balizadores:
                                            </strong>


                                            <ul>

                                                <li>
                                                    <strong>
                                                        Nível 1:
                                                    </strong>

                                                    ${escaparHTML(
                                                        detalhes
                                                            .niveis?.[1] ||
                                                        "-"
                                                    )}
                                                </li>


                                                <li>
                                                    <strong>
                                                        Nível 2:
                                                    </strong>

                                                    ${escaparHTML(
                                                        detalhes
                                                            .niveis?.[2] ||
                                                        "-"
                                                    )}
                                                </li>


                                                <li>
                                                    <strong>
                                                        Nível 3:
                                                    </strong>

                                                    ${escaparHTML(
                                                        detalhes
                                                            .niveis?.[3] ||
                                                        "-"
                                                    )}
                                                </li>


                                                <li>
                                                    <strong>
                                                        Nível 4:
                                                    </strong>

                                                    ${escaparHTML(
                                                        detalhes
                                                            .niveis?.[4] ||
                                                        "-"
                                                    )}
                                                </li>

                                            </ul>

                                        </div>


                                        <div
                                            style="
                                                display:flex;
                                                gap:20px;
                                                align-items:center;
                                                flex-wrap:wrap;
                                            "
                                        >

                                            <div>

                                                <strong>
                                                    Esperado:
                                                </strong>

                                                <span>
                                                    ${nivelEsperado}
                                                </span>

                                            </div>


                                            <div>

                                                <label>
                                                    <strong>
                                                        Atual:
                                                    </strong>
                                                </label>


                                                <select
                                                    class="inputNivelAtual"
                                                    data-index="${index}"
                                                    style="
                                                        background:#fff !important;
                                                        background-color:#fff !important;
                                                        color:#17324d !important;
                                                    "
                                                >

                                                    ${[
                                                        0,
                                                        1,
                                                        2,
                                                        3,
                                                        4
                                                    ].map(
                                                        n => `

                                                            <option
                                                                value="${n}"
                                                                ${
                                                                    n ===
                                                                    nivelAtual
                                                                        ? "selected"
                                                                        : ""
                                                                }
                                                            >
                                                                ${n}
                                                            </option>

                                                        `
                                                    ).join("")}

                                                </select>

                                            </div>


                                            <div>

                                                <strong>
                                                    GAP:
                                                </strong>

                                                <span
                                                    class="valorGap"
                                                    data-gap-index="${index}"
                                                >
                                                    ${gap}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                `;

                            }
                        ).join("")}

                    </div>


                    <button
                        id="btnSalvarAvaliacao"
                        class="btnPrincipal"
                    >
                        💾 Salvar Avaliação
                    </button>

                `;


                // =================================================
                // ATUALIZA GAP
                // =================================================

                const atualizarGaps = () => {

                    let maiorGap = 0;

                    let maiorCompetencia =
                        "";


                    document
                        .querySelectorAll(
                            "#moduloMatrizCargo .inputNivelAtual"
                        )
                        .forEach(
                            input => {

                                const index =
                                    Number(
                                        input.dataset.index
                                    );


                                const atual =
                                    Number(
                                        input.value
                                    ) || 0;


                                const esperadoNivel =
                                    Number(
                                        esperado[index]
                                    ) || 0;


                                const gap =
                                    Math.max(
                                        0,
                                        esperadoNivel -
                                        atual
                                    );


                                const campoGap =
                                    document.querySelector(
                                        `#moduloMatrizCargo [data-gap-index="${index}"]`
                                    );


                                if (campoGap) {

                                    campoGap.textContent =
                                        gap;

                                }


                                if (
                                    gap >
                                    maiorGap
                                ) {

                                    maiorGap =
                                        gap;

                                    maiorCompetencia =
                                        habilidadesArea[
                                            index
                                        ];

                                }

                            }
                        );


                    const painel =
                        document.getElementById(
                            "painelGaps"
                        );


                    if (!painel)
                        return;


                    if (maiorGap > 0) {

                        painel.innerHTML = `

                            <div
                                style="
                                    padding:15px;
                                    border-radius:8px;
                                    background:#fff8e1;
                                    border:1px solid #f1d37a;
                                    color:#6b4f00;
                                "
                            >

                                <strong>
                                    📌 Maior GAP:
                                </strong>

                                ${escaparHTML(
                                    maiorCompetencia
                                )}

                                — GAP ${maiorGap}

                            </div>

                        `;

                    } else {

                        painel.innerHTML = `

                            <div
                                style="
                                    padding:15px;
                                    border-radius:8px;
                                    background:#f0fdf4;
                                    border:1px solid #bbf7d0;
                                    color:#166534;
                                "
                            >

                                ✅
                                Nenhum GAP identificado.

                            </div>

                        `;

                    }

                };


                document
                    .querySelectorAll(
                        "#moduloMatrizCargo .inputNivelAtual"
                    )
                    .forEach(
                        input => {

                            input.onchange =
                                atualizarGaps;

                        }
                    );


                atualizarGaps();


                // =================================================
                // SALVAR AVALIAÇÃO
                // =================================================

                const btnSalvar =
                    document.getElementById(
                        "btnSalvarAvaliacao"
                    );


                if (btnSalvar) {

                    btnSalvar.onclick = () => {

                        const novosValores =
                            [];


                        document
                            .querySelectorAll(
                                "#moduloMatrizCargo .inputNivelAtual"
                            )
                            .forEach(
                                input => {

                                    let valor =
                                        Number(
                                            input.value
                                        ) || 0;


                                    if (valor < 0)
                                        valor = 0;


                                    if (valor > 4)
                                        valor = 4;


                                    novosValores.push(
                                        valor
                                    );

                                }
                            );


                        banco.avaliacoes[id] =
                            novosValores;


                        Storage.salvarBanco(
                            banco
                        );


                        alert(
                            "Avaliação salva com sucesso!"
                        );


                        ModuloMatriz.abrir(
                            usuario,
                            banco
                        );

                    };

                }

            };

        }

    }

};