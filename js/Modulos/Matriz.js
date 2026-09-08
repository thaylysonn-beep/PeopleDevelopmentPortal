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

        matrizArea.matrizEsperada =
            matrizArea.matrizEsperada || {};

        matrizArea.detalhesHabilidades =
            matrizArea.detalhesHabilidades || {};

        // =========================================================
        // COMPATIBILIDADE COM BANCO ANTIGO
        // =========================================================

        // Se a matriz da área ainda estiver vazia,
        // aproveita as habilidades antigas.

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


        const obterCargos = () => {

            const lista = [];

            // -----------------------------------------------------
            // Cargos vindos dos colaboradores
            // -----------------------------------------------------

            colaboradores.forEach(c => {

                if (c.cargo) {

                    if (!lista.includes(c.cargo)) {

                        lista.push(c.cargo);

                    }

                }

            });


            // -----------------------------------------------------
            // Cargos vindos do banco.cargos
            // -----------------------------------------------------

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


            // -----------------------------------------------------
            // Cargos da matriz da área
            // -----------------------------------------------------

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
        // INTERFACE PRINCIPAL
        // =========================================================

        let html = `

        <div class="portal">

            <header class="topo">

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
                            ${escaparHTML(areaUsuario || "-")}
                        </span>

                    </div>

                </div>

            </header>


            <nav class="menu">

                <button
                    id="btnAbaMatrizCargo"
                    class="ativo">

                    🎯 Matriz por Cargo

                </button>


                <button
                    id="btnAbaAvaliacao">

                    👤 Avaliação

                </button>


                <button
                    id="btnDashboard">

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

                        <select id="cmbCargoMatriz">

                            <option value="">
                                Selecione um cargo...
                            </option>

                            ${cargos.map(c => `

                                <option value="${escaparHTML(c)}">

                                    ${escaparHTML(c)}

                                </option>

                            `).join("")}

                        </select>

                    </div>


                    <div
                        id="areaMatrizCargo"
                        style="margin-top:20px;">

                    </div>


                </div>


                <!-- =================================================
                     ABA AVALIAÇÃO
                ================================================== -->

                <div
                    id="abaAvaliacao"
                    style="display:none;">

                    <div class="card">

                        <h3>
                            Avaliação de Competências
                        </h3>

                        <label>
                            Selecione o colaborador:
                        </label>

                        <select id="cmbColaborador">

                            <option value="">
                                Escolha...
                            </option>

                            ${colaboradores.map(c => `

                                <option value="${c.id}">

                                    ${escaparHTML(c.nome)}

                                </option>

                            `).join("")}

                        </select>


                        <div
                            id="areaAvaliacao"
                            style="margin-top:20px;">

                        </div>

                    </div>

                </div>

            </section>

        </div>

        `;


        UI.carregar(html);


        // =========================================================
        // NAVEGAÇÃO
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


        btnAbaMatrizCargo.onclick = () => {

            abaMatrizCargo.style.display = "block";

            abaAvaliacao.style.display = "none";

            btnAbaMatrizCargo.classList.add("ativo");

            btnAbaAvaliacao.classList.remove("ativo");

        };


        btnAbaAvaliacao.onclick = () => {

            abaMatrizCargo.style.display = "none";

            abaAvaliacao.style.display = "block";

            btnAbaAvaliacao.classList.add("ativo");

            btnAbaMatrizCargo.classList.remove("ativo");

        };


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


        const renderizarMatrizCargo = cargo => {

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

                <div class="card">

                    <h3>
                        Competências do cargo:
                        ${escaparHTML(cargo)}
                    </h3>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            align-items:center;
                            margin-bottom:20px;
                        ">

                        <input
                            type="text"
                            id="pesquisaCompetencia"
                            placeholder="🔎 Pesquisar competência existente..."
                            style="
                                flex:1;
                                padding:10px;
                            "
                        >


                        <button
                            id="btnNovaCompetencia">

                            ➕ Nova Competência

                        </button>

                    </div>


                    <div id="resultadoPesquisaCompetencia">

                    </div>


                    <div
                        id="listaCompetenciasCargo"
                        style="margin-top:20px;">

                    </div>


                    <div
                        id="formNovaCompetencia"
                        style="
                            display:none;
                            margin-top:25px;
                        ">

                    </div>

                </div>

            `;


            const lista =
                document.getElementById(
                    "listaCompetenciasCargo"
                );


            const renderizarLista = filtro => {

                const termo =
                    normalizar(filtro);


                const listaFiltrada =
                    competencias.filter(h => {

                        if (!termo) return true;

                        return normalizar(h)
                            .includes(termo);

                    });


                if (listaFiltrada.length === 0) {

                    lista.innerHTML = `

                        <div
                            style="
                                padding:20px;
                                text-align:center;
                                opacity:.7;
                            ">

                            Nenhuma competência encontrada.

                        </div>

                    `;

                    return;

                }


                lista.innerHTML = `

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Competência
                                </th>

                                <th>
                                    Direcionador
                                </th>

                                <th>
                                    Nível esperado
                                </th>

                                <th>
                                    Ação
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${listaFiltrada.map(habilidade => {

                                const detalhes =
                                    obterDetalhes(habilidade);

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

                                        <td>
                                            <strong>
                                                ${escaparHTML(habilidade)}
                                            </strong>
                                        </td>


                                        <td>
                                            ${escaparHTML(
                                                detalhes.direcionador || "-"
                                            )}
                                        </td>


                                        <td>

                                            <select
                                                class="selectNivelEsperado"
                                                data-index="${index}"
                                            >

                                                ${[0,1,2,3,4].map(n => `

                                                    <option
                                                        value="${n}"
                                                        ${n === esperado ? "selected" : ""}
                                                    >

                                                        ${n}

                                                    </option>

                                                `).join("")}

                                            </select>

                                        </td>


                                        <td>

                                            <button
                                                class="btnDetalhesCompetencia"
                                                data-habilidade="${escaparHTML(habilidade)}">

                                                👁️ Ver detalhes

                                            </button>

                                        </td>

                                    </tr>

                                `;

                            }).join("")}

                        </tbody>

                    </table>

                `;


                // -------------------------------------------------
                // ALTERAÇÃO DO NÍVEL ESPERADO
                // -------------------------------------------------

                document
                    .querySelectorAll(
                        ".selectNivelEsperado"
                    )
                    .forEach(select => {

                        select.onchange = () => {

                            const index =
                                Number(
                                    select.dataset.index
                                );


                            if (!Array.isArray(
                                matrizArea.matrizEsperada[cargo]
                            )) {

                                matrizArea.matrizEsperada[cargo] =
                                    [];

                            }


                            matrizArea.matrizEsperada[cargo][index] =
                                Number(select.value);


                            // Mantém compatibilidade
                            matrizEsperada[cargo] =
                                matrizArea.matrizEsperada[cargo];


                            Storage.salvarBanco(banco);

                        };

                    });


                // -------------------------------------------------
                // DETALHES
                // -------------------------------------------------

                document
                    .querySelectorAll(
                        ".btnDetalhesCompetencia"
                    )
                    .forEach(btn => {

                        btn.onclick = () => {

                            const habilidade =
                                btn.dataset.habilidade;

                            const detalhes =
                                obterDetalhes(habilidade);


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

                    });

            };


            renderizarLista("");


            // =====================================================
            // PESQUISA
            // =====================================================

            const pesquisa =
                document.getElementById(
                    "pesquisaCompetencia"
                );


            pesquisa.oninput = () => {

                renderizarLista(
                    pesquisa.value
                );

            };


            // =====================================================
            // NOVA COMPETÊNCIA
            // =====================================================

            const btnNova =
                document.getElementById(
                    "btnNovaCompetencia"
                );


            const form =
                document.getElementById(
                    "formNovaCompetencia"
                );


            btnNova.onclick = () => {

                form.style.display = "block";


                form.innerHTML = `

                    <div
                        style="
                            border-top:1px solid #ddd;
                            padding-top:20px;
                        ">

                        <h3>
                            Nova Competência
                        </h3>


                        <label>
                            Nome da competência
                        </label>

                        <input
                            id="novaNomeCompetencia"
                            type="text"
                            placeholder="Ex.: Comunicação"
                        >


                        <label>
                            Direcionador
                        </label>

                        <input
                            id="novaDirecionador"
                            type="text"
                            placeholder="Qual comportamento/resultado essa competência direciona?"
                        >


                        <label>
                            Definição
                        </label>

                        <textarea
                            id="novaDefinicao"
                            rows="3"
                            placeholder="Descreva o que significa essa competência."
                        ></textarea>


                        <h4>
                            Balizadores de comportamento
                        </h4>


                        <label>
                            Nível 1
                        </label>

                        <textarea
                            id="novaNivel1"
                            rows="2"
                            placeholder="O que caracteriza o nível 1?"
                        ></textarea>


                        <label>
                            Nível 2
                        </label>

                        <textarea
                            id="novaNivel2"
                            rows="2"
                            placeholder="O que caracteriza o nível 2?"
                        ></textarea>


                        <label>
                            Nível 3
                        </label>

                        <textarea
                            id="novaNivel3"
                            rows="2"
                            placeholder="O que caracteriza o nível 3?"
                        ></textarea>


                        <label>
                            Nível 4
                        </label>

                        <textarea
                            id="novaNivel4"
                            rows="2"
                            placeholder="O que caracteriza o nível 4?"
                        ></textarea>


                        <label>
                            Nível esperado para este cargo
                        </label>

                        <select id="novaNivelEsperado">

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


                        <div
                            style="
                                display:flex;
                                gap:10px;
                                margin-top:15px;
                            ">

                            <button
                                id="btnSalvarNovaCompetencia">

                                💾 Salvar

                            </button>


                            <button
                                id="btnCancelarNovaCompetencia">

                                Cancelar

                            </button>

                        </div>

                    </div>

                `;


                document
                    .getElementById(
                        "btnCancelarNovaCompetencia"
                    )
                    .onclick = () => {

                        form.style.display = "none";

                    };


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
                        // PROCURA COMPETÊNCIA EXISTENTE
                        // =========================================

                        const existente =
                            banco.habilidades.find(
                                h =>
                                    normalizar(h) ===
                                    normalizar(nome)
                            );


                        // =========================================
                        // SE JÁ EXISTIR
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
                                !matrizArea.habilidades
                                    .some(
                                        h =>
                                            normalizar(h) ===
                                            normalizar(existente)
                                    )
                            ) {

                                matrizArea.habilidades.push(
                                    existente
                                );

                            }


                            if (
                                !Array.isArray(
                                    matrizArea.matrizEsperada[cargo]
                                )
                            ) {

                                matrizArea.matrizEsperada[cargo] =
                                    [];

                            }


                            const index =
                                matrizArea.habilidades.indexOf(
                                    existente
                                );


                            matrizArea.matrizEsperada[cargo][index] =
                                nivelEsperado;


                            matrizEsperada[cargo] =
                                matrizArea.matrizEsperada[cargo];


                            Storage.salvarBanco(banco);


                            alert(
                                "Competência reutilizada com sucesso!"
                            );


                            renderizarMatrizCargo(cargo);


                            return;

                        }


                        // =========================================
                        // NOVA COMPETÊNCIA
                        // =========================================

                        banco.habilidades.push(nome);


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


                        // Catálogo global
                        banco.detalhesHabilidades[nome] =
                            detalhes;


                        // Catálogo da área
                        matrizArea.detalhesHabilidades[nome] =
                            detalhes;


                        // Adiciona à matriz da área
                        matrizArea.habilidades.push(nome);


                        // Cria vetor do cargo
                        if (
                            !Array.isArray(
                                matrizArea.matrizEsperada[cargo]
                            )
                        ) {

                            matrizArea.matrizEsperada[cargo] =
                                [];

                        }


                        const novoIndex =
                            matrizArea.habilidades.length - 1;


                        matrizArea.matrizEsperada[cargo][novoIndex] =
                            nivelEsperado;


                        // Compatibilidade com estrutura antiga
                        matrizEsperada[cargo] =
                            matrizArea.matrizEsperada[cargo];


                        Storage.salvarBanco(banco);


                        alert(
                            "Competência criada com sucesso!"
                        );


                        renderizarMatrizCargo(cargo);

                    };

            };

        };


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

                    areaAvaliacao.innerHTML = "";

                    return;

                }


                const colaborador =
                    colaboradores.find(
                        c => Number(c.id) === id
                    );


                if (!colaborador) return;


                const cargo =
                    colaborador.cargo || "";


                const habilidadesArea =
                    matrizArea.habilidades || [];


                const esperado =
                    matrizArea.matrizEsperada[cargo]

                    ||

                    matrizEsperada[cargo]

                    ||

                    [];


                const registro =
                    avaliacoes[id];


                const avaliacaoAtual =

                    Array.isArray(registro)

                        ? registro

                        : (

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

                        <strong>Cargo:</strong>

                        ${escaparHTML(cargo || "-")}

                    </p>


                    <div
                        id="painelGaps"
                        style="
                            margin-bottom:20px;
                        ">

                    </div>


                    <div
                        class="formAvaliacao"
                        id="formAvaliacao">

                        ${habilidadesArea.map(
                            (habilidade, index) => {

                                const detalhes =
                                    obterDetalhes(
                                        habilidade
                                    );


                                const nivelAtual =
                                    Number(
                                        avaliacaoAtual[index]
                                    ) || 0;


                                const nivelEsperado =
                                    Number(
                                        esperado[index]
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
                                            border:1px solid #ddd;
                                            border-radius:10px;
                                        ">

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
                                                detalhes.direcionador || "-"
                                            )}

                                        </p>


                                        <p>

                                            <strong>
                                                📖 Definição:
                                            </strong>

                                            ${escaparHTML(
                                                detalhes.definicao || "-"
                                            )}

                                        </p>


                                        <div
                                            style="
                                                margin:10px 0;
                                            ">

                                            <strong>
                                                Balizadores:
                                            </strong>


                                            <ul>

                                                <li>
                                                    <strong>Nível 1:</strong>
                                                    ${escaparHTML(
                                                        detalhes.niveis?.[1] || "-"
                                                    )}
                                                </li>

                                                <li>
                                                    <strong>Nível 2:</strong>
                                                    ${escaparHTML(
                                                        detalhes.niveis?.[2] || "-"
                                                    )}
                                                </li>

                                                <li>
                                                    <strong>Nível 3:</strong>
                                                    ${escaparHTML(
                                                        detalhes.niveis?.[3] || "-"
                                                    )}
                                                </li>

                                                <li>
                                                    <strong>Nível 4:</strong>
                                                    ${escaparHTML(
                                                        detalhes.niveis?.[4] || "-"
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
                                            ">

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
                                                >

                                                    ${[0,1,2,3,4].map(n => `

                                                        <option
                                                            value="${n}"
                                                            ${n === nivelAtual ? "selected" : ""}
                                                        >

                                                            ${n}

                                                        </option>

                                                    `).join("")}

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


                    <button id="btnSalvarAvaliacao">

                        💾 Salvar Avaliação

                    </button>

                `;


                // =================================================
                // ATUALIZA GAP EM TEMPO REAL
                // =================================================

                const atualizarGaps = () => {

                    let maiorGap = 0;

                    let maiorCompetencia = "";


                    document
                        .querySelectorAll(
                            ".inputNivelAtual"
                        )
                        .forEach(input => {

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
                                    `[data-gap-index="${index}"]`
                                );


                            if (campoGap) {

                                campoGap.textContent =
                                    gap;

                            }


                            if (gap > maiorGap) {

                                maiorGap = gap;

                                maiorCompetencia =
                                    habilidadesArea[index];

                            }

                        });


                    const painel =
                        document.getElementById(
                            "painelGaps"
                        );


                    if (!painel) return;


                    if (maiorGap > 0) {

                        painel.innerHTML = `

                            <div
                                style="
                                    padding:15px;
                                    border-radius:8px;
                                ">

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
                                ">

                                ✅

                                Nenhum GAP identificado.

                            </div>

                        `;

                    }

                };


                document
                    .querySelectorAll(
                        ".inputNivelAtual"
                    )
                    .forEach(input => {

                        input.onchange =
                            atualizarGaps;

                    });


                atualizarGaps();


                // =================================================
                // SALVAR AVALIAÇÃO
                // =================================================

                const btnSalvar =
                    document.getElementById(
                        "btnSalvarAvaliacao"
                    );


                btnSalvar.onclick = () => {


                    const novosValores = [];


                    document
                        .querySelectorAll(
                            ".inputNivelAtual"
                        )
                        .forEach(input => {

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

                        });


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

            };

        }

    }

};