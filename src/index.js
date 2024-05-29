import express from 'express';
import UsuariosController from './controlles/UsuariosController.js';
import ContaBancariaController from './controlles/ContaBancariaController.js';
import ReceitaController from './controlles/ReceitaController.js';
import CentroCustoController from './controlles/CentroCustoController.js';
import LancamentosController from './controlles/LancamentoController.js';


const port = 3000;

const app = express();
app.use(express.json());

const usuariosController = new UsuariosController;

app.get('/usuario', usuariosController.listar);
app.get('/usuario/:id', usuariosController.pesquisar);
app.post('/usuario', usuariosController.adicionar);
app.put('/usuario', usuariosController.atualizar);
app.delete('/usuario/:id', usuariosController.excluir);

const contaBancariaController = new ContaBancariaController;

app.get('/contaBancaria', contaBancariaController.listar);
app.get('/contaBancaria/:idConta', contaBancariaController.pesquisar);
app.post('/contaBancaria', contaBancariaController.adicionar);
app.put('/contaBancaria', contaBancariaController.atualizar);

const receitaControllerController = new ReceitaController;

app.get('/receita', receitaControllerController.listar);
app.get('/receita/:idReceita', receitaControllerController.pesquisar);
app.post('/receita', receitaControllerController.adicionar);
app.put('/receita', receitaControllerController.atualizar);

const centroCustoController = new CentroCustoController;

app.get('/centroCusto', centroCustoController.listar);
app.get('/centroCusto/:idCentroCusto', centroCustoController.pesquisar);
app.post('/centroCusto', centroCustoController.adicionar);
app.put('/centroCusto', centroCustoController.atualizar);

const lancamentoController = new LancamentosController

app.get('/lancamento', lancamentoController.listar);
app.post('/lancamento', lancamentoController.adicionar);
app.put('/lancamento', lancamentoController.atualizar);
app.delete('/lancamento', lancamentoController.excluir);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});