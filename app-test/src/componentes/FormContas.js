import React,{Component} from 'react';

export default class FormContas extends Component{

    constructor(){
        super();
        this.state = {
            nome:'', 
            valor:0, 
            dataPagamento:'', 
            tipoConta: '',
            alterarTodos: false,
            formAcao: 'salva'
        };
        this.salva = this.salva.bind(this);
        this.url = 'http://localhost:8080/paid';
        this.requisicao = {
            method: ''
            , mode: 'cors'
            , headers: new Headers({ 'Content-type' : 'application/json'
                , 'token' : localStorage.getItem('auth-token') })
        }
    }
    componentDidMount(){  
    }   

    salva(event){
        event.preventDefault();
        const conta = JSON.stringify({
            id: this.props.acao,
            name: this.state.nome,
            price: this.state.valor,
            payday: this.state.dataPagamento,
            billType: this.state.tipoConta
        });
        
        this.requisicao.method = 'POST';
        this.requisicao.body = conta;

        fetch(this.url, this.requisicao)
            .then(res => {
                console.log(res);
                this.setState(this.resetaCampos());
            }).then(jsonStringToken => {
               console.log(jsonStringToken);
            }).catch(error => {
                this.setState({
                    msg: error.message
            });
        });

    }

    resetaCampos(){
        return {nome:'', valor:0, dataPagamento:'', estado: false, repetir: false, tipoConta: '', alterarTodos: false};
    }
    
    salvaAteracaoCampo(nomeInput,event){
        var campoSendoAlterado = {};
        var value; 
        if(event.target.type === 'checkbox'){
            value = event.target.checked 
        } else if(event.target.type === 'number'){
            value = Number(event.target.value);
        }else{
           value = event.target.value;
        }
            
        campoSendoAlterado[nomeInput] = value;   
        this.setState(campoSendoAlterado);  
    }

    render(){

        var tipoConta = [{ "id": 'GASTOS', "value":'Gastos'}, { "id": 'GANHO', "value":'Ganho'}];
        tipoConta = tipoConta.map((c) => <option key={c.id} value={c.id}>{c.value}</option> );

        return(
            <div>
                 <form className="pure-form pure-form-stacked" onSubmit={this.salva}>
                    <fieldset>
                        
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" placeholder="nome da conta" value={this.state.nome} onChange={this.salvaAteracaoCampo.bind(this,'nome')}/>
        
                        <label htmlFor="valor">Valor</label>
                        <input id="valor" type="number" placeholder="0.00" step="0.01" value={this.state.valor} onChange={this.salvaAteracaoCampo.bind(this,'valor')} />
        
                        <label htmlFor="dataPagamento">Data Pagamento</label>
                        <input id="dataPagamento" type="date"  value={this.state.dataPagamento} onChange={this.salvaAteracaoCampo.bind(this,'dataPagamento')}/>
        
                        <div className="pure-controls">
                            <select value={this.state.tipoConta} name="tipoConta" onChange={this.salvaAteracaoCampo.bind(this,'tipoConta')} >
                            <option value="">Selecione</option>
                            {tipoConta}
                            </select>
                        </div>                       
        
                        <button type="submit" className="pure-button">Enviar</button>
                    </fieldset>
                </form>
            </div>
        );
    }

}
