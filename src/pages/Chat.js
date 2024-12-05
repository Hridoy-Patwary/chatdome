import React, { Component } from 'react'
import '../components/css/chat.css'
import axios from 'axios'
import ChatUsr from '../components/mini/ChatUsr';
import dummyUsrImg from '../assets/img/dummy-usr.webp'
import Cookie from 'js-cookie';
import calcTime from '../assets/functions/timing';
import uri from '../assets/functions/uri';
import Hash from '../assets/functions/customHash';
import { Link } from 'react-router-dom';


const id = Cookie.get('id');
const hash = new Hash();
const encr = hash.encrypt('cD');
let msgElmContainer = '', usrTyping = [];

function Typing() {
    return(
        <div className="typing-anim">
            <div className="typing">
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
            </div>
        </div>
    )
}

export default class Chat extends Component {
    constructor(props){
        super(props)
        this.id = id
        this.uriDef = new URL(window.location.href)
        this.updateStatus()
        this.getUsrList()
        this.usrInfo(this.id, 'info')
        this.socket = props.socket
        this.state = {
            info: '',
            chatUsrInfo: '',
            typing: false,
            chatUsrList: ''
        }
    }
    



    usrInfo = (i, stateKey)=>{
        axios.post(uri+'/api/v1/info', {id: i}).then(rs => {
            if(stateKey === 'info'){
                // console.log(new Date(rs.data.activeStatus).toLocaleString());
                if(rs.data) this.setState({info:rs.data});
            }else if(stateKey === 'chatUsrInfo'){
                if(rs.data.activeStatus !== true || rs.data.activeStatus !== false){
                    rs.data.activeStatus = calcTime(rs.data.activeStatus);
                    this.setState({chatUsrInfo:rs.data});
                }
            }
        }).catch(e => {
            console.error(e);
        });
    }
    ulist = []
    list = []
    
    getUsrList = async ()=>{
        const dt = {id: this.id}
        const a = await fetch(uri+'/api/v1/ulist', {
            method: "POST",
            mode: "cors", 
            cache: "no-cache",
            credentials: "same-origin", 
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(dt)
        });
        const data = await a.json();
        data.forEach(e=>{
            if(e._id !== this.id){
                this.list.push(e);
            }
        })
        if(this.state.chatUsrInfo === ''){
            let obj = {
                "_id": "",
                "name": "",
                "bio": "",
                "email": "",
                "pass": "",
                "verified": false,
                "time": "",
                "activeStatus": "",
                "__v": 0,
                "src": ''
            }
            this.setState({chatUsrInfo: obj})
        }
        this.setupUsrList()
    }

