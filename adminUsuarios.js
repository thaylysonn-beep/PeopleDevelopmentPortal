const ModuloAdminUsuarios = {


    abrir(usuario, banco){


        let html = `


        <div class="portal">


            <header class="topo">


                <div class="logo-area">


                    <div class="logo-box">
                        👥
                    </div>


                    <div>

                        <h2>
                        Gerenciar Usuários
                        </h2>


                        <span>
                        Administração
                        </span>

                    </div>


                </div>



                <button
                id="btnVoltarUsuarios"
                class="btnSecundario">

                ← Voltar

                </button>


            </header>





            <section class="conteudo">


            <div class="card">


            <div class="cabecalho-matriz">


            <h3>
            Usuários cadastrados
            </h3>


            <button
            id="btnNovoUsuario"
            class="btnAcao">

            + Novo Usuário

            </button>


            </div>





            <div class="tabela-container">


            <table>


            <thead>

            <tr>

            <th>
            Nome
            </th>

            <th>
            Perfil
            </th>

            <th>
            Área
            </th>

            <th>
            Ação
            </th>

            </tr>


            </thead>


            <tbody>



        `;



        banco.usuarios.forEach((u,index)=>{


            html += `


            <tr>


            <td>
            ${u.nome}
            </td>


            <td>
            ${u.perfil}
            </td>


            <td>
            ${u.area}
            </td>



            <td>


            <button
            class="btnEditarUsuario"
            data-index="${index}"
            >

            ✏️

            </button>




            <button
            class="btnExcluirUsuario"
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
        .getElementById("btnVoltarUsuarios")
        .onclick = ()=>{


            ModuloAdmin.abrir(
                usuario,
                banco
            );


        };




        document
        .getElementById("btnNovoUsuario")
        .onclick = ()=>{


            this.novo(
                usuario,
                banco
            );


        };





        document
        .querySelectorAll(".btnEditarUsuario")
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
        .querySelectorAll(".btnExcluirUsuario")
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






    montarAreas(banco,selecionada){


        let html = "";



        banco.areas.forEach(area=>{


            html += `


            <option

            value="${area.nome}"

            ${area.nome === selecionada ? "selected":""}

            >

            ${area.nome}

            </option>


            `;


        });



        return html;


    },






    novo(usuario,banco){


        let nome =
        prompt(
        "Nome do usuário:"
        );



        if(!nome)
        return;



        let perfil =
        prompt(
        "Perfil (ADMIN ou GESTOR):",
        "GESTOR"
        );



        if(
            perfil !== "ADMIN" &&
            perfil !== "GESTOR"
        ){


            alert(
            "Perfil inválido"
            );


            return;


        }





        let area = "TODAS";



        if(perfil === "GESTOR"){


            area =

            prompt(

            "Área do usuário:",

            banco.areas[0].nome

            );


        }





        let senha =
        prompt(
        "Senha:"
        );



        if(!senha)
        return;





        banco.usuarios.push({


            nome,

            perfil,

            area,

            senha


        });





        Storage.salvarBanco(banco);



        this.abrir(
            usuario,
            banco
        );


    },








    editar(usuario,banco,index){



        const u =
        banco.usuarios[index];



        let nome =
        prompt(
        "Nome:",
        u.nome
        );



        if(!nome)
        return;





        let perfil =
        prompt(

        "Perfil (ADMIN ou GESTOR):",

        u.perfil

        );




        let area =
        u.area;




        if(perfil === "GESTOR"){


            area =

            prompt(

            "Área:",

            u.area

            );


        }
        else{


            area="TODAS";


        }





        let senha =

        prompt(

        "Senha:",

        u.senha

        );





        u.nome =
        nome;


        u.perfil =
        perfil;


        u.area =
        area;


        u.senha =
        senha;





        Storage.salvarBanco(banco);



        this.abrir(
            usuario,
            banco
        );



    },








    excluir(usuario,banco,index){



        const u =
        banco.usuarios[index];





        if(
            u.perfil === "ADMIN" &&
            u.area === "TODAS"
        ){


            alert(

            "O administrador principal não pode ser excluído."

            );


            return;


        }






        const confirmar =

        confirm(

        `Deseja excluir ${u.nome}?`

        );





        if(confirmar){



            banco.usuarios.splice(
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