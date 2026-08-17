const DashboardRadar = {

    montar(areaAtual) {

        const colaboradores = areaAtual.colaboradores || [];

        return `

        <div class="card cardRadar">

            <div class="cabecalhoRadar">

                <div>

                    <h3>📡 Radar de Competências</h3>

                    <small>Comparação entre nível esperado e nível atual</small>

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
                    width="620"
                    height="620">
                </canvas>

            </div>

        </div>

        `;

    },

    iniciar(areaAtual){

        const combo = document.getElementById("cmbRadar");

        if(!combo) return;

        combo.onchange = ()=>{

            const id = Number(combo.value);

            if(!id){

                const canvas=document.getElementById("canvasRadar");

                if(canvas){

                    canvas.getContext("2d")
                    .clearRect(0,0,canvas.width,canvas.height);

                }

                return;

            }

            this.desenharRadar(id,areaAtual);

        };

    },

    desenharRadar(id,areaAtual){

        const canvas=document.getElementById("canvasRadar");

        if(!canvas) return;

        const ctx=canvas.getContext("2d");

        ctx.clearRect(0,0,canvas.width,canvas.height);

        const colaborador=
            areaAtual.colaboradores.find(c=>c.id===id);

        if(!colaborador) return;

        const habilidades=areaAtual.habilidades || [];

        const esperado=
            areaAtual.matrizEsperada[colaborador.cargo] || [];

        const atual=
            areaAtual.avaliacoes[id] ||
            habilidades.map(()=>0);

        const total=habilidades.length;

        if(total===0) return;

        const cx=canvas.width/2;
        const cy=canvas.height/2;
        const raio=220;

        ctx.strokeStyle="#394150";

        for(let nivel=1;nivel<=4;nivel++){

            ctx.beginPath();

            for(let i=0;i<total;i++){

                const ang=(Math.PI*2/total)*i-Math.PI/2;

                const r=(raio/4)*nivel;

                const x=cx+Math.cos(ang)*r;
                const y=cy+Math.sin(ang)*r;

                if(i===0) ctx.moveTo(x,y);
                else ctx.lineTo(x,y);

            }

            ctx.closePath();
            ctx.stroke();

        }

        ctx.strokeStyle="#586171";

        for(let i=0;i<total;i++){

            const ang=(Math.PI*2/total)*i-Math.PI/2;

            const x=cx+Math.cos(ang)*raio;
            const y=cy+Math.sin(ang)*raio;

            ctx.beginPath();
            ctx.moveTo(cx,cy);
            ctx.lineTo(x,y);
            ctx.stroke();

            ctx.fillStyle="#FFFFFF";
            ctx.font="bold 12px Arial";
            ctx.textAlign="center";

            ctx.fillText(

                habilidades[i],

                cx+Math.cos(ang)*(raio+32),

                cy+Math.sin(ang)*(raio+32)

            );

        }

        function desenhar(valores,linha,fundo){

            ctx.beginPath();

            valores.forEach((valor,index)=>{

                const ang=(Math.PI*2/total)*index-Math.PI/2;

                const r=(Number(valor)||0)*(raio/4);

                const x=cx+Math.cos(ang)*r;
                const y=cy+Math.sin(ang)*r;

                if(index===0) ctx.moveTo(x,y);
                else ctx.lineTo(x,y);

            });

            ctx.closePath();

            ctx.fillStyle=fundo;
            ctx.strokeStyle=linha;
            ctx.lineWidth=3;

            ctx.fill();
            ctx.stroke();

        }

        desenhar(
            esperado,
            "#4F8EF7",
            "rgba(79,142,247,.25)"
        );

        desenhar(
            atual,
            "#2ECC71",
            "rgba(46,204,113,.30)"
        );

        ctx.fillStyle="#FFFFFF";
        ctx.font="bold 16px Arial";
        ctx.textAlign="center";
        ctx.fillText(colaborador.nome,cx,30);

    }

};