let banco = null;


// =====================================
// SENHA ADICIONAL - MÓDULO SUCESSÃO
// =====================================

const SENHA_SUCESSAO = "gestor";


// =====================================
// TELA AUTORIZAÇÃO DO BANCO
// =====================================

async function telaBanco(){

    try{

        banco = await Storage.carregarBanco();

        if(banco){

            console.log(
                "Banco recuperado automaticamente."
            );

            mostrarLogin();

            return;

        }

    }
    catch(erro){

        console.error(
            "Erro tentando recuperar banco:",
            erro
        );

    }


    UI.carregar(`

        <div class="login">

            <div class="card">

                <div style="text-align:center;margin-bottom:20px">

                    <img
                        src="assets/logo-corteva.png"
                        style="height:70px"
                    >

                </div>

                <h1>
                    People Development Portal
                </h1>

                <div class="subtitulo">
                    Desenvolvimento de Pessoas
                </div>

                <p class="footer">
                    Banco não autorizado
                </p>

                <button id="btnBanco">
                    🔐 Autorizar acesso ao banco
                </button>

            </div>

        </div>

    `);


    document
        .getElementById("btnBanco")
        .onclick = async () => {

            const autorizado =
                await Storage.selecionarBanco();

            if(!autorizado){

                return;

            }

            banco =
                await Storage.carregarBanco();

            if(!banco){

                alert(
                    "Erro ao carregar banco."
                );

                return;

            }

            mostrarLogin();

        };

}


// =====================================
// TELA LOGIN
// =====================================

function mostrarLogin(){

    UI.carregar(`

        <div class="login">

            <div class="card">

                <div style="text-align:center;margin-bottom:20px">

                    <img
                        src="assets/logo-corteva.png"
                        style="height:70px"
                    >

                </div>

                <h1>
                    People Development Portal
                </h1>

                <div class="subtitulo">
                    Acesso ao sistema
                </div>

                <label>
                    Área
                </label>

                <select id="area">

                    <option value="">
                        Selecione
                    </option>

                </select>

                <br><br>

                <label>
                    Senha
                </label>

                <input
                    type="password"
                    id="senha"
                >

                <br><br>

                <button id="btnEntrar">
                    Entrar
                </button>

                <p
                    id="erro"
                    class="footer"
                ></p>

            </div>

        </div>

    `);


    const selectArea =
        document.getElementById("area");


    (banco.usuarios || []).forEach(
        usuario => {

            let option =
                document.createElement("option");

            option.value =
                usuario.area;

            option.textContent =
                usuario.area;

            selectArea.appendChild(
                option
            );

        }
    );


    document
        .getElementById("btnEntrar")
        .onclick = () => {

            const area =
                document
                .getElementById("area")
                .value;

            const senha =
                document
                .getElementById("senha")
                .value;

            const usuario =
                Auth.entrar(
                    area,
                    senha,
                    banco
                );


            if(usuario){

                if(
                    usuario.perfil ===
                    "ADMIN"
                ){

                    ModuloAdmin.abrir(
                        usuario,
                        banco
                    );

                }
                else{

                    mostrarDashboard(
                        usuario
                    );

                }

            }
            else{

                document
                    .getElementById("erro")
                    .innerHTML =
                    "Área ou senha inválida";

            }

        };

}


// =====================================
// TELA DE SENHA DA SUCESSÃO
// =====================================

