const ModuloAvaliacao = {

    abrir(usuario, banco) {

        const areaAtual = banco.matrizesPorArea[usuario.area];

if (!areaAtual.colaboradores) areaAtual.colaboradores = [];
if (!areaAtual.avaliacoes) areaAtual.avaliacoes = {};

const colaboradores = areaAtual.colaboradores;

        let html = `

        <div class="portal">

            <header class="topo">

                <div class="logo-area">

                    <div class="logo-box">
                        A
                    </div>

                    <div>

                        <h2>Avaliação de Competências</h2>

                        <span>Área: ${usuario.area}</span>

                    </div>

                </div>

            </header>

            <nav class="menu">

                <button id="btnVoltarMatriz">
                    🎯 Matriz
                </button>

                <button class="ativo">
                    📝 Avaliação
                </button>

            </nav>

            <section class="conteudo">

                <div class="card">

                    <div class="barraAcoes">

                        <div class="grupoCampo">

                            <label>
                                Colaborador
                            </label>

                            <select id="cmbColaborador">

                                <option value="">
                                    Selecione...
                                </option>

                                ${colaboradores.map(c=>`

                                    <option value="${c.id}">
                                        ${c.nome}
                                    </option>

                                `).join("")}

                            </select>

                        </div>

                    </div>

                    <div id="painelAvaliacao">

                        <p class="textoCinza">

                            Selecione um colaborador para iniciar a avaliação.

                        </p>

                    </div>

                </div>

            </section>

        </div>

        `;

        UI.carregar(html);

        document
            .getElementById("btnVoltarMatriz")
            .onclick = () => {

                mostrarDashboard(usuario);

            };

        document
            .getElementById("cmbColaborador")
            .onchange = () => {

                const id = Number(
                    document.getElementById("cmbColaborador").value
                );

                if (!id) {

                    document.getElementById("painelAvaliacao").innerHTML = `
                        <p class="textoCinza">
                            Selecione um colaborador.
                        </p>
                    `;

                    return;
                }

                this.mostrarFormulario(id, usuario, banco);

            };

    },

   mostrarFormulario(id, usuario, banco) {

   const areaAtual = banco.matrizesPorArea[usuario.area];

const colaborador =
    areaAtual.colaboradores.find(c => c.id === id);

if (!colaborador) return;

const habilidades = areaAtual.habilidades || [];

const esperados =
    areaAtual.matrizEsperada[colaborador.cargo] || [];

const avaliacao =
    areaAtual.avaliacoes[id] ||
    habilidades.map(() => 0);

    let html = `

        <div class="cabecalhoColaborador">

            <div>

                <h3>${colaborador.nome}</h3>

                <span>

                    Cargo:
                    <strong>${colaborador.cargo}</strong>

                </span>

            </div>

        </div>

        <div class="tabela-container">

        <table>

            <thead>

                <tr>

                    <th>Habilidade</th>

                    <th>Esperado</th>

                    <th>Atual</th>

                    <th>GAP</th>

                </tr>

            </thead>

            <tbody>

    `;

    habilidades.forEach((habilidade,index)=>{

        const esperado =
            Number(esperados[index] ?? 0);

        const atual =
            Number(avaliacao[index] ?? 0);

        const gap =
    Math.max(0, esperado - atual);

        let classe = "gapVerde";

        if(gap==1){

            classe="gapAmarelo";

        }

        if(gap>=2){

            classe="gapVermelho";

        }

        html += `

            <tr>

                <td class="colHabilidade">

                    ${habilidade}

                </td>

                <td>

                    ${esperado}

                </td>

                <td>

                    <select
                        class="nivelAtual"
                        data-index="${index}"
                    >

                        ${[0,1,2,3,4].map(n=>`

                            <option
                                value="${n}"
                                ${n===atual?"selected":""}
                            >

                                ${n}

                            </option>

                        `).join("")}

                    </select>

                </td>

                <td>

                    <span
                        id="gap${index}"
                        class="${classe}"
                    >

                        ${gap}

                    </span>

                </td>

            </tr>

        `;

    });

    html += `

            </tbody>

        </table>

        </div>

        <div class="rodapeAvaliacao">

            <button
                id="btnSalvarAvaliacao"
                class="btnAcao"
            >

                💾 Salvar Avaliação

            </button>

        </div>

    `;

    document.getElementById(
        "painelAvaliacao"
    ).innerHTML = html;

          // Atualiza o GAP ao alterar o nível
    document
    .querySelectorAll(".nivelAtual")
    .forEach(select => {

        select.onchange = () => {

            const index = Number(select.dataset.index);

            const esperado =
                Number(esperados[index]);

            const atual =
                Number(select.value);

    const gap =
    Math.max(0, esperado - atual);

            const span =
                document.getElementById("gap" + index);

            span.textContent = gap;

            span.classList.remove(
                "gapVerde",
                "gapAmarelo",
                "gapVermelho"
            );

            if (gap <= 0) {

                span.classList.add("gapVerde");

            }
            else if (gap === 1) {

                span.classList.add("gapAmarelo");

            }
            else {

                span.classList.add("gapVermelho");

            }

        };

    });

    // Salvar avaliação
    document
    .getElementById("btnSalvarAvaliacao")
    .onclick = async () => {

        const nova = [];

        document
        .querySelectorAll(".nivelAtual")
        .forEach(select => {

            nova.push(Number(select.value));

        });

      if (!areaAtual.avaliacoes) {

    areaAtual.avaliacoes = {};

}

areaAtual.avaliacoes[id] = nova;

        await Storage.salvarBanco(banco);

        alert("Avaliação salva com sucesso!");

    };

}

};