import React, { Component } from 'react';
import './css/pure-min.css';
import './css/marketing.css';
import './css/login.css';
import {Link} from 'react-router';

class App extends Component {

    
    render() {
        var stiloLogout = {paddingLeft: '80px'};  
        return (

            <div>
            
                <div className="header">
                    <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                        <a className="pure-menu-heading" href="/home">Home</a>

                        <ul className="pure-menu-list">
                            <li className="pure-menu-item"><Link to="/pagas" className="pure-menu-link">pagas</Link></li>
                            <li className="pure-menu-item"><Link to="/agendamentos" className="pure-menu-link">agendamentos</Link></li>
                            <li className="pure-menu-item" style={stiloLogout}><Link to="/logout" className="pure-menu-link">logout</Link></li>
                        </ul>
                    </div>
                </div>

                <br /> 

                <h2 className="content-head is-center">Meu Orçamento</h2>

                <div id="main">
                        {this.props.children}
                </div>

                <div className="footer l-box is-center">
                    Made with love by dmedeiros Team.
                </div>

            </div>
        );
    }
}

export default App;
