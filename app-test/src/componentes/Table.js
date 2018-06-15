import React,{Component} from 'react';
import Edit from 'react-icons/lib/fa/edit';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import Popup from './Popup';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';



export class Table extends Component{

    constructor(props){
        super(props);
        this.state = {
            trSelecionada: 0, 
            popupRemoverMostrar: false, 
            contaManipulada: {}, 
            tipoConta: ''
        }
    }

    componentDidMount(){
        this.setState({tipoConta: this.props.tipo});
    }

    selecionaConta(event, conta){
        if(this.state.trSelecionada === conta.id){
            this.setState({trSelecionada: 0});
        }else{
            this.setState({trSelecionada: conta.id});
        }
    }

    clickPopup(e, conta){
        this.setState({popupRemoverMostrar: true, contaManipulada: conta});
    }

    popupConfirm(){
        var obj = {conta: this.state.contaManipulada, tipo: this.state.tipoConta};
        PubSub.publish('popup.confirmar', obj);
        this.setState({popupRemoverMostrar: false, contaManipulada: {}});
    }

    popupSair(){
        this.setState({popupRemoverMostrar: false, contaManipulada: {}});
    }

    generateHeaders(){
        var headers = this.props.titulosHeader;
        return(<tr>
            {headers.map((nome, key) => <th key={key}>{nome}</th>)}
            </tr>);
    }

    render(){
        
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var tituloHeader = (this.props.titulo || monthNames[this.props.mes] + ' - ' + this.props.ano)
        return(
                <div>

                    <Popup label="Deseja remover ?" 
                        mostrar={this.state.popupRemoverMostrar} 
                        confirmar={() => this.popupConfirm()} 
                        recusar={() => this.popupSair()} 
                        close={() => this.popupSair()}/>

                    <table className="pure-table table-contas">
                        <thead>
                            <tr className="header-table-name">
                                <th colSpan={this.props.colSpan} id="">{tituloHeader}</th>
                            </tr>
                            {this.generateHeaders()}
                        </thead>
                        <tbody>
                                {this.props.getBodyTable()}
                        </tbody>
                    </table>

                </div>
        );
    };

}

export default class TableModelPagas extends Component{
    
    constructor(){
        super();
        this.titulosHeader = ['nome', 'valor', 'data'];
    }

    getBodyTable(){
        return this.props.lista.map(function(conta){
            return(
                <tr className={conta.estado?"estado-ok":""} id={conta.id === this.props.selecao?"selected":"" } key={conta.id} onClick={e => this.selecionaConta(e, conta)} >
                    <td>
                        <div>{conta.name}</div>
                        <span className={conta.id === this.props.selecao?"show":"hide" } >
                            <Link  className="pure-button button-margin-3" to=""><Edit/></Link>
                            <button type="submit" className="button-error pure-button button-margin-3" onClick={e => this.clickPopup(e, conta)}>
                                <FaTimesCircle/>
                            </button>
                        </span>
                    </td>
                    <td>{conta.price}</td>
                    <td>{conta.payday}</td>
                </tr>  
            );
        }.bind(this));
    }

    render(){
        return(
                <div>

                    <Table lista={this.props.lista} 
                        mes={this.props.mes} 
                        ano={this.props.ano} 
                        selecao={this.props.selecao}   
                        colSpan={this.titulosHeader.length}
                        titulosHeader={this.titulosHeader}
                        getBodyTable={() => this.getBodyTable()}
                        />
                 

                </div>
        );
    };

}

export class TableAgendadas extends Component{
    
    constructor(){
        super();
        this.titulosHeader = ['nome', 'valor', 'data', 'mensal'];
    }

    getBodyTable(){
        return this.props.lista.map(function(conta){
            return(
                <tr className={conta.estado?"estado-ok":""} id={conta.id === this.props.selecao?"selected":"" } key={conta.id} onClick={e => this.selecionaConta(e, conta)} >
                    <td>
                        <div>{conta.name}</div>
                        <span className={conta.id === this.props.selecao?"show":"hide" } >
                            <Link  className="pure-button button-margin-3" to=""><Edit/></Link>
                            <button type="submit" className="button-error pure-button button-margin-3" onClick={e => this.clickPopup(e, conta)}>
                                <FaTimesCircle/>
                            </button>
                        </span>
                    </td>
                    <td>{conta.price}</td>
                    <td>{conta.dayToPay}</td>
                    <td>{conta.monthly ? 'sim' : 'não'}</td>
                </tr>  
            );
        }.bind(this));
    }

    render(){
        return(
                <div>

                    <Table lista={this.props.lista} 
                        titulo={this.props.titulo}
                        mes={this.props.mes} 
                        ano={this.props.ano} 
                        selecao={this.props.selecao}   
                        colSpan={this.titulosHeader.length}
                        titulosHeader={this.titulosHeader}
                        getBodyTable={() => this.getBodyTable()}
                        />
                 

                </div>
        );
    };

}