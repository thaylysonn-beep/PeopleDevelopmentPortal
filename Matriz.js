const ModuloMatriz = {


    abrir(usuario,banco){


        const colaboradores =

            banco.colaboradores || [];



        const habilidades =

            banco.habilidades || [];



        const avaliacoes =

            banco.avaliacoes || {};



        const matrizEsperada =

            banco.matrizEsperada || {};





        let html = `



        <div class="portal">



            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">

                        M

                    </div>


                    <div>


                        <h2>

                            Matriz de Habilidades

                        </h2>



                        <span>

                            Área:

                            ${usuario.area || "-"}

                        </span>



                    </div>


                </div>


            </header>






            <nav class="menu">


                <button class="ativo">


                    🎯 Matriz


                </button>




                <button id="btnDashboard">


                    📊 Dashboard


                </button>



            </nav>






            <section class="conteudo">





                <div class="card">



                    <h3>


                        Avaliação de Competências


                    </h3>





                    <table>



                        <thead>



                            <tr>



                                <th>

                                    Colaborador

                                </th>




                                <th>

                                    Cargo

                                </th>




                                ${habilidades.map(h=>`


                                    <th>

                                        ${h}

                                    </th>


                                `).join("")}



                            </tr>



                        </thead>




                        <tbody>


`;
            colaboradores.forEach(colaborador=>{


                const esperado =

                    matrizEsperada[colaborador.cargo] || [];



                const atual =

                    avaliacoes[colaborador.id] ||

                    habilidades.map(()=>0);




                html += `



                    <tr>



                        <td>


                            ${colaborador.nome || "-"}


                        </td>




                        <td>


                            ${colaborador.cargo || "-"}


                        </td>




                `;





                habilidades.forEach((habilidade,index)=>{


                    const nivelAtual =

                        Number(atual[index]) || 0;



                    const nivelEsperado =

                        Number(esperado[index]) || 0;




                    const gap =

                        Math.max(

                            0,

                            nivelEsperado - nivelAtual

                        );




                    html += `



                        <td>



                            <div class="nivelBox">



                                <span>


                                    Atual:

                                    ${nivelAtual}


                                </span>




                                <span>


                                    Meta:

                                    ${nivelEsperado}


                                </span>




                                <span class="gap">


                                    GAP:

                                    ${gap}


                                </span>



                            </div>



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





                <div class="card">


                    <h3>


                        Evoluir Avaliação


                    </h3>





                    <label>


                        Selecione o colaborador:



                    </label>




                    <select id="cmbColaborador">



                        <option value="">


                            Escolha...


                        </option>





                        ${colaboradores.map(c=>`


                            <option value="${c.id}">


                                ${c.nome}


                            </option>



                        `).join("")}



                    </select>





                    <div id="areaAvaliacao">


                    </div>



                </div>



            </section>



        </div>



`;

        UI.carregar(html);




        const btnDashboard =

            document.getElementById("btnDashboard");




        if(btnDashboard){


            btnDashboard.onclick = ()=>{


                ModuloDashboard.abrir(

                    usuario,

                    banco

                );


            };


        }






        const cmbColaborador =

            document.getElementById("cmbColaborador");






        const areaAvaliacao =

            document.getElementById("areaAvaliacao");






        if(cmbColaborador){



            cmbColaborador.onchange = ()=>{



                const id =

                    Number(

                        cmbColaborador.value

                    );




                if(!id){


                    areaAvaliacao.innerHTML = "";


                    return;


                }






                const colaborador =

                    colaboradores.find(

                        c=>c.id===id

                    );






                if(!colaborador) return;







                const avaliacaoAtual =

                    avaliacoes[id] ||

                    habilidades.map(()=>0);







                areaAvaliacao.innerHTML = `




                    <h4>


                        ${colaborador.nome}


                    </h4>






                    <div class="formAvaliacao">




                    ${habilidades.map((habilidade,index)=>`



                        <div class="campoNivel">



                            <label>


                                ${habilidade}


                            </label>





                            <input



                                type="number"



                                min="0"



                                max="4"



                                value="${avaliacaoAtual[index] || 0}"



                                data-habilidade="${index}"



                            >




                        </div>



                    `).join("")}






                    </div>







                    <button id="btnSalvarAvaliacao">


                        💾 Salvar Avaliação


                    </button>




                `;







                const btnSalvar =

                    document

                    .getElementById(

                        "btnSalvarAvaliacao"

                    );







                btnSalvar.onclick = ()=>{





                    const novosValores = [];






                    document

                    .querySelectorAll(

                        "#areaAvaliacao input"

                    )

                    .forEach(input=>{



                        novosValores.push(



                            Number(input.value) || 0



                        );



                    });








                    banco.avaliacoes[id] =

                        novosValores;







                    alert(

                        "Avaliação salva com sucesso!"

                    );







                    ModuloMatriz.abrir(

                        usuario,

                        banco

                    );





                };





            };




        }



    }



};