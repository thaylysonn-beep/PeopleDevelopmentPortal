
const PDIExportar = {


    exportar(banco){


        const colaboradores =
            banco.colaboradores || [];


        const habilidades =
            banco.habilidades || [];


        const avaliacoes =
            banco.avaliacoes || {};


        const matrizEsperada =
            banco.matrizEsperada || {};



        let csv =
        "\uFEFFÁrea;Colaborador;Cargo;Data da Avaliação;Score;Atingimento;Situação;GAP;Competências GAP\n";



        colaboradores.forEach(colaborador=>{


            const esperado =
                matrizEsperada[colaborador.cargo] || [];


            const avaliacao =
                avaliacoes[colaborador.id] || [];



            const niveisAtuais =
                Array.isArray(avaliacao)
                    ? avaliacao
                    : (avaliacao.niveis || []);



            const area =
                colaborador.area ||
                colaborador.área ||
                "";



            const dataAvaliacao =
                Array.isArray(avaliacao)
                    ? ""
                    : (avaliacao.data ||
                       avaliacao.dataAvaliacao ||
                       "");



            let score = 0;


            let totalEsperado = 0;


            let quantidadeGaps = 0;


            const competenciasGap = [];



            habilidades.forEach((habilidade,index)=>{


                const atual =
                    Number(niveisAtuais[index]) || 0;


                const nivelEsperado =
                    Number(esperado[index]) || 0;


                const gap =
                    nivelEsperado - atual;



                score += Math.min(atual, nivelEsperado);


                totalEsperado += nivelEsperado;



                if(gap > 0){


                    quantidadeGaps++;


                    competenciasGap.push(habilidade);


                }


            });



            const atingimento =
                totalEsperado > 0
                    ? ((score / totalEsperado) * 100).toFixed(1) + "%"
                    : "0%";



            const situacao =
                quantidadeGaps > 0
                    ? "Com GAP"
                    : "Sem GAP";



            const campos = [

                area,

                colaborador.nome,

                colaborador.cargo,

                dataAvaliacao,

                score,

                atingimento,

                situacao,

                quantidadeGaps,

                competenciasGap.join(", ")

            ];



            csv +=

                campos.map(valor =>

                    `"${String(valor ?? "").replace(/"/g, '""')}"`

                ).join(";") + "\n";



        });



        const blob =

        new Blob(

            [csv],

            {
                type:
                "text/csv;charset=utf-8;"
            }

        );



        const url =
            URL.createObjectURL(blob);



        const link =
            document.createElement("a");



        link.href = url;


        link.download =
        "Relatorio_PDI.csv";


        link.click();



        URL.revokeObjectURL(url);


    }


};


