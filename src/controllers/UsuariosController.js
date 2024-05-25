import ConexaoMySql from '../database/ConexaoMySql.js';

class UsuariosController {
  async listar(req, resp) {
    try {
      const filtro = req.query.filtro || '';
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'SELECT * FROM usuario WHERE nome LIKE ?';
      const [resultado] = await conexao.execute(sql, [`%${filtro}%`]);

      resp.send(
        resultado.map((u) => {
          delete u.senha;
          delete u.id;
          return u;
        })
      );
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async adicionar(req, resp) {
    try {
      const novoUsuario = req.body;

      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha || !novoUsuario.cpf || !novoUsuario.dtNascimento) {
        resp.status(400).send('Os campos nome, email, senha, cpf e data de nascimento são obrigatórios.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'INSERT INTO usuario (nome, email, senha, cpf, dtNascimento, estado, cidade, bairro, rua, numero) VALUES (?,?,md5(?),?,?,?,?,?,?,?)';
      const [resultado] = await conexao.execute(sql, [
        novoUsuario.nome,
        novoUsuario.email,
        novoUsuario.senha,
        novoUsuario.cpf,
        novoUsuario.dtNascimento,
        novoUsuario.estado,
        novoUsuario.cidade,
        novoUsuario.bairro,
        novoUsuario.rua,
        novoUsuario.numero
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const usuarioEditar = req.body;

      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha|| !novoUsuario.estado || !novoUsuario.cidade || !novoUsuario.bairro || !novoUsuario.rua || !novoUsuario.numero) {
        resp.status(400).send('Todos os campos são obrigatórios para atualizar.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'UPDATE usuario SET nome = ?, email = ?, senha = ?, estado = ?, cidade = ?, bairro = ?, rua = ? numero = ?, WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [
        usuarioEditar.nome,
        usuarioEditar.email,
        novoUsuario.senha,
        novoUsuario.estado,
        novoUsuario.cidade,
        novoUsuario.bairro,
        novoUsuario.rua,
        novoUsuario.numero,
        usuarioEditar.id,
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'DELETE FROM usuario WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [+req.params.idUsuario]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default UsuariosController;
