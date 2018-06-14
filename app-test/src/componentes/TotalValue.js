import React, {Component} from 'react';

export default class TotalValue extends Component{

    render(){
        return(
            <div>
                <div className="pure-g total">
                  <div className="pure-u-2-24"></div>
                    <div className="pure-u-20-24"> 
                        <table className="pure-table pure-table-bordered margin-center">
                        <tbody>
                            <tr>
                                <td className="header-total">Total</td>
                                <td>R$ {this.props.total}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div className="pure-u-2-24"></div>
                </div>


            </div>
        );
    };

}