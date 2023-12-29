import React, { Component } from 'react'

export default class ChatMsg extends Component {
    render() {
        return (
            <div className={`chat-msg ${this.props.class} cd_px10 cd_py5 bg-prClr al_slfEnd`}>
                <p>{this.props.msg}</p>
            </div>
        )
    }
}
