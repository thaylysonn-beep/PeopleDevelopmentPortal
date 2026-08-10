const ModuloAdminAreas = {


    abrir(usuario, banco){


        let html = `


        <div class="portal">


            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">
                        🏭
                    </div>


                    <div>

                        <h2>
                        Gerenciar Áreas
                        </h2>


                        <span>
                        Administração
                        </span>


                    </div>


                </div>



                <button
                id="btnVoltarAreas"
                class="btnSecundario">

                ← Voltar

                </button>


            </header>





            <section class="conteudo">


            <div class="card">


                <div class="cabecalho-matriz">


                    <h3>
                    Áreas cadastradas
                    </h3>



                    <button
                    id="btnNovaArea"
                    class="btnAcao">

                    + Nova Área

                    </button>


                </div>





                <div class="tabela-container">


                <table>


                <thead>


                <tr>


                <th>
                Área
                </th>


                <th>
                Meta
                </th>


                <th>
                Ação
                </th>


                </tr>


                </thead>



                <tbody>


        `;



        banco.areas.forEach((area,index)=>{


            html += `


            <tr>


                <td>
                ${area.nome}
                </td>


                <td>
                ${area.meta}
                </td>


                <td>


                <button

                class="btnEditarArea"

                data-index="${index}"

                >

                ✏️

                </button>



                <button

                class="btnExcluirArea"

                data-index="${index}"

                >

                🗑️

                </button>



                </td>


            </tr>


            `;


        });





        html += `


                </tbody>


                </table>


                </div>


            </div>


            </section>


        </div>


        `;




        UI.carregar(html);




        document
        .getElementById("btnVoltarAreas")
        .onclick = ()=>{


            ModuloAdmin.abrir(
                usuario,
                banco
            );


        };





        document
        .getElementById("btnNovaArea")
        .onclick = ()=>{


            this.nova(
                usuario,
                banco
            );


        };






        document
        .querySelectorAll(".btnEditarArea")
        .forEach(botao=>{


            botao.onclick = ()=>{


                this.editar(

                    usuario,

                    banco,

                    Number(
                    botao.dataset.index
                    )

                );


            };


        });





        document
        .querySelectorAll(".btnExcluirArea")
        .forEach(botao=>{


            botao.onclick = ()=>{


                this.excluir(

                    usuario,

                    banco,

                    Number(
                    botao.dataset.index
                    )

                );


            };


        });



    },







    nova(usuario,banco){



        let nome =
        prompt(
        "Nome da nova área:"
        );



        if(!nome)
        return;





        let meta =
        prompt(
        "Meta de score (0 a 4):",
        "4"
        );



        meta =
        Number(meta);




        banco.areas.push({


            id:

            Date.now(),


            nome,


            meta


        });





        banco.matrizesPorArea[nome] = {

    cargos: [],
    habilidades: [],
    matrizEsperada: {},
    colaboradores: [],
    avaliacoes: {}

};




        Storage.salvarBanco(banco);



        this.abrir(
            usuario,
            banco
        );


    },







editar(usuario,banco,index){

    const area = banco.areas[index];

    const nomeAntigo = area.nome;

    let nome = prompt(
        "Nome da área:",
        area.nome
    );

    if(!nome) return;

    let meta = prompt(
        "Meta:",
        area.meta
    );

    if(meta === null) return;

    meta = Number(meta);

    area.nome = nome;
    area.meta = meta;

    // Atualiza a chave da matriz
    if(nomeAntigo !== nome){

        banco.matrizesPorArea[nome] =
            banco.matrizesPorArea[nomeAntigo];

        delete banco.matrizesPorArea[nomeAntigo];

        // Atualiza os usuários da área
        banco.usuarios.forEach(u => {

            if(u.area === nomeAntigo){

                u.area = nome;

            }

        });

    }

    Storage.salvarBanco(banco);

    this.abrir(usuario,banco);

},









    excluir(usuario,banco,index){



        const area =
        banco.areas[index];





    const possuiColaborador =

    banco.matrizesPorArea[area.nome] &&
    banco.matrizesPorArea[area.nome].colaboradores &&
    banco.matrizesPorArea[area.nome].colaboradores.length > 0;





        if(possuiColaborador){


            alert(

            "Esta área possui colaboradores cadastrados."

            );


            return;


        }






        if(

        confirm(

        `Excluir área ${area.nome}?`

        )

        ){



            delete banco.matrizesPorArea[area.nome];



            banco.areas.splice(
                index,
                1
            );



            Storage.salvarBanco(banco);



            this.abrir(
                usuario,
                banco
            );


        }



    }


};