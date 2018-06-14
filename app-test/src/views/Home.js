import React,{Component} from 'react';
import Configuracoes from '../componentes/Configuracoes';
import Submenu from '../componentes/Submenu';


class Home extends Component{

    render(){
        return(

        <div>
                        
            <Submenu nome="Home" />
            
            <Configuracoes />

        </div>

        );
    }

}

export default Home;