function solicitarSenhaSucessao(usuario){

    const conteudoAnterior =
        document.querySelector(".portal");


    if(conteudoAnterior){

        conteudoAnterior.style.display =
            "none";

    }


    const modal =
        document.createElement("div");


    modal.id =
        "modalSenhaSucessao";


    modal.innerHTML = `

        <div
            class="login"
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:rgba(0,0,0,0.75);
                display:flex;
                align-items:center;
                justify-content:center;
            "
        >

            <div
                class="card"
                style="
                    max-width:400px;
                    width:90%;
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:40px;
                        margin-bottom:15px;
                    "
                >
                    👑
                </div>

                <h2
                    style="
                        text-align:center;
                        margin-bottom:10px;
                    "
                >
                    Acesso Restrito
                </h2>

                <p
                    style="
                        text-align:center;
                        margin-bottom:25px;
                        opacity:0.75;
                    "
                >

                    O módulo de Sucessão possui
                    acesso restrito.

                    <br><br>

                    Digite a senha adicional
                    para continuar.

                </p>

                <label>
                    Senha de acesso
                </label>

                <input
                    type="password"
                    id="senhaSucessao"
                    autocomplete="off"
                    style="
                        width:100%;
                        box-sizing:border-box;
                    "
                >

                <p
                    id="erroSenhaSucessao"
                    style="
                        color:#ff5c5c;
                        text-align:center;
                        min-height:20px;
                        margin-top:10px;
                    "
                ></p>

                <div
                    style="
                        display:flex;
                        gap:10px;
                        margin-top:15px;
                    "
                >

                    <button
                        id="btnCancelarSucessao"
                        style="flex:1;"
                    >
                        Cancelar
                    </button>

                    <button
                        id="btnConfirmarSucessao"
                        style="flex:1;"
                    >
                        Entrar
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const inputSenha =
        document.getElementById(
            "senhaSucessao"
        );


    setTimeout(
        () => inputSenha.focus(),
        100
    );


    document
        .getElementById(
            "btnCancelarSucessao"
        )
        .onclick = () => {

            modal.remove();

            if(conteudoAnterior){

                conteudoAnterior.style.display =
                    "";

            }

        };


    function validarSenha(){

        const senhaDigitada =
            inputSenha.value;


        if(
            senhaDigitada ===
            SENHA_SUCESSAO
        ){

            modal.remove();

            ModuloSucessao.abrir(
                usuario,
                banco
            );

        }
        else{

            document
                .getElementById(
                    "erroSenhaSucessao"
                )
                .textContent =
                "Senha incorreta.";

            inputSenha.value =
                "";

            inputSenha.focus();

        }

    }


    document
        .getElementById(
            "btnConfirmarSucessao"
        )
        .onclick =
        validarSenha;


    inputSenha.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Enter"
            ){

                validarSenha();

            }

        }
    );

}


// =====================================
// FUNÇÕES AUXILIARES
// =====================================

function escaparHTML(valor){

    return String(valor ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


function normalizarTexto(valor){

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .toLowerCase()
        .trim();

}


// =====================================
// GARANTIR CATÁLOGO
// =====================================

function garantirCatalogoCompetencias(
    areaAtual
){

    if(!banco.habilidades){

        banco.habilidades = [];

    }


    if(!banco.detalhesHabilidades){

        banco.detalhesHabilidades = {};

    }


    if(!areaAtual.habilidades){

        areaAtual.habilidades = [];

    }


    if(!areaAtual.detalhesHabilidades){

        areaAtual.detalhesHabilidades = {};

    }


    if(!areaAtual.matrizEsperada){

        areaAtual.matrizEsperada = {};

    }

}


// =====================================
// OBTER DETALHES
// =====================================

function obterDetalhesCompetencia(
    areaAtual,
    habilidade
){

    garantirCatalogoCompetencias(
        areaAtual
    );


    return (

        areaAtual
        .detalhesHabilidades?.[
            habilidade
        ]

        ||

        banco
        .detalhesHabilidades?.[
            habilidade
        ]

        ||

        {

            nome:
                habilidade,

            direcionador:
                "",

            definicao:
                "",

            niveis:{

                1:"",
                2:"",
                3:"",
                4:""

            }

        }

    );

}


// =====================================
// SINCRONIZAR MATRIZES
// =====================================

function garantirMatrizesDosCargos(
    areaAtual
){

    const habilidades =
        areaAtual.habilidades || [];


    const cargos =
        areaAtual.cargos || [];


    if(!areaAtual.matrizEsperada){

        areaAtual.matrizEsperada =
            {};

    }


    cargos.forEach(
        cargo => {

            if(
                !Array.isArray(
                    areaAtual
                    .matrizEsperada[
                        cargo
                    ]
                )
            ){

                areaAtual
                    .matrizEsperada[
                        cargo
                    ] =
                    [];

            }


            while(
                areaAtual
                .matrizEsperada[
                    cargo
                ].length <
                habilidades.length
            ){

                areaAtual
                    .matrizEsperada[
                        cargo
                    ]
                    .push(0);

            }

        }
    );

}


// =====================================
// FORMULÁRIO COMPETÊNCIA
// NOVA / EDIÇÃO
// =====================================

function abrirFormularioCompetencia(
    usuario,
    bancoAtual,
    areaAtual,
    cargo,
    competenciaExistente = null
){

    const modoEdicao =
        !!competenciaExistente;


    const modal =
        document.createElement("div");


    modal.id =
        "modalCompetencia";


    const cargos =
        areaAtual.cargos || [];


    const detalhes =
        competenciaExistente
            ? obterDetalhesCompetencia(
                areaAtual,
                competenciaExistente
            )
            : {

                nome:"",
                direcionador:"",
                definicao:"",

                niveis:{
                    1:"",
                    2:"",
                    3:"",
                    4:""
                }

            };


    let nivelAtual = 0;


    if(
        competenciaExistente &&
        cargo &&
        Array.isArray(
            areaAtual.matrizEsperada?.[
                cargo
            ]
        )
    ){

        const indice =
            areaAtual
            .habilidades
            .findIndex(
                habilidade =>
                    normalizarTexto(
                        habilidade
                    ) ===
                    normalizarTexto(
                        competenciaExistente
                    )
            );


        if(indice >= 0){

            nivelAtual =
                Number(
                    areaAtual
                    .matrizEsperada[
                        cargo
                    ][indice]
                ) || 0;

        }

    }


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:rgba(0,0,0,.88);
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
                overflow:auto;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:800px;
                    max-height:92vh;
                    overflow:auto;
                    background:#15191e;
                    color:#fff;
                    border:1px solid #303840;
                    border-radius:14px;
                    box-shadow:0 20px 60px rgba(0,0,0,.7);
                "
            >

                <!-- CABEÇALHO -->

                <div
                    style="
                        padding:22px 25px;
                        border-bottom:1px solid #303840;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >

                    <div>

                        <h2
                            style="
                                margin:0;
                                color:#0b8bd3;
                                font-size:21px;
                            "
                        >
                            ${
                                modoEdicao
                                ? "✏️ Editar Competência"
                                : "+ Nova Competência"
                            }
                        </h2>

                        <div
                            style="
                                margin-top:7px;
                                color:#aeb7bf;
                                font-size:13px;
                            "
                        >
                            ${
                                modoEdicao
                                ? "Altere as informações da competência."
                                : "Cadastre uma nova competência para a matriz."
                            }
                        </div>

                    </div>


                    <button
                        id="btnFecharFormularioCompetencia"
                        style="
                            width:38px;
                            height:38px;
                            flex-shrink:0;
                            border-radius:8px;
                            border:1px solid #39424c;
                            background:#20262d;
                            color:#fff;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >
                        ✕
                    </button>

                </div>


                <div
                    style="
                        padding:25px;
                    "
                >

                    <!-- CARGO -->

                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Cargo
                    </label>

                    <select
                        id="campoCargoCompetencia"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            margin-bottom:20px;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                        "
                        ${
                            modoEdicao
                            ? "disabled"
                            : ""
                        }
                    >

                        <option value="">
                            Selecione o cargo
                        </option>

                        ${cargos
                            .map(
                                item => `

                                    <option
                                        value="${escaparHTML(item)}"
                                        ${
                                            item === cargo
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(item)}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>


                    <!-- NOME -->

                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nome da competência
                    </label>

                    <input
                        id="campoNomeCompetencia"
                        type="text"
                        autocomplete="off"
                        value="${escaparHTML(
                            modoEdicao
                                ? competenciaExistente
                                : ""
                        )}"
                        placeholder="Ex.: Comunicação"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:20px;
                        "
                    >


                    <!-- DIRECIONADOR -->

                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        🎯 Direcionador
                    </label>

                    <textarea
                        id="campoDirecionador"
                        rows="3"
                        placeholder="Qual comportamento ou resultado essa competência direciona?"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:20px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.direcionador || ""
                    )}</textarea>


                    <!-- DEFINIÇÃO -->

                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        📖 Definição
                    </label>

                    <textarea
                        id="campoDefinicao"
                        rows="4"
                        placeholder="Descreva o significado da competência."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:20px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.definicao || ""
                    )}</textarea>


                    <!-- BALIZADORES -->

                    <h3
                        style="
                            margin-top:10px;
                            margin-bottom:18px;
                            color:#ffffff;
                            font-size:17px;
                        "
                    >
                        Balizadores
                    </h3>


                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nível 1
                    </label>

                    <textarea
                        id="campoNivel1"
                        rows="3"
                        placeholder="Comportamentos esperados no nível 1."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:18px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.niveis?.[1] || ""
                    )}</textarea>


                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nível 2
                    </label>

                    <textarea
                        id="campoNivel2"
                        rows="3"
                        placeholder="Comportamentos esperados no nível 2."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:18px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.niveis?.[2] || ""
                    )}</textarea>


                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nível 3
                    </label>

                    <textarea
                        id="campoNivel3"
                        rows="3"
                        placeholder="Comportamentos esperados no nível 3."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:18px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.niveis?.[3] || ""
                    )}</textarea>


                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nível 4
                    </label>

                    <textarea
                        id="campoNivel4"
                        rows="3"
                        placeholder="Comportamentos esperados no nível 4."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                            margin-bottom:20px;
                            resize:vertical;
                        "
                    >${escaparHTML(
                        detalhes.niveis?.[4] || ""
                    )}</textarea>


                    <!-- NÍVEL ESPERADO -->

                    <label
                        style="
                            display:block;
                            color:#ffffff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Nível esperado para este cargo
                    </label>

                    <select
                        id="campoNivelEsperado"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                        "
                    >

                        <option
                            value="0"
                            ${
                                nivelAtual === 0
                                    ? "selected"
                                    : ""
                            }
                        >
                            0 - Sem conhecimento
                        </option>

                        <option
                            value="1"
                            ${
                                nivelAtual === 1
                                    ? "selected"
                                    : ""
                            }
                        >
                            1 - Conhecimento básico
                        </option>

                        <option
                            value="2"
                            ${
                                nivelAtual === 2
                                    ? "selected"
                                    : ""
                            }
                        >
                            2 - Experiência moderada
                        </option>

                        <option
                            value="3"
                            ${
                                nivelAtual === 3
                                    ? "selected"
                                    : ""
                            }
                        >
                            3 - Expert, autônomo
                        </option>

                        <option
                            value="4"
                            ${
                                nivelAtual === 4
                                    ? "selected"
                                    : ""
                            }
                        >
                            4 - Nível treinador
                        </option>

                    </select>


                    <!-- BOTÕES -->

                    <div
                        style="
                            display:flex;
                            gap:10px;
                            margin-top:25px;
                        "
                    >

                        <button
                            id="btnCancelarFormularioCompetencia"
                            style="
                                flex:1;
                            "
                        >
                            Cancelar
                        </button>


                        <button
                            id="btnSalvarCompetencia"
                            style="
                                flex:1;
                            "
                        >
                            ${
                                modoEdicao
                                ? "💾 Salvar Alterações"
                                : "💾 Salvar Competência"
                            }
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    function fechar(){

        modal.remove();

    }


    document
        .getElementById(
            "btnFecharFormularioCompetencia"
        )
        .onclick =
        fechar;


    document
        .getElementById(
            "btnCancelarFormularioCompetencia"
        )
        .onclick =
        fechar;


    // =====================================
    // SALVAR
    // =====================================

    document
        .getElementById(
            "btnSalvarCompetencia"
        )
        .onclick =
        async () => {

            const cargoSelecionado =
                document
                .getElementById(
                    "campoCargoCompetencia"
                )
                .value;


            const nome =
                document
                .getElementById(
                    "campoNomeCompetencia"
                )
                .value
                .trim();


            const direcionador =
                document
                .getElementById(
                    "campoDirecionador"
                )
                .value
                .trim();


            const definicao =
                document
                .getElementById(
                    "campoDefinicao"
                )
                .value
                .trim();


            const nivel1 =
                document
                .getElementById(
                    "campoNivel1"
                )
                .value
                .trim();


            const nivel2 =
                document
                .getElementById(
                    "campoNivel2"
                )
                .value
                .trim();


            const nivel3 =
                document
                .getElementById(
                    "campoNivel3"
                )
                .value
                .trim();


            const nivel4 =
                document
                .getElementById(
                    "campoNivel4"
                )
                .value
                .trim();


            const nivelEsperado =
                Number(
                    document
                    .getElementById(
                        "campoNivelEsperado"
                    )
                    .value
                ) || 0;


            if(!modoEdicao && !cargoSelecionado){

                alert(
                    "Selecione o cargo."
                );

                return;

            }


            if(!nome){

                alert(
                    "Informe o nome da competência."
                );

                return;

            }


            garantirCatalogoCompetencias(
                areaAtual
            );


            // =================================
            // NOVA COMPETÊNCIA
            // =================================

            if(!modoEdicao){

                const catalogoExistente =
                    obterCatalogoGeralCompetencias(
                        bancoAtual
                    );


                const existente =
                    catalogoExistente.find(
                        item =>
                            normalizarTexto(
                                item.nome
                            ) ===
                            normalizarTexto(
                                nome
                            )
                    );


                if(existente){

                    alert(

                        `A competência "${existente.nome}" já existe.\n\n` +

                        `Utilize "Pesquisar Competência" ` +
                        `para reutilizá-la.`

                    );

                    return;

                }


                const detalhesNova = {

                    nome:
                        nome,

                    direcionador:
                        direcionador,

                    definicao:
                        definicao,

                    niveis:{

                        1:
                            nivel1,

                        2:
                            nivel2,

                        3:
                            nivel3,

                        4:
                            nivel4

                    }

                };


                if(
                    !bancoAtual.habilidades
                ){

                    bancoAtual.habilidades =
                        [];

                }


                bancoAtual
                    .habilidades
                    .push(
                        nome
                    );


                if(
                    !bancoAtual.detalhesHabilidades
                ){

                    bancoAtual.detalhesHabilidades =
                        {};

                }


                bancoAtual
                    .detalhesHabilidades[
                        nome
                    ] =
                    detalhesNova;


                areaAtual
                    .detalhesHabilidades[
                        nome
                    ] =
                    detalhesNova;


                if(
                    !areaAtual.habilidades
                ){

                    areaAtual.habilidades =
                        [];

                }


                areaAtual
                    .habilidades
                    .push(
                        nome
                    );


                garantirMatrizesDosCargos(
                    areaAtual
                );


                const indice =
                    areaAtual
                    .habilidades
                    .length - 1;


                areaAtual
                    .matrizEsperada[
                        cargoSelecionado
                    ][indice] =
                    nivelEsperado;


                await Storage.salvarBanco(
                    bancoAtual
                );


                fechar();


                mostrarDashboard(
                    usuario
                );


                alert(
                    "Competência criada e adicionada com sucesso!"
                );


                return;

            }


            // =================================
            // EDIÇÃO
            // =================================

            const nomeAntigo =
                competenciaExistente;


            const detalhesEditados = {

                nome:
                    nome,

                direcionador:
                    direcionador,

                definicao:
                    definicao,

                niveis:{

                    1:
                        nivel1,

                    2:
                        nivel2,

                    3:
                        nivel3,

                    4:
                        nivel4

                }

            };


            // =================================
            // VERIFICAR DUPLICIDADE
            // =================================

            if(
                normalizarTexto(nome) !==
                normalizarTexto(nomeAntigo)
            ){

                const duplicada =
                    obterCatalogoGeralCompetencias(
                        bancoAtual
                    )
                    .find(
                        item =>
                            normalizarTexto(
                                item.nome
                            ) ===
                            normalizarTexto(
                                nome
                            ) &&
                            normalizarTexto(
                                item.nome
                            ) !==
                            normalizarTexto(
                                nomeAntigo
                            )
                    );


                if(duplicada){

                    alert(

                        `Já existe uma competência chamada "${duplicada.nome}".\n\n` +

                        `Escolha outro nome ou utilize a competência existente.`

                    );

                    return;

                }

            }


            // =================================
            // ATUALIZAR CATÁLOGO GLOBAL
            // =================================

            const indiceGlobal =
                (bancoAtual.habilidades || [])
                .findIndex(
                    habilidade =>
                        normalizarTexto(
                            habilidade
                        ) ===
                        normalizarTexto(
                            nomeAntigo
                        )
                );


            if(
                indiceGlobal >= 0
            ){

                bancoAtual
                    .habilidades[
                        indiceGlobal
                    ] =
                    nome;

            }
            else{

                bancoAtual
                    .habilidades
                    .push(
                        nome
                    );

            }


            if(
                !bancoAtual.detalhesHabilidades
            ){

                bancoAtual.detalhesHabilidades =
                    {};

            }


            delete bancoAtual
                .detalhesHabilidades[
                    nomeAntigo
                ];


            bancoAtual
                .detalhesHabilidades[
                    nome
                ] =
                detalhesEditados;


            // =================================
            // ATUALIZAR TODAS AS ÁREAS
            // =================================

            Object.entries(
                bancoAtual.matrizesPorArea || {}
            )
            .forEach(
                ([nomeArea, matriz]) => {

                    if(!matriz){

                        return;

                    }


                    if(
                        !Array.isArray(
                            matriz.habilidades
                        )
                    ){

                        matriz.habilidades =
                            [];

                    }


                    if(
                        !matriz.detalhesHabilidades
                    ){

                        matriz.detalhesHabilidades =
                            {};

                    }


                    const indiceArea =
                        matriz
                        .habilidades
                        .findIndex(
                            habilidade =>
                                normalizarTexto(
                                    habilidade
                                ) ===
                                normalizarTexto(
                                    nomeAntigo
                                )
                        );


                    if(
                        indiceArea >= 0
                    ){

                        matriz
                            .habilidades[
                                indiceArea
                            ] =
                            nome;


                        const detalhesArea =
                            matriz
                            .detalhesHabilidades[
                                nomeAntigo
                            ]

                            ||

                            detalhesEditados;


                        delete matriz
                            .detalhesHabilidades[
                                nomeAntigo
                            ];


                        matriz
                            .detalhesHabilidades[
                                nome
                            ] =
                            detalhesEditados;

                    }

                }
            );


            // =================================
            // GARANTIR ÁREA ATUAL
            // =================================

            if(
                !areaAtual
                .detalhesHabilidades
            ){

                areaAtual
                    .detalhesHabilidades =
                    {};

            }


            areaAtual
                .detalhesHabilidades[
                    nome
                ] =
                detalhesEditados;


            delete areaAtual
                .detalhesHabilidades[
                    nomeAntigo
                ];


            // =================================
            // ATUALIZAR NÍVEL ESPERADO
            // =================================

            garantirMatrizesDosCargos(
                areaAtual
            );


            const indiceAtual =
                areaAtual
                .habilidades
                .findIndex(
                    habilidade =>
                        normalizarTexto(
                            habilidade
                        ) ===
                        normalizarTexto(
                            nomeAntigo
                        )
                );


            if(
                indiceAtual >= 0
            ){

                areaAtual
                    .habilidades[
                        indiceAtual
                    ] =
                    nome;


                if(
                    cargo &&
                    Array.isArray(
                        areaAtual
                        .matrizEsperada[
                            cargo
                        ]
                    )
                ){

                    areaAtual
                        .matrizEsperada[
                            cargo
                        ][
                            indiceAtual
                        ] =
                        nivelEsperado;

                }

            }


            await Storage.salvarBanco(
                bancoAtual
            );


            fechar();


            mostrarDashboard(
                usuario
            );


            alert(
                "Competência atualizada com sucesso!"
            );

        };

}


