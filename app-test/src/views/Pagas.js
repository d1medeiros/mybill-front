import React,{Component} from 'react';
import TableModelPagas from '../componentes/Table';
import PubSub from 'pubsub-js';
import ActionMenu from '../componentes/ActionMenu';
import TotalValue from '../componentes/TotalValue';
import HeaderTotal from '../componentes/HeaderTotal';
import Submenu from '../componentes/Submenu';


export default class Pagas extends Component{

    constructor(){
        super();
        this.state = {
            lista: [], 
            listaGastos: [], 
            listaGanho: [], 
            totalGastos: 0, 
            totalGanho: 0, 
            mes: '', 
            mesValor:0, 
            anoValor:0,
            trSelecionadaGastos:0,
            trSelecionadaGanho:0,
            mensagem: ''
        };
        this.getNextContasPorMes = this.getNextContasPorMes.bind(this);
        this.getPrevContasPorMes = this.getPrevContasPorMes.bind(this);
        this.maxMes = 11;
        this.minMes = 0;
        this.url = 'http://localhost:8080/paid';
    }
    
    componentDidMount(){  
        
        console.log("didMount", this.props);
        
        this.getContas();
        
        PubSub.subscribe('atualiza',function(topico,index){
            var novaLista = this.state.lista.filter(x => x.id !== index);
            this.setState(this.prepareComponent(novaLista));
        }.bind(this));
        
        PubSub.subscribe('popup.confirmar',function(topico,obj){
            var conta = obj.conta;
            this.removerConta(conta, true);
            
        }.bind(this));
        

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

    parseDateFromAPI(date){
        return new Date(date.split('-'));
    }

    prepareComponent(listaCompras, mesEscolhido, anoEscolhido){
        var info = {};
        info.lista = listaCompras;

        var  data = new Date();
        info.mes = mesEscolhido ? mesEscolhido : data.getMonth();
        info.ano = anoEscolhido ? anoEscolhido : data.getFullYear();

        info.listaGastos = listaCompras
            .filter(conta => this.filtraGastosPorTipoMesAno.call(this, conta, info.mes, info.ano));
        
        info.totalGastos = info.listaGastos.length ? info.listaGastos.map(conta => conta.price).reduce((acc, price) => acc + price) : 0.0;

        info.listaGanho = listaCompras
            .filter(conta => this.filtraGanhoPorTipoMesAno.call(this, conta, info.mes, info.ano));

        info.totalGanho = info.listaGanho.length ? info.listaGanho.map(conta => conta.price).reduce((acc, price) => acc + price) : 0.0;

        return info;
    }

    filtraGastosPorTipoMesAno(conta, mes, ano){
        return conta.billType === 'GASTOS'
            && mes === this.parseDateFromAPI(conta.payday).getMonth()
            && ano === this.parseDateFromAPI(conta.payday).getFullYear()
    }
    
    filtraGanhoPorTipoMesAno(conta, mes, ano){
        return conta.billType === 'GANHO'
            && mes === this.parseDateFromAPI(conta.payday).getMonth()
            && ano === this.parseDateFromAPI(conta.payday).getFullYear()
    }

    moverContasPorMes(mes, ano){
        this.setState(this.prepareComponent(this.state.lista, mes, ano));
    }

    getNextContasPorMes(event){

        var ano = this.state.ano;
        var previous = this.state.mes;
        if (this.state.mes === this.maxMes){
            ano += 1;
            previous = this.minMes;
        }else{
            previous += 1;
        }
            
        event.preventDefault();
        this.moverContasPorMes(previous, ano);
    }
    
    getPrevContasPorMes(event){
                
        var ano = this.state.ano;
        var previous = this.state.mes;
        if (this.state.mes === this.minMes){
            ano -= 1;
            previous = this.maxMes;
        }else{
            previous -= 1;
        }

        event.preventDefault();  
        this.moverContasPorMes(previous, ano);
    }

    removerConta(conta){
        var requisicao = {};
        requisicao.method = 'DELETE';
        requisicao.mode = 'cors';
        requisicao.headers = new Headers({ 'Content-type' : 'application/json', 'token' : localStorage.getItem('auth-token') });
        fetch(`${this.url}/${conta.id}`, requisicao)
            .then(res => {
                PubSub.publish('atualiza', conta.id);
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
            
            <Submenu nome="Contas Pagas" />
            <HeaderTotal totalGanho={this.state.totalGanho} totalGastos={this.state.totalGastos} />
            <div className="content is-center">
            
                {/* botao prev next */}
                <ActionMenu rota="/cadastro" prev={this.getPrevContasPorMes.bind(this)} next={this.getNextContasPorMes.bind(this)}/>
                

                {/* tabela gastos */}
                <div id="div-gastos" className="pure-g gastos">
                    <div className="pure-u-5-5">
                        <TableModelPagas tipo="GASTOS"
                                  lista={this.state.listaGastos} 
                                  selecao={this.state.trSelecionadaGastos} 
                                  onClick={this.removerConta.bind(this)} 
                                  mes={this.state.mes}
                                  ano={this.state.ano}/>
                    </div>
                </div>
                
                {/* total gastos */}
                <TotalValue total={this.state.totalGastos} />


                {/* tabela ganho */}
                <div id="div-ganho" className="pure-g ganho">
                    <div className="pure-u-5-5">
                        <TableModelPagas tipo="GANHO"
                                  lista={this.state.listaGanho} 
                                  selecao={this.state.trSelecionadaGanho} 
                                  onClick={this.removerConta.bind(this)}
                                  mes={this.state.mes}
                                  ano={this.state.ano}/>
                    </div>
                </div>
                
                {/* total ganho */}
                <TotalValue total={this.state.totalGanho} />

            </div>

        </div>

        );
    }

}

