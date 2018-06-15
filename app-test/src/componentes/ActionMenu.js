import React, {Component} from 'react';
import {Link} from 'react-router';
import FaPlus from 'react-icons/lib/fa/plus';

export default class ActionMenu extends Component{

    render(){
        return(
            <div>

                {/* botao prev next */}
                <div className="pure-g">
                    <div className="pure-u-1-3" id="prev-contas">
                        <p>
                            <button type="submit" className="pure-button" onClick={this.props.prev}>Prev</button>
                        </p>
                    </div>
                    <div className="pure-u-1-3">
                        <p>
                            <Link to={this.props.rota} className="pure-button" ><FaPlus/></Link>
                        </p>
                    </div>
                    <div className="pure-u-1-3" id="next-contas">
                        <p>
                            <button type="submit" className="pure-button" onClick={this.props.next}>Next</button>
                        </p>
                    </div>
                </div>


            </div>
        );
    };

}