const DashboardRadar = {

    // =====================================================
    // MONTAR RADAR
    // =====================================================

    montar(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];


        return `

        <div class="card cardRadar">

            <div class="cabecalhoRadar">

                <div>

                    <h3>
                        📡 Radar de Competências
                    </h3>

                    <small>
                        Comparação entre nível esperado e nível atual
                    </small>

                </div>


                <select id="cmbRadar">

                    <option value="">
                        Selecione um colaborador
                    </option>

                    ${colaboradores.map(
                        colaborador => `

                            <option
                                value="${this.escaparHTML(
                                    colaborador.id
                                )}"
                            >

                                ${this.escaparHTML(
                                    colaborador.nome
                                )}

                            </option>

                        `
                    ).join("")}

                </select>

            </div>


            <!-- =================================================
                 LEGENDA
            ================================================= -->

            <div
                class="legendaRadar"
                style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    gap:35px;
                    margin-top:20px;
                    margin-bottom:15px;
                    font-weight:600;
                    color:#344054;
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        style="
                            display:inline-block;
                            width:35px;
                            height:4px;
                            background:#4F8EF7;
                            border-radius:10px;
                        "
                    ></span>

                    <span>
                        Esperado
                    </span>

                </div>


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        style="
                            display:inline-block;
                            width:35px;
                            height:4px;
                            background:#2ECC71;
                            border-radius:10px;
                        "
                    ></span>

                    <span>
                        Atual
                    </span>

                </div>

            </div>


            <!-- =================================================
                 CONTAINER
            ================================================= -->

            <div
                class="radarContainer"
                style="
                    width:100%;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    overflow:visible;
                "
            >

                <canvas
                    id="canvasRadar"
                    width="1600"
                    height="1200"
                    style="
                        display:block;
                        width:100%;
                        max-width:1600px;
                        height:auto;
                        margin:0 auto;
                    "
                ></canvas>

            </div>

        </div>

        `;

    },


    // =====================================================
    // INICIAR
    // =====================================================

    iniciar(areaAtual) {

        const combo =
            document.getElementById(
                "cmbRadar"
            );


        if (!combo) {

            return;

        }


        combo.onchange =
            () => {

                const id =
                    Number(
                        combo.value
                    );


                const canvas =
                    document.getElementById(
                        "canvasRadar"
                    );


                if (!canvas) {

                    return;

                }


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                if (!id) {

                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    return;

                }


                this.desenharRadar(
                    id,
                    areaAtual
                );

            };

    },


    // =====================================================
    // DESENHAR RADAR
    // =====================================================

    desenharRadar(
        id,
        areaAtual
    ) {

        const canvas =
            document.getElementById(
                "canvasRadar"
            );


        if (!canvas) {

            return;

        }


        const ctx =
            canvas.getContext(
                "2d"
            );


        // =================================================
        // LIMPAR
        // =================================================

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // =================================================
        // FUNDO
        // =================================================

        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // =================================================
        // BUSCAR COLABORADOR
        // =================================================

        const colaborador =
            (
                areaAtual.colaboradores || []
            ).find(
                c =>
                    Number(c.id) ===
                    Number(id)
            );


        if (!colaborador) {

            return;

        }


        // =================================================
        // DADOS
        // =================================================

        const todasHabilidades =
            areaAtual.habilidades || [];


        const todosEsperados =
            areaAtual.matrizEsperada?.[
                colaborador.cargo
            ] || [];


        let todosAtuais =
            areaAtual.avaliacoes?.[
                colaborador.id
            ] ||
            areaAtual.avaliacoes?.[
                id
            ] ||
            [];


        // =================================================
        // COMPATIBILIDADE COM FORMATO NOVO
        // =================================================

        if (
            todosAtuais &&
            !Array.isArray(
                todosAtuais
            ) &&
            typeof todosAtuais ===
                "object"
        ) {

            todosAtuais =
                Array.isArray(
                    todosAtuais.niveis
                )
                    ? todosAtuais.niveis
                    : [];

        }


        // =================================================
        // FILTRAR COMPETÊNCIAS COM META
        // =================================================

        const habilidades = [];

        const esperado = [];

        const atual = [];


        todasHabilidades.forEach(
            (
                habilidade,
                index
            ) => {

                const meta =
                    Number(
                        todosEsperados[
                            index
                        ] ?? 0
                    );


                if (
                    meta <= 0
                ) {

                    return;

                }


                habilidades.push(
                    habilidade
                );


                esperado.push(
                    meta
                );


                atual.push(
                    Number(
                        todosAtuais[
                            index
                        ] ?? 0
                    )
                );

            }
        );


        const total =
            habilidades.length;


        // =================================================
        // SEM COMPETÊNCIAS
        // =================================================

        if (
            total === 0
        ) {

            ctx.fillStyle =
                "#667085";


            ctx.font =
                "18px Arial";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(
                "Não existem competências com nível esperado para este colaborador.",
                canvas.width / 2,
                canvas.height / 2
            );


            return;

        }


        // =================================================
        // CONFIGURAÇÕES DO RADAR
        // =================================================

        const cx =
            canvas.width / 2;


        const cy =
            canvas.height / 2;


        /*
         * Radar maior que a versão anterior.
         */

        const raio =
            300;


        /*
         * Distância aproximada onde
         * os conectores terminam.
         */

        const distanciaConector =
            370;


        /*
         * Posição dos blocos laterais.
         */

        const distanciaBloco =
            570;


        /*
         * Largura máxima do bloco.
         */

        const larguraBloco =
            210;


        /*
         * Altura mínima entre blocos.
         */

        const espacamentoBloco =
            8;


        const alturaLinha =
            15;


        // =================================================
        // EIXOS
        // =================================================

        ctx.strokeStyle =
            "#d0d5dd";


        ctx.lineWidth =
            1;


        for (
            let i = 0;
            i < total;
            i++
        ) {

            const ang =
                (
                    Math.PI * 2 /
                    total
                ) *
                i -
                Math.PI / 2;


            const meta =
                Number(
                    esperado[i]
                ) || 1;


            const r =
                (
                    meta / 4
                ) *
                raio;


            const x =
                cx +
                Math.cos(ang) *
                r;


            const y =
                cy +
                Math.sin(ang) *
                r;


            ctx.beginPath();


            ctx.moveTo(
                cx,
                cy
            );


            ctx.lineTo(
                x,
                y
            );


            ctx.stroke();

        }


        // =================================================
        // NÍVEIS INTERNOS
        // =================================================

        ctx.strokeStyle =
            "#dce5ef";


        ctx.lineWidth =
            1;


        for (
            let nivel = 1;
            nivel <= 4;
            nivel++
        ) {

            ctx.beginPath();


            let iniciou =
                false;


            for (
                let i = 0;
                i < total;
                i++
            ) {

                const meta =
                    Number(
                        esperado[i]
                    ) || 1;


                if (
                    nivel >
                    meta
                ) {

                    continue;

                }


                const ang =
                    (
                        Math.PI * 2 /
                        total
                    ) *
                    i -
                    Math.PI / 2;


                const r =
                    (
                        nivel / 4
                    ) *
                    raio;


                const x =
                    cx +
                    Math.cos(ang) *
                    r;


                const y =
                    cy +
                    Math.sin(ang) *
                    r;


                if (
                    !iniciou
                ) {

                    ctx.moveTo(
                        x,
                        y
                    );


                    iniciou =
                        true;

                }

                else {

                    ctx.lineTo(
                        x,
                        y
                    );

                }

            }


            if (
                iniciou
            ) {

                ctx.stroke();

            }

        }


        // =================================================
        // NÚMEROS DOS NÍVEIS
        // =================================================

        ctx.fillStyle =
            "#98a2b3";


        ctx.font =
            "12px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        for (
            let nivel = 1;
            nivel <= 4;
            nivel++
        ) {

            const y =
                cy -
                (
                    nivel / 4
                ) *
                raio;


            ctx.fillText(
                nivel,
                cx + 12,
                y
            );

        }


        // =================================================
        // FUNÇÃO DO POLÍGONO
        // =================================================

        const desenharPoligono =
            (
                valores,
                corLinha,
                corFundo,
                limitarAoEsperado = false
            ) => {

                ctx.beginPath();


                for (
                    let i = 0;
                    i < total;
                    i++
                ) {

                    let valor =
                        Number(
                            valores[i]
                        ) || 0;


                    const meta =
                        Number(
                            esperado[i]
                        ) || 0;


                    if (
                        limitarAoEsperado
                    ) {

                        valor =
                            Math.min(
                                valor,
                                meta
                            );

                    }


                    const ang =
                        (
                            Math.PI * 2 /
                            total
                        ) *
                        i -
                        Math.PI / 2;


                    const r =
                        (
                            valor / 4
                        ) *
                        raio;


                    const x =
                        cx +
                        Math.cos(ang) *
                        r;


                    const y =
                        cy +
                        Math.sin(ang) *
                        r;


                    if (
                        i === 0
                    ) {

                        ctx.moveTo(
                            x,
                            y
                        );

                    }

                    else {

                        ctx.lineTo(
                            x,
                            y
                        );

                    }

                }


                ctx.closePath();


                ctx.fillStyle =
                    corFundo;


                ctx.strokeStyle =
                    corLinha;


                ctx.lineWidth =
                    4;


                ctx.fill();


                ctx.stroke();

            };


        // =================================================
        // ESPERADO
        // =================================================

        desenharPoligono(
            esperado,
            "#4F8EF7",
            "rgba(79,142,247,.18)"
        );


        // =================================================
        // ATUAL
        // =================================================

        desenharPoligono(
            atual,
            "#2ECC71",
            "rgba(46,204,113,.22)",
            true
        );


        // =================================================
        // PREPARAR BLOCOS DAS COMPETÊNCIAS
        // =================================================

        const blocosEsquerda = [];

        const blocosDireita = [];


        for (
            let i = 0;
            i < total;
            i++
        ) {

            const ang =
                (
                    Math.PI * 2 /
                    total
                ) *
                i -
                Math.PI / 2;


            /*
             * Se estiver no lado direito,
             * vai para a coluna direita.
             *
             * Se estiver no lado esquerdo,
             * vai para a coluna esquerda.
             */

            const lado =
                Math.cos(ang) >= 0
                    ? "direita"
                    : "esquerda";


            const linhas =
                this.quebrarTexto(
                    ctx,
                    habilidades[i],
                    185
                );


            const alturaNome =
                linhas.length *
                alturaLinha;


            /*
             * Meta fica dentro do próprio bloco.
             */

            const alturaBloco =
                Math.max(
                    48,
                    alturaNome +
                    28
                );


            const desejadoY =
                cy +
                Math.sin(ang) *
                distanciaBloco;


            const bloco = {

                index: i,

                ang: ang,

                lado: lado,

                linhas: linhas,

                altura: alturaBloco,

                largura: larguraBloco,

                desejadoY: desejadoY,

                y: desejadoY

            };


            if (
                lado ===
                "direita"
            ) {

                blocosDireita.push(
                    bloco
                );

            }

            else {

                blocosEsquerda.push(
                    bloco
                );

            }

        }


        // =================================================
        // ORGANIZAR BLOCOS VERTICALMENTE
        // =================================================

        const organizarBlocos =
            (
                blocos
            ) => {

                /*
                 * Ordena pela posição natural.
                 */

                blocos.sort(
                    (
                        a,
                        b
                    ) =>
                        a.desejadoY -
                        b.desejadoY
                );


                /*
                 * Limites.
                 */

                const topo =
                    35;


                const base =
                    canvas.height -
                    35;


                // -----------------------------------------
                // PRIMEIRA PASSADA
                // -----------------------------------------

                let cursor =
                    topo;


                blocos.forEach(
                    bloco => {

                        const metade =
                            bloco.altura /
                            2;


                        bloco.y =
                            Math.max(
                                bloco.desejadoY,
                                cursor +
                                metade
                            );


                        cursor =
                            bloco.y +
                            metade +
                            espacamentoBloco;

                    }
                );


                // -----------------------------------------
                // CORRIGIR EXCESSO INFERIOR
                // -----------------------------------------

                let ultimo =
                    blocos[
                        blocos.length - 1
                    ];


                if (
                    ultimo &&
                    (
                        ultimo.y +
                        ultimo.altura / 2
                    ) >
                    base
                ) {

                    ultimo.y =
                        base -
                        ultimo.altura / 2;


                    for (
                        let i =
                            blocos.length - 2;
                        i >= 0;
                        i--
                    ) {

                        const atualBloco =
                            blocos[i];


                        const proximo =
                            blocos[i + 1];


                        const limite =
                            proximo.y -
                            proximo.altura / 2 -
                            espacamentoBloco -
                            atualBloco.altura / 2;


                        if (
                            atualBloco.y >
                            limite
                        ) {

                            atualBloco.y =
                                limite;

                        }

                    }

                }


                // -----------------------------------------
                // CORRIGIR EXCESSO SUPERIOR
                // -----------------------------------------

                if (
                    blocos.length > 0
                ) {

                    const primeiro =
                        blocos[0];


                    if (
                        primeiro.y -
                        primeiro.altura / 2 <
                        topo
                    ) {

                        const deslocamento =
                            topo -
                            (
                                primeiro.y -
                                primeiro.altura / 2
                            );


                        blocos.forEach(
                            bloco => {

                                bloco.y +=
                                    deslocamento;

                            }
                        );

                    }

                }

            };


        organizarBlocos(
            blocosEsquerda
        );


        organizarBlocos(
            blocosDireita
        );


        // =================================================
        // DESENHAR BLOCOS
        // =================================================

        const desenharBloco =
            (
                bloco
            ) => {

                const i =
                    bloco.index;


                const lado =
                    bloco.lado;


                const x =
                    lado === "direita"

                        ? cx +
                          distanciaBloco

                        : cx -
                          distanciaBloco;


                const y =
                    bloco.y;


                const largura =
                    bloco.largura;


                const altura =
                    bloco.altura;


                const esquerda =
                    lado === "direita"

                        ? x

                        : x -
                          largura;


                const topo =
                    y -
                    altura / 2;


                // =================================================
                // FUNDO DO BLOCO
                // =================================================

                ctx.save();


                ctx.fillStyle =
                    "rgba(255,255,255,.96)";


                ctx.strokeStyle =
                    "#d0d5dd";


                ctx.lineWidth =
                    1;


                ctx.beginPath();


                if (
                    ctx.roundRect
                ) {

                    ctx.roundRect(
                        esquerda,
                        topo,
                        largura,
                        altura,
                        8
                    );

                }

                else {

                    ctx.rect(
                        esquerda,
                        topo,
                        largura,
                        altura
                    );

                }


                ctx.fill();


                ctx.stroke();


                ctx.restore();


                // =================================================
                // NOME
                // =================================================

                ctx.fillStyle =
                    "#17365d";


                ctx.font =
                    "bold 12px Arial";


                ctx.textAlign =
                    lado === "direita"
                        ? "left"
                        : "right";


                ctx.textBaseline =
                    "alphabetic";


                const padding =
                    10;


                const nomeX =
                    lado === "direita"

                        ? esquerda +
                          padding

                        : esquerda +
                          largura -
                          padding;


                const alturaNome =
                    bloco.linhas.length *
                    alturaLinha;


                const inicioNome =
                    y -
                    (
                        alturaNome +
                        16
                    ) /
                    2 +
                    alturaLinha;


                bloco.linhas.forEach(
                    (
                        linha,
                        index
                    ) => {

                        ctx.fillText(
                            linha,
                            nomeX,
                            inicioNome +
                            (
                                index *
                                alturaLinha
                            )
                        );

                    }
                );


                // =================================================
                // META
                // =================================================

                const nivelMeta =
                    Number(
                        esperado[i]
                    ) || 0;


                ctx.fillStyle =
                    "#005eb8";


                ctx.font =
                    "bold 11px Arial";


                ctx.fillText(
                    `Meta: ${nivelMeta}`,
                    nomeX,
                    inicioNome +
                    (
                        bloco.linhas.length *
                        alturaLinha
                    ) +
                    7
                );


                // =================================================
                // PONTO DO RADAR
                // =================================================

                const raioFinal =
                    (
                        nivelMeta / 4
                    ) *
                    raio;


                const xRadar =
                    cx +
                    Math.cos(
                        bloco.ang
                    ) *
                    raioFinal;


                const yRadar =
                    cy +
                    Math.sin(
                        bloco.ang
                    ) *
                    raioFinal;


                // =================================================
                // PONTO DO CONECTOR
                // =================================================

                const xIntermediario =
                    cx +
                    Math.cos(
                        bloco.ang
                    ) *
                    distanciaConector;


                const yIntermediario =
                    cy +
                    Math.sin(
                        bloco.ang
                    ) *
                    distanciaConector;


                /*
                 * O conector termina na borda do bloco.
                 */

                const xBorda =
                    lado === "direita"

                        ? esquerda

                        : esquerda +
                          largura;


                const yBorda =
                    y;


                // =================================================
                // LINHA CONECTORA
                // =================================================

                ctx.save();


                ctx.strokeStyle =
                    "#cbd5e1";


                ctx.lineWidth =
                    1;


                ctx.setLineDash(
                    [5, 5]
                );


                ctx.beginPath();


                ctx.moveTo(
                    xRadar,
                    yRadar
                );


                ctx.lineTo(
                    xIntermediario,
                    yIntermediario
                );


                ctx.lineTo(
                    xBorda,
                    yBorda
                );


                ctx.stroke();


                ctx.setLineDash(
                    []
                );


                ctx.restore();


                // =================================================
                // PEQUENO PONTO NO RADAR
                // =================================================

                ctx.beginPath();


                ctx.arc(
                    xRadar,
                    yRadar,
                    3,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    lado === "direita"
                        ? "#2ECC71"
                        : "#4F8EF7";


                ctx.fill();

            };


        // =================================================
        // DESENHAR ESQUERDA
        // =================================================

        blocosEsquerda.forEach(
            desenharBloco
        );


        // =================================================
        // DESENHAR DIREITA
        // =================================================

        blocosDireita.forEach(
            desenharBloco
        );


        // =================================================
        // BORDA DO RADAR
        // =================================================

        ctx.save();


        ctx.strokeStyle =
            "#4F8EF7";


        ctx.lineWidth =
            2;


        ctx.globalAlpha =
            0.25;


        ctx.beginPath();


        ctx.arc(
            cx,
            cy,
            raio,
            0,
            Math.PI * 2
        );


        ctx.stroke();


        ctx.restore();

    },


    // =====================================================
    // QUEBRAR TEXTO
    // =====================================================

    quebrarTexto(
        ctx,
        texto,
        larguraMaxima
    ) {

        const palavras =
            String(
                texto ?? ""
            ).split(
                " "
            );


        const linhas =
            [];


        let linha =
            "";


        palavras.forEach(
            palavra => {

                const teste =
                    linha
                        ? linha +
                          " " +
                          palavra
                        : palavra;


                const largura =
                    ctx.measureText(
                        teste
                    ).width;


                if (
                    largura >
                    larguraMaxima &&
                    linha
                ) {

                    linhas.push(
                        linha
                    );


                    linha =
                        palavra;

                }

                else {

                    linha =
                        teste;

                }

            }
        );


        if (
            linha
        ) {

            linhas.push(
                linha
            );

        }


        return linhas;

    },


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    escaparHTML(
        valor
    ) {

        return String(
            valor ?? ""
        )
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

    }

};