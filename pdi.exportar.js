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
        "\uFEFFColaborador;Cargo;Treinamento;Nivel Atual;Nivel Esperado;GAP\n";



        colaboradores.forEach(colaborador=>{


            const esperado =
                matrizEsperada[colaborador.cargo] || [];


            const avaliacao =
                avaliacoes[colaborador.id] || [];



            habilidades.forEach((habilidade,index)=>{


                const atual =
                    Number(avaliacao[index]) || 0;


                const nivelEsperado =
                    Number(esperado[index]) || 0;


                const gap =
                    nivelEsperado - atual;



                if(gap > 0){


                    csv +=

`"${colaborador.nome}";"${colaborador.cargo}";"${habilidade}";"${atual}";"${nivelEsperado}";"${gap}"\n`;


                }


            });


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