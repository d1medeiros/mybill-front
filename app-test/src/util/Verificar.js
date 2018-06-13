import { Component } from 'react';


export default class Verificar extends Component {

    verifica(){
        const url = `http://meuorcamentoec2.com:8080/meuorcamento/api/usuario/verificar?XTOKEN=${localStorage.getItem('auth-token')}`;

        fetch(url)
            .then(res => {
                if(res.ok){
                    return res.json();
                }else{
                    throw new Error('não foi possível Verificar o login');
                }
            })
            .then(jsonStringToken => {
                const token = JSON.parse(jsonStringToken).authtoken;
                if(token){
                    console.log('Verificar token', token);
                    localStorage.setItem('auth-token', token);
                }else{
                    console.log('removeItem token', token);
                    localStorage.removeItem('auth-token');
                }
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
            });
       
    }

    render(){
        return null;
    }
}

