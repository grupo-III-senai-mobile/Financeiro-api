import ConexaoMySql from '../database/ConexaoMySql.js';

class LancamentosController {
  async listar(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = `
        SELECT l.*, cc.*, r.*, cb.* 
        FROM lancamento l
        JOIN centroCusto cc ON l.centroCustoId = cc.id
        JOIN receita r ON l.receitaId = r.id
        JOIN contaBancaria cb ON l.contaBancariaId = cb.id
      `;
      const [resultado] = await conexao.execute(sql);

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
        JOIN centroCusto cc ON l.centroCustoId = cc.id
        JOIN receita r ON l.receitaId = r.id
        JOIN contaBancaria cb ON l.contaBancariaId = cb.id
        WHERE id = ?
      `;
        const [resultado] = await conexao.execute(sql, [id]);

        if (resultado.length === 0) {
            resp.status(404).send({ message: 'Lançamento não encontrado' });
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

    if (!novoLancamento.lancamentoTipo || !novoLancamento.descricao || isNaN(Number(novoLancamento.valor)) || !novoLancamento.dataVencimento || 
    isNaN(Number(novoLancamento.centroCustoId)) || isNaN(Number(novoLancamento.receitaId)) || isNaN(Number(novoLancamento.contaBancariaId))) {
      resp.status(400).send('Os campos lancamentoTipo, descricao, valor, data, centroCustoId, receitaId e contaBancariaId são obrigatórios.');
      return;
    }

    if (novoLancamento.lancamentoTipo !== "Pagamento" && novoLancamento.lancamentoTipo !== "Recebimento"){
      resp.status(400).send('O campo lancamentoTipo só aceita (Pagamento ou Recebimento).');
      return;
    }

    const conexao = await new ConexaoMySql().getConexao();
    const sql = 'INSERT INTO lancamento (lancamentoTipo, descricao, valor, dataVencimento, receitaId, centroCustoId, contaBancariaId) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [resultado] = await conexao.execute(sql, [
      novoLancamento.lancamentoTipo,
      novoLancamento.descricao,
      novoLancamento.valor,
      novoLancamento.dataVencimento,
      novoLancamento.receitaId,
      novoLancamento.centroCustoId,
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
          !lancamentoEditar.centroCustoId || !lancamentoEditar.receitaId || !lancamentoEditar.contaBancariaId) {
        resp.status(400).send('Todos os campos são obrigatórios para atualizar.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'UPDATE lancamento SET descricao = ?, valor = ?, dataVencimento = ?, centroCustoId = ?, receitaId = ?, contaBancariaId = ? WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [
        lancamentoEditar.descricao,
        lancamentoEditar.valor,
        lancamentoEditar.dataVencimento,
        lancamentoEditar.centroCustoId,
        lancamentoEditar.receitaId,
        lancamentoEditar.contaBancariaId,
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
      const [resultado] = await conexao.execute(sql, [+req.params.id]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default LancamentosController;
