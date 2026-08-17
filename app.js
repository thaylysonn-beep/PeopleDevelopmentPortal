let banco = null;


// =====================================
// TELA AUTORIZAÇÃO DO BANCO
// =====================================

async function telaBanco(){

    // Primeiro tenta recuperar automaticamente
    // o banco que já foi autorizado neste computador.

    try {

        banco = await Storage.carregarBanco();

        // Se encontrou o banco, entra direto no sistema.

        if (banco) {

            console.log(
                "Banco recuperado automaticamente."
            );

            mostrarLogin();

            return;

        }

    }
    catch (erro) {

        console.error(
            "Erro tentando recuperar banco:",
            erro
        );

    }


    // =====================================
    // SE NÃO ENCONTROU, MOSTRA AUTORIZAÇÃO
    // =====================================

    UI.carregar(`

        <div class="login">

            <div class="card">

                <div style="text-align:center;margin-bottom:20px">

                    <img
                        src="assets/logo-corteva.png"
                        style="height:70px">

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


    // =====================================
    // BOTÃO AUTORIZAR
    // =====================================

    document
        .getElementById("btnBanco")
        .onclick = async () => {

            const autorizado =
                await Storage.selecionarBanco();


            if (!autorizado) {

                return;

            }


            banco =
                await Storage.carregarBanco();


            if (!banco) {

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

<img src="assets/logo-corteva.png" style="height:70px">

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



<p id="erro" class="footer"></p>



</div>

</div>


`);





const selectArea =
document.getElementById("area");



banco.usuarios.forEach(usuario=>{


let option =
document.createElement("option");


option.value =
usuario.area;


option.textContent =
usuario.area;


selectArea.appendChild(option);


});





document.getElementById("btnEntrar").onclick = ()=>{


const area =
document.getElementById("area").value;



const senha =
document.getElementById("senha").value;



const usuario =
Auth.entrar(
area,
senha,
banco
);




if(usuario){


    if(usuario.perfil === "ADMIN"){


        ModuloAdmin.abrir(usuario,banco);


    }
    else{


        mostrarDashboard(usuario);


    }


}
else{


document.getElementById("erro").innerHTML =
"Área ou senha inválida";


}



};



}
// =====================================
// DASHBOARD PRINCIPAL
// =====================================

