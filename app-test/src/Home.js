import React,{Component} from 'react';
import Configuracoes from './componentes/Configuracoes';


class Home extends Component{

    render(){
        return(

        <div>
                        
            <div className="is-center">
                <h3>Home</h3>
            </div>
            
            <Configuracoes />

        </div>

        );
    }

}

export default Home;