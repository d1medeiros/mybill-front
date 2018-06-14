import React,{Component} from 'react';
import Edit from 'react-icons/lib/fa/edit';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import Popup from './Popup';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';

export default class TRContas extends Component{
    
    constructor(){
        super();
        this.state = {trSelecionada: 0, 
                        popupRemoverMostrar: false, 
                        contaManipulada: {}, 
                        tipoConta: ''}
        this.selecionaConta = this.selecionaConta.bind(this);
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

    popupRecusar(){
        this.popupSair();
    }

    popupSair(){
        this.setState({popupRemoverMostrar: false, contaManipulada: {}});
    }

    render(){
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // console.log('trcontas', this.state)
        return(
                <div>

                    <Popup label="Deseja remover todos repetidos para o mesmo?" mostrar={this.state.popupRemoverMostrar} 
                    confirmar={this.popupConfirm.bind(this)} recusar={this.popupRecusar.bind(this)} close={this.popupSair.bind(this)}/>

                    <table className="pure-table">
                        <thead>
                            <tr className="header-table-name">
                                <th colSpan="3" id="">{monthNames[this.props.mes] + ' - ' + this.props.ano}</th>
                                
                            </tr>
                            <tr>
                                <th id="tableName">nome</th>
                                <th>valor</th>
                                <th>data</th>
                            </tr>
                        </thead>

                        <tbody>
                        {
                            this.props.lista.map(function(conta){
                                return(
                                    <tr className={conta.estado?"estado-ok":""} 
                                    id={conta.id === this.state.trSelecionada?"selected":"" }
                                    key={conta.id} 
                                    onClick={e => this.selecionaConta(e, conta)} >
                                        <td>
                                            <div className={conta.id === this.state.trSelecionada?"show":"hide" }>
                                                <Link  className="pure-button button-margin-3" to={'/cadastro/' + conta.id}>
                                                    <Edit/>
                                                </Link>
                                                <button type="submit" className="button-error pure-button button-margin-3" onClick={e => this.clickPopup(e, conta)}>
                                                    <FaTimesCircle/>
                                                </button>
                                            </div>
                                            {conta.name}
                                        </td>
                                        <td>{conta.price}</td>
                                        <td>{conta.payday}</td>
                                    </tr>  
                                );
                            }.bind(this))
                        }
                        </tbody>
                    </table>
                </div>
        );
    };

}