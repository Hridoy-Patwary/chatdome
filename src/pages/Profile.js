import React from 'react'
import '../components/css/pr.css'
import Post from '../components/Post'
import LeftBar from '../components/mini/LeftBar'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios'
import Loader from '../components/mini/loader'
import NewPost from '../components/CreatePost'
import calcTime from '../assets/functions/timing'
import uri from '../assets/functions/uri'
import Img from '../assets/img/dummy-usr.webp'


let counter = 0, postIDs = [];

export default function Profile(props) {
    const [loading, setLoading] = useState(true);
    const [bioEditMode, setBioEditMode] = useState(true);
    const [prImgSrc, setPrImgSrc] = useState(Img);
    const URIParser = new URL(window.location.href);
    const viewingID = URIParser.searchParams.get('i');
    const socket = props.socket;

    let info, posts, displayName, bioElm, postContainer, backupContainer, bioInp, profileImgElm, profileImgInp;
    const mainUID = Cookies.get('id');
    
    if(mainUID === viewingID){
        URIParser.searchParams.delete('i')
    }
    const id = viewingID ? viewingID : mainUID;
    // get user full information
    axios.post(uri+'/api/v1/info/fullInfo', {id: id}).then(rs => {
        try {
            info = rs.data.info;
            if(info.src){
                info.src = JSON.parse(info.src);
                if(info.src.profile) setPrImgSrc(uri+'/'+info.src.profile);
            }
            posts = rs.data.posts.sort((x, y) => {
                let d = new Date(x.time).getTime(), d2 = new Date(y.time).getTime();
                return d2-d
            });
            loader()
        } catch (e) {
            console.log(JSON.parse(rs.data.info.src))
            console.log(e)
        }
    }).catch(error => {
        console.error(error);
    });
    function loader(){
        if(displayName !== undefined && displayName){
            displayName.innerHTML = info.name;
        }
        if(bioInp !== undefined && bioInp){
            bioInp.value = info.bio
        }
        setLoading(false);
    }
    function handlePosts(e){
        if(e !== undefined){
            backupContainer = e;
        }
        if(posts !== undefined){
            for (let i = 0; i < posts.length; i++) {
                if(postIDs.includes(posts[i]._id)) return;
                const calculatedTime = calcTime(posts[i].time)
                const postTime = calculatedTime === 'active' ? 'now' : calculatedTime;
                const newPostElm = document.createElement('div');
                newPostElm.dataset.pid = posts[i]._id;
                newPostElm.className = 'cd_post cd_w100 brd-rds cd_mb20';
                newPostElm.innerHTML = `<div class="cd_post cd_w100 brd-rds cd_mb20">
                                            <div class="post-top cd_px20 cd_py10 uslctN cd_df cd_jstfy-cspb">
                                                <div class="post-top-left cd_df cd_al-ic gap5 cd_my5">
                                                <div class="small-user-ico brd-rds50"></div><div class="post-top-details"><h4>${info.name}</h4><small>${postTime}</small>
                                            </div>
                                        </div>
                                        <div class="post-top-right cd_df cd_al-ic">
                                            <div class="three-dott cd_df cd_al-ic cd_jstfy-cc brd-rds50 cp uslctN">
                                                <span class="cd_db brd-rds50"></span>
                                                <span class="cd_db brd-rds50"></span>
                                                <span class="cd_db brd-rds50"></span>
                                            </div></div></div><div class="post-main cd_px20">
                                            <div class="post-content cd_py10"><p>${posts[i].postTxt}</p></div><div class="post-media cp uslctN">
                                            </div><div class="post-bottom cd_df cd_al-ic cd_jstfy-cspb cd_pt5 cd_pb10 f-bld uslctN">
                                            <div class="react pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp">
                                            <div class="ico"></div><span>Like</span></div><div class="comment pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp"><div class="ico"></div><span>Comment</span></div><div class="share pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp"><div class="ico"></div><span>Share</span></div></div></div></div>`
                if(postContainer !== null && postContainer !== undefined){
                    postContainer.append(newPostElm);
                    counter++;
                    postIDs.push(posts[i]._id);
                }else if(backupContainer){
                    backupContainer.append(newPostElm);
                    counter++;
                    postIDs.push(posts[i]._id);
                }else{
                    if(counter>=posts.length) return;
                    console.log(counter, posts.length, postContainer, backupContainer)
                    handlePosts()
                }
            }
        }else{
            // get user posts
            const repeat = setInterval(() => {
                if(posts !== undefined){
                    clearInterval(repeat)
                    handlePosts();
                }
            }, 100);
        }
    }


    const bioEdit = ()=>{
        setBioEditMode(false);
    }
    const countBioChar = ()=>{
        bioElm.className = 'cd_usr-bio'
        const count = bioInp.value.length;
        bioElm.innerHTML = 100-count;
    }
    const handleBioSubmit = ()=>{
        if(bioInp.value.length !== 0){
            axios.post(uri+'/api/v1/bio',{b: bioInp.value, id: id}).then(rs => {
                if(rs.data && rs.data.status === 'ok'){
                    setBioEditMode(true)
                }else{
                    console.log(rs.data)
                }
            }).catch(e => {
                console.error(e);
            });
        }
    }

    const handleProfileClick = async ()=>{
        const data = new FormData();
        const profileInpFileReader = new FileReader();

        data.append("uid", info._id)
        data.append("image", profileImgInp.files[0]);
        profileInpFileReader.onload = function(){
            profileImgElm.src = profileInpFileReader.result
        }
        profileInpFileReader.readAsDataURL(profileImgInp.files[0])
        
        try {
            await fetch(uri+'/api/media/upload', {
                method: "POST",
                body: data,
            }).then((rs) =>  rs.json()).then((rsDt) => {
                info.src = rsDt.json ? rsDt.json : '';
            })
        } catch (e) {
            console.log('some error occured while uploading profile picture: '+ e)
        }
    }


    useEffect(()=>{
        document.title = "ChatDome | Profile";
        handlePosts(postContainer)
    })
    return (
        <>
            {loading?<Loader/>:''}
            <div className="h100vh fOpSans">
                <div className="cd_profile-top cd_psR">
                    <div className="cd_profile-inner uslctN cd_h100">
                        <div className="cd_profile_cover cd_w100 cd_h100 cp"></div>
                        <div className="cd_profile cp cd_psA brd-rds50 pr_bottomN20px pr_right cp cd_zindx1">
                            <img className='cd_w100 cp cd_h100 uslctN pntrEvN objFTCovr' loading='lazy' src={prImgSrc} ref={e => {profileImgElm = e}} alt="" />
                            <input type="file" className='cd_psA cp l0 t0 cd_w100 cd_h100 brd-rds50' multiple={false} onChange={handleProfileClick} ref={e => profileImgInp = e} />
                        </div>
                    </div>
                    <div className="cd_pr-top-content cd_psA cd_w100 l0 b0 cd_p20 cd_dg cd_alc-end">
                        <h2 className="cd_usr-name f-bld cd" ref={e=>displayName=e}>-</h2>
                        <div className="bio-container cd cd_psR" onClick={bioEdit}>
                            <textarea placeholder='bio...' className='fOpSans' maxLength={100} disabled={bioEditMode} onKeyUp={countBioChar} ref={e=>{bioInp = e}}></textarea>
                            <div className={`bioButtonCon cd_df cd_jstfy-cspb cd_al-ic gap10${bioEditMode?' cd_opcty_vsblty0':''}`}>
                                <p className="cd_usr-bio uslctN pntrEvN" ref={e=>{bioElm=e}}>100</p>
                                <button className='closeBtn cp' onClick={()=>{bioInp.value = ''; bioElm.innerHTML = 100}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={33} height={33} fill="none" viewBox="-2.4 -2.4 28.8 28.8" ><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.296} d="m9 9 3 3m0 0 3 3m-3-3-3 3m3-3 3-3m-3 12a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /></svg>
                                </button>
                                <button className='saveBtn cp' onClick={handleBioSubmit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={30} height={30} stroke="#000" strokeWidth={0.001} viewBox="-5.57 -5.57 66.84 66.84"><path d="M27.851 0C12.494 0 0 12.494 0 27.851s12.494 27.851 27.851 27.851 27.851-12.494 27.851-27.851C55.701 12.494 43.208 0 27.851 0zm0 51.213c-12.882 0-23.362-10.48-23.362-23.363 0-12.882 10.48-23.362 23.362-23.362s23.362 10.481 23.362 23.363-10.48 23.362-23.362 23.362z"/><path d="m36.729 18.97-13 13.001-4.757-4.757a2.242 2.242 0 0 0-3.173 0 2.242 2.242 0 0 0 0 3.173l6.344 6.344a2.24 2.24 0 0 0 3.173 0l14.587-14.587a2.245 2.245 0 0 0-3.174-3.174z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cd_profile-bottom cd_pt50 cd_pb20">
                    <div className="container cd_dg gap20">
                        <LeftBar img={Img} id={mainUID} viewing={viewingID} socket={socket} />
                        <div className="posts-wrapper" ref={e=>{postContainer=e}}>
                            <NewPost _uid={id}  />
                            <Post profileImg={prImgSrc} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
