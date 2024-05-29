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
            const sql = 'SELECT * FROM usuario WHERE id = ?';
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
            const contaBancariaEditar = req.body;

            if (!contaBancariaEditar.nome || isNaN(Number(contaBancariaEditar.agencia)) || isNaN(Number(contaBancariaEditar.conta))) {

                resp.status(400).send('Os campos nome, agencia e conta são obrigatórios.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'INSERT INTO contaBancaria (nome, agencia, conta) VALUES (?, ?, ?)';
            const [resultado] = await conexao.execute(sql, [
                contaBancariaEditar.nome,
                contaBancariaEditar.agencia,
                contaBancariaEditar.conta,
            ]);

            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async atualizar(req, resp) {
        try {
            const contaBancariaEditar = req.body;

            if (isNaN(Number(contaBancariaEditar.agencia)) || isNaN(Number(contaBancariaEditar.conta))) {
                resp.status(400).send('Os campos agencia e conta são obrigatórios para atualizar.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'UPDATE contaBancaria SET agencia = ?, conta = ? WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [
                contaBancariaEditar.agencia,
                contaBancariaEditar.conta,
                contaBancariaEditar.id,
            ]);


            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

}

export default ContaBancariaController;
