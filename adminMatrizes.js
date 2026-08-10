const ModuloAdminMatrizes = {


    abrir(usuario, banco){


        let html = `


        <div class="portal">


            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">
                        🎯
                    </div>


                    <div>

                        <h2>
                        Gerenciar Matrizes
                        </h2>


                        <span>
                        Administração
                        </span>


                    </div>


                </div>



                <button
                id="btnVoltarMatrizes"
                class="btnSecundario">

                ← Voltar

                </button>


            </header>





            <section class="conteudo">


                <div class="card">


                    <h3>
                    Selecionar Área
                    </h3>



                    <br>


                    <select id="selectAreaMatriz">


        `;



        banco.areas.forEach(area=>{


            html += `


            <option value="${area.nome}">

            ${area.nome}

            </option>


            `;


        });



        html += `


                    </select>



                    <br><br>



                    <button
                    id="btnAbrirMatrizArea"
                    class="btnAcao">

                    Abrir Matriz

                    </button>



                </div>


            </section>


        </div>


        `;



        UI.carregar(html);





        document
        .getElementById("btnVoltarMatrizes")
        .onclick = ()=>{


            ModuloAdmin.abrir(
                usuario,
                banco
            );


        };





        document
        .getElementById("btnAbrirMatrizArea")
        .onclick = ()=>{


            const area =

            document
            .getElementById("selectAreaMatriz")
            .value;



            this.editarMatriz(

                usuario,

                banco,

                area

            );


        };


    },







    editarMatriz(usuario,banco,area){


        let matriz =

        banco.matrizesPorArea[area];



        if(!matriz){


            matriz = {


                cargos: [],


                matrizEsperada:{}


            };


            banco.matrizesPorArea[area]=matriz;


        }





        let html = `


        <div class="portal">


            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">
                        🎯
                    </div>


                    <div>

                        <h2>
                        Matriz - ${area}
                        </h2>


                        <span>
                        Administração
                        </span>


                    </div>


                </div>



                <button
                id="btnVoltarEditorMatriz"
                class="btnSecundario">

                ← Voltar

                </button>



            </header>





            <section class="conteudo">


            <div class="card">


            <h3>
            Habilidades
            </h3>



            <p>

            Edite os níveis esperados por cargo.

            </p>



            <div class="tabela-container">


            <table>


            <thead>

            <tr>


            <th>
            Habilidade
            </th>


        `;




        banco.cargos.forEach(cargo=>{


            html += `


            <th>
            ${cargo}
            </th>


            `;


        });





        html += `


            </tr>


            </thead>


            <tbody>


        `;




        banco.habilidades.forEach((hab,index)=>{


            html += `


            <tr>


            <td>
            ${hab}
            </td>


            `;



            banco.cargos.forEach(cargo=>{


                let valor = 0;



                if(

                    matriz.matrizEsperada[cargo]

                    &&

                    matriz.matrizEsperada[cargo][index]

                    !== undefined

                ){

                    valor =

                    matriz.matrizEsperada[cargo][index];


                }



                html += `


                <td>


                <select

                class="nivelMatriz"

                data-cargo="${cargo}"

                data-index="${index}"


                >


                ${[0,1,2,3,4].map(n=>`

                <option value="${n}"
                ${valor===n?"selected":""}>

                ${n}

                </option>

                `).join("")}


                </select>


                </td>


                `;


            });



            html += `


            </tr>


            `;


        });





        html += `


            </tbody>


            </table>


            </div>


            <br>


            <button
            id="btnSalvarMatrizArea"
            class="btnAcao">

            💾 Salvar Matriz

            </button>



            </div>


            </section>


        </div>


        `;



        UI.carregar(html);





        document
        .getElementById("btnVoltarEditorMatriz")
        .onclick = ()=>{


            this.abrir(
                usuario,
                banco
            );


        };





        document
        .getElementById("btnSalvarMatrizArea")
        .onclick = ()=>{


            banco.matrizesPorArea[area] = matriz;



            Storage.salvarBanco(banco);



            alert(
            "Matriz salva com sucesso"
            );


        };



    }


};