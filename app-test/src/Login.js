import React, { Component } from 'react';
import {browserHistory} from  'react-router';
import queryString from 'query-string';

export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            msg: this.props.location.query.msg
        };
    }

    componentDidMount(){
        // console.log("componentDidMount");
    }

    envia(event){
        console.log('envia', this.state);
        event.preventDefault();

        var formData = new FormData();
        formData.set('login', this.login.value)
        formData.set('password', this.senha.value)

        var loginAndPassword = {};
        formData.forEach(function(value, key){
            loginAndPassword[key] = value;
        });

        const url = 'http://localhost:8080/user';
        const req = {
            method: 'PUT'
            , mode: 'cors'
            , body: queryString.stringify(loginAndPassword)
            , headers: new Headers({
                 'Content-type' : 'application/x-www-form-urlencoded'
                })
        }

        fetch(url, req)
            .then(res => {
                if(res.ok){
                    return res.headers.get('Location');
                }else{
                    throw new Error('não foi possível fazer o login');
                }
            }).then(jsonStringToken => {
                const token = jsonStringToken;
                localStorage.setItem('auth-token', token);
                browserHistory.push('/home');
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
            });

    }

    render(){ 
        return (
            <div className="login-box">
                <h1 className="header-logo">Meu Orçamento</h1>
                <span className="negativo">{this.state.msg}</span>
                <form onSubmit={this.envia.bind(this)} > 
                    <input id="login" type="text" placeholder="login" ref={(input) => this.login = input} />
                    <input id="senha" type="password" placeholder="senha" ref={(input) => this.senha = input} />
                    <button type="submit" className="pure-button">login</button>
                </form>
            </div>
        );
  }   
}