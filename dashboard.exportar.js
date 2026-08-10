const DashboardExportar = {

    montar() {

        return `

            <div class="barraDashboard">

                <button
                    id="btnExportarExcel"
                    class="btnAcao">

                    📊 Exportar Competências

                </button>

            </div>

        `;

    },

    iniciar(areaAtual){

        const btnExcel =
        document.getElementById("btnExportarExcel");

        if(btnExcel){

            btnExcel.onclick = ()=>{

                this.exportarCSV(areaAtual);

            };

        }

    },

    exportarCSV(areaAtual){

        const colaboradores =
            areaAtual.colaboradores || [];

        const habilidades =
            areaAtual.habilidades || [];

        const avaliacoes =
            areaAtual.avaliacoes || {};

        const matriz =
            areaAtual.matrizEsperada || {};

        let linhas = [];

        colaboradores.forEach(colaborador=>{

            const esperado =
                matriz[colaborador.cargo] || [];

            const avaliacao =
                avaliacoes[colaborador.id] ||
                habilidades.map(()=>0);

            let soma = 0;

            let quantidadeGap = 0;

            let treinamentosGap = [];

            avaliacao.forEach((nota,index)=>{

                const atual =
                    Number(nota)||0;

                const nivelEsperado =
                    Number(esperado[index])||0;

                soma += atual;

                if(nivelEsperado>atual){

                    quantidadeGap++;

                    treinamentosGap.push(
                        habilidades[index]
                    );

                }

            });

            const score =
                avaliacao.length
                ?
                (soma/avaliacao.length).toFixed(2)
                :
                "0.00";

            linhas.push({

                colaborador: colaborador.nome,
                cargo: colaborador.cargo,
                score,
                quantidadeGap,
                treinamentosGap

            });

        });

        let maiorGap = 0;

        linhas.forEach(linha=>{

            if(linha.treinamentosGap.length>maiorGap){

                maiorGap =
                linha.treinamentosGap.length;

            }

        });

        let cabecalho = [

            "Colaborador",
            "Cargo",
            "Score",
            "Quantidade GAP"

        ];

        for(let i=1;i<=maiorGap;i++){

            cabecalho.push(
                `Treinamento GAP ${i}`
            );

        }

        let csv =
            cabecalho.join(";")+"\n";

        linhas.forEach(linha=>{

            let dados=[

                linha.colaborador,
                linha.cargo,
                linha.score,
                linha.quantidadeGap

            ];

            for(let i=0;i<maiorGap;i++){

                dados.push(

                    linha.treinamentosGap[i] || ""

                );

            }

            csv += dados.join(";")+"\n";

        });

        const blob = new Blob(

            ["\ufeff"+csv],

            {

                type:"text/csv;charset=utf-8;"

            }

        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "Relatorio_Competencias.csv";

        link.click();

        URL.revokeObjectURL(url);

    }

};