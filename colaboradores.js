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

<div class="portal">

<header class="topo">

<div class="logo-area">

<div class="logo-box">
M
</div>

<div>

<h2>Colaboradores</h2>

<span>Área: ${usuario.area}</span>

</div>

</div>

</header>

<nav class="menu">

<button id="btnMatriz">
🎯 Matriz por Cargo
</button>

<button class="ativo">
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

<h3>Colaboradores</h3>

<div class="barraAcoes">

    <button id="btnNovo" class="btnAcao">
        + Novo Colaborador
    </button>

</div>

</div>

<div id="formNovo" style="display:none;margin-bottom:20px;">

<input
id="novoNome"
placeholder="Nome do colaborador"
>

<br><br>

<select id="novoCargo">

${areaAtual.cargos.map(c=>`
<option value="${c}">
${c}
</option>
`).join("")}

</select>

<br><br>

<button id="salvarNovo">
Salvar
</button>

<button id="cancelarNovo">
Cancelar
</button>

</div>

<input

id="pesquisa"

class="campoPesquisa"

placeholder="Pesquisar colaborador..."

value="${filtro}"

>

<table>

<thead>

<tr>

<th class="colId">
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
${colaboradores.map(colaborador => `

<tr>

    <td class="colId">
        ${colaborador.id}
    </td>

    <td>
        ${colaborador.nome}
    </td>

    <td>
        ${colaborador.cargo}
    </td>

    <td class="acoes">

        <button
            class="btnEditar"
            data-id="${colaborador.id}">
            ✏️
        </button>

        <button
            class="btnExcluir"
            data-id="${colaborador.id}">
            🗑️
        </button>

    </td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</section>

</div>

`);


// ======================================
// MENU
// ======================================

document.getElementById("btnMatriz").onclick = () => {

    mostrarDashboard(usuario);

};

document.getElementById("btnAvaliacao").onclick = () => {

    ModuloAvaliacao.abrir(usuario,banco);

};

document.getElementById("btnDashboard").onclick = () => {

    ModuloDashboard.abrir(usuario,banco);

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