
const PDIExportar = {

    exportar(banco) {
        const colaboradores = banco.colaboradores || [];
        const habilidades = banco.habilidades || [];
        const avaliacoes = banco.avaliacoes || {};
        const matrizEsperada = banco.matrizEsperada || {};

        const escaparCSV = (valor) => {
            const texto = valor == null ? "" : String(valor);
            return `"${texto.replace(/"/g, '""')}"`;
        };

        let csv = "\uFEFFÁrea;Colaborador;Cargo;Data da Avaliação;Score;Atingimento;Situação;GAP;Competências GAP\n";

        colaboradores.forEach((colaborador) => {
            const esperado = matrizEsperada[colaborador.cargo] || [];
            const avaliacao = avaliacoes[colaborador.id] || [];

            const niveisAtuais = Array.isArray(avaliacao)
                ? avaliacao
                : (avaliacao.niveis || []);

            const dataAvaliacao = Array.isArray(avaliacao)
                ? ""
                : (avaliacao.data || avaliacao.dataAvaliacao || "");

            const scoreInformado = Array.isArray(avaliacao)
                ? null
                : (avaliacao.score ?? avaliacao.Score ?? null);

            const atingimentoInformado = Array.isArray(avaliacao)
                ? null
                : (avaliacao.atingimento ?? avaliacao.Atingimento ?? null);

            let totalEsperado = 0;
            let totalAtual = 0;
            const competenciasGAP = [];

            habilidades.forEach((habilidade, index) => {
                const atual = Number(niveisAtuais[index]) || 0;
                const nivelEsperado = Number(esperado[index]) || 0;

                totalEsperado += nivelEsperado;
                totalAtual += Math.min(atual, nivelEsperado);

                const gap = Math.max(0, nivelEsperado - atual);

                if (gap > 0) {
                    competenciasGAP.push(
                        `${habilidade} (Atual: ${atual}, Esperado: ${nivelEsperado}, GAP: ${gap})`
                    );
                }
            });

            const score = scoreInformado ?? totalAtual;
            const atingimento = atingimentoInformado ??
                (totalEsperado > 0
                    ? `${((totalAtual / totalEsperado) * 100).toFixed(1).replace(".", ",")}%`
                    : "0%");

            const situacao = competenciasGAP.length === 0
                ? "Sem GAP"
                : "Com GAP";

            const area = colaborador.area || colaborador.área || "";

            const linha = [
                area,
                colaborador.nome || "",
                colaborador.cargo || "",
                dataAvaliacao,
                score,
                atingimento,
                situacao,
                competenciasGAP.length,
                competenciasGAP.join(" | ")
            ];

            csv += linha.map(escaparCSV).join(";") + "\n";
        });

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Relatorio_PDI.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
};
