import React, {Component} from 'react';
import TotalValue from './TotalValue';

export default class ListaAgendadas extends Component{

    render(){
        return(
            <div>
                
                {/* tabela gastos */}
                <div id="div-gastos" className="pure-g gastos">
                    <div className="pure-u-5-5">
                       
                    </div>
                </div>
                
                {/* total gastos */}
                <TotalValue total={this.state.totalGastos} />


                {/* tabela ganho */}
                <div id="div-ganho" className="pure-g ganho">
                    <div className="pure-u-5-5">
                       
                    </div>
                </div>
                
                {/* total ganho */}
                <TotalValue total={this.state.totalGanho} />

            </div>
        );
    };

}

export class ListaAgendadasGastos extends Component{

    render(){
        return(
            <div>
                
                
            </div>
        );
    };

}