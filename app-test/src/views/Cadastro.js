import React,{Component} from 'react';
import FormContas from '../componentes/FormContas'
import Submenu from '../componentes/Submenu';


class Cadastro extends Component{

    componentDidMount(){
        console.log(this.props);

    }

    render(){

        return(
        <div>

            <Submenu nome="Cadastro" />

            <div className="content">

                <div className="pure-g">
                    <div className="l-box-lrg pure-u-1 pure-u-md-2-5">
                       <FormContas acao={this.props.params.userId} rota={this.props.router}/>
                    </div>
                </div>
           
            </div>
        
        </div>
        );

    }

}

export default Cadastro;