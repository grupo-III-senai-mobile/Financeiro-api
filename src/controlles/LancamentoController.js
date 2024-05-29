import ConexaoMySql from '../database/ConexaoMySql.js';

class LancamentosController {
  async listar(req, resp) {
    try {
      const filtro = req.query.filtro || '';
      const conexao = await new ConexaoMySql().getConexao();
      const sql = `
        SELECT l.*, cc.*, r.*, cb.* 
        FROM lancamento l
        JOIN centroCentro cc ON l.centroCustoId = cc.id
        JOIN receita r ON l.receitaId = r.id
        JOIN contaBancaria cb ON l.contaBancariaId = cb.id
      `;
      const [resultado] = await conexao.execute(sql, [`%${filtro}%`]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async pesquisar(req, resp) {
    try {
        const id = req.params.id;
        const conexao = await new ConexaoMySql().getConexao();
        const sql = `
        SELECT l.*, cc.*, r.*, cb.* 
        FROM lancamento l
        JOIN centroCentro cc ON l.centroCustoId = cc.id
        JOIN receita r ON l.receitaId = r.id
        JOIN contaBancaria cb ON l.contaBancariaId = cb.id
        WHERE id = ?
      `;
        const [resultado] = await conexao.execute(sql, [id]);

        if (resultado.length === 0) {
            resp.status(404).send({ message: 'Conta não encontrada' });
            return;
        }

        resp.send({ resultado: resultado[0] });
    } catch (error) {
        resp.status(500).send(error.message);
    }
}

  async adicionar(req, resp) {
    try {
      const novoLancamento = req.body;

      if (!novoLancamento.lancamentoTipo || !novoLancamento.descricao || !novoLancamento.valor || !novoLancamento.data || 
          !novoLancamento.centro_custo_id || !novoLancamento.receita_id || !novoLancamento.conta_bancaria_id) {
        resp.status(400).send('Os campos lancamentoTipo, descricao, valor, data, centroCustoId, receitaId e contaBancariaId são obrigatórios.');
        return;
      }

      if (novoLancamento.lancamentoTipo != "Pagamento" && novoLancamento.lancamentoTipo != "Recebimento"){
        resp.status(400).send('O campo lancamentoTipo só aceita (Pagamento ou Recebimento).');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'INSERT INTO lancamento (lancamentoTipo, descricao, valor, dataVencimento, centroCustoId, receitaId, contaBancariaId) VALUES (?,?,?,?,?,?,?)';
      const [resultado] = await conexao.execute(sql, [
        novoLancamento.lancamentoTipo,
        novoLancamento.descricao,
        novoLancamento.valor,
        novoLancamento.dataVencimento,
        novoLancamento.centroCustoId,
        novoLancamento.receitaId,
        novoLancamento.contaBancariaId
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const lancamentoEditar = req.body;

      if (!lancamentoEditar.id || !lancamentoEditar.descricao || !lancamentoEditar.valor || !lancamentoEditar.data || 
          !lancamentoEditar.centro_custo_id || !lancamentoEditar.receita_id || !lancamentoEditar.conta_bancaria_id) {
        resp.status(400).send('Todos os campos são obrigatórios para atualizar.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'UPDATE lancamento SET descricao = ?, valor = ?, dataVencimento = ?, centroCustoId = ?, receitaId = ?, contaBancariaId = ? WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [
        novoLancamento.descricao,
        novoLancamento.valor,
        novoLancamento.dataVencimento,
        novoLancamento.centroCustoId,
        novoLancamento.receitaId,
        novoLancamento.contaBancariaId,
        lancamentoEditar.id
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'DELETE FROM lancamento WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [+req.params.idLancamento]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default LancamentosController;
