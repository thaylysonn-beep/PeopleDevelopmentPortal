const DashboardRadar = {

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

                            <option value="${colaborador.id}">

                                ${colaborador.nome}

                            </option>

                        `
                    ).join("")}

                </select>

            </div>


            <!-- LEGENDA -->

            <div
                class="legendaRadar"
                style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    gap:30px;
                    margin-top:20px;
                    margin-bottom:10px;
                    font-weight:600;
                "
            >

                <div
                    class="itemLegenda"
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        style="
                            display:inline-block;
                            width:32px;
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
                    class="itemLegenda"
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        style="
                            display:inline-block;
                            width:32px;
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


            <div class="radarContainer">

                <canvas
                    id="canvasRadar"
                    width="1200"
                    height="1050"
                >
                </canvas>

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


        ctx.clearRect(
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
        // DADOS DA MATRIZ
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
        // TRATAR FORMATO NOVO DA AVALIAÇÃO
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
        // FILTRAR SOMENTE HABILIDADES
        // COM NÍVEL ESPERADO MAIOR QUE ZERO
        // =================================================

        const habilidades =
            [];


        const esperado =
            [];


        const atual =
            [];


        todasHabilidades.forEach(
            (
                habilidade,
                index
            ) => {

                const nivelEsperado =
                    Number(
                        todosEsperados[
                            index
                        ] ?? 0
                    );


                // =========================================
                // SE O ESPERADO FOR ZERO,
                // A HABILIDADE NÃO APARECE NO RADAR
                // =========================================

                if (
                    nivelEsperado <= 0
                ) {

                    return;

                }


                habilidades.push(
                    habilidade
                );


                esperado.push(
                    nivelEsperado
                );


                const nivelAtual =
                    Number(
                        todosAtuais[
                            index
                        ] ?? 0
                    );


                atual.push(
                    nivelAtual
                );

            }
        );


        const total =
            habilidades.length;


        if (
            total === 0
        ) {

            return;

        }


        // =================================================
        // CONFIGURAÇÕES DO RADAR
        // =================================================

        const cx =
            canvas.width / 2;


        /*
        DEIXAMOS O RADAR UM POUCO MAIS
        PARA BAIXO PARA DAR ESPAÇO AOS TEXTOS
        SUPERIORES
        */

        const cy =
            canvas.height / 2 +
            35;


        /*
        REDUZ UM POUCO O TAMANHO DO RADAR
        PARA AUMENTAR A ÁREA DOS TEXTOS
        */

        const raio =
            270;


        /*
        DISTÂNCIA INICIAL DOS TEXTOS
        EM RELAÇÃO À TEIA
        */

        const distanciaTexto =
            raio + 95;


        /*
        DISTÂNCIA DOS CONECTORES
        */

        const distanciaConector =
            raio + 45;


        const alturaLinha =
            16;


        // =================================================
        // DESENHAR EIXOS COMPRIDOS
        // =================================================

        ctx.strokeStyle =
            "#586171";


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


            /*
            CADA EIXO TEM UM COMPRIMENTO
            PROPORCIONAL AO ESPERADO
            */

            const nivelEsperado =
                Number(
                    esperado[i]
                ) || 1;


            const raioEixo =
                (
                    nivelEsperado / 4
                ) *
                raio;


            const x =
                cx +
                Math.cos(ang) *
                raioEixo;


            const y =
                cy +
                Math.sin(ang) *
                raioEixo;


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
        // DESENHAR NÍVEIS INTERNOS
        // =================================================

        ctx.strokeStyle =
            "#394150";


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

                const esperadoHabilidade =
                    Number(
                        esperado[i]
                    ) || 1;


                /*
                NÃO DESENHA O NÍVEL
                SE A HABILIDADE NÃO
                CHEGA ATÉ ELE
                */

                if (
                    nivel >
                    esperadoHabilidade
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


            if (iniciou) {

                ctx.stroke();

            }

        }


        // =================================================
        // FUNÇÃO PARA DESENHAR POLÍGONO
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


                    /*
                    NÃO PERMITE QUE O ATUAL
                    ULTRAPASSE O ESPERADO
                    NO RADAR
                    */

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
                    3;


                ctx.fill();

                ctx.stroke();

            };


        // =================================================
        // DESENHAR ESPERADO
        // =================================================

        desenharPoligono(
            esperado,
            "#4F8EF7",
            "rgba(79,142,247,.25)"
        );


        // =================================================
        // DESENHAR ATUAL
        // =================================================

        desenharPoligono(
            atual,
            "#2ECC71",
            "rgba(46,204,113,.30)",
            true
        );


        // =================================================
        // CONFIGURAÇÃO DOS TEXTOS
        // =================================================

        ctx.fillStyle =
            "#FFFFFF";


        ctx.font =
            "bold 12px Arial";


        const textosPosicionados =
            [];


        // =================================================
        // DESENHAR NOMES
        // =================================================

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


            const linhas =
                this.quebrarTexto(
                    ctx,
                    habilidades[i],
                    155
                );


            let larguraTexto =
                0;


            linhas.forEach(
                linha => {

                    const largura =
                        ctx.measureText(
                            linha
                        ).width;


                    larguraTexto =
                        Math.max(
                            larguraTexto,
                            largura
                        );

                }
            );


            const alturaTexto =
                linhas.length *
                alturaLinha;


            // =============================================
            // POSIÇÃO DO TEXTO
            // =============================================

            let distancia =
                distanciaTexto;


            /*
            AUMENTA UM POUCO A DISTÂNCIA
            NAS ÁREAS SUPERIOR E INFERIOR
            */

            if (
                Math.abs(
                    Math.sin(ang)
                ) > 0.85
            ) {

                distancia +=
                    25;

            }


            let xTexto =
                cx +
                Math.cos(ang) *
                distancia;


            let yTexto =
                cy +
                Math.sin(ang) *
                distancia;


            // =============================================
            // ALINHAMENTO
            // =============================================

            let alinhamento =
                "center";


            if (
                Math.cos(ang) >
                0.30
            ) {

                alinhamento =
                    "left";

            }

            else if (
                Math.cos(ang) <
                -0.30
            ) {

                alinhamento =
                    "right";

            }


            // =============================================
            // CRIAR CAIXA DE COLISÃO
            // =============================================

            const criarCaixa =
                (
                    x,
                    y
                ) => {

                    let esquerda =
                        x -
                        larguraTexto / 2;


                    if (
                        alinhamento ===
                        "left"
                    ) {

                        esquerda =
                            x;

                    }


                    if (
                        alinhamento ===
                        "right"
                    ) {

                        esquerda =
                            x -
                            larguraTexto;

                    }


                    return {

                        x:
                            esquerda,

                        y:
                            y -
                            alturaTexto / 2,

                        largura:
                            larguraTexto,

                        altura:
                            alturaTexto

                    };

                };


            let caixa =
                criarCaixa(
                    xTexto,
                    yTexto
                );


            // =============================================
            // EVITAR SOBREPOSIÇÃO
            // =============================================

            let tentativa =
                0;


            while (
                this.temSobreposicao(
                    caixa,
                    textosPosicionados
                ) &&
                tentativa < 30
            ) {

                const sentido =
                    tentativa % 2 === 0
                        ? 1
                        : -1;


                const deslocamento =
                    (
                        Math.floor(
                            tentativa / 2
                        ) + 1
                    ) *
                    20;


                /*
                MOVE LATERALMENTE
                AO REDOR DO RADAR
                */

                xTexto =
                    cx +
                    Math.cos(ang) *
                    distancia +
                    (
                        -Math.sin(ang) *
                        deslocamento *
                        sentido
                    );


                yTexto =
                    cy +
                    Math.sin(ang) *
                    distancia +
                    (
                        Math.cos(ang) *
                        deslocamento *
                        sentido
                    );


                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );


                tentativa++;

            }


            // =============================================
            // LIMITES DO CANVAS
            // =============================================

            const margem =
                15;


            if (
                caixa.x <
                margem
            ) {

                xTexto +=
                    margem -
                    caixa.x;


                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            if (
                caixa.x +
                caixa.largura >
                canvas.width -
                margem
            ) {

                xTexto -=
                    (
                        caixa.x +
                        caixa.largura
                    ) -
                    (
                        canvas.width -
                        margem
                    );


                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            if (
                caixa.y <
                margem
            ) {

                yTexto +=
                    margem -
                    caixa.y;


                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            if (
                caixa.y +
                caixa.altura >
                canvas.height -
                margem
            ) {

                yTexto -=
                    (
                        caixa.y +
                        caixa.altura
                    ) -
                    (
                        canvas.height -
                        margem
                    );


                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            textosPosicionados.push(
                caixa
            );


            // =============================================
            // LINHA CONECTORA
            // =============================================

            const nivelEsperado =
                Number(
                    esperado[i]
                ) || 1;


            const raioFinal =
                (
                    nivelEsperado / 4
                ) *
                raio;


            const xRadar =
                cx +
                Math.cos(ang) *
                raioFinal;


            const yRadar =
                cy +
                Math.sin(ang) *
                raioFinal;


            const xConector =
                cx +
                Math.cos(ang) *
                distanciaConector;


            const yConector =
                cy +
                Math.sin(ang) *
                distanciaConector;


            ctx.save();


            ctx.strokeStyle =
                "rgba(255,255,255,.45)";


            ctx.lineWidth =
                1.5;


            ctx.setLineDash(
                [4, 6]
            );


            ctx.beginPath();

            ctx.moveTo(
                xRadar,
                yRadar
            );

            ctx.lineTo(
                xConector,
                yConector
            );

            ctx.stroke();


            ctx.setLineDash(
                []
            );


            ctx.restore();


            // =============================================
            // DESENHAR TEXTO
            // =============================================

            ctx.fillStyle =
                "#FFFFFF";


            ctx.font =
                "bold 12px Arial";


            ctx.textAlign =
                alinhamento;


            const inicioY =
                yTexto -
                (
                    alturaTexto -
                    alturaLinha
                ) /
                2;


            linhas.forEach(
                (
                    linha,
                    index
                ) => {

                    ctx.fillText(
                        linha,
                        xTexto,
                        inicioY +
                        (
                            index *
                            alturaLinha
                        )
                    );

                }
            );


            // =============================================
            // MOSTRAR META
            // =============================================

            const nivelMeta =
                Number(
                    esperado[i]
                ) || 0;


            ctx.fillStyle =
                "#7FB3FF";


            ctx.font =
                "bold 11px Arial";


            const yMeta =
                inicioY +
                (
                    linhas.length *
                    alturaLinha
                ) +
                8;


            ctx.fillText(
                `Meta: ${nivelMeta}`,
                xTexto,
                yMeta
            );

        }

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
                texto
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
    // VERIFICAR SOBREPOSIÇÃO
    // =====================================================

    temSobreposicao(
        caixa,
        caixas
    ) {

        return caixas.some(
            outra => {

                return !(
                    caixa.x +
                    caixa.largura <
                    outra.x ||

                    caixa.x >
                    outra.x +
                    outra.largura ||

                    caixa.y +
                    caixa.altura <
                    outra.y ||

                    caixa.y >
                    outra.y +
                    outra.altura
                );

            }
        );

    }

};