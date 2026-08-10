const ModuloAdmin = {


    abrir(usuario, banco){

console.log("BANCO NO ADMIN:", banco);
        let html = `


        <div class="portal">


            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">
                        ⚙️
                    </div>


                    <div>

                        <h2>
                        Painel Administrativo
                        </h2>


                        <span>
                        Administrador: ${usuario.nome}
                        </span>


                    </div>


                </div>



                <div class="acoes-topo">


                    <button
                    id="btnVoltarAdmin"
                    class="btnSecundario">

                    ← Voltar

                    </button>


                </div>


            </header>





            <section class="conteudo">



                <div class="dashboardCards">



                    <!-- USUÁRIOS -->

                    <div class="card">


                        <h3>
                        👥 Usuários
                        </h3>


                        <strong>
                        ${banco.usuarios.length}
                        </strong>


                        <p>
                        Usuários cadastrados
                        </p>


                        <button
                        id="btnUsuarios"
                        class="btnAcao">

                        Gerenciar

                        </button>


                    </div>





                    <!-- ÁREAS -->

                    <div class="card">


                        <h3>
                        🏭 Áreas
                        </h3>


                        <strong>
                        ${banco.areas.length}
                        </strong>


                        <p>
                        Áreas cadastradas
                        </p>


                        <button
                        id="btnAreas"
                        class="btnAcao">

                        Gerenciar

                        </button>


                    </div>





                    <!-- MATRIZES -->

                    <div class="card">


                        <h3>
                        🎯 Matrizes
                        </h3>


                        <strong>
                        ${banco.areas.length}
                        </strong>


                        <p>
                        Matrizes por área
                        </p>


                        <button
                        id="btnMatrizes"
                        class="btnAcao">

                        Acessar

                        </button>


                    </div>






                    <!-- PDI -->

                    <div class="card">


                        <h3>
                        📊 Relatórios
                        </h3>


                        <strong>
${
Object.values(banco.matrizesPorArea)
.reduce((total, area)=>{

    return total +
        ((area.colaboradores || []).length);

},0)
}
</strong>


                        <p>
                        Planos de desenvolvimento
                        </p>


                        <button
                        id="btnPDIAdmin"
                        class="btnAcao">

                        Acessar

                        </button>


                    </div>





                </div>




            </section>



        </div>


        `;




        UI.carregar(html);






        // VOLTAR

        document
        .getElementById("btnVoltarAdmin")
        .onclick = ()=>{


            mostrarLogin();


        };







        // USUÁRIOS

        document
        .getElementById("btnUsuarios")
        .onclick = ()=>{


            ModuloAdminUsuarios.abrir(
                usuario,
                banco
            );


        };







        // ÁREAS

        document
        .getElementById("btnAreas")
        .onclick = ()=>{


            ModuloAdminAreas.abrir(
                usuario,
                banco
            );


        };







        // MATRIZES

        document
        .getElementById("btnMatrizes")
        .onclick = ()=>{


            ModuloAdminMatrizes.abrir(
                usuario,
                banco
            );


        };








        // PDI

        document
        .getElementById("btnPDIAdmin")
        .onclick = ()=>{


            ModuloPDI.abrir(
                usuario,
                banco
            );


        };



    }


};