import cors from 'cors';
import express from 'express';
import UsuariosController from './controlles/UsuariosController.js';
import ContaBancariaController from './controlles/ContaBancariaController.js';
import ReceitaController from './controlles/ReceitaController.js';
import CentroCustoController from './controlles/CentroCustoController.js';
import LancamentosController from './controlles/LancamentoController.js';
import AutenticacaoController from './controlles/AutenticacaoController.js';


const port = 3000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

const logarcontroller = new AutenticacaoController;

app.post('/logar', logarcontroller.logar);

const usuariosController = new UsuariosController;

app.get('/usuario', usuariosController.listar);
app.get('/usuario/:id', usuariosController.pesquisar);
app.post('/usuario', usuariosController.adicionar);
app.put('/usuario/:id', usuariosController.atualizar);
app.delete('/usuario/:id', usuariosController.excluir);

const contaBancariaController = new ContaBancariaController;

app.get('/contaBancaria', contaBancariaController.listar);
app.get('/contaBancaria/:id', contaBancariaController.pesquisar);
app.post('/contaBancaria', contaBancariaController.adicionar);
app.put('/contaBancaria/:id', contaBancariaController.atualizar);
app.delete('/contaBancaria/:id', contaBancariaController.excluir);

const receitaControllerController = new ReceitaController;

app.get('/receita', receitaControllerController.listar);
app.get('/receita/:id', receitaControllerController.pesquisar);
app.post('/receita', receitaControllerController.adicionar);
app.put('/receita', receitaControllerController.atualizar);
app.delete('/receita/:id', receitaControllerController.excluir);

const centroCustoController = new CentroCustoController;

app.get('/centroCusto', centroCustoController.listar);
app.get('/centroCusto/:id', centroCustoController.pesquisar);
app.post('/centroCusto', centroCustoController.adicionar);
app.put('/centroCusto', centroCustoController.atualizar);
app.delete('/centroCusto/:id', centroCustoController.excluir);

const lancamentoController = new LancamentosController

app.get('/lancamento', lancamentoController.listar);
app.get('/lancamento/:id', lancamentoController.pesquisar);
app.post('/lancamento', lancamentoController.adicionar);
app.put('/lancamento', lancamentoController.atualizar);
app.delete('/lancamento/:id', lancamentoController.excluir);


app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});