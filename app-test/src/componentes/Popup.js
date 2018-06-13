import React, { Component } from 'react';
import FaCheck from 'react-icons/lib/fa/check';
import FaBan from 'react-icons/lib/fa/ban';

export default class Popup extends Component{

    constructor(){
        super();
        this.state = {classe: 'popup-display'};
    }

    render(){

        return(
            <div className={ this.props.mostrar ? "" : this.state.classe}>
                <div className="popup-main" onClick={this.props.close}></div>
                <div className="popup">
                    <div>
                        {this.props.label}
                    </div>
                    <div>
                        <button type="submit" className="button-success pure-button button-margin-3" onClick={this.props.confirmar}>
                        <FaCheck />
                        </button>
                        <button type="submit" className="button-error pure-button button-margin-3" onClick={this.props.recusar}>
                        <FaBan />
                        </button>
                    </div>
                </div>
            </div>
        );

    }

}

