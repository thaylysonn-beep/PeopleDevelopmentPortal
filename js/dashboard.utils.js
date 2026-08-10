const DashboardUtils = {

    calcularIndicadores(areaAtual){

        const colaboradores = areaAtual.colaboradores || [];
        const habilidades = areaAtual.habilidades || [];
        const avaliacoes = areaAtual.avaliacoes || {};
        const matriz = areaAtual.matrizEsperada || {};

        let totalGap = 0;
        let somaNotas = 0;
        let totalNotas = 0;

        colaboradores.forEach(colaborador=>{

            const esperado =
                matriz[colaborador.cargo] || [];

            const avaliacao =
                avaliacoes[colaborador.id] ||
                habilidades.map(()=>0);

            avaliacao.forEach((nota,index)=>{

                const atual = Number(nota) || 0;
                const nivelEsperado = Number(esperado[index]) || 0;

                somaNotas += atual;
                totalNotas++;

                totalGap += Math.max(0, nivelEsperado-atual);

            });

        });

        return{

            colaboradores: colaboradores.length,

            habilidades: habilidades.length,

            totalGap,

            scoreMedio:
                totalNotas
                ? (somaNotas/totalNotas).toFixed(2)
                : "0.00"

        };

    },

    calcularRanking(areaAtual){

        const colaboradores = areaAtual.colaboradores || [];
        const habilidades = areaAtual.habilidades || [];
        const avaliacoes = areaAtual.avaliacoes || {};
        const matriz = areaAtual.matrizEsperada || {};

        return colaboradores.map(colaborador=>{

            const esperado =
                matriz[colaborador.cargo] || [];

            const avaliacao =
                avaliacoes[colaborador.id] ||
                habilidades.map(()=>0);

            let soma = 0;
            let gap = 0;
            let treinamentosGap = [];

            avaliacao.forEach((nota,index)=>{

                const atual = Number(nota) || 0;
                const nivelEsperado = Number(esperado[index]) || 0;

                soma += atual;

                if(nivelEsperado > atual){

                    gap += nivelEsperado-atual;

                    treinamentosGap.push(
                        habilidades[index]
                    );

                }

            });

            return{

                colaborador,

                score:
                    avaliacao.length
                    ? soma/avaliacao.length
                    : 0,

                gap,

                treinamentosGap

            };

        }).sort((a,b)=>{

            if(b.score !== a.score){

                return b.score-a.score;

            }

            return a.gap-b.gap;

        });

    }

};