// =====================================
// CATÁLOGO GERAL
// =====================================

function obterCatalogoGeralCompetencias(
    bancoAtual
){

    const catalogo = [];


    function adicionar(
        nome,
        detalhes,
        areaOrigem
    ){

        if(!nome){

            return;

        }


        const chave =
            normalizarTexto(
                nome
            );


        if(!chave){

            return;

        }


        const existente =
            catalogo.find(
                item =>
                    normalizarTexto(
                        item.nome
                    ) ===
                    chave
            );


        if(existente){

            if(
                !existente.detalhes &&
                detalhes
            ){

                existente.detalhes =
                    detalhes;

            }


            if(
                areaOrigem &&
                !existente.origens.includes(
                    areaOrigem
                )
            ){

                existente.origens.push(
                    areaOrigem
                );

            }

            return;

        }


        catalogo.push({

            nome:
                nome,

            detalhes:
                detalhes || {

                    nome:
                        nome,

                    direcionador:"",
                    definicao:"",

                    niveis:{

                        1:"",
                        2:"",
                        3:"",
                        4:""

                    }

                },

            areaOrigem:
                areaOrigem || "",

            origens:
                areaOrigem
                    ? [areaOrigem]
                    : []

        });

    }


    // =================================
    // CATÁLOGO GLOBAL
    // =================================

    (
        bancoAtual.habilidades ||
        []
    )
    .forEach(
        habilidade => {

            adicionar(

                habilidade,

                bancoAtual
                .detalhesHabilidades?.[
                    habilidade
                ],

                "Catálogo corporativo"

            );

        }
    );


    // =================================
    // DETALHES QUE ESTÃO NO GLOBAL
    // =================================

    Object.entries(
        bancoAtual.detalhesHabilidades || {}
    )
    .forEach(
        ([nome, detalhes]) => {

            adicionar(

                nome,

                detalhes,

                "Catálogo corporativo"

            );

        }
    );


    // =================================
    // TODAS AS ÁREAS
    // =================================

    Object.entries(
        bancoAtual.matrizesPorArea || {}
    )
    .forEach(
        ([area, matriz]) => {

            if(!matriz){

                return;

            }


            (
                matriz.habilidades ||
                []
            )
            .forEach(
                habilidade => {

                    const detalhes =

                        matriz
                        .detalhesHabilidades?.[
                            habilidade
                        ]

                        ||

                        bancoAtual
                        .detalhesHabilidades?.[
                            habilidade
                        ];


                    adicionar(

                        habilidade,

                        detalhes,

                        area

                    );

                }
            );


            Object.entries(
                matriz.detalhesHabilidades || {}
            )
            .forEach(
                ([nome, detalhes]) => {

                    adicionar(

                        nome,

                        detalhes,

                        area

                    );

                }
            );

        }
    );


    return catalogo;

}


