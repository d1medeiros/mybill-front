import React,{Component} from 'react';
import FaBook from 'react-icons/lib/fa/book';
import FaBell from 'react-icons/lib/fa/bell';
import {ButtonHome} from './Buttons';


export default class Configuracoes extends Component{


    render(){
        return(

            <div className="button-margin-3">


                <div className="pure-g total">
                    <div className="pure-u-1-1 is-center">
                        <ButtonHome label="Criar classificações para contas" para="/classificacao">
                            <FaBook />
                        </ButtonHome>
                    </div>
                </div>
                <div className="pure-g total">
                    <div className="pure-u-1-1 is-center">
                        <ButtonHome label="Outros Exemplos para contas" >
                            <FaBell />
                        </ButtonHome>
                    </div>
                </div>


            </div>
        
        );
    }

}
