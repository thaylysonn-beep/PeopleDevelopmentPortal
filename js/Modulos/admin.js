const ModuloAdmin = {

    // =====================================================
    // ABRIR PAINEL ADMINISTRATIVO
    // =====================================================

    abrir(usuario, banco) {

        console.log(
            "BANCO NO ADMIN:",
            banco
        );


        // =================================================
        // CALCULAR DADOS DE SUCESSÃO
        // =================================================

        let totalSucessores = 0;


        Object.values(
            banco.matrizesPorArea || {}
        )
        .forEach(
            area => {

                totalSucessores +=
                    Object.keys(
                        area.avaliacoesSucessao || {}
                    ).length;

            }
        );


        let html = `

        <div class="portal">

            <!-- =================================================
                 CABEÇALHO
            ================================================== -->

            <header class="topo">

                <div class="logo-area">

                    <div class="logo-box">
                        ⚙️
                    </div>

                    <div>

                        <h2>
                            Painel Administrativo
                        </h2>

                        <span>
                            Administrador: ${usuario.nome}
                        </span>

                    </div>

                </div>


                <div class="acoes-topo">

                    <button
                        id="btnVoltarAdmin"
                        class="btnSecundario">

                        ← Voltar

                    </button>

                </div>

            </header>


            <!-- =================================================
                 CONTEÚDO
            ================================================== -->

            <section class="conteudo">


                <div class="dashboardCards">


                    <!-- USUÁRIOS -->

                    <div class="card">

                        <h3>
                            👥 Usuários
                        </h3>

                        <strong>

                            ${
                                banco.usuarios
                                    ? banco.usuarios.length
                                    : 0
                            }

                        </strong>

                        <p>
                            Usuários cadastrados
                        </p>

                        <button
                            id="btnUsuarios"
                            class="btnAcao">

                            Gerenciar

                        </button>

                    </div>


                    <!-- ÁREAS -->

                    <div class="card">

                        <h3>
                            🏭 Áreas
                        </h3>

                        <strong>

                            ${
                                banco.areas
                                    ? banco.areas.length
                                    : 0
                            }

                        </strong>

                        <p>
                            Áreas cadastradas
                        </p>

                        <button
                            id="btnAreas"
                            class="btnAcao">

                            Gerenciar

                        </button>

                    </div>


                    <!-- MATRIZES -->

                    <div class="card">

                        <h3>
                            🎯 Matrizes
                        </h3>

                        <strong>

                            ${
                                banco.areas
                                    ? banco.areas.length
                                    : 0
                            }

                        </strong>

                        <p>
                            Matrizes por área
                        </p>

                        <button
                            id="btnMatrizes"
                            class="btnAcao">

                            Acessar

                        </button>

                    </div>


                    <!-- RELATÓRIOS -->

                    <div class="card">

                        <h3>
                            📊 Relatórios
                        </h3>

                        <strong>

                            ${
                                Object.values(
                                    banco.matrizesPorArea || {}
                                )
                                .reduce(
                                    (
                                        total,
                                        area
                                    ) => {

                                        return total +
                                            (
                                                area.colaboradores || []
                                            ).length;

                                    },
                                    0
                                )
                            }

                        </strong>

                        <p>
                            Relatórios administrativos
                        </p>

                        <button
                            id="btnPDIAdmin"
                            class="btnAcao">

                            Acessar

                        </button>

                    </div>


                    <!-- POWER BI -->

                    <div class="card">

                        <h3>
                            📈 Power BI
                        </h3>

                        <strong>
                            Base de Competências
                        </strong>

                        <p>
                            Base consolidada para análise
                        </p>

                        <button
                            id="btnBasePowerBI"
                            class="btnAcao">

                            Exportar Base

                        </button>

                    </div>


                    <!-- INTELIGÊNCIA T&D -->

                    <div class="card">

                        <h3>
                            🎯 Inteligência de T&D
                        </h3>

                        <strong>
                            Análise estratégica
                        </strong>

                        <p>
                            Identifique as principais necessidades
                            de desenvolvimento e onde T&D precisa atuar.
                        </p>

                        <button
                            id="btnDashboardTD"
                            class="btnAcao">

                            Analisar necessidades

                        </button>

                    </div>


                    <!-- SUCESSÃO ESTRATÉGICA -->

                    <div class="card">

                        <h3>
                            👑 Sucessão Estratégica
                        </h3>

                        <strong>

                            ${totalSucessores}

                        </strong>

                        <p>
                            Possíveis sucessores avaliados
                        </p>

                        <button
                            id="btnAdminSucessao"
                            class="btnAcao">

                            Analisar Sucessão

                        </button>

                    </div>


                </div>

            </section>

        </div>

        `;


        // =====================================================
        // CARREGAR TELA
        // =====================================================

        UI.carregar(
            html
        );


        // =====================================================
        // VOLTAR
        // =====================================================

        const btnVoltarAdmin =
            document.getElementById(
                "btnVoltarAdmin"
            );


        if (btnVoltarAdmin) {

            btnVoltarAdmin.onclick = () => {

                mostrarLogin();

            };

        }


        // =====================================================
        // SUCESSÃO ESTRATÉGICA
        // =====================================================

        const btnAdminSucessao =
            document.getElementById(
                "btnAdminSucessao"
            );


        if (btnAdminSucessao) {

            btnAdminSucessao.onclick = () => {

                if (
                    typeof ModuloAdminSucessao !==
                    "undefined"
                ) {

                    ModuloAdminSucessao.abrir(
                        usuario,
                        banco
                    );

                } else {

                    console.error(
                        "ModuloAdminSucessao não foi carregado."
                    );


                    alert(
                        "O módulo de Sucessão Estratégica não foi carregado.\n\n" +
                        "Verifique se o arquivo adminSucessao.js foi incluído no index.html."
                    );

                }

            };

        }


        // =====================================================
        // INTELIGÊNCIA DE T&D
        // =====================================================

        const btnDashboardTD =
            document.getElementById(
                "btnDashboardTD"
            );


        if (btnDashboardTD) {

            btnDashboardTD.onclick = () => {

                if (
                    typeof DashboardTD !==
                    "undefined"
                ) {

                    DashboardTD.abrir(
                        usuario,
                        banco
                    );

                } else {

                    alert(
                        "O Dashboard de T&D não foi carregado."
                    );

                }

            };

        }


        // =====================================================
        // USUÁRIOS
        // =====================================================

        const btnUsuarios =
            document.getElementById(
                "btnUsuarios"
            );


        if (btnUsuarios) {

            btnUsuarios.onclick = () => {

                if (
                    typeof ModuloAdminUsuarios !==
                    "undefined"
                ) {

                    ModuloAdminUsuarios.abrir(
                        usuario,
                        banco
                    );

                } else {

                    alert(
                        "O módulo de Usuários não foi carregado."
                    );

                }

            };

        }


        // =====================================================
        // ÁREAS
        // =====================================================

        const btnAreas =
            document.getElementById(
                "btnAreas"
            );


        if (btnAreas) {

            btnAreas.onclick = () => {

                if (
                    typeof ModuloAdminAreas !==
                    "undefined"
                ) {

                    ModuloAdminAreas.abrir(
                        usuario,
                        banco
                    );

                } else {

                    alert(
                        "O módulo de Áreas não foi carregado."
                    );

                }

            };

        }


        // =====================================================
        // MATRIZES
        // =====================================================

        const btnMatrizes =
            document.getElementById(
                "btnMatrizes"
            );


        if (btnMatrizes) {

            btnMatrizes.onclick = () => {

                if (
                    typeof ModuloAdminMatrizes !==
                    "undefined"
                ) {

                    ModuloAdminMatrizes.abrir(
                        usuario,
                        banco
                    );

                } else {

                    alert(
                        "O módulo de Matrizes não foi carregado."
                    );

                }

            };

        }


        // =====================================================
        // RELATÓRIOS / PDI
        // =====================================================

        const btnPDIAdmin =
            document.getElementById(
                "btnPDIAdmin"
            );


        if (btnPDIAdmin) {

            btnPDIAdmin.onclick = () => {

                if (
                    typeof ModuloPDI !==
                    "undefined"
                ) {

                    ModuloPDI.abrir(
                        usuario,
                        banco
                    );

                } else {

                    alert(
                        "O módulo de Relatórios não foi carregado."
                    );

                }

            };

        }


        // =====================================================
        // BASE POWER BI
        // =====================================================

        const btnBasePowerBI =
            document.getElementById(
                "btnBasePowerBI"
            );


        if (btnBasePowerBI) {

            btnBasePowerBI.onclick = () => {

                this.exportarBasePowerBI(
                    banco
                );

            };

        }

    },


    // =====================================================
    // EXPORTAR BASE PARA POWER BI
    // =====================================================

    exportarBasePowerBI(banco) {

        const matrizesPorArea =
            banco.matrizesPorArea || {};


        const linhas = [];


        Object.keys(
            matrizesPorArea
        )
        .forEach(
            nomeArea => {

                const area =
                    matrizesPorArea[nomeArea] || {};


                const nome =
                    area.nome ||
                    nomeArea ||
                    "";


                const colaboradores =
                    Array.isArray(
                        area.colaboradores
                    )
                        ? area.colaboradores
                        : [];


                const habilidades =
                    Array.isArray(
                        area.habilidades
                    )
                        ? area.habilidades
                        : [];


                const avaliacoes =
                    area.avaliacoes || {};


                const matrizEsperada =
                    area.matrizEsperada || {};


                colaboradores.forEach(
                    colaborador => {

                        const cargo =
                            colaborador.cargo || "";


                        const esperado =
                            Array.isArray(
                                matrizEsperada[cargo]
                            )
                                ? matrizEsperada[cargo]
                                : [];


                        const registro =
                            avaliacoes[
                                colaborador.id
                            ];


                        let niveis = [];


                        let dataAvaliacao =
                            "";


                        if (
                            registro &&
                            !Array.isArray(registro) &&
                            typeof registro === "object"
                        ) {

                            niveis =
                                Array.isArray(
                                    registro.niveis
                                )
                                    ? registro.niveis
                                    : [];


                            dataAvaliacao =
                                registro.data ||
                                "";

                        }

                        else if (
                            Array.isArray(
                                registro
                            )
                        ) {

                            niveis =
                                registro;

                        }


                        habilidades.forEach(
                            (
                                habilidade,
                                index
                            ) => {

                                const nivelEsperado =
                                    Number(
                                        esperado[index]
                                    ) || 0;


                                const nivelAtual =
                                    Number(
                                        niveis[index]
                                    ) || 0;


                                const gap =
                                    Math.max(
                                        0,
                                        nivelEsperado -
                                        nivelAtual
                                    );


                                linhas.push({

                                    area:
                                        nome,

                                    colaborador:
                                        colaborador.nome ||
                                        "",

                                    cargo,

                                    habilidade:
                                        habilidade ||
                                        "",

                                    nivelEsperado,

                                    nivelAtual,

                                    gap,

                                    dataAvaliacao

                                });

                            }
                        );

                    }
                );

            }
        );


        if (
            linhas.length === 0
        ) {

            alert(
                "Não foram encontrados dados de competências para exportação."
            );

            return;

        }


        const cabecalho = [

            "Área",

            "Colaborador",

            "Cargo",

            "Habilidade",

            "Nível Esperado",

            "Nível Atual",

            "GAP",

            "Data da Avaliação"

        ];


        let csv =
            cabecalho
                .map(
                    valor =>
                        this.formatarCSV(
                            valor
                        )
                )
                .join(";") +
            "\n";


        linhas.forEach(
            linha => {

                const dados = [

                    linha.area,

                    linha.colaborador,

                    linha.cargo,

                    linha.habilidade,

                    linha.nivelEsperado,

                    linha.nivelAtual,

                    linha.gap,

                    linha.dataAvaliacao

                ];


                csv +=
                    dados
                        .map(
                            valor =>
                                this.formatarCSV(
                                    valor
                                )
                        )
                        .join(";") +
                    "\n";

            }
        );


        const blob =
            new Blob(
                [
                    "\ufeff" + csv
                ],
                {

                    type:
                        "text/csv;charset=utf-8;"

                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "Base_Competencias.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    },


    // =====================================================
    // FORMATAR CSV
    // =====================================================

    formatarCSV(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(valor)

            .replace(
                /;/g,
                ","
            )

            .replace(
                /\r?\n|\r/g,
                " "
            )

            .trim();

    }

};