import React, {Component} from 'react';

export default class HeaderTotal extends Component{

    render(){
    

        var total = this.props.totalGanho - this.props.totalGastos; 
        var positivoOuNegativo = total > 0 ? "positivo" : "negativo";

        
        return(
            <div>
                

                <div className={ positivoOuNegativo + " is-center" } id="total">Saldo: R$ {total} </div>


            </div>
        );
    };

}