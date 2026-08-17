const Auth = {


    entrar(area, senha, banco){


        const usuario = banco.usuarios.find(u =>

            u.area === area &&
            u.senha === senha

        );


        return usuario || null;


    }


};