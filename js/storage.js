const Storage = {

    fileHandle: null,

    // =====================================================
    // SELECIONAR BANCO
    // =====================================================

    async selecionarBanco() {

        try {

            const [handle] =
                await window.showOpenFilePicker({

                    types: [
                        {
                            description: "Banco de Dados",

                            accept: {
                                "application/json": [".json"]
                            }
                        }
                    ],

                    multiple: false

                });


            this.fileHandle = handle;


            const permission =
                await this.fileHandle.requestPermission({
                    mode: "readwrite"
                });


            if (permission === "granted") {

                await this.salvarHandle(
                    this.fileHandle
                );


                localStorage.setItem(
                    "bancoAutorizado",
                    "true"
                );


                console.log(
                    "Banco autorizado e salvo."
                );


                return true;

            }


            return false;

        }
        catch (error) {

            console.error(
                "Erro ao selecionar banco:",
                error
            );

            return false;

        }

    },


    // =====================================================
    // SALVAR HANDLE NO NAVEGADOR
    // =====================================================

    async salvarHandle(handle) {

        return new Promise(
            (resolve, reject) => {

                const request =
                    indexedDB.open(
                        "PeopleDevelopmentPortal",
                        1
                    );


                request.onupgradeneeded =
                    function(event) {

                        const db =
                            event.target.result;


                        if (
                            !db.objectStoreNames.contains(
                                "config"
                            )
                        ) {

                            db.createObjectStore(
                                "config"
                            );

                        }

                    };


                request.onsuccess =
                    function(event) {

                        const db =
                            event.target.result;


                        const transaction =
                            db.transaction(
                                ["config"],
                                "readwrite"
                            );


                        const store =
                            transaction.objectStore(
                                "config"
                            );


                        store.put(
                            handle,
                            "bancoHandle"
                        );


                        transaction.oncomplete =
                            function() {

                                db.close();

                                resolve(true);

                            };


                        transaction.onerror =
                            function() {

                                db.close();

                                reject(
                                    transaction.error
                                );

                            };

                    };


                request.onerror =
                    function() {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    // =====================================================
    // RECUPERAR HANDLE SALVO
    // =====================================================

    async recuperarHandle() {

        return new Promise(
            (resolve, reject) => {

                const request =
                    indexedDB.open(
                        "PeopleDevelopmentPortal",
                        1
                    );


                request.onupgradeneeded =
                    function(event) {

                        const db =
                            event.target.result;


                        if (
                            !db.objectStoreNames.contains(
                                "config"
                            )
                        ) {

                            db.createObjectStore(
                                "config"
                            );

                        }

                    };


                request.onsuccess =
                    function(event) {

                        const db =
                            event.target.result;


                        const transaction =
                            db.transaction(
                                ["config"],
                                "readonly"
                            );


                        const store =
                            transaction.objectStore(
                                "config"
                            );


                        const requestHandle =
                            store.get(
                                "bancoHandle"
                            );


                        requestHandle.onsuccess =
                            function() {

                                const handle =
                                    requestHandle.result ||
                                    null;


                                db.close();


                                resolve(handle);

                            };


                        requestHandle.onerror =
                            function() {

                                db.close();


                                reject(
                                    requestHandle.error
                                );

                            };

                    };


                request.onerror =
                    function() {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    // =====================================================
    // VERIFICAR PERMISSÃO
    // =====================================================

    async verificarPermissao(handle) {

        if (!handle) {

            return false;

        }


        try {

            const permission =
                await handle.queryPermission({
                    mode: "readwrite"
                });


            if (permission === "granted") {

                return true;

            }


            const novaPermissao =
                await handle.requestPermission({
                    mode: "readwrite"
                });


            return (
                novaPermissao === "granted"
            );

        }
        catch (error) {

            console.error(
                "Erro verificando permissão:",
                error
            );

            return false;

        }

    },


    // =====================================================
    // CARREGAR BANCO
    // =====================================================

    async carregarBanco() {

        try {

            // Se ainda não temos o handle,
            // tenta recuperar do navegador.

            if (!this.fileHandle) {

                this.fileHandle =
                    await this.recuperarHandle();

            }


            if (!this.fileHandle) {

                return null;

            }


            const autorizado =
                await this.verificarPermissao(
                    this.fileHandle
                );


            if (!autorizado) {

                console.warn(
                    "Banco não autorizado."
                );

                return null;

            }


            const file =
                await this.fileHandle.getFile();


            const texto =
                await file.text();


            return JSON.parse(texto);

        }
        catch (error) {

            console.error(
                "Erro carregando banco:",
                error
            );

            return null;

        }

    },


    // =====================================================
    // SALVAR BANCO
    // =====================================================

    async salvarBanco(banco) {

        try {

            // Se perdeu o handle,
            // tenta recuperar do navegador.

            if (!this.fileHandle) {

                this.fileHandle =
                    await this.recuperarHandle();

            }


            if (!this.fileHandle) {

                console.error(
                    "Nenhum banco autorizado."
                );

                return false;

            }


            const autorizado =
                await this.verificarPermissao(
                    this.fileHandle
                );


            if (!autorizado) {

                console.error(
                    "Sem permissão para salvar banco."
                );

                return false;

            }


            const writable =
                await this.fileHandle.createWritable();


            await writable.write(
                JSON.stringify(
                    banco,
                    null,
                    4
                )
            );


            await writable.close();


            console.log(
                "Banco salvo com sucesso!"
            );


            return true;

        }
        catch (error) {

            console.error(
                "Erro salvando banco:",
                error
            );

            return false;

        }

    }

};