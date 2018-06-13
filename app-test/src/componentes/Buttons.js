import React,{Component} from 'react';
import {Link} from 'react-router';


export class ButtonHome extends Component{

    render(){
        console.log(this)
        return(
            <div>

                <Link className="button-home pure-button" to={this.props.para} >
                    <b>{this.props.children}</b> {this.props.label}
                </Link>

            </div>
        );
    }
    
}

export class Button extends Component{

    
}