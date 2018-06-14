import React,{Component} from 'react';
import Submenu from '../componentes/Submenu';


class Classificar extends Component{

    componentDidMount(){
    }

    render(){
      
        return(
        <div>

            <Submenu nome="Classificação" />

            <div className="content">
                <div className="pure-g">
                    <div className="l-box-lrg pure-u-1 pure-u-md-2-5">
                        {/* <span className="negativo">{this.state.msg}</span> */}
                        <form className="pure-form pure-form-stacked" > 
                            <label htmlFor="classificacaoConta">Classificação da Conta</label>
                            <input id="classificacaoConta" type="text" ref={(input) => this.classificacaoConta = input} />
                            <button type="submit" className="pure-button">gravar</button>
                        </form>
                    </div>
                </div>
            
           
            </div>

        
        </div>
        );

    }

}

export default Classificar;