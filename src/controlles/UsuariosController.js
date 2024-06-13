import ConexaoMySql from "../database/ConexaoMySql.js";

class UsuariosController {
  async listar(req, resp) {
    try {
      const filtro = req.query.filtro || "";
      const conexao = await new ConexaoMySql().getConexao();
      const sql = "SELECT * FROM usuario WHERE nome LIKE ?";
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

  async pesquisar(req, resp) {
    try {
      const id = req.params.id;
      const conexao = await new ConexaoMySql().getConexao();
      const sql = "SELECT * FROM usuario WHERE id = ?";
      const [resultado] = await conexao.execute(sql, [id]);

      if (resultado.length === 0) {
        resp.status(404).send({ message: "Usuario não encontrado" });
        return;
      }

      resp.send({ resultado: resultado[0] });
    } catch (error) {
      resp.status(500).send(error.message);
    }
  }

  async adicionar(req, resp) {
    try {
      const novoUsuario = req.body;

      if (
        !novoUsuario.nome ||
        !novoUsuario.email ||
        !novoUsuario.senha ||
        isNaN(Number(novoUsuario.cpf)) ||
        !novoUsuario.dtNascimento ||
        !novoUsuario.estado ||
        !novoUsuario.cidade ||
        !novoUsuario.bairro ||
        !novoUsuario.rua ||
        isNaN(Number(novoUsuario.numero))
      ) {
        resp
          .status(400)
          .send(
            "Os campos nome, e-mail, senha, CPF, data de nascimento, estado, cidade, bairro, rua e numero são obrigatórios."
          );
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql =
        "INSERT INTO usuario (nome, email, senha, cpf, dtNascimento, estado, cidade, bairro, rua, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        novoUsuario.numero,
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    const usuarioEditar = req.body;
    const usuarioId = +req.params.id;
  
    if (
      !usuarioEditar.nome ||
      !usuarioEditar.email ||
      !usuarioEditar.estado ||
      !usuarioEditar.cidade ||
      !usuarioEditar.bairro ||
      !usuarioEditar.rua ||
      isNaN(Number(usuarioEditar.numero))
    ) {
      resp.status(400).send("Os campos nome, email, senha, estado, cidade, bairro, rua e número são obrigatórios para atualizar.");
      return;
    }
  
    let conexao;
    try {
      conexao = await new ConexaoMySql().getConexao();
  
      const sql = `
        UPDATE usuario 
        SET nome = ?, email = ?, estado = ?, cidade = ?, bairro = ?, rua = ?, numero = ? 
        WHERE id = ?`;
    
      const [resultado] = await conexao.execute(sql, [
        usuarioEditar.nome,
        usuarioEditar.email,
        usuarioEditar.estado,
        usuarioEditar.cidade,
        usuarioEditar.bairro,
        usuarioEditar.rua,
        usuarioEditar.numero,
        usuarioId
      ]);
  
      if (resultado.affectedRows > 0) {
        resp.status(200).send("Usuário atualizado com sucesso.");
      } else {
        resp.status(404).send("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      resp.status(500).send("Erro ao atualizar o usuário.");
    } finally {
      if (conexao) {
        try {
          await conexao.end();
        } catch (error) {
          console.error("Erro ao fechar a conexão com o banco de dados:", error);
        }
      }
    }
  }
  
  
  


  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = "DELETE FROM usuario WHERE id = ?";
      const [resultado] = await conexao.execute(sql, [+req.params.id]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default UsuariosController;
