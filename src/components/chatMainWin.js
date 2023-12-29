import React, { Component } from "react";
import ChatMsg from "./chatMsg";


export default class ChatMainWindow extends Component {
    constructor(props){
        super(props)
        this.state = {
            msg: {
                txt: '',
                to: '0000'
            }
        }
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    handleMsg = (e)=>{
        if(this.msgInp.value === "") return;
        const inpTxt = this.msgInp.value;
        if(e.key === "Enter" || e.type === "click"){
            this.msgInp.value = '';
            this.setState({msg:{txt: inpTxt}})

            const msgElm = document.createElement('div');
            msgElm.className = 'chat-msg send cd_px10 cd_py5 bg-prClr al_slfEnd';
            msgElm.innerHTML = `<p>${inpTxt}</p>`;
            this.msgElmContainer.appendChild(msgElm)
        }
    }
    componentDidMount() {
        this.scrollToBottom();
        console.log(this.props.userInfo)
    }
    
    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        return (
            <>
                <div className="top-bar">
                    <p className="userName f-bld">{this.props.userInfo.name}</p>
                    <small><p className="last-online">{this.props.userInfo.lastActive}</p></small>
                </div>
                <div className="chat-main-display-parent cd_dg cd_mt10 cd_mb5 cd_p10 brd-rds">
                    <div className="chat-main-display cd_df cd_jstfy-cend" ref={(el) => { this.msgElmContainer = el }}>
                        <ChatMsg msg={'testing'} class={'send'}/>
                        <div className="chat-msg received cd_px10 cd_py5">
                            <p>Hello</p>
                        </div>
                        <div className="chat-msg send cd_px10 cd_py5 bg-prClr al_slfEnd">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, aut.</p>
                        </div>
                        <div className="chat-msg received cd_px10 cd_py5">
                            <p>Hello</p>
                        </div>
                        <div className="chat-msg send cd_px10 cd_py5 bg-prClr al_slfEnd" ref={(el) => { this.messagesEnd = el }}>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, aut.</p>
                        </div>
                    </div>
                </div>
                <div className="chat-bottom cd_df cd_al-ic cd_jstfy-cspb cd_py5">
                    <input type="text" className="chatMainInp brd-rds" onKeyUp={this.handleMsg} placeholder="type here.." ref={(e) => {this.msgInp = e}}/>
                    <div className="send-btn cp cd_psA" onClick={this.handleMsg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 173.64 149.826">
                            <path id="Path_8370" data-name="Path 8370" d="M163.3,94.537,23.2,36.4A16.767,16.767,0,0,0,.529,56.035L13,104.936H74.053a5.087,5.087,0,0,1,0,10.175H13l-12.47,48.9A16.768,16.768,0,0,0,23.2,183.643l140.1-58.132a16.767,16.767,0,0,0,0-30.974Z" transform="translate(-0.001 -35.111)"/>
                        </svg>
                    </div>
                </div>
            </>
        );
    }
}
