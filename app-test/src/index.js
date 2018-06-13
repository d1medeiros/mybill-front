import React from 'react';
import ReactDOM from 'react-dom';
import Cadastro from './Cadastro';
import Contas from './Contas';
import Home from './Home';
import App from './App';
import Login from './Login';
import Logout from './Logout';
import Classificar from './Classificar';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import './index.css';

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
	  	<Route path="/contas" component={Contas}/>
	  	<Route path="/classificacao" component={Classificar}/>
  	</Route>
  	<Route path="/logout" component={Logout}/>
  </Router>),
  document.getElementById('root')
);