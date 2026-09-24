const ModuloColaboradores = {

    abrir(usuario, banco){

        let filtro = "";

        this.render(usuario, banco, filtro);

    },

    render(usuario, banco, filtro = ""){

        // Recupera a área atual
if (!banco.matrizesPorArea) {
    banco.matrizesPorArea = {};
}

if (!banco.matrizesPorArea[usuario.area]) {

    banco.matrizesPorArea[usuario.area] = {
        cargos: [],
        habilidades: [],
        matrizEsperada: {},
        colaboradores: [],
        avaliacoes: {}
    };

}

const areaAtual = banco.matrizesPorArea[usuario.area];

// Garante as estruturas
if (!areaAtual.colaboradores) areaAtual.colaboradores = [];
if (!areaAtual.avaliacoes) areaAtual.avaliacoes = {};

        const colaboradores = areaAtual.colaboradores.filter(c =>
            c.nome.toLowerCase().includes(filtro.toLowerCase())
        );

       UI.carregar(`

<div class="sistema-layout">

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
                ${usuario.area}
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
                class="menu-lateral-item ativo"
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

        <div class="cabecalho-pagina">

            <div>

                <h1>
                    Colaboradores
                </h1>

                <p>
                    Área:
                    <strong>
                        ${usuario.area}
                    </strong>
                </p>

            </div>

        </div>


        <section class="conteudo-principal">

            <div class="card">

                <div class="cabecalho-matriz">

                    <div>

                        <h3>
                            Colaboradores
                        </h3>

                    </div>


                    <div class="acoes">

                        <button
                            id="btnNovo"
                            type="button"
                        >
                            + Novo Colaborador
                        </button>

                    </div>

                </div>


                <div
                    id="formNovo"
                    style="display:none;margin:20px 24px;"
                >

                    <input
                        id="novoNome"
                        placeholder="Nome do colaborador"
                    >

                    <br><br>

                    <select id="novoCargo">

                        ${areaAtual.cargos.map(
                            c => `

                            <option value="${c}">
                                ${c}
                            </option>

                        `
                        ).join("")}

                    </select>

                    <br><br>

                    <button id="salvarNovo">
                        Salvar
                    </button>

                    <button id="cancelarNovo">
                        Cancelar
                    </button>

                </div>


                <div style="padding:0 24px 20px 24px;">

                    <input
                        id="pesquisa"
                        class="campoPesquisa"
                        placeholder="Pesquisar colaborador..."
                        value="${filtro}"
                    >

                </div>


                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Nome
                                </th>

                                <th>
                                    Cargo
                                </th>

                                <th>
                                    Ações
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${colaboradores.map(
                                colaborador => `

                                <tr>

                                    <td>
                                        ${colaborador.id}
                                    </td>

                                    <td>
                                        ${colaborador.nome}
                                    </td>

                                    <td>
                                        ${colaborador.cargo}
                                    </td>

                             <td class="acoes">

    <div class="acoes-colaborador">

        <button
            class="btnEditar"
            data-id="${colaborador.id}"
            title="Editar colaborador"
            type="button"
        >
            ✏️
        </button>

        <button
            class="btnExcluir"
            data-id="${colaborador.id}"
            title="Excluir colaborador"
            type="button"
        >
            🗑️
        </button>

    </div>

</td>

                                </tr>

                            `
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            </div>

        </section>

    </main>

</div>

`);


// ======================================
// MENU
// ======================================

// ======================================
// MENU
// ======================================

document.getElementById("btnMatriz").onclick = () => {

    mostrarDashboard(usuario);

};


document.getElementById("btnAvaliacao").onclick = () => {

    ModuloAvaliacao.abrir(
        usuario,
        banco
    );

};


document.getElementById("btnDashboard").onclick = () => {

    ModuloDashboard.abrir(
        usuario,
        banco
    );

};


// ======================================
// PESQUISA
// ======================================

document.getElementById("pesquisa").oninput = (e)=>{

    this.render(
        usuario,
        banco,
        e.target.value
    );

};


// ======================================
// NOVO COLABORADOR
// ======================================

document.getElementById("btnNovo").onclick = ()=>{

    document.getElementById("formNovo").style.display="block";

};


document.getElementById("cancelarNovo").onclick = ()=>{

    document.getElementById("formNovo").style.display="none";

};


document.getElementById("salvarNovo").onclick = async()=>{

    const nome =
    document.getElementById("novoNome").value.trim();

    const cargo =
    document.getElementById("novoCargo").value;

    if(nome===""){

        alert("Informe o nome.");

        return;

    }
const novoId =
areaAtual.colaboradores.length==0
?1
:Math.max(...areaAtual.colaboradores.map(c=>c.id))+1;

    areaAtual.colaboradores.push({

        id:novoId,

        nome,

        cargo

    });

    areaAtual.avaliacoes[novoId] =
(areaAtual.habilidades || []).map(() => 0);

    await Storage.salvarBanco(banco);

    this.render(usuario,banco);

};
// ======================================
// EDITAR COLABORADOR
// ======================================

document.querySelectorAll(".btnEditar").forEach(botao=>{

    botao.onclick = async()=>{

        const id =
        Number(botao.dataset.id);

        const colaborador =
areaAtual.colaboradores.find(c=>c.id===id);

        if(!colaborador) return;

        const novoNome =
        prompt(
            "Nome do colaborador:",
            colaborador.nome
        );

        if(novoNome===null) return;

        const novoCargo =
        prompt(
            "Cargo do colaborador:",
            colaborador.cargo
        );

        if(novoCargo===null) return;

        colaborador.nome =
        novoNome.trim();

        colaborador.cargo =
        novoCargo.trim();

        await Storage.salvarBanco(banco);

        this.render(usuario,banco,filtro);

    };

});


// ======================================
// EXCLUIR COLABORADOR
// ======================================

document.querySelectorAll(".btnExcluir").forEach(botao=>{

    botao.onclick = async()=>{

        const id =
        Number(botao.dataset.id);

        const confirmar =
        confirm("Deseja excluir este colaborador?");

        if(!confirmar) return;

       areaAtual.colaboradores =
areaAtual.colaboradores.filter(c=>c.id!==id);

delete areaAtual.avaliacoes[id];

        await Storage.salvarBanco(banco);

        this.render(usuario,banco,filtro);

    };

});

}

};