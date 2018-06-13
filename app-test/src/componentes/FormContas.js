import React,{Component} from 'react';

export default class FormContas extends Component{

    constructor(){
        super();
        this.state = {
            nome:'', 
            valor:0, 
            dataPagamento:'', 
            estado: false, 
            repetir: false, 
            tipoConta: '',
            alterarTodos: false,
            formAcao: 'salva'
        };
        this.salva = this.salva.bind(this);
    }
 
    sucessoAjax(resp){
        console.log(resp);
        return{
            nome: resp.nome, 
            valor: resp.valor, 
            dataPagamento: resp.dataPagamento, 
            estado: resp.estado, 
            repetir: resp.repetir, 
            tipoConta: resp.tipoConta,
            formAcao: 'altera'
        }
    }

    
    componentDidMount(){  
        console.log("didMount ");
        console.log(this.props);
        if(this.props.acao){

            const url = "http://meuorcamentoec2.com:8080/meuorcamento/api/conta/" + this.props.acao;
            const req = {
                method: 'GET',
                headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') })
            }
            fetch(url, req)
                .then(res => {
                    if(res.ok){
                        return  res.json();
                    }else{
                        throw new Error('não foi possível fazer o login');
                    }
                }).then(resp => {
                    this.setState(this.sucessoAjax(resp));
                }).catch(error => {
                    this.setState({
                        msg: error.message
                    });
                });
        }
    }   

    salva(event){
        event.preventDefault();
        var a = '';
        if(this.props.acao){
            a = this.state.alterarTodos ? 'altera/todos' : 'altera';
        }else{
            a = 'salva';
        }
        
        console.log(this.props.acao);

        const url = 'http://meuorcamentoec2.com:8080/meuorcamento/api/conta/' + a;
        const req = {
            method: 'POST',
            headers: new Headers({ 'Content-type' : 'application/json', 'XTOKEN' : localStorage.getItem('auth-token') }),
            body: JSON.stringify({
                id: this.props.acao,
                nome: this.state.nome,
                valor: this.state.valor,
                dataPagamento: this.state.dataPagamento,
                estado: this.state.estado,
                repetir: this.state.repetir,
                tipoConta: this.state.tipoConta
            })
        }

        fetch(url, req)
            .then(res => {
                var acaoAltera = this.state.formAcao;
                this.setState({nome:'', valor:0, dataPagamento:'', estado: false, repetir: false, tipoConta: '', alterarTodos: false});
                if(acaoAltera === 'altera'){
                    this.props.rota.push('/contas')         
                }
                console.log(res)
                
            }).then(jsonStringToken => {
               
            }).catch(error => {
                this.setState({
                    msg: error.message
                });
        });
    }
    
    salvaAlteracao(nomeInput,event){
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
        return(
            <div>
                 <form className="pure-form pure-form-stacked" onSubmit={this.salva}>
                    <fieldset>
                        
                        <label htmlFor="nome">Nome</label>
                        <input id="nome" type="text" placeholder="nome da conta" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')}/>
        
                        <label htmlFor="valor">Valor</label>
                        <input id="valor" type="number" placeholder="0000" value={this.state.valor} onChange={this.salvaAlteracao.bind(this,'valor')} />
        
                        <label htmlFor="dataPagamento">Data Pagamento</label>
                        <input id="dataPagamento" type="date"  value={this.state.dataPagamento} onChange={this.salvaAlteracao.bind(this,'dataPagamento')}/>
        
                        <div className="pure-controls">
                            <select value={this.state.tipoConta} name="tipoConta" onChange={this.salvaAlteracao.bind(this,'tipoConta')} >
                            <option value="">Selecione</option>
                            {this.props.tipos}
                            </select>
                        </div>

                        <label htmlFor="estado">Status</label>
                        <input id="estado" type="checkbox" checked={this.state.estado} onChange={this.salvaAlteracao.bind(this,'estado')} />
        
                        <div className={this.state.formAcao}>
                            <label  htmlFor="repetir">Repetir</label>
                            <input id="repetir" type="checkbox" checked={this.state.repetir} onChange={this.salvaAlteracao.bind(this,'repetir')} />
                        </div>
        
                        <div className={this.state.formAcao} id="alteraShow">
                            <label  htmlFor="repetir">Deve alterar em todos?</label>
                            <input id="alterarTodos" type="checkbox" checked={this.state.alterarTodos} onChange={this.salvaAlteracao.bind(this,'alterarTodos')} />
                        </div>

        
                        <button type="submit" className="pure-button">Enviar</button>
                    </fieldset>
                </form>
            </div>
        );
    }

}
