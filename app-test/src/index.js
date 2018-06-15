import React from 'react';
import ReactDOM from 'react-dom';
import Cadastro from './views/Cadastro';
import Pagas from './views/Pagas';
import Home from './views/Home';
import App from './App';
import Login from './Login';
import Logout from './Logout';
import Classificar from './views/Classificar';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import './index.css';
import ContasBox from './views/Contas';
import Agendamentos from './views/Agendamentos';

function verificaAutenticacao(nextState,replace) {
	if(localStorage.getItem('auth-token') === null){
	  replace('/?msg=você precisa estar logado para acessar o endereço');
	}
  }

ReactDOM.render(
  (<Router history={browserHistory}>
  	<Route path="/" component={Login}/>
  	<Route path="/home" component={App} onEnter={verificaAutenticacao}>
  		<IndexRoute component={Home}/>
	  	<Route path="/cadastro" component={Cadastro}/>
	  	<Route path="/cadastro/:userId" component={Cadastro}/>
	  	<Route path="/pagas" component={Pagas}/>
	  	<Route path="/agendamentos" component={Agendamentos}/>
	  	<Route path="/contas" component={ContasBox}/>
	  	<Route path="/classificacao" component={Classificar}/>
  	</Route>
  	<Route path="/logout" component={Logout}/>
  </Router>),
  document.getElementById('root')
);