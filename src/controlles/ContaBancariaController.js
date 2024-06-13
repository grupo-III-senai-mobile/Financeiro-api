import ConexaoMySql from '../database/ConexaoMySql.js';

class ContaBancariaController {
    async listar(req, resp) {
        try {
            const filtro = req.query.filtro || '';
            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'SELECT * FROM contaBancaria WHERE nome LIKE ?';
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
            const sql = 'SELECT * FROM contaBancaria WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [id]);

            if (resultado.length === 0) {
                resp.status(404).send({ message: 'Conta bancaria não encontrada' });
                return;
            }

            resp.send({ resultado: resultado[0] });
        } catch (error) {
            resp.status(500).send(error.message);
        }
    }


    async adicionar(req, resp) {
        try {
            const novaContaBancaria = req.body;

            if (!novaContaBancaria.nome || isNaN(Number(novaContaBancaria.agencia)) || isNaN(Number(novaContaBancaria.conta))) {

                resp.status(400).send('Os campos nome, agencia e conta são obrigatórios.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'INSERT INTO contaBancaria (nome, agencia, conta) VALUES (?, ?, ?)';
            const [resultado] = await conexao.execute(sql, [
                novaContaBancaria.nome,
                novaContaBancaria.agencia,
                novaContaBancaria.conta,
            ]);

            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async atualizar(req, resp) {
        try {
            const contaBancariaEditar = req.body;
            const contaId = +req.params.id;

            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'UPDATE contaBancaria SET agencia = ?, conta = ? WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [
                contaBancariaEditar.agencia,
                contaBancariaEditar.conta,
                contaId.id,
            ]);


            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async excluir(req, resp) {
        try {
          const conexao = await new ConexaoMySql().getConexao();
          const sql = 'DELETE FROM contaBancaria WHERE id = ?';
          const [resultado] = await conexao.execute(sql, [+req.params.id]);
    
          resp.send(resultado);
        } catch (error) {
          resp.status(500).send(error);
        }
      }

}

export default ContaBancariaController;
