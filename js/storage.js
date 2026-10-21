
const Storage = {
    urlLeitura: "https://bf8c86d96bd4e3d995a78be4d4419d.09.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/29/workflows/0ff9d89d5e264ada9a04639abccb4afa/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=J-JXWHMMDoTjvOppHcwJRN3nUU70_lLDwD-Qu4jPJic",
    urlGravacao: "https://bf8c86d96bd4e3d995a78be4d4419d.09.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/24/workflows/0cc215b5586c41a7add3d5e186eb8e5d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gxLr6YMtA3EPKS7VDFpDuPocQDKdXBdAvByH7DY6i4M",

    // =====================================================
    // CARREGAR BANCO PELO POWER AUTOMATE
    // =====================================================
    async carregarBanco() {
        try {
            const resposta = await fetch(this.urlLeitura, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({})
            });

            if (!resposta.ok) {
                throw new Error(`Erro HTTP ${resposta.status}`);
            }

            const banco = await resposta.json();

            if (
                !banco ||
                typeof banco !== "object" ||
                Array.isArray(banco)
            ) {
                throw new Error("O fluxo não retornou um banco válido.");
            }

            console.log("Banco carregado com sucesso.");
            return banco;

        } catch (error) {
            console.error("Erro carregando banco:", error);
            return null;
        }
    },

    // =====================================================
    // SALVAR BANCO PELO POWER AUTOMATE
    // =====================================================
    async salvarBanco(banco) {
        try {
            if (
                !banco ||
                typeof banco !== "object" ||
                Array.isArray(banco)
            ) {
                throw new Error("O banco informado é inválido.");
            }

            const resposta = await fetch(this.urlGravacao, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(banco)
            });

            const texto = await resposta.text();

            if (!resposta.ok) {
                throw new Error(
                    `Erro HTTP ${resposta.status}: ${texto}`
                );
            }

            console.log("Resposta do fluxo:", texto);
            return true;

        } catch (error) {
            console.error("Erro salvando banco:", error);
            return false;
        }
    }
};
