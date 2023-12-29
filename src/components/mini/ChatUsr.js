import React from 'react';

export default function ChatUsr(props) {
    let usrFromChatList;
    const handleChatUsr = ()=>{
        props.chatID(usrFromChatList.dataset.i)
    }
    return (
        <div className='cd_chat-user cd_df cd_al-ic brd-rds cd_my10 cd_mr5 cd_p10 cp' data-lastmsg={props.usr.lastMsg.sentOrRecived} data-stg={props.usr.lastMsg.stage} data-i={props.usr.id} onClick={handleChatUsr} ref={e=>usrFromChatList=e}>
            <div className="user-img">
                <img width={40} loading='lazy' src={props.usr.img} alt="" />
            </div>
            <div className="cd_usr_details cd_w100">
                <p className="name f-bld">{props.usr.name}</p>
                <p className="last-msg">{props.usr.lastMsg.msg}</p>
            </div>
            <div className="cd_chat_opts al_slfEnd cd_psA">
                <div id="wave" className='usr-typing cd_dn'>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    )
}
