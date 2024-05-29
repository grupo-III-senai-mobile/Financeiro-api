import ConexaoMySql from '../database/ConexaoMySql.js';

class AutenticacaoController {
  async logar(req, resp) {
    try {
      if (!req.body.email || !req.body.senha) {
        resp.status(400).send('Os campos email e senha são obrigatórios!');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'SELECT * FROM usuario u WHERE email = ? AND senha = md5(?)';
      const [resultado] = await conexao.execute(sql, [req.body.email, req.body.senha]);

      const usuarioEncontradoNoBancoDeDados = resultado[0];

      if (!usuarioEncontradoNoBancoDeDados) {
        resp.status(401).send('Email ou senha incorreta!');
        return;
      }

      delete usuarioEncontradoNoBancoDeDados.senha;
      resp.send(usuarioEncontradoNoBancoDeDados);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default AutenticacaoController;