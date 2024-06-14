import ConexaoMySql from '../database/ConexaoMySql.js';

class LancamentosController {
  async listar(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = `
        SELECT l.*, 
               cc.nome as cc_nome, cc.cpf as cc_cpf, cc.email as cc_email, 
               r.nome as r_nome, r.cpf as r_cpf, r.email as r_email, 
               cb.nome as cb_nome, cb.conta as cb_conta, cb.agencia as cb_agencia 
        FROM lancamento l
        LEFT JOIN centroCusto cc ON l.centroCustoId = cc.id
        LEFT JOIN receita r ON l.receitaId = r.id
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
      const date = new Date();
  
      // Validação básica dos campos obrigatórios
      if (!novoLancamento.lancamentoTipo || !novoLancamento.descricao || isNaN(Number(novoLancamento.valor)) || !novoLancamento.dataVencimento || !novoLancamento.contaBancariaId) {
        resp.status(400).send('Os campos lancamentoTipo, descricao, valor, dataVencimento e contaBancariaId são obrigatórios.');
        return;
      }
  
      // Validação do tipo de lançamento
      if (novoLancamento.lancamentoTipo !== "Pagamento" && novoLancamento.lancamentoTipo !== "Recebimento") {
        resp.status(400).send('O campo lancamentoTipo só aceita (Pagamento ou Recebimento).');
        return;
      }
  
      // Validação condicional para receitaId e centroCustoId
      if (novoLancamento.lancamentoTipo === "Pagamento" && !novoLancamento.centroCustoId) {
        resp.status(400).send('O campo centroCustoId é obrigatório para lançamentos do tipo Pagamento.');
        return;
      }
  
      if (novoLancamento.lancamentoTipo === "Recebimento" && !novoLancamento.receitaId) {
        resp.status(400).send('O campo receitaId é obrigatório para lançamentos do tipo Recebimento.');
        return;
      }
  
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'INSERT INTO lancamento (lancamentoTipo, descricao, valor, dataVencimento, receitaId, centroCustoId, contaBancariaId) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const [resultado] = await conexao.execute(sql, [
        novoLancamento.lancamentoTipo,
        novoLancamento.descricao,
        novoLancamento.valor,
        novoLancamento.dataVencimento,
        novoLancamento.lancamentoTipo === 'Recebimento' ? novoLancamento.receitaId : null,
        novoLancamento.lancamentoTipo === 'Pagamento' ? novoLancamento.centroCustoId : null,
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
      const lancamentoId = +req.params.id

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
        lancamentoId.id
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
