import ConexaoMySql from '../database/ConexaoMySql.js';

class CentroCustoController {
    async listar(req, resp) {
        try {
            const filtro = req.query.filtro || '';
            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'SELECT * FROM centroCusto WHERE nome LIKE ?';
            const [resultado] = await conexao.execute(sql, [`%${filtro}%`]);

            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async pesquisar(req, resp) {
        try {
            const id = req.params.id;
            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'SELECT * FROM centroCusto WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [id]);

            if (resultado.length === 0) {
                resp.status(404).send({ message: 'Centro de custo não encontrado' });
                return;
            }

            resp.send({ resultado: resultado[0] });
        } catch (error) {
            resp.status(500).send(error.message);
        }
    }

    async adicionar(req, resp) {
        try {
            const novoCentroCusto = req.body;

            if (!novoCentroCusto.nome) {
                resp.status(400).send('O campo nome é obrigatório.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            let sql = 'INSERT INTO centroCusto (nome';
            let placeholders = '?';
            const values = [novoCentroCusto.nome];

            if (novoCentroCusto.cpf && !isNaN(Number(novoCentroCusto.cpf))) {
                sql += ', cpf';
                placeholders += ', ?';
                values.push(novoCentroCusto.cpf);
            }
            if (novoCentroCusto.email) {
                sql += ', email';
                placeholders += ', ?';
                values.push(novoCentroCusto.email);
            }

            sql += `) VALUES (${placeholders})`;
            const [resultado] = await conexao.execute(sql, values);
            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async atualizar(req, resp) {
    try {
        const centroCustoEditar = req.body;
        const centroId = +req.params.id;

        if (!centroCustoEditar.nome) {
            resp.status(400).send('O campo nome deve ser obrigatóriamente atualizado.');
            return;
        }

        const conexao = await new ConexaoMySql().getConexao();
        const sql = 'UPDATE centroCusto SET nome = ? WHERE id = ?';
        const [resultado] = await conexao.execute(sql, [
            centroCustoEditar.nome,
            centroId.id,
        ]);


        resp.send({ resultado });
    } catch (error) {
        resp.status(500).send(error);
    }
}

async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'DELETE FROM centroCusto WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [+req.params.id]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

}

export default CentroCustoController;
