import ConexaoMySql from '../database/ConexaoMySql.js';

class ReceitaController {
    async listar(req, resp) {
        try {
            const filtro = req.query.filtro || '';
            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'SELECT * FROM receita WHERE nome LIKE ?';
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
            const sql = 'SELECT * FROM receita WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [id]);

            if (resultado.length === 0) {
                resp.status(404).send({ message: 'Receita não encontrada' });
                return;
            }

            resp.send({ resultado: resultado[0] });
        } catch (error) {
            resp.status(500).send(error.message);
        }
    }

    async adicionar(req, resp) {
        try {
            const novaReceita = req.body;

            if (!novaReceita.nome) {
                resp.status(400).send('O campo nome é obrigatório.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            let sql = 'INSERT INTO receita (nome';
            let placeholders = '?';
            const values = [novaReceita.nome];

            if (novaReceita.cpf && !isNaN(Number(novaReceita.cpf))) {
                sql += ', cpf';
                placeholders += ', ?';
                values.push(novaReceita.cpf);
            }
            if (novaReceita.email) {
                sql += ', email';
                placeholders += ', ?';
                values.push(novaReceita.email);
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
            const receitaEditar = req.body;

            if (!receitaEditar.nome) {
                resp.status(400).send('O campo nome deve ser obrigatóriamente atualizado.');
                return;
            }

            const conexao = await new ConexaoMySql().getConexao();
            const sql = 'UPDATE receita SET nome = ? WHERE id = ?';
            const [resultado] = await conexao.execute(sql, [
                receitaEditar.nome,
                receitaEditar.id,
            ]);


            resp.send({ resultado });
        } catch (error) {
            resp.status(500).send(error);
        }
    }

    async excluir(req, resp) {
        try {
          const conexao = await new ConexaoMySql().getConexao();
          const sql = 'DELETE FROM receita WHERE id = ?';
          const [resultado] = await conexao.execute(sql, [+req.params.id]);
    
          resp.send(resultado);
        } catch (error) {
          resp.status(500).send(error);
        }
      }

}

export default ReceitaController;
