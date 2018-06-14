import React,{Component} from 'react';
import {Link} from 'react-router';
import FaPlus from 'react-icons/lib/fa/plus';
import TRContas from './componentes/TRContas';
import PubSub from 'pubsub-js';
// import queryString from 'query-string';

class Contas extends Component{

    constructor(props){
        super(props);
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
    }

    componentDidMount(){  
        // console.log("didMount");

        const url = 'http://localhost:8080/paid';
        const req = {
            method: 'GET',
            headers: new Headers({ 'Content-type' : 'application/json', 'token' : localStorage.getItem('auth-token') })
        }
        fetch(url, req)
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


        PubSub.subscribe('atualiza',function(topico,index){
            var novaLista = this.state.lista.filter(x => x.id !== index);
            this.setState(this.prepareComponent(novaLista));
        }.bind(this));

        PubSub.subscribe('popup.confirmar',function(topico,obj){
            var conta = obj.conta;
            this.removerConta(conta, true);
            
        }.bind(this));


    }

    parseDateFromAPI(date){
        return new Date(date.split('-'));
    }

    prepareComponent(resposta, mesEscolhido, anoEscolhido){
        var info = {};
        info.lista = resposta;

        var  data = new Date();
        info.mes = mesEscolhido ? mesEscolhido : data.getMonth();
        info.ano = anoEscolhido ? anoEscolhido : data.getFullYear();

        info.listaGastos = resposta
            .filter(conta => this.filtraGastosPorTipoMesAno.call(this, conta, info.mes, info.ano));
        
        info.totalGastos = info.listaGastos.length ? info.listaGastos.map(conta => conta.price).reduce((acc, price) => acc + price) : 0.0;

        info.listaGanho = resposta
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
        const url = `http://localhost:8080/paid/${conta.id}`;
        const req = {
            method: 'DELETE'
            , mode: 'cors'
            , headers: new Headers({ 'Content-type' : 'application/json', 'token' : localStorage.getItem('auth-token') })
        }
        fetch(url, req)
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

        var total = this.state.totalGanho - this.state.totalGastos; 
        var positivoOuNegativo = total > 0 ? "positivo" : "negativo";

        return(

        <div>
        
            <div className="is-center">
                <h3>Contas Pagas</h3>
            </div>

            <div className={ positivoOuNegativo + " is-center" } id="total">Saldo: R$ {total} </div>

            <div className="content is-center">
            
                {/* botao prev next */}
                <div className="pure-g">
                    <div className="pure-u-1-3" id="prev-contas">
                        <p>
                            <button type="submit" className="pure-button" onClick={this.getPrevContasPorMes}>Prev</button>
                        </p>
                    </div>
                    <div className="pure-u-1-3">
                        <p>
                            <Link to="/cadastro" className="pure-button" ><FaPlus/></Link>
                        </p>
                    </div>
                    <div className="pure-u-1-3" id="next-contas">
                        <p>
                            <button type="submit" className="pure-button" onClick={this.getNextContasPorMes}>Next</button>
                        </p>
                    </div>
                </div>

                

                {/* tabela gastos */}
                <div id="div-gastos" className="pure-g gastos">
                    <div className="pure-u-5-5">
                        <TRContas tipo="GASTOS"
                                  lista={this.state.listaGastos} 
                                  selecao={this.state.trSelecionadaGastos} 
                                  onClick={this.removerConta.bind(this)} 
                                  mes={this.state.mes}
                                  ano={this.state.ano}/>
                    </div>
                </div>

                
                {/* total gastos */}
                <div className="pure-g total">
                    <div className="pure-u-2-24"></div>
                    <div className="pure-u-20-24"> 
                        <table className="pure-table pure-table-bordered margin-center">
                            <tbody>
                                <tr>
                                    <td className="header-total">Total</td>
                                    <td>R$ {this.state.totalGastos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pure-u-2-24"></div>
                </div>


                {/* tabela ganho */}
                <div id="div-ganho" className="pure-g ganho">
                    <div className="pure-u-5-5">
                        <TRContas tipo="GANHO"
                                  lista={this.state.listaGanho} 
                                  selecao={this.state.trSelecionadaGanho} 
                                  onClick={this.removerConta.bind(this)}
                                  mes={this.state.mes}
                                  ano={this.state.ano}/>
                    </div>
                </div>

                
                {/* total ganho */}
                <div className="pure-g total">
                    <div className="pure-u-2-24"></div>
                    <div className="pure-u-20-24"> 
                        <table className="pure-table pure-table-bordered margin-center">
                        <tbody>
                            <tr>
                                <td className="header-total">Total</td>
                                <td>R$ {this.state.totalGanho}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div className="pure-u-2-24"></div>
                </div>
               

            </div>

        </div>

        );
    }

}

export default Contas;