function mostrarDashboard(usuario){

    // =====================================
    // ÁREA ATUAL
    // =====================================

    const areaAtual =
        banco.matrizesPorArea?.[usuario.area];

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


    const cargos =
        areaAtual.cargos;

    const habilidades =
        areaAtual.habilidades;

    const matrizEsperada =
        areaAtual.matrizEsperada;


    // =====================================
    // GARANTIR MATRIZ DOS CARGOS
    // =====================================

    cargos.forEach(cargo => {

        if(!Array.isArray(matrizEsperada[cargo])){

            matrizEsperada[cargo] =
                habilidades.map(() => 0);

        }

        while(
            matrizEsperada[cargo].length <
            habilidades.length
        ){

            matrizEsperada[cargo].push(0);

        }

    });


    // =====================================
    // MONTAR TABELA
    // =====================================

    let tabela = `

        <table>

            <thead>

                <tr>

                    <th class="col-habilidade">
                        Habilidade
                    </th>

    `;


    cargos.forEach(cargo => {

        tabela += `

            <th>

                ${cargo}

                <button
                    class="btnExcluirCargo"
                    data-cargo="${cargo}"
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

    });


    tabela += `

                    <th>
                        Ação
                    </th>

                </tr>

            </thead>

            <tbody>

    `;


    // =====================================
    // HABILIDADES
    // =====================================

    habilidades.forEach((habilidade,index) => {

        tabela += `

            <tr>

                <td class="habilidade">

                    ${habilidade}

                </td>

        `;


        // =====================================
        // NÍVEL POR CARGO
        // =====================================

        cargos.forEach(cargo => {

            const valor =
                Number(
                    matrizEsperada[cargo]?.[index] ?? 0
                );


            tabela += `

                <td>

                    <select

                        class="nivel"

                        data-cargo="${cargo}"

                        data-index="${index}"

                    >

                        <option
                            value="0"
                            ${valor === 0 ? "selected" : ""}
                        >
                            0
                        </option>

                        <option
                            value="1"
                            ${valor === 1 ? "selected" : ""}
                        >
                            1
                        </option>

                        <option
                            value="2"
                            ${valor === 2 ? "selected" : ""}
                        >
                            2
                        </option>

                        <option
                            value="3"
                            ${valor === 3 ? "selected" : ""}
                        >
                            3
                        </option>

                        <option
                            value="4"
                            ${valor === 4 ? "selected" : ""}
                        >
                            4
                        </option>

                    </select>

                </td>

            `;

        });


        // =====================================
        // BOTÃO EXCLUIR HABILIDADE
        // =====================================

        tabela += `

                <td>

                    <button

                        class="btnExcluirHabilidade"

                        data-index="${index}"

                        title="Excluir habilidade"

                    >
                        🗑️
                    </button>

                </td>

            </tr>

        `;

    });


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
                            ${usuario.area}

                        </span>

                    </div>


                </div>


                <div class="meta">


                    <small>

                        Meta de score

                    </small>


                    <div class="meta-edicao">


                        <strong>

                            ${Number(areaAtual.meta) || 0} / 4

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


                            <button id="btnHabilidade">

                                + Habilidade

                            </button>


                        </div>


                    </div>


                    <p class="descricao">

                        Nível esperado (0–4) de cada
                        habilidade, por cargo.
                        Gestor define aqui uma única vez.

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
        .getElementById("btnColaboradores")
        .onclick = () => {

            ModuloColaboradores.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById("btnAvaliacao")
        .onclick = () => {

            ModuloAvaliacao.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById("btnDashboard")
        .onclick = () => {

            ModuloDashboard.abrir(
                usuario,
                banco
            );

        };


    document
        .getElementById("btnMatriz")
        .onclick = () => {

            mostrarDashboard(usuario);

        };


    // =====================================
    // ALTERAR NÍVEL
    // =====================================

    document
        .querySelectorAll(".nivel")
        .forEach(select => {


            select.onchange = async () => {


                const cargo =
                    select.dataset.cargo;


                const index =
                    Number(
                        select.dataset.index
                    );


                if(
                    !Array.isArray(
                        areaAtual.matrizEsperada[cargo]
                    )
                ){

                    areaAtual.matrizEsperada[cargo] =
                        habilidades.map(() => 0);

                }


                areaAtual.matrizEsperada[cargo][index] =
                    Number(select.value);


                await Storage.salvarBanco(banco);

            };

        });


    // =====================================
    // EXCLUIR HABILIDADE
    // =====================================

    document
        .querySelectorAll(".btnExcluirHabilidade")
        .forEach(botao => {


            botao.onclick = async () => {


                const index =
                    Number(
                        botao.dataset.index
                    );


                const habilidade =
                    areaAtual.habilidades[index];


                if(
                    !confirm(
                        `Deseja excluir a habilidade "${habilidade}"?`
                    )
                ){

                    return;

                }


                // Remove habilidade

                areaAtual.habilidades.splice(
                    index,
                    1
                );


                // Remove o nível correspondente
                // de todos os cargos

                Object.keys(
                    areaAtual.matrizEsperada
                )
                .forEach(cargo => {


                    if(
                        Array.isArray(
                            areaAtual.matrizEsperada[cargo]
                        )
                    ){

                        areaAtual.matrizEsperada[cargo]
                            .splice(index,1);

                    }

                });


                await Storage.salvarBanco(banco);


                mostrarDashboard(usuario);

            };

        });


    // =====================================
    // EXCLUIR CARGO
    // =====================================

    document
        .querySelectorAll(".btnExcluirCargo")
        .forEach(botao => {


            botao.onclick = async () => {


                const cargo =
                    botao.dataset.cargo;


                if(
                    !confirm(
                        `Deseja excluir o cargo "${cargo}"?`
                    )
                ){

                    return;

                }


                // Remove cargo

                const indice =
                    areaAtual.cargos.indexOf(
                        cargo
                    );


                if(indice >= 0){

                    areaAtual.cargos.splice(
                        indice,
                        1
                    );

                }


                // Remove matriz do cargo

                delete areaAtual.matrizEsperada[cargo];


                // Limpa cargo dos colaboradores

                areaAtual.colaboradores
                    .forEach(colaborador => {

                        if(
                            colaborador.cargo === cargo
                        ){

                            colaborador.cargo = "";

                        }

                    });


                await Storage.salvarBanco(banco);


                mostrarDashboard(usuario);

            };

        });


    // =====================================
    // ALTERAR META
    // =====================================

    document
        .getElementById("btnMeta")
        .onclick = async () => {


            let novaMeta =
                prompt(
                    "Digite a nova meta de score (0 a 4):",
                    Number(areaAtual.meta) || 0
                );


            if(novaMeta === null){

                return;

            }


            novaMeta =
                Number(novaMeta);


            if(
                novaMeta < 0 ||
                novaMeta > 4 ||
                Number.isNaN(novaMeta)
            ){

                alert(
                    "Digite uma meta entre 0 e 4."
                );

                return;

            }


            areaAtual.meta =
                novaMeta;


            await Storage.salvarBanco(banco);


            mostrarDashboard(usuario);

        };


    // =====================================
    // ADICIONAR CARGO
    // =====================================

    document
        .getElementById("btnCargo")
        .onclick = async () => {


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


            if(
                areaAtual.cargos
                    .includes(nomeCargo)
            ){

                alert(
                    "Cargo já existe."
                );

                return;

            }


            areaAtual.cargos.push(
                nomeCargo
            );


            areaAtual.matrizEsperada[nomeCargo] =
                areaAtual.habilidades.map(
                    () => 0
                );


            await Storage.salvarBanco(banco);


            mostrarDashboard(usuario);

        };


    // =====================================
    // ADICIONAR HABILIDADE
    // =====================================

    document
        .getElementById("btnHabilidade")
        .onclick = async () => {


            const novaHabilidade =
                prompt(
                    "Digite o nome da nova habilidade:"
                );


            if(!novaHabilidade){

                return;

            }


            const nomeHabilidade =
                novaHabilidade.trim();


            if(!nomeHabilidade){

                return;

            }


            if(
                areaAtual.habilidades
                    .includes(nomeHabilidade)
            ){

                alert(
                    "Habilidade já existe."
                );

                return;

            }


            areaAtual.habilidades.push(
                nomeHabilidade
            );


            // Adiciona nível 0
            // para todos os cargos

            areaAtual.cargos
                .forEach(cargo => {


                    if(
                        !Array.isArray(
                            areaAtual.matrizEsperada[cargo]
                        )
                    ){

                        areaAtual.matrizEsperada[cargo] =
                            [];

                    }


                    areaAtual.matrizEsperada[cargo]
                        .push(0);

                });


            await Storage.salvarBanco(banco);


            mostrarDashboard(usuario);

        };

}


telaBanco();

