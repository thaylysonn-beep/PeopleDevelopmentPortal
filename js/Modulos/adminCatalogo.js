// ============================================================
// ADMIN - CATÁLOGO DE COMPETÊNCIAS
// IMPORTAÇÃO + COMPLEMENTAÇÃO DO CATÁLOGO
// ============================================================

const ModuloAdminCatalogo = {

    // ========================================================
    // CONFIGURAÇÃO
    // ========================================================

    colunasEsperadas: [
        "competencia",
        "definicao",
        "nivel1",
        "nivel2",
        "nivel3",
        "nivel4"
    ],

    // ========================================================
    // NORMALIZAÇÃO
    // ========================================================

    normalizarTexto(texto) {

        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    },

    normalizarCabecalho(texto) {

        return this.normalizarTexto(texto)
            .replace(/[^a-z0-9]/g, "");

    },

    limparTexto(texto) {

        return String(texto ?? "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();

    },

    escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    },

    // ========================================================
    // GARANTIR ESTRUTURA
    // ========================================================

    garantirEstruturaCatalogo(banco) {

        if (!banco) {
            throw new Error(
                "Banco de dados não informado."
            );
        }

        if (!Array.isArray(banco.habilidades)) {
            banco.habilidades = [];
        }

        if (
            !banco.detalhesHabilidades ||
            typeof banco.detalhesHabilidades !== "object"
        ) {
            banco.detalhesHabilidades = {};
        }

    },

    // ========================================================
    // LOCALIZAR DETALHES DE UMA COMPETÊNCIA
    // ========================================================

    localizarDetalhes(banco, nome) {

        this.garantirEstruturaCatalogo(banco);

        const chave =
            this.normalizarTexto(nome);

        // Primeiro tenta pelo nome exato
        if (
            banco.detalhesHabilidades[nome]
        ) {

            return {
                chave: nome,
                detalhes:
                    banco.detalhesHabilidades[nome]
            };

        }

        // Depois procura ignorando maiúsculas,
        // acentos e espaços
        const chaveEncontrada =
            Object.keys(
                banco.detalhesHabilidades
            ).find(nomeExistente =>
                this.normalizarTexto(nomeExistente) === chave
            );

        if (chaveEncontrada) {

            return {
                chave: chaveEncontrada,
                detalhes:
                    banco.detalhesHabilidades[
                        chaveEncontrada
                    ]
            };

        }

        return null;

    },

    // ========================================================
    // LOCALIZAR COMPETÊNCIA NO CATÁLOGO
    // ========================================================

    localizarCompetencia(banco, nome) {

        this.garantirEstruturaCatalogo(banco);

        const chave =
            this.normalizarTexto(nome);

        // ----------------------------------------------------
        // Procura no banco.habilidades
        // ----------------------------------------------------

        for (
            let i = 0;
            i < banco.habilidades.length;
            i++
        ) {

            const item =
                banco.habilidades[i];

            const nomeItem =
                typeof item === "string"
                    ? item
                    : item?.nome;

            if (!nomeItem) {
                continue;
            }

            if (
                this.normalizarTexto(nomeItem) === chave
            ) {

                return {
                    nome: nomeItem,
                    indice: i,
                    item: item
                };

            }

        }

        // ----------------------------------------------------
        // Procura nos detalhes
        // ----------------------------------------------------

        const detalhe =
            this.localizarDetalhes(
                banco,
                nome
            );

        if (detalhe) {

            return {
                nome: detalhe.chave,
                indice: -1,
                item: detalhe.detalhes
            };

        }

        // ----------------------------------------------------
        // Procura também nas matrizes
        // ----------------------------------------------------

        for (
            const area of Object.values(
                banco.matrizesPorArea || {}
            )
        ) {

            if (
                !Array.isArray(area?.habilidades)
            ) {
                continue;
            }

            for (
                const habilidade of area.habilidades
            ) {

                const nomeHabilidade =
                    typeof habilidade === "string"
                        ? habilidade
                        : habilidade?.nome;

                if (!nomeHabilidade) {
                    continue;
                }

                if (
                    this.normalizarTexto(
                        nomeHabilidade
                    ) === chave
                ) {

                    return {
                        nome: nomeHabilidade,
                        indice: -1,
                        item: habilidade
                    };

                }

            }

        }

        return null;

    },

    // ========================================================
    // GARANTIR ESTRUTURA DOS DETALHES
    // ========================================================

    garantirDetalhesCompetencia(
        banco,
        nome
    ) {

        this.garantirEstruturaCatalogo(banco);

        const existente =
            this.localizarDetalhes(
                banco,
                nome
            );

        if (existente) {

            const detalhes =
                existente.detalhes;

            if (
                !detalhes.niveis ||
                typeof detalhes.niveis !== "object"
            ) {

                detalhes.niveis = {};

            }

            return detalhes;

        }

        const detalhes = {

            nome: nome,

            direcionador: "",

            definicao: "",

            niveis: {

                1: "",
                2: "",
                3: "",
                4: ""

            }

        };

        banco.detalhesHabilidades[nome] =
            detalhes;

        return detalhes;

    },

    // ========================================================
    // VERIFICAR SE UMA INFORMAÇÃO ESTÁ PREENCHIDA
    // ========================================================

    possuiValor(valor) {

        return (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        );

    },

    // ========================================================
    // COMPARAR INFORMAÇÕES
    // ========================================================

    compararValor(valorSistema, valorExcel) {

        if (
            !this.possuiValor(valorSistema)
        ) {

            return "faltante";

        }

        if (
            !this.possuiValor(valorExcel)
        ) {

            return "excel_vazio";

        }

        if (
            this.normalizarTexto(valorSistema) ===
            this.normalizarTexto(valorExcel)
        ) {

            return "igual";

        }

        return "diferente";

    },

    // ========================================================
    // LOCALIZAR COLUNAS
    // ========================================================

    localizarColunas(cabecalho) {

        const mapa = {};

        cabecalho.forEach(
            (coluna, indice) => {

                const chave =
                    this.normalizarCabecalho(
                        coluna
                    );

                mapa[chave] = indice;

            }
        );

        return mapa;

    },

    // ========================================================
    // VALIDAR CABEÇALHO
    // ========================================================

    validarCabecalho(cabecalho) {

        const mapa =
            this.localizarColunas(
                cabecalho
            );

        const aliases = {

            competencia: [
                "competencia",
                "nomecompetencia"
            ],

            definicao: [
                "definicao",
                "descricao",
                "descricaocompetencia"
            ],

            nivel1: [
                "nivel1",
                "nivel01"
            ],

            nivel2: [
                "nivel2",
                "nivel02"
            ],

            nivel3: [
                "nivel3",
                "nivel03"
            ],

            nivel4: [
                "nivel4",
                "nivel04"
            ]

        };

        const resultado = {};

        for (
            const campo of this.colunasEsperadas
        ) {

            const possiveis =
                aliases[campo] || [campo];

            const encontrado =
                possiveis.find(
                    alias =>
                        mapa[alias] !== undefined
                );

            if (
                encontrado === undefined
            ) {

                return {

                    valido: false,

                    erro:
                        `A coluna "${campo}" não foi encontrada no Excel.`

                };

            }

            resultado[campo] =
                mapa[encontrado];

        }

        return {

            valido: true,

            colunas: resultado

        };

    },

    // ========================================================
    // LER EXCEL
    // ========================================================

    async lerExcel(arquivo) {

        if (
            typeof XLSX === "undefined"
        ) {

            throw new Error(
                "A biblioteca XLSX não foi carregada. " +
                "Verifique o index.html."
            );

        }

        if (!arquivo) {

            throw new Error(
                "Nenhum arquivo foi selecionado."
            );

        }

        const extensao =
            arquivo.name
                .split(".")
                .pop()
                .toLowerCase();

        if (
            extensao !== "xlsx" &&
            extensao !== "xls"
        ) {

            throw new Error(
                "Selecione um arquivo Excel (.xlsx ou .xls)."
            );

        }

        const buffer =
            await arquivo.arrayBuffer();

        const workbook =
            XLSX.read(
                buffer,
                {
                    type: "array"
                }
            );

        if (
            !workbook.SheetNames ||
            workbook.SheetNames.length === 0
        ) {

            throw new Error(
                "O arquivo Excel não possui planilhas."
            );

        }

        // Prioriza Catálogo Mestre

        let nomePlanilha =
            workbook.SheetNames.find(
                nome =>
                    this.normalizarTexto(nome) ===
                    "catalogo mestre"
            );

        if (!nomePlanilha) {

            nomePlanilha =
                workbook.SheetNames[0];

        }

        const planilha =
            workbook.Sheets[nomePlanilha];

        const dados =
            XLSX.utils.sheet_to_json(
                planilha,
                {
                    header: 1,
                    defval: "",
                    raw: false
                }
            );

        if (!dados.length) {

            throw new Error(
                "A planilha está vazia."
            );

        }

        const cabecalho =
            dados[0];

        const validacao =
            this.validarCabecalho(
                cabecalho
            );

        if (!validacao.valido) {

            throw new Error(
                validacao.erro
            );

        }

        const registros = [];

        const erros = [];

        const col =
            validacao.colunas;

        // ====================================================
        // PROCESSAR LINHAS
        // ====================================================

        for (
            let i = 1;
            i < dados.length;
            i++
        ) {

            const linha =
                dados[i];

            const possuiConteudo =
                linha.some(
                    valor =>
                        this.limparTexto(valor) !== ""
                );

            if (!possuiConteudo) {
                continue;
            }

            const competencia =
                this.limparTexto(
                    linha[col.competencia]
                );

            const definicao =
                this.limparTexto(
                    linha[col.definicao]
                );

            const nivel1 =
                this.limparTexto(
                    linha[col.nivel1]
                );

            const nivel2 =
                this.limparTexto(
                    linha[col.nivel2]
                );

            const nivel3 =
                this.limparTexto(
                    linha[col.nivel3]
                );

            const nivel4 =
                this.limparTexto(
                    linha[col.nivel4]
                );

            // Competência é obrigatória

            if (!competencia) {

                erros.push({

                    linha: i + 1,

                    competencia:
                        "(sem nome)",

                    erro:
                        "A competência está vazia."

                });

                continue;

            }

            // Os demais campos podem estar vazios.
            // Isso permite usar o Excel para
            // complementar competências existentes.

            registros.push({

                linha: i + 1,

                competencia,

                definicao,

                nivel1,

                nivel2,

                nivel3,

                nivel4

            });

        }

        return {

            planilha: nomePlanilha,

            registros,

            erros,

            totalLinhas:
                Math.max(
                    0,
                    dados.length - 1
                )

        };

    },

    // ========================================================
    // ANALISAR UMA COMPETÊNCIA
    // ========================================================

    analisarCompetencia(
        banco,
        registro
    ) {

        const encontrada =
            this.localizarCompetencia(
                banco,
                registro.competencia
            );

        // ====================================================
        // NOVA
        // ====================================================

        if (!encontrada) {

            return {

                tipo: "nova",

                registro,

                faltantes: [
                    "Definição",
                    "Nível 1",
                    "Nível 2",
                    "Nível 3",
                    "Nível 4"
                ],

                alteracoes: []

            };

        }

        const detalhes =
            this.garantirDetalhesCompetencia(
                banco,
                encontrada.nome
            );

        const alteracoes = [];

        const campos = [

            {
                nome: "Definição",
                sistema:
                    detalhes.definicao,
                excel:
                    registro.definicao
            },

            {
                nome: "Nível 1",
                sistema:
                    detalhes.niveis?.[1],
                excel:
                    registro.nivel1
            },

            {
                nome: "Nível 2",
                sistema:
                    detalhes.niveis?.[2],
                excel:
                    registro.nivel2
            },

            {
                nome: "Nível 3",
                sistema:
                    detalhes.niveis?.[3],
                excel:
                    registro.nivel3
            },

            {
                nome: "Nível 4",
                sistema:
                    detalhes.niveis?.[4],
                excel:
                    registro.nivel4
            }

        ];

        let faltantes = [];

        let diferentes = [];

        let preenchidos = 0;

        campos.forEach(campo => {

            const comparacao =
                this.compararValor(
                    campo.sistema,
                    campo.excel
                );

            if (
                comparacao === "faltante" &&
                this.possuiValor(campo.excel)
            ) {

                faltantes.push(
                    campo.nome
                );

            }

            else if (
                comparacao === "diferente"
            ) {

                diferentes.push(
                    campo.nome
                );

            }

            else if (
                comparacao === "igual"
            ) {

                preenchidos++;

            }

        });

        // ====================================================
        // COMPLETA
        // ====================================================

        if (
            faltantes.length > 0
        ) {

            faltantes.forEach(campo => {

                alteracoes.push({
                    campo,
                    tipo: "preencher"
                });

            });

            return {

                tipo: "completar",

                registro,

                nomeSistema:
                    encontrada.nome,

                detalhes,

                faltantes,

                diferentes,

                alteracoes

            };

        }

        // ====================================================
        // DIVERGENTE
        // ====================================================

        if (
            diferentes.length > 0
        ) {

            return {

                tipo: "divergente",

                registro,

                nomeSistema:
                    encontrada.nome,

                detalhes,

                faltantes,

                diferentes,

                alteracoes

            };

        }

        // ====================================================
        // JÁ COMPLETA
        // ====================================================

        return {

            tipo: "completa",

            registro,

            nomeSistema:
                encontrada.nome,

            detalhes,

            faltantes: [],

            diferentes: [],

            alteracoes: []

        };

    },

    // ========================================================
    // ANALISAR TODO O ARQUIVO
    // ========================================================

    analisarImportacao(
        banco,
        registros
    ) {

        const resultado = {

            novas: [],

            completar: [],

            completas: [],

            divergentes: [],

            erros: []

        };

        const processadas =
            new Set();

        registros.forEach(
            registro => {

                const chave =
                    this.normalizarTexto(
                        registro.competencia
                    );

                // --------------------------------------------
                // Duplicada dentro do próprio Excel
                // --------------------------------------------

                if (
                    processadas.has(chave)
                ) {

                    resultado.erros.push({

                        linha:
                            registro.linha,

                        competencia:
                            registro.competencia,

                        erro:
                            "Competência repetida no próprio arquivo."

                    });

                    return;

                }

                processadas.add(chave);

                const analise =
                    this.analisarCompetencia(
                        banco,
                        registro
                    );

                if (
                    analise.tipo === "nova"
                ) {

                    resultado.novas.push(
                        analise
                    );

                }

                else if (
                    analise.tipo === "completar"
                ) {

                    resultado.completar.push(
                        analise
                    );

                }

                else if (
                    analise.tipo === "completa"
                ) {

                    resultado.completas.push(
                        analise
                    );

                }

                else if (
                    analise.tipo === "divergente"
                ) {

                    resultado.divergentes.push(
                        analise
                    );

                }

            }
        );

        return resultado;

    },

    // ========================================================
    // ADICIONAR NOVA COMPETÊNCIA
    // ========================================================

    adicionarNovaCompetencia(
        banco,
        analise
    ) {

        const registro =
            analise.registro;

        const nome =
            registro.competencia.trim();

        const detalhes = {

            nome,

            direcionador: "",

            definicao:
                registro.definicao,

            niveis: {

                1: registro.nivel1,

                2: registro.nivel2,

                3: registro.nivel3,

                4: registro.nivel4

            }

        };

        banco.habilidades.push(
            nome
        );

        banco.detalhesHabilidades[nome] =
            detalhes;

        return true;

    },

    // ========================================================
    // COMPLETAR COMPETÊNCIA EXISTENTE
    // ========================================================

    completarCompetencia(
        banco,
        analise
    ) {

        const detalhes =
            analise.detalhes;

        const registro =
            analise.registro;

        let alterada = false;

        // ----------------------------------------------------
        // Definição
        // ----------------------------------------------------

        if (
            !this.possuiValor(
                detalhes.definicao
            ) &&
            this.possuiValor(
                registro.definicao
            )
        ) {

            detalhes.definicao =
                registro.definicao;

            alterada = true;

        }

        // ----------------------------------------------------
        // Níveis
        // ----------------------------------------------------

        if (
            !detalhes.niveis ||
            typeof detalhes.niveis !== "object"
        ) {

            detalhes.niveis = {};

        }

        const niveisExcel = {

            1: registro.nivel1,

            2: registro.nivel2,

            3: registro.nivel3,

            4: registro.nivel4

        };

        [1, 2, 3, 4].forEach(
            nivel => {

                if (
                    !this.possuiValor(
                        detalhes.niveis[nivel]
                    ) &&
                    this.possuiValor(
                        niveisExcel[nivel]
                    )
                ) {

                    detalhes.niveis[nivel] =
                        niveisExcel[nivel];

                    alterada = true;

                }

            }
        );

        return alterada;

    },

    // ========================================================
    // EXECUTAR IMPORTAÇÃO
    // ========================================================

    async executarImportacao(
        banco,
        analise
    ) {

        this.garantirEstruturaCatalogo(
            banco
        );

        let novas = 0;

        let completadas = 0;

        let completas = 0;

        let divergentes = 0;

        // ====================================================
        // NOVAS
        // ====================================================

        analise.novas.forEach(
            item => {

                if (
                    this.adicionarNovaCompetencia(
                        banco,
                        item
                    )
                ) {

                    novas++;

                }

            }
        );

        // ====================================================
        // COMPLETAR
        // ====================================================

        analise.completar.forEach(
            item => {

                if (
                    this.completarCompetencia(
                        banco,
                        item
                    )
                ) {

                    completadas++;

                }

            }
        );

        // ====================================================
        // JÁ COMPLETAS
        // ====================================================

        completas =
            analise.completas.length;

        // ====================================================
        // DIVERGENTES
        // ====================================================

        divergentes =
            analise.divergentes.length;

        // ====================================================
        // SALVAR
        // ====================================================

        if (
            novas > 0 ||
            completadas > 0
        ) {

            const salvou =
                await Storage.salvarBanco(
                    banco
                );

            if (!salvou) {

                throw new Error(
                    "Não foi possível salvar as alterações no banco de dados."
                );

            }

        }

        return {

            novas,

            completadas,

            completas,

            divergentes,

            erros:
                analise.erros.length

        };

    },

    // ========================================================
    // MODAL
    // ========================================================

    abrir(
        usuario,
        banco
    ) {

        const modal =
            document.createElement("div");

        modal.id =
            "modalAdminCatalogo";

        modal.innerHTML = `

            <div style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.78);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:99999;
                padding:20px;
            ">

                <div style="
                    width:min(1100px,96vw);
                    max-height:92vh;
                    overflow:auto;
                    background:#111820;
                    border:1px solid #2d3945;
                    border-radius:16px;
                    box-shadow:0 20px 60px rgba(0,0,0,.55);
                    color:#e8edf2;
                    padding:26px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:20px;
                        margin-bottom:24px;
                    ">

                        <div>

                            <div style="
                                font-size:24px;
                                font-weight:700;
                                margin-bottom:7px;
                            ">
                                Catálogo de Competências
                            </div>

                            <div style="
                                color:#9ba8b5;
                                font-size:14px;
                                line-height:1.5;
                            ">
                                Importe ou complete as informações
                                das competências existentes no sistema.
                            </div>

                        </div>

                        <button
                            id="btnFecharCatalogo"
                            style="
                                border:0;
                                background:#26313d;
                                color:#fff;
                                width:38px;
                                height:38px;
                                border-radius:10px;
                                cursor:pointer;
                                font-size:18px;
                            "
                        >
                            ×
                        </button>

                    </div>

                    <!-- ESTRUTURA -->

                    <div style="
                        background:#18222c;
                        border:1px solid #2b3947;
                        border-radius:14px;
                        padding:18px;
                        margin-bottom:18px;
                    ">

                        <div style="
                            font-weight:700;
                            margin-bottom:10px;
                        ">
                            Estrutura esperada do Excel
                        </div>

                        <div style="
                            display:flex;
                            flex-wrap:wrap;
                            gap:8px;
                        ">

                            ${[
                                "Competência",
                                "Definição",
                                "Nível 1",
                                "Nível 2",
                                "Nível 3",
                                "Nível 4"
                            ].map(item => `

                                <span style="
                                    background:#253240;
                                    border:1px solid #364554;
                                    padding:7px 10px;
                                    border-radius:8px;
                                    font-size:12px;
                                ">
                                    ${item}
                                </span>

                            `).join("")}

                        </div>

                    </div>

                    <!-- EXPLICAÇÃO -->

                    <div style="
                        background:#18222c;
                        border:1px solid #2b3947;
                        border-radius:12px;
                        padding:15px;
                        margin-bottom:18px;
                        font-size:13px;
                        color:#b9c5cf;
                        line-height:1.6;
                    ">

                        <strong style="
                            color:#e8edf2;
                        ">
                            Como funciona:
                        </strong>

                        <br>

                        🟢 Competência nova → será criada.

                        <br>

                        🟡 Competência existente incompleta
                        → as informações faltantes serão preenchidas.

                        <br>

                        ⚪ Competência já completa
                        → não será alterada.

                        <br>

                        🔵 Informação diferente
                        → será preservada e apresentada como divergência.

                    </div>

                    <input
                        type="file"
                        id="inputExcelCatalogo"
                        accept=".xlsx,.xls"
                        style="display:none;"
                    >

                    <button
                        id="btnSelecionarExcel"
                        style="
                            width:100%;
                            padding:15px;
                            border:1px dashed #4b6073;
                            background:#18232e;
                            color:#e8edf2;
                            border-radius:12px;
                            cursor:pointer;
                            font-size:15px;
                            font-weight:600;
                        "
                    >
                        📥 Selecionar arquivo Excel
                    </button>

                    <div
                        id="statusCatalogo"
                        style="
                            margin-top:18px;
                        "
                    ></div>

                    <div
                        id="previewCatalogo"
                        style="
                            margin-top:18px;
                        "
                    ></div>

                </div>

            </div>

        `;

        document.body.appendChild(
            modal
        );

        // ====================================================
        // FECHAR
        // ====================================================

        modal.querySelector(
            "#btnFecharCatalogo"
        ).onclick = () => {

            modal.remove();

        };

        const fundo =
            modal.firstElementChild;

        fundo.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === fundo
                ) {

                    modal.remove();

                }

            }
        );

        // ====================================================
        // SELECIONAR EXCEL
        // ====================================================

        const input =
            modal.querySelector(
                "#inputExcelCatalogo"
            );

        modal.querySelector(
            "#btnSelecionarExcel"
        ).onclick = () => {

            input.click();

        };

        input.onchange =
            async evento => {

                const arquivo =
                    evento.target.files?.[0];

                if (!arquivo) {
                    return;
                }

                await this.processarArquivo(
                    arquivo,
                    banco,
                    modal
                );

            };

    },

    // ========================================================
    // PROCESSAR ARQUIVO
    // ========================================================

    async processarArquivo(
        arquivo,
        banco,
        modal
    ) {

        const status =
            modal.querySelector(
                "#statusCatalogo"
            );

        const preview =
            modal.querySelector(
                "#previewCatalogo"
            );

        status.innerHTML = `

            <div style="
                background:#18222c;
                border:1px solid #2b3947;
                padding:14px;
                border-radius:10px;
                color:#b9c5cf;
            ">
                ⏳ Analisando o catálogo...
            </div>

        `;

        preview.innerHTML = "";

        try {

            const leitura =
                await this.lerExcel(
                    arquivo
                );

            const analise =
                this.analisarImportacao(
                    banco,
                    leitura.registros
                );

            this.mostrarResumo(
                modal,
                leitura,
                analise
            );

            this.mostrarPreview(
                modal,
                banco,
                leitura,
                analise
            );

        } catch (erro) {

            status.innerHTML = `

                <div style="
                    background:#321d20;
                    border:1px solid #6b3038;
                    color:#ffccd1;
                    padding:15px;
                    border-radius:10px;
                ">
                    ❌
                    ${this.escaparHTML(
                        erro.message
                    )}
                </div>

            `;

        }

    },

    // ========================================================
    // RESUMO
    // ========================================================

    mostrarResumo(
        modal,
        leitura,
        analise
    ) {

        const status =
            modal.querySelector(
                "#statusCatalogo"
            );

        status.innerHTML = `

            <div style="
                background:#18222c;
                border:1px solid #2b3947;
                border-radius:12px;
                padding:16px;
            ">

                <div style="
                    font-weight:700;
                    margin-bottom:12px;
                ">
                    ${this.escaparHTML(
                        leitura.planilha
                    )}
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(150px,1fr));
                    gap:10px;
                ">

                    <div style="
                        background:#202d38;
                        padding:12px;
                        border-radius:9px;
                    ">
                        <div style="
                            font-size:12px;
                            color:#9ba8b5;
                        ">
                            🟢 Novas
                        </div>

                        <strong style="
                            font-size:20px;
                        ">
                            ${analise.novas.length}
                        </strong>
                    </div>

                    <div style="
                        background:#202d38;
                        padding:12px;
                        border-radius:9px;
                    ">
                        <div style="
                            font-size:12px;
                            color:#9ba8b5;
                        ">
                            🟡 Completar
                        </div>

                        <strong style="
                            font-size:20px;
                        ">
                            ${analise.completar.length}
                        </strong>
                    </div>

                    <div style="
                        background:#202d38;
                        padding:12px;
                        border-radius:9px;
                    ">
                        <div style="
                            font-size:12px;
                            color:#9ba8b5;
                        ">
                            ⚪ Completas
                        </div>

                        <strong style="
                            font-size:20px;
                        ">
                            ${analise.completas.length}
                        </strong>
                    </div>

                    <div style="
                        background:#202d38;
                        padding:12px;
                        border-radius:9px;
                    ">
                        <div style="
                            font-size:12px;
                            color:#9ba8b5;
                        ">
                            🔵 Divergentes
                        </div>

                        <strong style="
                            font-size:20px;
                        ">
                            ${analise.divergentes.length}
                        </strong>
                    </div>

                    <div style="
                        background:#202d38;
                        padding:12px;
                        border-radius:9px;
                    ">
                        <div style="
                            font-size:12px;
                            color:#9ba8b5;
                        ">
                            ❌ Erros
                        </div>

                        <strong style="
                            font-size:20px;
                        ">
                            ${leitura.erros.length}
                        </strong>
                    </div>

                </div>

            </div>

        `;

    },

    // ========================================================
    // PREVIEW
    // ========================================================

    mostrarPreview(
        modal,
        banco,
        leitura,
        analise
    ) {

        const preview =
            modal.querySelector(
                "#previewCatalogo"
            );

        let html = "";

        // ====================================================
        // COMPETÊNCIAS NOVAS
        // ====================================================

        if (
            analise.novas.length
        ) {

            html += `

                <div style="
                    background:#172a20;
                    border:1px solid #315f48;
                    border-radius:12px;
                    padding:16px;
                    margin-bottom:14px;
                ">

                    <div style="
                        font-weight:700;
                        margin-bottom:10px;
                    ">
                        🟢
                        ${analise.novas.length}
                        nova(s) competência(s)
                    </div>

                    <div style="
                        max-height:180px;
                        overflow:auto;
                        color:#b8d3c1;
                        font-size:13px;
                        line-height:1.7;
                    ">

                        ${analise.novas
                            .slice(0,30)
                            .map(item => `
                                <div>
                                    •
                                    ${this.escaparHTML(
                                        item.registro.competencia
                                    )}
                                </div>
                            `)
                            .join("")}

                    </div>

                </div>

            `;

        }

        // ====================================================
        // COMPLETAR
        // ====================================================

        if (
            analise.completar.length
        ) {

            html += `

                <div style="
                    background:#292518;
                    border:1px solid #62552c;
                    border-radius:12px;
                    padding:16px;
                    margin-bottom:14px;
                ">

                    <div style="
                        font-weight:700;
                        margin-bottom:10px;
                    ">
                        🟡
                        ${analise.completar.length}
                        competência(s) serão completadas
                    </div>

                    <div style="
                        max-height:250px;
                        overflow:auto;
                        font-size:13px;
                    ">

                        ${analise.completar
                            .slice(0,50)
                            .map(item => `

                                <div style="
                                    padding:8px 0;
                                    border-bottom:1px solid #403b26;
                                ">

                                    <strong>
                                        ${this.escaparHTML(
                                            item.nomeSistema
                                        )}
                                    </strong>

                                    <div style="
                                        color:#c8bd96;
                                        margin-top:3px;
                                    ">
                                        Preencher:
                                        ${item.faltantes.join(", ")}
                                    </div>

                                </div>

                            `)
                            .join("")}

                    </div>

                </div>

            `;

        }

        // ====================================================
        // DIVERGENTES
        // ====================================================

        if (
            analise.divergentes.length
        ) {

            html += `

                <div style="
                    background:#211c2c;
                    border:1px solid #56456f;
                    border-radius:12px;
                    padding:16px;
                    margin-bottom:14px;
                ">

                    <div style="
                        font-weight:700;
                        margin-bottom:8px;
                    ">
                        🔵
                        ${analise.divergentes.length}
                        divergência(s)
                    </div>

                    <div style="
                        color:#c8bdd8;
                        font-size:13px;
                        line-height:1.6;
                    ">

                        Essas informações já existem no sistema
                        e são diferentes das encontradas no Excel.
                        Elas não serão sobrescritas.

                    </div>

                    <div style="
                        margin-top:10px;
                        max-height:180px;
                        overflow:auto;
                    ">

                        ${analise.divergentes
                            .slice(0,30)
                            .map(item => `

                                <div style="
                                    padding:7px 0;
                                ">

                                    <strong>
                                        ${this.escaparHTML(
                                            item.nomeSistema
                                        )}
                                    </strong>

                                    <div style="
                                        color:#aaa0ba;
                                    ">
                                        Divergência:
                                        ${item.diferentes.join(", ")}
                                    </div>

                                </div>

                            `)
                            .join("")}

                    </div>

                </div>

            `;

        }

        // ====================================================
        // ERROS
        // ====================================================

        if (
            leitura.erros.length
        ) {

            html += `

                <div style="
                    background:#321d20;
                    border:1px solid #6b3038;
                    border-radius:12px;
                    padding:16px;
                    margin-bottom:14px;
                ">

                    <div style="
                        font-weight:700;
                        margin-bottom:8px;
                    ">
                        ❌
                        ${leitura.erros.length}
                        erro(s)
                    </div>

                    ${leitura.erros
                        .slice(0,20)
                        .map(erro => `

                            <div style="
                                font-size:13px;
                                color:#ffccd1;
                                margin-top:5px;
                            ">
                                Linha ${erro.linha}:
                                ${this.escaparHTML(
                                    erro.erro
                                )}
                            </div>

                        `)
                        .join("")}

                </div>

            `;

        }

        // ====================================================
        // BOTÃO
        // ====================================================

        const totalAlteracoes =
            analise.novas.length +
            analise.completar.length;

        if (
            totalAlteracoes > 0
        ) {

            html += `

                <div style="
                    display:flex;
                    justify-content:flex-end;
                    gap:10px;
                    margin-top:18px;
                ">

                    <button
                        id="btnCancelarImportacao"
                        style="
                            border:1px solid #394754;
                            background:#202b35;
                            color:#dce4eb;
                            padding:13px 20px;
                            border-radius:10px;
                            cursor:pointer;
                            font-weight:600;
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        id="btnConfirmarImportacao"
                        style="
                            border:0;
                            background:#246bce;
                            color:#fff;
                            padding:13px 20px;
                            border-radius:10px;
                            cursor:pointer;
                            font-weight:700;
                        "
                    >
                        Confirmar importação
                    </button>

                </div>

            `;

        } else {

            html += `

                <div style="
                    background:#18222c;
                    border:1px solid #2b3947;
                    border-radius:12px;
                    padding:18px;
                    color:#9ba8b5;
                    text-align:center;
                ">
                    Nenhuma alteração necessária.
                </div>

            `;

        }

        preview.innerHTML =
            html;

        // ====================================================
        // CANCELAR
        // ====================================================

        const cancelar =
            preview.querySelector(
                "#btnCancelarImportacao"
            );

        if (cancelar) {

            cancelar.onclick = () => {

                preview.innerHTML = "";

            };

        }

        // ====================================================
        // CONFIRMAR
        // ====================================================

        const confirmar =
            preview.querySelector(
                "#btnConfirmarImportacao"
            );

        if (!confirmar) {
            return;
        }

        confirmar.onclick =
            async () => {

                confirmar.disabled =
                    true;

                confirmar.innerText =
                    "Salvando alterações...";

                try {

                    const resultado =
                        await this.executarImportacao(
                            banco,
                            analise
                        );

                    preview.innerHTML = `

                        <div style="
                            background:#182d23;
                            border:1px solid #315f48;
                            border-radius:12px;
                            padding:22px;
                        ">

                            <div style="
                                font-size:19px;
                                font-weight:700;
                                margin-bottom:14px;
                            ">
                                ✅ Catálogo atualizado
                            </div>

                            <div style="
                                line-height:1.8;
                                color:#b8d3c1;
                            ">

                                🟢
                                <strong>
                                    ${resultado.novas}
                                </strong>
                                nova(s) competência(s).

                                <br>

                                🟡
                                <strong>
                                    ${resultado.completadas}
                                </strong>
                                competência(s)
                                completada(s).

                                <br>

                                ⚪
                                <strong>
                                    ${resultado.completas}
                                </strong>
                                já estavam completas.

                                <br>

                                🔵
                                <strong>
                                    ${resultado.divergentes}
                                </strong>
                                divergência(s)
                                preservada(s).

                                <br>

                                ❌
                                <strong>
                                    ${resultado.erros}
                                </strong>
                                erro(s).

                            </div>

                            <div style="
                                margin-top:15px;
                                padding-top:14px;
                                border-top:1px solid #31503f;
                                color:#8eab99;
                                font-size:12px;
                            ">
                                Nenhuma competência foi atribuída
                                automaticamente a cargos ou áreas.
                            </div>

                            <button
                                id="btnFecharCatalogoFinal"
                                style="
                                    margin-top:18px;
                                    border:0;
                                    background:#26313d;
                                    color:#fff;
                                    padding:11px 18px;
                                    border-radius:9px;
                                    cursor:pointer;
                                "
                            >
                                Fechar
                            </button>

                        </div>

                    `;

                    const fechar =
                        preview.querySelector(
                            "#btnFecharCatalogoFinal"
                        );

                    if (fechar) {

                        fechar.onclick =
                            () => modal.remove();

                    }

                } catch (erro) {

                    confirmar.disabled =
                        false;

                    confirmar.innerText =
                        "Tentar novamente";

                    alert(
                        "Erro ao salvar o catálogo:\n\n" +
                        erro.message
                    );

                }

            };

    }

};