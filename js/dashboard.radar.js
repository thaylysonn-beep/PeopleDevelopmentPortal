const DashboardRadar = {

    montar(areaAtual) {

        const colaboradores =
            areaAtual.colaboradores || [];

        return `

        <div class="card cardRadar">

            <div class="cabecalhoRadar">

                <div>

                    <h3>📡 Radar de Competências</h3>

                    <small>
                        Comparação entre nível esperado e nível atual
                    </small>

                </div>

                <select id="cmbRadar">

                    <option value="">
                        Selecione um colaborador
                    </option>

                    ${colaboradores.map(c => `
                        <option value="${c.id}">
                            ${c.nome}
                        </option>
                    `).join("")}

                </select>

            </div>


            <div class="legendaRadar">

                <div class="itemLegenda">
                    <span class="corEsperado"></span>
                    Esperado
                </div>

                <div class="itemLegenda">
                    <span class="corAtual"></span>
                    Atual
                </div>

            </div>


            <div class="radarContainer">

                <canvas
                    id="canvasRadar"
                    width="1200"
                    height="1050">
                </canvas>

            </div>

        </div>

        `;

    },


    iniciar(areaAtual) {

        const combo =
            document.getElementById("cmbRadar");

        if (!combo) return;


        combo.onchange = () => {

            const id =
                Number(combo.value);


            const canvas =
                document.getElementById("canvasRadar");


            if (!canvas) return;


            const ctx =
                canvas.getContext("2d");


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


    desenharRadar(id, areaAtual) {

        const canvas =
            document.getElementById("canvasRadar");

        if (!canvas) return;


        const ctx =
            canvas.getContext("2d");


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const colaborador =
            areaAtual.colaboradores.find(
                c => c.id === id
            );

        if (!colaborador) return;


        const habilidades =
            areaAtual.habilidades || [];


        const esperado =
            areaAtual.matrizEsperada[
                colaborador.cargo
            ] || [];


        const atual =
            areaAtual.avaliacoes[id] ||
            habilidades.map(() => 0);


        const total =
            habilidades.length;


        if (total === 0) return;


        /*
        ==================================
        POSIÇÃO DO RADAR
        ==================================
        */

        const cx =
            canvas.width / 2;


        const cy =
            canvas.height / 2;


        /*
        RADAR MENOR PARA SOBRAR
        ESPAÇO PARA OS TEXTOS
        */

        const raio =
            285;


        /*
        ==================================
        LINHAS DOS NÍVEIS
        ==================================
        */

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


                const r =
                    (
                        raio / 4
                    ) *
                    nivel;


                const x =
                    cx +
                    Math.cos(ang) *
                    r;


                const y =
                    cy +
                    Math.sin(ang) *
                    r;


                if (i === 0) {

                    ctx.moveTo(
                        x,
                        y
                    );

                } else {

                    ctx.lineTo(
                        x,
                        y
                    );

                }

            }


            ctx.closePath();

            ctx.stroke();

        }


        /*
        ==================================
        LINHAS RADIAIS
        ==================================
        */

        ctx.strokeStyle =
            "#586171";


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


            const x =
                cx +
                Math.cos(ang) *
                raio;


            const y =
                cy +
                Math.sin(ang) *
                raio;


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


        /*
        ==================================
        DESENHA OS POLÍGONOS
        ==================================
        */

        function desenhar(
            valores,
            linha,
            fundo
        ) {

            ctx.beginPath();


            for (
                let index = 0;
                index < total;
                index++
            ) {

                const valor =
                    valores[index];


                const ang =
                    (
                        Math.PI * 2 /
                        total
                    ) *
                    index -
                    Math.PI / 2;


                const r =
                    (
                        Number(valor) ||
                        0
                    ) *
                    (
                        raio / 4
                    );


                const x =
                    cx +
                    Math.cos(ang) *
                    r;


                const y =
                    cy +
                    Math.sin(ang) *
                    r;


                if (index === 0) {

                    ctx.moveTo(
                        x,
                        y
                    );

                } else {

                    ctx.lineTo(
                        x,
                        y
                    );

                }

            }


            ctx.closePath();


            ctx.fillStyle =
                fundo;


            ctx.strokeStyle =
                linha;


            ctx.lineWidth =
                3;


            ctx.fill();

            ctx.stroke();

        }


        /*
        ==================================
        RADAR ESPERADO
        ==================================
        */

        desenhar(
            esperado,
            "#4F8EF7",
            "rgba(79,142,247,.25)"
        );


        /*
        ==================================
        RADAR ATUAL
        ==================================
        */

        desenhar(
            atual,
            "#2ECC71",
            "rgba(46,204,113,.30)"
        );


        /*
        ==================================
        CONFIGURAÇÃO DOS TEXTOS
        ==================================
        */

        ctx.fillStyle =
            "#FFFFFF";


        ctx.font =
            "bold 12px Arial";


        const alturaLinha =
            16;


        /*
        GUARDA AS ÁREAS JÁ UTILIZADAS
        PARA EVITAR SOBREPOSIÇÃO
        */

        const textosPosicionados =
            [];


        /*
        ==================================
        DESENHA OS NOMES DAS HABILIDADES
        ==================================
        */

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
                    160
                );


            let larguraTexto =
                0;


            linhas.forEach(
                linha => {

                    const largura =
                        ctx.measureText(
                            linha
                        ).width;


                    if (
                        largura >
                        larguraTexto
                    ) {

                        larguraTexto =
                            largura;

                    }

                }
            );


            const alturaTexto =
                linhas.length *
                alturaLinha;


            /*
            ==================================
            POSIÇÃO INICIAL
            ==================================
            */

            let distancia =
                raio + 35;


            let xTexto =
                cx +
                Math.cos(ang) *
                distancia;


            let yTexto =
                cy +
                Math.sin(ang) *
                distancia;


            /*
            ==================================
            ALINHAMENTO
            ==================================
            */

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


            /*
            ==================================
            ÁREA DO TEXTO
            ==================================
            */

            const criarCaixa =
                (
                    x,
                    y
                ) => {

                    let esquerda =
                        x -
                        larguraTexto / 2;


                    if (
                        alinhamento === "left"
                    ) {

                        esquerda =
                            x;

                    }


                    if (
                        alinhamento === "right"
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


            /*
            ==================================
            TESTA SOBREPOSIÇÃO
            ==================================
            */

            let caixa =
                criarCaixa(
                    xTexto,
                    yTexto
                );


            let tentativa =
                0;


            while (
                this.temSobreposicao(
                    caixa,
                    textosPosicionados
                ) &&
                tentativa < 25
            ) {

                /*
                Move o texto
                lateralmente ao longo
                da borda do radar
                */

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
                    22;


                /*
                DIREÇÃO PERPENDICULAR
                À LINHA DO RADAR
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


            /*
            GARANTE QUE O TEXTO
            NÃO SAIA DO CANVAS
            */

            const margem =
                10;


            if (
                caixa.x < margem
            ) {

                const ajuste =
                    margem -
                    caixa.x;

                xTexto +=
                    ajuste;

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

                const ajuste =
                    (
                        caixa.x +
                        caixa.largura
                    ) -
                    (
                        canvas.width -
                        margem
                    );

                xTexto -=
                    ajuste;

                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            if (
                caixa.y < margem
            ) {

                const ajuste =
                    margem -
                    caixa.y;

                yTexto +=
                    ajuste;

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

                const ajuste =
                    (
                        caixa.y +
                        caixa.altura
                    ) -
                    (
                        canvas.height -
                        margem
                    );

                yTexto -=
                    ajuste;

                caixa =
                    criarCaixa(
                        xTexto,
                        yTexto
                    );

            }


            /*
            GUARDA A POSIÇÃO
            */

            textosPosicionados.push(
                caixa
            );


            /*
            DESENHA O TEXTO
            */

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

        }

    },


    /*
    ======================================
    QUEBRA TEXTO CONFORME A LARGURA
    ======================================
    */

    quebrarTexto(
        ctx,
        texto,
        larguraMaxima
    ) {

        const palavras =
            String(texto).split(" ");


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

                } else {

                    linha =
                        teste;

                }

            }
        );


        if (linha) {

            linhas.push(
                linha
            );

        }


        return linhas;

    },


    /*
    ======================================
    VERIFICA SE DUAS ÁREAS SE SOBREPÕEM
    ======================================
    */

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