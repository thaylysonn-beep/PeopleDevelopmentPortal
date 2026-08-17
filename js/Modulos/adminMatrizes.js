const ModuloAdminMatrizes = {


// =====================================================
// ABRIR
// =====================================================

abrir(usuario, banco) {

    const areas =
        banco.areas || [];


    let html = `

    <div class="portal">

        <header class="topo">

            <div class="logo-area">

                <div class="logo-box">
                    🎯
                </div>

                <div>

                    <h2>
                        Gerenciar Matrizes
                    </h2>

                    <span>
                        Administração
                    </span>

                </div>

            </div>


            <button
                id="btnVoltarMatrizes"
                class="btnSecundario">

                ← Voltar

            </button>

        </header>


        <section class="conteudo">

            <div class="card">

                <h3>
                    Selecionar Área
                </h3>

                <br>

                <select id="selectAreaMatriz">

    `;


    // =====================================================
    // ÁREAS
    // =====================================================

    areas.forEach(
        area => {

            html += `

                <option value="${this.escaparHTML(area.nome)}">

                    ${this.escaparHTML(area.nome)}

                </option>

            `;

        }
    );


    html += `

                </select>

                <br><br>

                <button
                    id="btnAbrirMatrizArea"
                    class="btnAcao">

                    Abrir Matriz

                </button>

            </div>

        </section>

    </div>

    `;


    UI.carregar(html);


    // =====================================================
    // VOLTAR
    // =====================================================

    const btnVoltar =
        document.getElementById(
            "btnVoltarMatrizes"
        );


    if (btnVoltar) {

        btnVoltar.onclick = () => {

            ModuloAdmin.abrir(
                usuario,
                banco
            );

        };

    }


    // =====================================================
    // ABRIR MATRIZ
    // =====================================================

    const btnAbrir =
        document.getElementById(
            "btnAbrirMatrizArea"
        );


    if (btnAbrir) {

        btnAbrir.onclick = () => {

            const select =
                document.getElementById(
                    "selectAreaMatriz"
                );


            if (!select) {

                return;

            }


            const area =
                select.value;


            this.editarMatriz(
                usuario,
                banco,
                area
            );

        };

    }

},


// =====================================================
// EDITAR MATRIZ
// =====================================================

editarMatriz(
    usuario,
    banco,
    area
) {

    // =================================================
    // LOCALIZAR MATRIZ DA ÁREA
    // =================================================

    if (!banco.matrizesPorArea) {

        banco.matrizesPorArea = {};

    }


    let matriz =
        banco.matrizesPorArea[area];


    // =================================================
    // CRIAR ESTRUTURA CASO NÃO EXISTA
    // =================================================

    if (!matriz) {

        matriz = {

            nome: area,

            cargos: [],

            habilidades: [],

            matrizEsperada: {}

        };


        banco.matrizesPorArea[area] =
            matriz;

    }


    // =================================================
    // GARANTIR ARRAYS
    // =================================================

    if (
        !Array.isArray(
            matriz.cargos
        )
    ) {

        matriz.cargos = [];

    }


    if (
        !Array.isArray(
            matriz.habilidades
        )
    ) {

        matriz.habilidades = [];

    }


    if (
        !matriz.matrizEsperada ||
        typeof matriz.matrizEsperada !== "object"
    ) {

        matriz.matrizEsperada = {};

    }


    // =================================================
    // COMPATIBILIDADE
    // =================================================
    //
    // Caso alguma instalação antiga ainda tenha
    // cargos/habilidades no banco principal,
    // aproveitamos esses dados.
    //
    // =================================================

    if (
        matriz.cargos.length === 0 &&
        Array.isArray(banco.cargos)
    ) {

        matriz.cargos =
            banco.cargos;

    }


    if (
        matriz.habilidades.length === 0 &&
        Array.isArray(banco.habilidades)
    ) {

        matriz.habilidades =
            banco.habilidades;

    }


    const cargos =
        matriz.cargos || [];


    const habilidades =
        matriz.habilidades || [];


    // =================================================
    // HTML
    // =================================================

    let html = `

    <div class="portal">

        <header class="topo">

            <div class="logo-area">

                <div class="logo-box">
                    🎯
                </div>

                <div>

                    <h2>
                        Matriz - ${this.escaparHTML(area)}
                    </h2>

                    <span>
                        Administração
                    </span>

                </div>

            </div>


            <button
                id="btnVoltarEditorMatriz"
                class="btnSecundario">

                ← Voltar

            </button>

        </header>


        <section class="conteudo">

            <div class="card">

                <h3>
                    Habilidades
                </h3>


                <p>
                    Edite os níveis esperados por cargo.
                </p>


                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Habilidade
                                </th>

    `;


    // =================================================
    // CABEÇALHO DOS CARGOS
    // =================================================

    cargos.forEach(
        cargo => {

            html += `

                                <th>
                                    ${this.escaparHTML(cargo)}
                                </th>

            `;

        }
    );


    html += `

                            </tr>

                        </thead>

                        <tbody>

    `;


    // =================================================
    // HABILIDADES
    // =================================================

    habilidades.forEach(
        (
            hab,
            index
        ) => {

            html += `

                            <tr>

                                <td>
                                    ${this.escaparHTML(hab)}
                                </td>

            `;


            // =============================================
            // CARGOS
            // =============================================

            cargos.forEach(
                cargo => {

                    let valor = 0;


                    const matrizCargo =
                        matriz.matrizEsperada[
                            cargo
                        ];


                    if (
                        Array.isArray(
                            matrizCargo
                        ) &&
                        matrizCargo[index] !== undefined
                    ) {

                        valor =
                            Number(
                                matrizCargo[index]
                            ) || 0;

                    }


                    html += `

                                <td>

                                    <select
                                        class="nivelMatriz"
                                        data-cargo="${this.escaparAtributo(cargo)}"
                                        data-index="${index}"
                                    >

                    `;


                    // =====================================
                    // NÍVEIS
                    // =====================================

                    [0, 1, 2, 3, 4].forEach(
                        nivel => {

                            html += `

                                        <option
                                            value="${nivel}"
                                            ${valor === nivel ? "selected" : ""}
                                        >

                                            ${nivel}

                                        </option>

                            `;

                        }
                    );


                    html += `

                                    </select>

                                </td>

                    `;

                }
            );


            html += `

                            </tr>

            `;

        }
    );


    html += `

                        </tbody>

                    </table>

                </div>


                <br>


                <button
                    id="btnSalvarMatrizArea"
                    class="btnAcao">

                    💾 Salvar Matriz

                </button>


            </div>

        </section>

    </div>

    `;


    UI.carregar(html);


    // =====================================================
    // VOLTAR
    // =====================================================

    const btnVoltar =
        document.getElementById(
            "btnVoltarEditorMatriz"
        );


    if (btnVoltar) {

        btnVoltar.onclick = () => {

            this.abrir(
                usuario,
                banco
            );

        };

    }


    // =====================================================
    // SALVAR
    // =====================================================

    const btnSalvar =
        document.getElementById(
            "btnSalvarMatrizArea"
        );


    if (btnSalvar) {

        btnSalvar.onclick = () => {

            // =============================================
            // GARANTIR ESTRUTURA
            // =============================================

            if (
                !matriz.matrizEsperada ||
                typeof matriz.matrizEsperada !== "object"
            ) {

                matriz.matrizEsperada = {};

            }


            // =============================================
            // LER TODOS OS SELECTS
            // =============================================

            const selects =
                document.querySelectorAll(
                    ".nivelMatriz"
                );


            selects.forEach(
                select => {

                    const cargo =
                        select.dataset.cargo;


                    const index =
                        Number(
                            select.dataset.index
                        );


                    const valor =
                        Number(
                            select.value
                        ) || 0;


                    if (
                        !Array.isArray(
                            matriz.matrizEsperada[
                                cargo
                            ]
                        )
                    ) {

                        matriz.matrizEsperada[
                            cargo
                        ] = [];

                    }


                    matriz.matrizEsperada[
                        cargo
                    ][index] =
                        valor;

                }
            );


            // =============================================
            // GARANTIR DADOS DA ÁREA
            // =============================================

            matriz.cargos =
                cargos;


            matriz.habilidades =
                habilidades;


            matriz.nome =
                area;


            banco.matrizesPorArea[
                area
            ] =
                matriz;


            // =============================================
            // SALVAR BANCO
            // =============================================

            Storage.salvarBanco(
                banco
            );


            alert(
                "Matriz salva com sucesso."
            );

        };

    }

},


// =====================================================
// SEGURANÇA HTML
// =====================================================

escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
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
// SEGURANÇA PARA ATRIBUTOS
// =====================================================

escaparAtributo(valor) {

    return this
        .escaparHTML(valor);

}


};
