import React,{Component} from 'react';
import {Link} from 'react-router';
import FaPlus from 'react-icons/lib/fa/plus';
import TRContas from './componentes/TRContas';
import Verificar from './util/Verificar';
import PubSub from 'pubsub-js';

class Contas extends Component{

    constructor(props){
        super(props);
        this.state = {
            listaGastos: [], 
            listaGanho: [], 
            totalGastos: 0, 
            totalGanho: 0, 
            mes: '', 
            mesValor:0, 
            anoValor:0,
            trSelecionadaGastos:0,
            trSelecionadaGanho:0

        };
        this.getNextContasPorMes = this.getNextContasPorMes.bind(this);
        this.getPrevContasPorMes = this.getPrevContasPorMes.bind(this);
        // console.log("construtor");
    }

    componentDidMount(){  
        // console.log("didMount");

        // new Verificar().verifica();

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
                this.setState(this.sucessoAjax(resp));
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
            });


        PubSub.subscribe('atualiza.gastos',function(topico,index){
            var newList = this.state.listaGastos.filter(x => x.id !== index);
            this.setState({listaGastos: newList});
        }.bind(this));

        PubSub.subscribe('atualiza.ganho',function(topico,index){
            var newList = this.state.listaGanho.filter(x => x.id !== index);
            this.setState({listaGanho: newList});
        }.bind(this));

        PubSub.subscribe('popup.confirmar',function(topico,obj){
            console.log(topico);
            var conta = obj.conta;
            var tipo = obj.tipo;
            console.log(conta + ' - ' + tipo);
            
            if(tipo === 'GASTOS'){
                this.removerGastos(conta, true);
            }else if(tipo === 'GANHO'){
                this.removerGanho(conta, true);
            }
        }.bind(this));

        PubSub.subscribe('popup.recusar',function(topico,obj){
            console.log(topico);
            var conta = obj.conta;
            var tipo = obj.tipo;
            console.log(conta, tipo);
            
            if(tipo === 'GASTOS'){
                this.removerGastos(conta, false);
            }else if(tipo === 'GANHO'){
                this.removerGanho(conta, false);
            }
        }.bind(this));

    }

    componentWillMount(){
        // console.log("willMount");
    }   
    
    componentWillUnmount(){}

    sucessoAjax(resp){
        var mesGastos = '';
        var mesTemp = 0;
        var anoTemp = 0;
        var totalGastosTemp = 0;  
        var totalGanhoTemp = 0;  

        console.log('Response', resp)
        
        var  data = new Date();
        
        var listaGastosAtualizada = resp.filter(function(conta){
            var isGastos = conta.billType === 'GASTOS'
            if(isGastos){
                totalGastosTemp += conta.price;
            }
            return isGastos;
        });
        
        
        var listaGanhoAtualizada = resp.filter(function(conta){
            var isGanho = conta.billType === 'GANHO'
            if(isGanho){
                totalGanhoTemp += conta.price;
            }
            return isGanho;
        });

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        mesTemp = data.getMonth() + 1;
        anoTemp = data.getFullYear();
        mesGastos = monthNames[data.getMonth()];

        return {
              listaGastos: listaGastosAtualizada,
              listaGanho: listaGanhoAtualizada,
              totalGastos:totalGastosTemp,
              totalGanho:totalGanhoTemp,
              mes: mesGastos,
              mesValor: mesTemp,
              anoValor: anoTemp
          };
    }

    getNextContasPorMes(event){
        event.preventDefault();  
        var isOk = false;
        var mes = this.state.mesValor;
        var ano = this.state.anoValor;
        
        mes++;
        if(mes >= 1 && mes <= 12){
            isOk = true;
        }else if (mes > 12){
            ano++;
            mes = 1;
            isOk = true;
        }else{
            isOk = false;
        }
        
        console.log("depois de mudar -> next mes - ano " + mes + ' - ' + ano);
        if(isOk){
            var paramDate = mes + '-' + ano
           
            const url = "http://meuorcamentoec2.com:8080/meuorcamento/api/conta/mesano/" + paramDate;
            const req = {
                method: 'GET',
                headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') })
            }
            fetch(url, req)
                .then(res => {
                    if(res.ok){
                        return  res.json();
                    }else{
                        throw new Error('não foi possível fazer o login');
                    }
                }).then(resp => {
                    this.setState(this.sucessoAjax(resp));
                }).catch(error => {
                    this.setState({
                        msg: error.message
                    });
                });
                
            }
    }
        
    getPrevContasPorMes(event){
            event.preventDefault();  
            var isOk = false;
            var mes = this.state.mesValor;
            var ano = this.state.anoValor;
            
            mes--;
            if(mes >= 1 && mes <= 12){
                isOk = true;
            }else if (mes < 1){
                ano--;
                mes = 12;
                isOk = true;
            }else{
                isOk = false;
            }
            
            console.log("next mes - ano " + mes + ' - ' + ano);
            if(isOk){
                var paramDate = mes + '-' + ano
                const url = "http://meuorcamentoec2.com:8080/meuorcamento/api/conta/mesano/" + paramDate;
                const req = {
                    method: 'GET',
                    headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') })
                }
                fetch(url, req)
                    .then(res => {
                        if(res.ok){
                            return  res.json();
                        }else{
                            throw new Error('não foi possível fazer o login');
                        }
                    }).then(resp => {
                        this.setState(this.sucessoAjax(resp));
                    }).catch(error => {
                        this.setState({
                            msg: error.message
                        });
                    });
        }
    }

    removerGastos(conta, pTodos){
        
        var param = "";
        if(pTodos){
            param = "todos/" + conta.id;
        }else{
            param = conta.id;
        }
        
        console.log("Removendo " + param);

        const url = 'http://meuorcamentoec2.com:8080/meuorcamento/api/conta/remove/' + param;
        const req = {
            method: 'POST',
            headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') })
        }

        fetch(url, req)
            .then(res => {
                    PubSub.publish('atualiza.gastos', conta.id);
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
            });
    }

    removerGanho(conta, pTodos){
        
        var param = "";
        if(pTodos){
            param = "todos/" + conta.id;
        }else{
            param = conta.id;
        }
        
        console.log("Removendo " + param);

        const url = 'http://meuorcamentoec2.com:8080/meuorcamento/api/conta/remove/' + param;
        const req = {
            method: 'POST',
            headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') })
        }

        fetch(url, req)
            .then(res => {
                    PubSub.publish('atualiza.ganho', conta.id);
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
            });

    }



    render(){
        // console.log("render");
        console.log(this.state);

        var total = this.state.totalGanho - this.state.totalGastos; 
        var positivoOuNegativo = total > 0 ? "positivo" : "negativo";

        return(

        <div>
        
            <div className="is-center">
                <h3>Contas</h3>
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
                                  onClick={this.removerGastos.bind(this)} 
                                  mes={this.state.mes}/>
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
                                  onClick={this.removerGanho.bind(this)}
                                  mes={this.state.mes}/>
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