import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/leftBar.css';
import uri from '../../assets/functions/uri';
import dummyIMG from '../../assets/img/dummy-usr.webp'
import axios from 'axios';

export default function LeftBar(props) {
    const [suggestedUsers, setSuggestedUsers] = useState();
    const [usrOptButton, setUsrOptButton] = useState();
    const socket = props.socket;
    let obj = {
        usr: props.id,
        to: props.viewing,
        type: 'connect'
    }
    let rqAccptBtn ;
    const rqAccepter = ()=>{
        obj.type = 'accepted';
        socket.emit('req', obj);
        rqAccptBtn.classList.add('pntrEvN');
        rqAccptBtn.innerHTML = 'Accepted';
        setTimeout(() => {
            setUsrOptButton('')            
        }, 1000);
    }

    const rqCanceler = ()=>{
        console.log('request cancel');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkConnection = ()=>{
        if(!props.id || !props.viewing || props.viewing === props.id) {
            test()
            return
        };
        let usrHTML = '';
        axios.post(uri+'/api/v1/user/connect/check', { usr: props.id, to: props.viewing }).then(rs => {
            if(typeof rs.data === 'object' && rs.data.length > 0){
                if(rs.data[0].type === 'connect'){
                    const requestHandleButton = rs.data[0].usr === parseInt(props.id) ? <div className='cd_px10 cd_h100 cd_df cd_al-ic tc brd-rds5 fw400 cp bg-srClr' onClick={rqCanceler}>Cancel Request</div> : <div className='cd_px10 cd_h100 cd_df cd_al-ic tc brd-rds5 fw400 cp bg-srClr' onClick={rqAccepter} ref={e => rqAccptBtn = e}>Accept Request</div>;
                    usrHTML = <div className='cd_dg cd_al_ic tc gap10 suggested-people cd_pt20 cd_pb10 cd_px10 brd-rds'>
                        <h4 className='cd_pb5'>{rs.data[0].toUsr === parseInt(props.id)?'Connect request':'Request already sent'}</h4>
                        <div className='cd_df cd_al-ic cd_jstfy-cc gap10 cd_whTxtClr' >
                            {requestHandleButton}
                            <Link to={'/chat?id='+props.viewing} className='cd_py5 cd_px10 bg-srClr brd-rds5 cd_df cd_al-ic cd_jstfy-cc cp' title='Send a message'>
                                <svg width={24} height={24} x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                    <g><g><path fill="#fff" d="M219.8,181.1H112.3l-62.9,53.1v-53.1H36.2c-14.5,0-26.2-11.9-26.2-26.6V48.3c0-14.6,11.8-26.5,26.2-26.5h183.6c14.5,0,26.2,11.9,26.2,26.6v106.2C246,169.2,234.2,181.1,219.8,181.1L219.8,181.1z M232.9,48.4c0-7.3-5.9-13.3-13.1-13.3H36.2c-7.2,0-13.1,5.9-13.1,13.3v106.2c0,7.3,5.9,13.3,13.1,13.3h13.1h13.1v26.6l39.3-26.5H128h91.8c7.2,0,13.1-5.9,13.1-13.3V48.4L232.9,48.4z M180.5,114.7c-7.3,0-13.1-5.9-13.1-13.3s5.9-13.3,13.1-13.3c7.2,0,13.1,5.9,13.1,13.3C193.6,108.8,187.7,114.7,180.5,114.7L180.5,114.7z M128,114.7c-7.2,0-13.1-5.9-13.1-13.3s5.9-13.3,13.1-13.3c7.2,0,13.1,5.9,13.1,13.3C141.1,108.8,135.2,114.7,128,114.7L128,114.7z M75.6,114.7c-7.2,0-13.1-5.9-13.1-13.3s5.9-13.3,13.1-13.3s13.1,5.9,13.1,13.3C88.7,108.8,82.8,114.7,75.6,114.7L75.6,114.7z"/></g></g>
                                </svg>
                            </Link>
                        </div>
                        <p className='cd_TgrayClr note-txt cd'><small>You can send messages by clicking the message icon even if you are not connected to the user</small></p>
                    </div>;
                    setUsrOptButton(usrHTML);
                }
            }else{
                test()
            }
        }).catch(err =>{
            console.log(err);
            throw err;
        })
    }
    function handleConnect (){
        obj.type = 'connect';
        socket.emit('req', obj);
        checkConnection()
        // axios.post(uri+'/api/v1/user/connect', {requestedUsr: props.id, requestingTo: props.viewing}).then(rs => {
        //     console.log(rs.data);
        // }).catch((err) => {
        //     console.log(err);
        //     throw err;
        // })
    }
    async function test(){
        const data = {id: obj.usr}
        const a = await fetch(uri+'/api/v1/ulist', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data)
        });
        const x = await a.json();
        let b = [];
        try {
            x.map(e => {
                const src = e.src && JSON.parse(e.src)['profile']?`${uri}/`+JSON.parse(e.src)['profile']:dummyIMG;
                const html = <div className='cd_df cd_al-ic gap10'><div data-id={`${e._id}`}><img src={`${src}`} width='32' height='32' alt='' className='brd-rds50'/></div><h4>{e.name}</h4></div>;
                b.push(<Link to={`/profile?i=${e._id}`} className="lDefault" key={e._id}>{html}</Link>)
                return b;
            });
            if(props.viewing && props.id && props.viewing !== ''){
                const viewingHTML = <div className='cd_df cd_al_ic cd_jstfy-cc gap10 cd_whTxtClr'><div className='cd_px10 cd_py5 fw400 bg-srClr cp brd-rds5' onClick={handleConnect}>Connect</div><div className='cd_px10 cd_py5 fw400 brd-rds5 cp bg_grayTrnsparent cd_prTxtClr'>Block</div></div>
                setSuggestedUsers(viewingHTML)
                return;
            }else{
                setSuggestedUsers(b)
            }
        } catch (e) {}
    } 
    useEffect(()=>{
        checkConnection()
    },[])// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className='leftBar'>
            <div className="menu-items cd_dg uslctN f-bld">
                <Link to="/" className='menu cd_p10 cd_mb10 brd-rds5 cp'>Home</Link>
                <Link to="/profile" className='menu cd_p10 cd_mb10 brd-rds5 cp'>Profile</Link>
                <Link to="/chat" className='menu cd_p10 cd_mb10 brd-rds5 cp'>Chat</Link>
            </div>
            {usrOptButton!==undefined?usrOptButton:<div className="suggested-people cd_p10 brd-rds5"><h3 className='cd_pb10'>People you may know</h3><div className="cd_dg cd_mt10 gap10 cd_srTxtClr">{suggestedUsers}</div></div>}
            <div className='cd_p10 cd_mb10 brd-rds5 suggested-people cd_mt10'>
                <h3 className='cd_pb10'>Explore our features</h3>
                <Link to='/collaboration' className="lDefault cd_p10">Collaborate with your team</Link>
            </div>
        </div>
    )
}