// =====================================
// PESQUISA INTELIGENTE
// =====================================

function abrirPesquisaCompetencias(
    usuario,
    bancoAtual,
    areaAtual
){

    const catalogo =
        obterCatalogoGeralCompetencias(
            bancoAtual
        );


    const modal =
        document.createElement("div");


    modal.id =
        "modalPesquisaCompetencias";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:rgba(0,0,0,.88);
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:900px;
                    height:90vh;
                    background:#15191e;
                    color:#fff;
                    border:1px solid #303840;
                    border-radius:14px;
                    box-shadow:0 20px 60px rgba(0,0,0,.75);
                    display:flex;
                    flex-direction:column;
                    overflow:hidden;
                "
            >

                <!-- CABEÇALHO -->

                <div
                    style="
                        padding:20px 25px;
                        border-bottom:1px solid #303840;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                    "
                >

                    <div>

                        <h2
                            style="
                                margin:0;
                                color:#0b8bd3;
                                font-size:22px;
                            "
                        >
                            🔎 Pesquisar Competência
                        </h2>

                        <div
                            style="
                                margin-top:6px;
                                color:#aeb7bf;
                                font-size:13px;
                            "
                        >
                            Pesquise em todas as competências
                            cadastradas no sistema.
                        </div>

                    </div>


                    <button
                        id="btnFecharPesquisaTopo"
                        style="
                            width:38px;
                            height:38px;
                            flex-shrink:0;
                            border-radius:8px;
                            border:1px solid #39424c;
                            background:#20262d;
                            color:#fff;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >
                        ✕
                    </button>

                </div>


                <!-- CAMPO -->

                <div
                    style="
                        padding:20px 25px;
                        border-bottom:1px solid #303840;
                    "
                >

                    <input
                        id="pesquisaCompetencia"
                        type="text"
                        autocomplete="off"
                        placeholder="Digite o nome, comportamento ou conceito..."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px 16px;
                            border-radius:9px;
                            border:1px solid #46515c;
                            background:#20262d;
                            color:#fff;
                            font-size:15px;
                            outline:none;
                        "
                    >

                    <div
                        id="contadorCompetencias"
                        style="
                            margin-top:8px;
                            color:#8f99a3;
                            font-size:12px;
                        "
                    >
                        ${catalogo.length}
                        competências disponíveis
                    </div>

                </div>


                <!-- RESULTADOS -->

                <div
                    id="resultadoCompetencias"
                    style="
                        flex:1;
                        overflow-y:auto;
                        padding:20px 25px;
                    "
                >
                </div>


                <!-- RODAPÉ -->

                <div
                    style="
                        padding:15px 25px;
                        border-top:1px solid #303840;
                        display:flex;
                        justify-content:flex-end;
                    "
                >

                    <button
                        id="btnFecharPesquisa"
                        style="
                            min-width:120px;
                            padding:10px 22px;
                            border-radius:8px;
                            border:1px solid #39424c;
                            background:#252b32;
                            color:#fff;
                            cursor:pointer;
                        "
                    >
                        Fechar
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const input =
        document.getElementById(
            "pesquisaCompetencia"
        );


    const resultado =
        document.getElementById(
            "resultadoCompetencias"
        );


    const contador =
        document.getElementById(
            "contadorCompetencias"
        );


    function fechar(){

        modal.remove();

    }


    document
        .getElementById(
            "btnFecharPesquisaTopo"
        )
        .onclick =
        fechar;


    document
        .getElementById(
            "btnFecharPesquisa"
        )
        .onclick =
        fechar;


    function pesquisar(){

        const termo =
            normalizarTexto(
                input.value
            );


        if(!termo){

            contador.textContent =
                `${catalogo.length} competências disponíveis`;


            resultado.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:60px 20px;
                        color:#8f99a3;
                    "
                >

                    <div
                        style="
                            font-size:42px;
                            margin-bottom:15px;
                        "
                    >
                        🔎
                    </div>

                    <div
                        style="
                            color:#e1e5e8;
                            font-size:16px;
                            margin-bottom:8px;
                        "
                    >
                        Comece a digitar
                    </div>

                    <div
                        style="
                            font-size:13px;
                        "
                    >
                        A pesquisa procura pelo nome,
                        direcionador, definição e balizadores.
                    </div>

                </div>

            `;

            return;

        }


        const resultados =
            catalogo
            .map(
                item => {

                    const detalhes =
                        item.detalhes || {};


                    const niveis =
                        detalhes.niveis || {};


                    const nome =
                        normalizarTexto(
                            item.nome
                        );


                    const textoPesquisa =
                        normalizarTexto(

                            [

                                item.nome,

                                detalhes.direcionador,

                                detalhes.definicao,

                                niveis[1],
                                niveis[2],
                                niveis[3],
                                niveis[4],

                                ...(item.origens || [])

                            ]
                            .join(" ")

                        );


                    let pontuacao = 0;


                    if(
                        nome === termo
                    ){

                        pontuacao += 100;

                    }
                    else if(
                        nome.startsWith(
                            termo
                        )
                    ){

                        pontuacao += 70;

                    }
                    else if(
                        nome.includes(
                            termo
                        )
                    ){

                        pontuacao += 50;

                    }
                    else if(
                        textoPesquisa.includes(
                            termo
                        )
                    ){

                        pontuacao += 20;

                    }


                    const palavras =
                        termo
                        .split(/\s+/)
                        .filter(
                            palavra =>
                                palavra.length >= 2
                        );


                    palavras.forEach(
                        palavra => {

                            if(
                                nome.includes(
                                    palavra
                                )
                            ){

                                pontuacao += 15;

                            }
                            else if(
                                textoPesquisa.includes(
                                    palavra
                                )
                            ){

                                pontuacao += 5;

                            }

                        }
                    );


                    return {

                        ...item,

                        pontuacao

                    };

                }
            )
            .filter(
                item =>
                    item.pontuacao > 0
            )
            .sort(
                (a,b) =>
                    b.pontuacao -
                    a.pontuacao
            );


        contador.textContent =
            `${resultados.length} competência(s) encontrada(s)`;


        if(
            resultados.length === 0
        ){

            resultado.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:55px 20px;
                        color:#8f99a3;
                    "
                >

                    <div
                        style="
                            font-size:40px;
                            margin-bottom:15px;
                        "
                    >
                        😕
                    </div>

                    <div
                        style="
                            color:#e1e5e8;
                            font-size:16px;
                            margin-bottom:8px;
                        "
                    >
                        Nenhuma competência encontrada
                    </div>

                    <div
                        style="
                            font-size:13px;
                            margin-bottom:20px;
                        "
                    >
                        Tente outra palavra ou expressão.
                    </div>

                    <button
                        id="btnCriarCompetenciaSemResultado"
                        style="
                            padding:11px 20px;
                            border:none;
                            border-radius:8px;
                            background:#07558f;
                            color:#fff;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >
                        + Criar nova competência
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "btnCriarCompetenciaSemResultado"
                )
                .onclick =
                () => {

                    fechar();

                    abrirFormularioCompetencia(
                        usuario,
                        bancoAtual,
                        areaAtual,
                        areaAtual.cargos?.[0] || ""
                    );

                };


            return;

        }


        // =================================
        // RESULTADOS
        // =================================

        resultado.innerHTML =
            resultados
            .map(
                (item,index) => {

                    const detalhes =
                        item.detalhes || {};


                    const niveis =
                        detalhes.niveis || {};


                    return `

                        <div
                            style="
                                background:#1b2026;
                                border:1px solid #38434e;
                                border-radius:10px;
                                padding:16px;
                                margin-bottom:12px;
                                box-sizing:border-box;
                            "
                        >

                            <!-- CONTEÚDO -->

                            <div
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                "
                            >

                                <div
                                    style="
                                        font-size:16px;
                                        font-weight:600;
                                        color:#fff;
                                        margin-bottom:7px;
                                        line-height:1.4;
                                    "
                                >
                                    ${escaparHTML(
                                        item.nome
                                    )}
                                </div>


                                <div
                                    style="
                                        color:#7f94a4;
                                        font-size:12px;
                                        margin-bottom:10px;
                                    "
                                >
                                    Origem:
                                    ${
                                        escaparHTML(
                                            item.origens?.join(", ") ||
                                            item.areaOrigem ||
                                            "Catálogo corporativo"
                                        )
                                    }
                                </div>


                                ${
                                    detalhes.direcionador
                                    ?

                                    `

                                    <div
                                        style="
                                            color:#c1c9cf;
                                            font-size:13px;
                                            line-height:1.5;
                                            margin-bottom:8px;
                                        "
                                    >

                                        <strong
                                            style="
                                                color:#fff;
                                            "
                                        >
                                            Direcionador:
                                        </strong>

                                        ${escaparHTML(
                                            detalhes.direcionador
                                        )}

                                    </div>

                                    `

                                    :

                                    ""

                                }


                                <div
                                    style="
                                        color:#c1c9cf;
                                        font-size:13px;
                                        line-height:1.5;
                                    "
                                >

                                    <strong
                                        style="
                                            color:#fff;
                                        "
                                    >
                                        Definição:
                                    </strong>

                                    ${escaparHTML(
                                        detalhes.definicao ||
                                        "Não cadastrada."
                                    )}

                                </div>

                            </div>


                            <!-- BOTÃO SEPARADO -->

                            <div
                                style="
                                    width:100%;
                                    margin-top:15px;
                                "
                            >

                                <button
                                    class="btnAdicionarCompetenciaPesquisa"
                                    data-index="${index}"
                                    style="
                                        display:block;
                                        width:100%;
                                        box-sizing:border-box;
                                        padding:10px 14px;
                                        border:none;
                                        border-radius:7px;
                                        background:#075f9c;
                                        color:#fff;
                                        font-weight:600;
                                        cursor:pointer;
                                        text-align:center;
                                    "
                                >
                                    Adicionar
                                </button>

                            </div>


                            ${
                                niveis[1] ||
                                niveis[2] ||
                                niveis[3] ||
                                niveis[4]

                                ?

                                `

                                <details
                                    style="
                                        margin-top:12px;
                                    "
                                >

                                    <summary
                                        style="
                                            cursor:pointer;
                                            color:#1591d2;
                                            font-size:12px;
                                        "
                                    >
                                        Ver balizadores
                                    </summary>


                                    <div
                                        style="
                                            margin-top:10px;
                                            display:grid;
                                            gap:7px;
                                        "
                                    >

                                        ${[1,2,3,4]
                                            .map(
                                                nivel => `

                                                    <div
                                                        style="
                                                            color:#aeb7bf;
                                                            font-size:12px;
                                                            line-height:1.4;
                                                        "
                                                    >

                                                        <strong
                                                            style="
                                                                color:#fff;
                                                            "
                                                        >
                                                            Nível ${nivel}:
                                                        </strong>

                                                        ${escaparHTML(
                                                            niveis[nivel] ||
                                                            "Não informado."
                                                        )}

                                                    </div>

                                                `
                                            )
                                            .join("")}

                                    </div>

                                </details>

                                `

                                :

                                ""

                            }

                        </div>

                    `;

                }
            )
            .join("");


        // =================================
        // BOTÕES ADICIONAR
        // =================================

        document
            .querySelectorAll(
                ".btnAdicionarCompetenciaPesquisa"
            )
            .forEach(
                botao => {

                    botao.onclick =
                        () => {

                            const indice =
                                Number(
                                    botao.dataset.index
                                );


                            const competencia =
                                resultados[
                                    indice
                                ];


                            abrirSelecaoCargoParaCompetencia(

                                usuario,

                                bancoAtual,

                                areaAtual,

                                competencia.nome

                            );

                        };

                }
            );

    }


    input.oninput =
        pesquisar;


    pesquisar();


    setTimeout(
        () => input.focus(),
        100
    );

}


// =====================================
// ESCOLHER CARGO
// =====================================

function abrirSelecaoCargoParaCompetencia(
    usuario,
    bancoAtual,
    areaAtual,
    competencia
){

    const modal =
        document.createElement("div");


    modal.id =
        "modalEscolhaCargoCompetencia";


    const cargos =
        areaAtual.cargos || [];


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                z-index:10000;
                background:rgba(0,0,0,.88);
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:520px;
                    background:#15191e;
                    color:#fff;
                    border:1px solid #303840;
                    border-radius:14px;
                    box-shadow:0 20px 60px rgba(0,0,0,.7);
                    overflow:hidden;
                "
            >

                <div
                    style="
                        padding:20px 24px;
                        border-bottom:1px solid #303840;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >

                    <div>

                        <h2
                            style="
                                margin:0;
                                color:#0b8bd3;
                                font-size:20px;
                            "
                        >
                            Adicionar competência
                        </h2>

                    </div>


                    <button
                        id="btnFecharCargoCompetencia"
                        style="
                            width:36px;
                            height:36px;
                            border-radius:8px;
                            border:1px solid #39424c;
                            background:#20262d;
                            color:#fff;
                            cursor:pointer;
                        "
                    >
                        ✕
                    </button>

                </div>


                <div
                    style="
                        padding:25px;
                    "
                >

                    <div
                        style="
                            padding:14px;
                            background:#1e252c;
                            border-radius:8px;
                            margin-bottom:22px;
                        "
                    >

                        <div
                            style="
                                color:#8f99a3;
                                font-size:12px;
                                margin-bottom:5px;
                            "
                        >
                            Competência selecionada
                        </div>

                        <strong>
                            ${escaparHTML(
                                competencia
                            )}
                        </strong>

                    </div>


                    <label
                        style="
                            display:block;
                            color:#fff !important;
                            font-weight:600;
                            font-size:14px;
                            margin-bottom:7px;
                        "
                    >
                        Para qual cargo deseja adicionar?
                    </label>

                    <select
                        id="cargoCompetencia"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                        "
                    >

                        <option value="">
                            Selecione o cargo
                        </option>

                        ${cargos
                            .map(
                                cargo => `

                                    <option
                                        value="${escaparHTML(cargo)}"
                                    >
                                        ${escaparHTML(cargo)}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>


                    <label
                        style="
                            display:block;
                            margin-top:18px;
                            margin-bottom:7px;
                            color:#fff !important;
                            font-weight:600;
                            font-size:14px;
                        "
                    >
                        Nível esperado para este cargo
                    </label>


                    <select
                        id="nivelCompetencia"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            background:#20262d;
                            color:#fff;
                            border:1px solid #46515c;
                            padding:11px 12px;
                            border-radius:7px;
                        "
                    >

                        <option value="0">
                            0 - Sem conhecimento
                        </option>

                        <option value="1">
                            1 - Conhecimento básico
                        </option>

                        <option value="2">
                            2 - Experiência moderada
                        </option>

                        <option value="3">
                            3 - Expert, autônomo
                        </option>

                        <option value="4">
                            4 - Nível treinador
                        </option>

                    </select>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            margin-top:25px;
                        "
                    >

                        <button
                            id="btnCancelarCargoCompetencia"
                            style="
                                flex:1;
                            "
                        >
                            Cancelar
                        </button>


                        <button
                            id="btnConfirmarCargoCompetencia"
                            style="
                                flex:1;
                            "
                        >
                            ✓ Adicionar
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    function fechar(){

        modal.remove();

    }


    document
        .getElementById(
            "btnFecharCargoCompetencia"
        )
        .onclick =
        fechar;


    document
        .getElementById(
            "btnCancelarCargoCompetencia"
        )
        .onclick =
        fechar;


    document
        .getElementById(
            "btnConfirmarCargoCompetencia"
        )
        .onclick =
        async () => {

            const cargo =
                document
                .getElementById(
                    "cargoCompetencia"
                )
                .value;


            const nivel =
                Number(
                    document
                    .getElementById(
                        "nivelCompetencia"
                    )
                    .value
                ) || 0;


            if(!cargo){

                alert(
                    "Selecione um cargo."
                );

                return;

            }


            garantirCatalogoCompetencias(
                areaAtual
            );


            const indice =
                areaAtual
                .habilidades
                .findIndex(
                    habilidade =>
                        normalizarTexto(
                            habilidade
                        ) ===
                        normalizarTexto(
                            competencia
                        )
                );


            let indiceCompetencia =
                indice;


            if(
                indiceCompetencia < 0
            ){

                areaAtual
                    .habilidades
                    .push(
                        competencia
                    );


                indiceCompetencia =
                    areaAtual
                    .habilidades
                    .length - 1;


                const detalhes =
                    bancoAtual
                    .detalhesHabilidades?.[
                        competencia
                    ];


                if(detalhes){

                    areaAtual
                        .detalhesHabilidades[
                            competencia
                        ] =
                        detalhes;

                }

            }


            garantirMatrizesDosCargos(
                areaAtual
            );


            areaAtual
                .matrizEsperada[
                    cargo
                ][
                    indiceCompetencia
                ] =
                nivel;


            await Storage.salvarBanco(
                bancoAtual
            );


            fechar();


            mostrarDashboard(
                usuario
            );


            alert(

                `Competência "${competencia}" ` +
                `configurada para o cargo "${cargo}".`

            );

        };

}


// =====================================
// DASHBOARD PRINCIPAL
// MATRIZ POR CARGO
// =====================================

function mostrarDashboard(usuario){

    const areaAtual =
        banco.matrizesPorArea?.[
            usuario.area
        ];


    if(!areaAtual){

        alert(
            "Área não encontrada no banco: " +
            usuario.area
        );

        return;

    }


    // =====================================
    // GARANTIR ESTRUTURA
    // =====================================

    if(!areaAtual.cargos){

        areaAtual.cargos = [];

    }


    if(!areaAtual.habilidades){

        areaAtual.habilidades = [];

    }


    if(!areaAtual.matrizEsperada){

        areaAtual.matrizEsperada = {};

    }


    if(!areaAtual.colaboradores){

        areaAtual.colaboradores = [];

    }


    if(!areaAtual.avaliacoes){

        areaAtual.avaliacoes = {};

    }


    garantirCatalogoCompetencias(
        areaAtual
    );


    // =====================================
    // MIGRAR DETALHES
    // =====================================

    areaAtual.habilidades.forEach(
        habilidade => {

            if(
                !areaAtual
                .detalhesHabilidades[
                    habilidade
                ]
            ){

                if(
                    banco
                    .detalhesHabilidades?.[
                        habilidade
                    ]
                ){

                    areaAtual
                    .detalhesHabilidades[
                        habilidade
                    ] =
                    banco
                    .detalhesHabilidades[
                        habilidade
                    ];

                }
                else{

                    areaAtual
                    .detalhesHabilidades[
                        habilidade
                    ] = {

                        nome:
                            habilidade,

                        direcionador:"",
                        definicao:"",

                        niveis:{

                            1:"",
                            2:"",
                            3:"",
                            4:""

                        }

                    };

                }

            }

        }
    );


    // =====================================
    // MATRIZ DE SUCESSÃO
    // =====================================

    if(!areaAtual.matrizSucessao){

        areaAtual.matrizSucessao = {

            "Supervisor": {

                "Liderança de Pessoas": 3,
                "Comunicação": 3,
                "Tomada de Decisão": 3,
                "Gestão de Conflitos": 3,
                "Visão Estratégica": 2,
                "Planejamento e Organização": 3,
                "Foco em Resultados": 4,
                "Adaptabilidade": 3,
                "Influência": 2,
                "Desenvolvimento de Pessoas": 3

            },

            "Coordenador": {

                "Liderança de Pessoas": 4,
                "Comunicação": 4,
                "Tomada de Decisão": 4,
                "Gestão de Conflitos": 4,
                "Visão Estratégica": 3,
                "Planejamento e Organização": 4,
                "Foco em Resultados": 4,
                "Adaptabilidade": 3,
                "Influência": 3,
                "Desenvolvimento de Pessoas": 4

            },

            "Gerente": {

                "Liderança de Pessoas": 4,
                "Comunicação": 4,
                "Tomada de Decisão": 4,
                "Gestão de Conflitos": 4,
                "Visão Estratégica": 4,
                "Planejamento e Organização": 4,
                "Foco em Resultados": 4,
                "Adaptabilidade": 4,
                "Influência": 4,
                "Desenvolvimento de Pessoas": 4

            }

        };

    }


    if(!areaAtual.avaliacoesSucessao){

        areaAtual.avaliacoesSucessao = {};

    }


    const cargos =
        areaAtual.cargos;


    const habilidades =
        areaAtual.habilidades;


    const matrizEsperada =
        areaAtual.matrizEsperada;


    garantirMatrizesDosCargos(
        areaAtual
    );


    // =====================================
    // MONTAR TABELA
    // =====================================

    let tabela = `

        <table>

            <thead>

                <tr>

                    <th class="col-habilidade">
                        Competência
                    </th>

    `;


    cargos.forEach(
        cargo => {

            tabela += `

                <th>

                    ${escaparHTML(cargo)}

                    <button
                        class="btnExcluirCargo"
                        data-cargo="${escaparHTML(cargo)}"
                        title="Excluir cargo"
                        style="
                            margin-left:8px;
                            cursor:pointer;
                        "
                    >
                        🗑️
                    </button>

                </th>

            `;

        }
    );


    tabela += `

                    <th>
                        Ação
                    </th>

                </tr>

            </thead>

            <tbody>

    `;


    habilidades.forEach(
        (
            habilidade,
            index
        ) => {

            const detalhes =
                obterDetalhesCompetencia(
                    areaAtual,
                    habilidade
                );


            tabela += `

                <tr>

                    <td class="habilidade">

                        <div>

                            <strong>
                                ${escaparHTML(
                                    habilidade
                                )}
                            </strong>

                            <br>

                            <small
                                style="
                                    opacity:.65;
                                "
                            >
                                ${escaparHTML(
                                    detalhes
                                    .direcionador || ""
                                )}
                            </small>

                        </div>

                    </td>

            `;


            cargos.forEach(
                cargo => {

                    const valor =
                        Number(
                            matrizEsperada[
                                cargo
                            ]?.[
                                index
                            ] ?? 0
                        );


                    tabela += `

                        <td>

                            <select
                                class="nivel"
                                data-cargo="${escaparHTML(cargo)}"
                                data-index="${index}"
                            >

                                ${[0,1,2,3,4]
                                    .map(
                                        nivel => `

                                            <option
                                                value="${nivel}"
                                                ${
                                                    valor ===
                                                    nivel
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${nivel}
                                            </option>

                                        `
                                    )
                                    .join("")}

                            </select>

                        </td>

                    `;

                }
            );


            tabela += `
        <td>
            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap:6px;
                    white-space:nowrap;
                "
            >

                <!-- EDITAR / VISUALIZAR -->
                <button
                    class="btnDetalhesHabilidade"
                    data-index="${index}"
                    title="Editar competência"
                    style="
                        width:44px;
                        min-width:44px;
                        height:42px;
                        padding:0;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >
                    👁️
                </button>


                <!-- EXCLUIR COMPETÊNCIA -->
                <button
                    class="btnExcluirHabilidade"
                    data-index="${index}"
                    title="Excluir competência desta área"
                    style="
                        width:44px;
                        min-width:44px;
                        height:42px;
                        padding:0;
                        border:1px solid #7f1d1d;
                        border-radius:6px;
                        background:#991b1b;
                        color:#ffffff;
                        cursor:pointer;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:17px;
                    "
                >
                    🗑️
                </button>

            </div>
        </td>
    </tr>
`;
        }
    );


    tabela += `

            </tbody>

        </table>

    `;


    // =====================================
    // TELA
    // =====================================

    UI.carregar(`

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
                            ${escaparHTML(
                                usuario.area
                            )}
                        </span>

                    </div>

                </div>


                <div class="meta">

                    <small>
                        Meta de score
                    </small>

                    <div class="meta-edicao">

                        <strong>
                            ${Number(
                                areaAtual.meta
                            ) || 0} / 4
                        </strong>

                        <button id="btnMeta">
                            ⚙
                        </button>

                    </div>

                </div>

            </header>


            <nav class="menu">

                <button
                    id="btnMatriz"
                    class="ativo"
                >
                    🎯 Matriz por Cargo
                </button>


                <button id="btnColaboradores">
                    👥 Colaboradores
                </button>


                <button id="btnAvaliacao">
                    📝 Avaliação
                </button>


                <button id="btnSucessao">
                    👑 Sucessão 🔐
                </button>


                <button id="btnDashboard">
                    📊 Dashboard
                </button>

            </nav>


            <section class="conteudo">

                <div class="card">

                    <div class="cabecalho-matriz">

                        <h3>
                            Matriz por Cargo
                        </h3>


                        <div class="acoes">

                            <button id="btnCargo">
                                + Cargo
                            </button>


                            <button
                                id="btnPesquisarCompetencia"
                            >
                                🔎 Pesquisar Competência
                            </button>


                            <button
                                id="btnHabilidade"
                            >
                                + Nova Competência
                            </button>

                        </div>

                    </div>


                    <p class="descricao">

                        Defina as competências e o nível esperado
                        para cada cargo.

                        <br>

                        <strong>
                            As competências são cadastradas pelo Gestor
                            e podem ser reutilizadas em outros cargos.
                        </strong>

                    </p>


                    <div class="tabela-container">

                        ${tabela}

                    </div>


                    <div class="legenda">

                        0 · Sem conhecimento |

                        1 · Conhecimento básico |

                        2 · Experiência moderada |

                        3 · Expert, autônomo |

                        4 · Nível treinador

                    </div>

                </div>

            </section>

        </div>

    `);


    // =====================================
    // MENU
    // =====================================

    document
        .getElementById(
            "btnColaboradores"
        )
        .onclick =
        () => {

            ModuloColaboradores.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById(
            "btnAvaliacao"
        )
        .onclick =
        () => {

            ModuloAvaliacao.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById(
            "btnSucessao"
        )
        .onclick =
        () => {

            solicitarSenhaSucessao(
                usuario
            );

        };


    document
        .getElementById(
            "btnDashboard"
        )
        .onclick =
        () => {

            ModuloDashboard.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById(
            "btnMatriz"
        )
        .onclick =
        () => {

            mostrarDashboard(
                usuario
            );

        };


    // =====================================
    // ALTERAR NÍVEL ESPERADO
    // =====================================

    document
        .querySelectorAll(
            ".nivel"
        )
        .forEach(
            select => {

                select.onchange =
                    async () => {

                        const cargo =
                            select.dataset.cargo;


                        const index =
                            Number(
                                select.dataset.index
                            );


                        garantirMatrizesDosCargos(
                            areaAtual
                        );


                        areaAtual
                            .matrizEsperada[
                                cargo
                            ][
                                index
                            ] =
                            Number(
                                select.value
                            );


                        await Storage.salvarBanco(
                            banco
                        );

                    };

            }
        );


    // =====================================
    // EDITAR COMPETÊNCIA
    // =====================================

    document
        .querySelectorAll(
            ".btnDetalhesHabilidade"
        )
        .forEach(
            botao => {

                botao.onclick =
                    () => {

                        const index =
                            Number(
                                botao.dataset.index
                            );


                        const habilidade =
                            habilidades[
                                index
                            ];


                        const cargoInicial =
                            cargos[0] || "";


                        abrirFormularioCompetencia(

                            usuario,

                            banco,

                            areaAtual,

                            cargoInicial,

                            habilidade

                        );

                    };

            }
        );


    // =====================================
    // EXCLUIR CARGO
    // =====================================

    document
        .querySelectorAll(
            ".btnExcluirCargo"
        )
        .forEach(
            botao => {

                botao.onclick =
                    async () => {

                        const cargo =
                            botao.dataset.cargo;


                        if(
                            !confirm(
                                `Deseja excluir o cargo "${cargo}"?`
                            )
                        ){

                            return;

                        }


                        const indice =
                            areaAtual
                            .cargos
                            .indexOf(
                                cargo
                            );


                        if(
                            indice >= 0
                        ){

                            areaAtual
                                .cargos
                                .splice(
                                    indice,
                                    1
                                );

                        }


                        delete areaAtual
                            .matrizEsperada[
                                cargo
                            ];


                        areaAtual
                            .colaboradores
                            .forEach(
                                colaborador => {

                                    if(
                                        colaborador.cargo ===
                                        cargo
                                    ){

                                        colaborador.cargo =
                                            "";

                                    }

                                }
                            );


                        await Storage.salvarBanco(
                            banco
                        );


                        mostrarDashboard(
                            usuario
                        );

                    };

            }
        );


    // =====================================
    // ALTERAR META
    // =====================================

    document
        .getElementById(
            "btnMeta"
        )
        .onclick =
        async () => {

            let novaMeta =
                prompt(
                    "Digite a nova meta de score (0 a 4):",
                    Number(
                        areaAtual.meta
                    ) || 0
                );


            if(
                novaMeta === null
            ){

                return;

            }


            novaMeta =
                Number(
                    novaMeta
                );


            if(
                novaMeta < 0 ||
                novaMeta > 4 ||
                Number.isNaN(
                    novaMeta
                )
            ){

                alert(
                    "Digite uma meta entre 0 e 4."
                );

                return;

            }


            areaAtual.meta =
                novaMeta;


            await Storage.salvarBanco(
                banco
            );


            mostrarDashboard(
                usuario
            );

        };


    // =====================================
    // ADICIONAR CARGO
    // =====================================

    document
        .getElementById(
            "btnCargo"
        )
        .onclick =
        async () => {

            const novoCargo =
                prompt(
                    "Digite o nome do novo cargo:"
                );


            if(!novoCargo){

                return;

            }


            const nomeCargo =
                novoCargo.trim();


            if(!nomeCargo){

                return;

            }


            const cargoExiste =
                areaAtual
                .cargos
                .some(
                    cargo =>
                        normalizarTexto(
                            cargo
                        ) ===
                        normalizarTexto(
                            nomeCargo
                        )
                );


            if(cargoExiste){

                alert(
                    "Cargo já existe."
                );

                return;

            }


            areaAtual
                .cargos
                .push(
                    nomeCargo
                );


            areaAtual
                .matrizEsperada[
                    nomeCargo
                ] =
                areaAtual
                .habilidades
                .map(
                    () => 0
                );


            await Storage.salvarBanco(
                banco
            );


            mostrarDashboard(
                usuario
            );

        };


    // =====================================
    // NOVA COMPETÊNCIA
    // =====================================

    document
        .getElementById(
            "btnHabilidade"
        )
        .onclick =
        () => {

            if(
                areaAtual.cargos.length === 0
            ){

                alert(
                    "Primeiro cadastre pelo menos um cargo."
                );

                return;

            }


            abrirFormularioCompetencia(
                usuario,
                banco,
                areaAtual,
                areaAtual.cargos[0]
            );

        };


    // =====================================
    // PESQUISAR COMPETÊNCIA
    // =====================================

    document
        .getElementById(
            "btnPesquisarCompetencia"
        )
        .onclick =
        () => {

            if(
                areaAtual.cargos.length === 0
            ){

                alert(
                    "Primeiro cadastre pelo menos um cargo."
                );

                return;

            }


            abrirPesquisaCompetencias(
                usuario,
                banco,
                areaAtual
            );

        };

}


// =====================================
// FUNÇÃO MANTIDA PARA COMPATIBILIDADE
// =====================================
// Caso algum outro módulo ainda chame
// abrirDetalhesCompetencia(), agora ele
// abrirá a competência em modo de edição.
// =====================================

function abrirDetalhesCompetencia(
    areaAtual,
    habilidade
){

    const usuarioAtual =
        (banco.usuarios || [])
        .find(
            usuario =>
                normalizarTexto(
                    usuario.area
                ) ===
                normalizarTexto(
                    areaAtual.nome || ""
                )
        );


    // Se não encontrou pelo nome da área,
    // procura pelo objeto da matriz.

    let usuario =
        usuarioAtual;


    if(!usuario){

        usuario =
            (banco.usuarios || [])
            .find(
                item =>
                    banco.matrizesPorArea?.[
                        item.area
                    ] ===
                    areaAtual
            );

    }


    if(!usuario){

        usuario = {

            area:
                areaAtual.nome || ""

        };

    }


    const cargo =
        areaAtual.cargos?.[0] || "";


    abrirFormularioCompetencia(

        usuario,

        banco,

        areaAtual,

        cargo,

        habilidade

    );

}


// =====================================
// INICIAR SISTEMA
// =====================================

telaBanco();