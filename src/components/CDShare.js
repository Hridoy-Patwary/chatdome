import React from 'react'
import './css/cdShare.css'
import { io } from 'socket.io-client';
import uri from '../assets/functions/uri';
import { useState } from 'react';



export default function CDShare(props) {
    const [disabled, setDisabled] = useState(true)

    let cdShrScan, shareID
    function displayUList(e, a) {
        a.innerHTML = ""
        e.ulist.forEach((u)=>{
            if(u.id !== shareID){
                const uDiv = document.createElement('div')
                uDiv.className = "cd_df cd_jstfy-cspb cd_al-ic cd_py10 cp"
                uDiv.innerHTML = `<span class="pntrEvN">ID: ${u.username}</span> <small class="pntrEvN">${u.id}</small>`;
                a.append(uDiv);
            }
        })
        props.reSize()
    }
    function cdShareScan(){
        if(cdShrScan.classList.contains("scanning")){
            console.log('scanning your local network please wait..')
        }else{
            // socket connection 
            const socket = io(uri,{transports: ["websocket", "polling"]});
            const ulistContainer = cdShrScan.parentElement.children[1];
            const sendBox = cdShrScan.parentElement.children[2]

            ulistContainer.addEventListener('click', (x)=>{
                const cdShareMsgInp = sendBox.children[0].children[0];
                setDisabled(true)
                sendBox.children[0].children[0].focus()
                console.log(cdShareMsgInp)
                socket.emit('prmsg', {to: x.target.children[1].innerHTML, from: socket.id, msg: 'Hello'})
            })
            socket.on("connect", () => {
                // on connect
                socket.emit('i', props.uname)
            });
            socket.on("connect_error", () => {
                // revert to classic upgrade
                socket.io.opts.transports = ["polling", "websocket"];
            });
            socket.on('prmsg', (e)=>{
                alert(e.msg+" from "+e.uid)
            })
            socket.on("ini", (e) => {
                // cdShrScan.classList.remove('scanning');
                // cdShrScan.classList.add('scanComplete');
                shareID = e.id
                displayUList(e, ulistContainer)
            })
            socket.on('newConnection', (e)=>{
                displayUList(e, ulistContainer)
            })
            socket.on('userLeft', (e)=>{
                displayUList(e, ulistContainer)
                console.log(e)
            })

            // handle design part
            cdShrScan.classList.add('scanning');
            cdShrScan.children[0].innerHTML = "Scanning"
        }
    }
    return (
        <div className='cd_share_window f-lighter'>
            <div className="cd_df cd_jstfy-cspb cd_al-ic cdShare_scan cp" onClick={cdShareScan} ref={e=> cdShrScan = e}>
                <p>Scan</p>
                <div className="cdShare_scanIco"></div>
            </div>
            <div className="cd_share_ulist"></div>
            <div className="cd_sendBox cd_mt10">
                <div className="cd_sbx_inner cd_p10 cd_df cd_jstfy-cspb cd_al-ic">
                    <input type="text" className='bg-none brd-none cd_srTxtClr cd_w100' placeholder='send message..' disabled={disabled} />
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 173.64 149.826" style={{fill: 'var(--prTxtColor)', minWidth: 20}}>
                            <path id="Path_8370" data-name="Path 8370" d="M163.3,94.537,23.2,36.4A16.767,16.767,0,0,0,.529,56.035L13,104.936H74.053a5.087,5.087,0,0,1,0,10.175H13l-12.47,48.9A16.768,16.768,0,0,0,23.2,183.643l140.1-58.132a16.767,16.767,0,0,0,0-30.974Z" transform="translate(-0.001 -35.111)"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
