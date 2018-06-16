import React, {Component} from 'react';
import {Link} from 'react-router';
import FaPlus from 'react-icons/lib/fa/plus';

export default class ActionMenu extends Component{


    checkIfExits(valor){
        return valor ? 'pure-button' : 'pure-button button-disable'
    }

    render(){

        console.log('prev', this.props.prev)
        console.log('rota', this.props.rota)
        console.log('next', this.props.next)
        return(
            <div>

                {/* botao prev next */}
                <div className="pure-g">
                    <div className="pure-u-1-3" id="prev-contas">
                        <p>
                            <button type="submit" className={this.checkIfExits(this.props.prev)} onClick={this.props.prev}>Prev</button>
                        </p>
                    </div>
                    <div className="pure-u-1-3">
                        <p>
                            <Link to={this.props.rota} className={this.checkIfExits(this.props.rota)} ><FaPlus/></Link>
                        </p>
                    </div>
                    <div className="pure-u-1-3" id="next-contas">
                        <p>
                            <button type="submit" className={this.checkIfExits(this.props.next)} onClick={this.props.next}>Next</button>
                        </p>
                    </div>
                </div>


            </div>
        );
    };

}