    getMessages = (r)=>{
        axios.post(uri+'/api/v1/m/get', {
            id: this.id,
            opsitID: r
        }).then(rs => {
            msgElmContainer.innerHTML = ''
            if(rs.data.length>0){
                rs.data = rs.data.sort((x, y) => {
                    let d = new Date(x.timestamp).getTime(), d2 = new Date(y.timestamp).getTime();
                    return d - d2
                });
                rs.data.forEach(m=>{
                    const msgElm = document.createElement('div');
                    msgElm.title = new Date(m.timestamp).toLocaleTimeString();
                    msgElm.className = `chat-msg ${m.receiverID===this.id?'received al_slfBase': 'send al_slfEnd'} cd_px10 cd_py5 bg-prClr`;
                    msgElm.innerHTML = `<p>${m.msg}</p>`;
                    msgElmContainer.append(msgElm)
                })
                this.scrollToBottom()
            }
        }).catch(e => {
            console.error(e);
        });
    }
    TYPING_GAP_SEC = 4;
    intervalCount = false;
    lastType = ''
    handleMsg = (e)=>{
        const icon = '<svg width="12" height="12" x="0" y="0" viewBox="0 0 408.576 408.576" xml:space="preserve"><g><path d="M204.288 0C91.648 0 0 91.648 0 204.288s91.648 204.288 204.288 204.288 204.288-91.648 204.288-204.288S316.928 0 204.288 0zm114.176 150.528-130.56 129.536c-7.68 7.68-19.968 8.192-28.16.512L90.624 217.6c-8.192-7.68-8.704-20.48-1.536-28.672 7.68-8.192 20.48-8.704 28.672-1.024l54.784 50.176L289.28 121.344c8.192-8.192 20.992-8.192 29.184 0s8.192 20.992 0 29.184z"></path></g></svg>'
        // const gapBetweenType = (new Date().getTime() - this.lastType) / 1000;
        this.lastType = new Date().getTime();
        const typingTimout = this.intervalCount === false ? (setInterval(() => {
            const nCountSec = parseInt((new Date().getTime() - this.lastType)/1000);
            if(nCountSec > this.TYPING_GAP_SEC && this.intervalCount === true){
                this.socket.emit('usrtpig', [this.id, this.state.chatUsrInfo._id, false]);
                this.intervalCount = false;
                clearInterval(typingTimout)
            }else if(nCountSec < this.TYPING_GAP_SEC && this.intervalCount === false) {
                this.socket.emit('usrtpig', [this.id, this.state.chatUsrInfo._id, true])
                this.intervalCount = true
            }
        }, 1000)):'';
        
        if(this.msgInp.value === "") return;

        const inpTxt = this.msgInp.value;
        if(e.key === "Enter" || e.type === "click"){
            this.intervalCount = true;

            const hashedReceiverID = encr(' '+this.state.chatUsrInfo._id)

            this.socket.emit('smttu', {s: this.id, i: hashedReceiverID, m: inpTxt}) // smttu = send message to the user
            axios.post(uri+'/api/v1/m/send', {
                sender: this.id,
                reciever: this.state.chatUsrInfo._id,
                message: inpTxt
            }).then(rs => {
                    if(rs.data.status === "ok"){
                        const msgElm = document.createElement('div');
                        msgElm.className = 'chat-msg cd_df cd_al_ic gap5 send al_slfEnd'
                        msgElm.innerHTML = `<div class='chat-msg cd_px10 cd_py5 bg-prClr'><p>${inpTxt}</p></div><div class='msg-stage-sent al_slfEnd'>${icon}</div>`;
                        msgElmContainer.append(msgElm)
                    }
                    this.scrollToBottom()
            }).catch(error => {
                console.error(error);
            });
            this.msgInp.value = '';
        }
    }
    scrollToBottom = () => {
        if(msgElmContainer.scrollHeight > 0){
            msgElmContainer.lastElementChild.scrollIntoView({ behavior: "smooth" })
        }
    }
    getChatID = (i) => {
        if(i){
            this.usrInfo(i, 'chatUsrInfo');
            this.getMessages(i)
        }
    };
    componentDidMount(){
        document.title = "ChatDome | Chat";
        this.scrollToBottom();
        // socket messages read and configure
        this.socket.getSocket().onmessage = (e)=>{
            try {
                const data = JSON.parse(e.data);
                if(data.nmb && data.nmb[0] === this.id){
                    this.socket.emit('gmsg', data.nmb)
                    const msgElm = document.createElement('div');
                    msgElm.className = 'chat-msg received cd_px10 cd_py5 bg-prClr al_slfBase';
                    msgElm.innerHTML = `<p>${data.nmb[1].m}</p>`;
                    msgElmContainer.appendChild(msgElm)

                    this.scrollToBottom()
                }else if(data.usrtpig){
                    usrTyping.push({
                        userID: data.usrtpig[0],
                        typing: data.usrtpig[2]
                    })
                    const usrFromList = document.querySelector(`[data-i="${data.usrtpig[0]}"]`);
                    const typingAnim = usrFromList.querySelector('.usr-typing');
                    if(data.usrtpig[2]){
                        typingAnim.classList.remove('cd_dn')
                    }else{
                        typingAnim.classList.add('cd_dn');
                    }
                    const timout = setTimeout(() => {
                        if(data.usrtpig[2] === true){
                            typingAnim.classList.add('cd_dn')
                        }
                        clearTimeout(timout)
                    }, 50000);
                    this.setState({typing: data.usrtpig[2]})
                }else if(data.delivery){
                    console.log(data.delivery);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }

    setupUsrList = ()=>{
        axios.post(uri+'/api/v1/m/chatlist', {
            id: this.id
        }).then(rs => {
            if(typeof rs.data === 'object'){
                if(this.uriDef.searchParams.get('id') === null && rs.data.length < 1){
                    console.log('no users in Chatlist');
                }
                const listComponent = [], ids = [];
                rs.data = rs.data.sort((x, y) => {
                    let d = new Date(x.timestamp).getTime(), d2 = new Date(y.timestamp).getTime();
                    return d2 - d
                });
                if(this.uriDef.searchParams.get('id')){
                    rs.data.push(this.list.find((u) => u._id === parseInt(this.uriDef.searchParams.get('id'))))
                    // console.log(rs.data, this.list);
                }
                rs.data.forEach((obj, i) => {
                    // const id = obj.senderID !== this.id ? obj.senderID : obj.receiverID;
                    // const duplicateIndx = ids.indexOf(id);

                    // if(duplicateIndx !== -1) return;
                    // ids.push(id);
                    // const usrInfo = this.list.find((u) => u._id === parseInt(id)) || this.list.find((u) => u._id === parseInt(this.uriDef.searchParams.get('id')));
                    // // console.log(this.list, id)

                    
                    // const chatListUsrObj = {
                    //     id:  obj.senderID ? (obj.senderID !== this.id ? obj.senderID : obj.receiverID) : usrInfo._id,
                    //     img: usrInfo && usrInfo.src && JSON.parse(usrInfo.src)['profile']?uri+'/'+JSON.parse(usrInfo.src)['profile']:dummyUsrImg,
                    //     name: usrInfo.name,
                    //     lastMsg: {
                    //         sentOrRecived: obj.senderID === this.id?'send':'received',
                    //         msg: obj.msg,
                    //         stage: obj.stage
                    //     }
                    // }

                    const chatListUsrObj = {
                        id:  obj._id,
                        img: dummyUsrImg,
                        name: obj.name,
                        lastMsg: {
                            sentOrRecived: 'received',
                            msg: 'fuck you',
                            stage: 'sent'
                        }
                    }
                    listComponent.push(<ChatUsr key={i} usr={chatListUsrObj} chatID={this.getChatID} />)
                    // const usrFromList = document.querySelector(`[data-i="${obj.receiverID}"]`);
                    // if(usrFromList){
                    //     const lastMsgElm = usrFromList.querySelector('.last-msg');
                    //     lastMsgElm.innerHTML = obj.msg
                    //     const deliveryStage = usrFromList.querySelector('.cd_chat_opts');
                    //     if(usrFromList.querySelector('.delivery-stage')) return;
                    //     const nwElm = document.createElement('div');
                    //     nwElm.className = 'delivery-stage '+ obj.stage;
                    //     nwElm.title = obj.stage;
                    //     nwElm.innerHTML = `<svg width="12" height="12" x="0" y="0" viewBox="0 0 408.576 408.576" xml:space="preserve"><g><path d="M204.288 0C91.648 0 0 91.648 0 204.288s91.648 204.288 204.288 204.288 204.288-91.648 204.288-204.288S316.928 0 204.288 0zm114.176 150.528-130.56 129.536c-7.68 7.68-19.968 8.192-28.16.512L90.624 217.6c-8.192-7.68-8.704-20.48-1.536-28.672 7.68-8.192 20.48-8.704 28.672-1.024l54.784 50.176L289.28 121.344c8.192-8.192 20.992-8.192 29.184 0s8.192 20.992 0 29.184z"></path></g></svg>`;
                    //     deliveryStage.appendChild(nwElm)
                    // }
                })
                this.setState({chatUsrList: listComponent})
            }
        }).catch((e) =>{console.log(e)});
    }
    updateStatus = ()=>{
        axios.post(uri+'/api/v1/statusUpdate', {id: this.id}).then(rs => {
            // console.log(rs.data, this.state.info)
        })
    }
    render() {
        return (
            <div className="cd_chat-main cd_dg cd_p10 fOpSans">
                <div className="">
                    <Link to="/profile" className='cd_pb20 cd_pt10 cd_df gap10 cd_al-ic cp cd_prTxtClr lDefault'>
                        <img width={35} height={35} className='cd_user-ico cp brd-rds50 objFTCovr' src={this.state.info.src && JSON.parse(this.state.info.src)['profile']?uri+'/'+JSON.parse(this.state.info.src)['profile']:dummyUsrImg} alt="" />
                        <p>{this.state.info.name}</p>
                    </Link>
                    <div className="chat-user-list uslctN cd_psR">{this.state.chatUsrList}</div>
                </div>
                <div className="chat-main cd_dg">
                    <div className="top-bar">
                        <p className="userName f-bld">{this.state.chatUsrInfo.name}</p>
                        <small><p className="last-online cd_srTxtClr">{this.state.chatUsrInfo.activeStatus}</p></small>
                    </div>
                    <div className={`chat-main-display-parent ${this.state.typing?'typing-active':''} cd_psR cd_dg cd_mt10 cd_mb5 cd_py10 cd_px20 brd-rds`}>
                        <div className={`chat-main-display cd_df cd_jstfy-cend`} ref={(el) => { msgElmContainer = el }}></div>
                        {this.state.chatUsrInfo.name?<Typing />:''}
                    </div>
                    <div className={`chat-bottom cd_df cd_al-ic cd_jstfy-cspb cd_py5${this.state.chatUsrInfo.name?'':' cd_dn'}`}>
                        <input type="text" className="chatMainInp brd-rds" onKeyUp={this.handleMsg} placeholder="type here.." ref={(e) => {this.msgInp = e}}/>
                        <div className="send-btn cp cd_psA" onClick={this.handleMsg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 173.64 149.826" style={{fill: 'var(--srColor)'}}>
                                <path id="Path_8370" data-name="Path 8370" d="M163.3,94.537,23.2,36.4A16.767,16.767,0,0,0,.529,56.035L13,104.936H74.053a5.087,5.087,0,0,1,0,10.175H13l-12.47,48.9A16.768,16.768,0,0,0,23.2,183.643l140.1-58.132a16.767,16.767,0,0,0,0-30.974Z" transform="translate(-0.001 -35.111)"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
