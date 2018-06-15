import React,{Component} from 'react';
import PubSub from 'pubsub-js';
import ActionMenu from '../componentes/ActionMenu';
import TotalValue from '../componentes/TotalValue';
import HeaderTotal from '../componentes/HeaderTotal';
import Submenu from '../componentes/Submenu';
import { TableAgendadas } from '../componentes/Table';


export default class Agendamentos extends Component{

    constructor(){
        super();
        this.state = {
            lista: [], 
            listaGastos: [], 
            listaGanho: [], 
            totalGastos: 0, 
            totalGanho: 0, 
            dia: 0, 
            mensal: false,
            trSelecionadaGastos:0,
            trSelecionadaGanho:0,
            mensagem: ''
        };
        this.url = 'http://localhost:8080/schedule';
    }

    getContas(){
        var requisicao = {};
        requisicao.method = 'GET';
        requisicao.headers = new Headers({ 'Content-type' : 'application/json', 'token' : localStorage.getItem('auth-token') })
        fetch(this.url, requisicao)
            .then(res => {
                if(res.ok){
                    return  res.json();
                }else{
                    throw new Error('não foi possível fazer o login');
                }
            }).then(resp => {
                this.setState(this.prepareComponent(resp));
            }).catch(error => {
                this.setState({
                    mensagem: error.message
                });
            });
    }

    componentDidMount(){  

        console.log("didMount", this.props);

        this.getContas();

        PubSub.subscribe('atualiza.agendadas',function(topico,index){
            var novaLista = this.state.lista.filter(x => x.id !== index);
            this.setState(this.prepareComponent(novaLista));
        }.bind(this));

        PubSub.subscribe('popup.confirmar.agendadas',function(topico,obj){
            var conta = obj.conta;
            this.removerConta(conta, true);
            
        }.bind(this));


    }

    prepareComponent(listaCompras){
        var info = {};
        info.lista = listaCompras;

        info.listaGastos = listaCompras.filter(conta => conta.billType === 'GASTOS');
        info.totalGastos = info.listaGastos.length ? info.listaGastos.map(conta => conta.price).reduce((acc, price) => acc + price) : 0.0;

        info.listaGanho = listaCompras.filter(conta => conta.billType === 'GANHO');
        info.totalGanho = info.listaGanho.length ? info.listaGanho.map(conta => conta.price).reduce((acc, price) => acc + price) : 0.0;

        return info;
    }

    removerConta(conta){
        var requisicao = {};
        requisicao.method = 'DELETE';
        requisicao.mode = 'cors';
        requisicao.headers = new Headers({ 'Content-type' : 'application/json', 'token' : localStorage.getItem('auth-token') });
        fetch(`${this.url}/${conta.id}`, requisicao)
            .then(res => {
                PubSub.publish('atualiza.agendadas', conta.id);
            }).catch(error => {
                this.setState({
                    mensagem: error.message
                });
            });
    }


    render(){
        console.log(this.state);

        return(

        <div>
            
            <Submenu nome="Contas Agendadas" />
            <HeaderTotal totalGanho={this.state.totalGanho} totalGastos={this.state.totalGastos} />
            <div className="content is-center">
            
                {/* botao prev next */}
                <ActionMenu rota="" />
                

                {/* tabela gastos */}
                <div id="div-gastos" className="pure-g gastos">
                    <div className="pure-u-5-5">
                        <TableAgendadas tipo="GASTOS"
                            titulo="GASTOS"
                            lista={this.state.listaGastos} 
                            selecao={this.state.trSelecionadaGastos} 
                            onClick={this.removerConta.bind(this)} 
                            />
                    </div>
                </div>
                
                {/* total gastos */}
                <TotalValue total={this.state.totalGastos} />


                {/* tabela ganho */}
                <div id="div-ganho" className="pure-g ganho">
                    <div className="pure-u-5-5">
                        <TableAgendadas tipo="GANHO"
                            titulo="GANHO"
                            lista={this.state.listaGanho} 
                            selecao={this.state.trSelecionadaGanho} 
                            onClick={this.removerConta.bind(this)} 
                            />
                    </div>
                </div>
                
                {/* total ganho */}
                <TotalValue total={this.state.totalGanho} />

            </div>

        </div>

        );
    }

}

