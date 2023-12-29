import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import LeftBar from '../components/mini/LeftBar'
import Post from '../components/Post'
import '../components/css/home.css'
import PRImg from '../assets/img/pr.JPG'
import CreatePost from '../components/CreatePost';

export default function Home(props) {
    const id = Cookies.get('id');
    if(!id){
        window.location.assign('/login')
    }
    useEffect(()=>{
        document.title = "ChatDome | Home";
    })
    return (
        <div className='home_page_main container cd_py20 fOpSans'>
            <h2 className='cd_py20'>Activity Feed</h2>
            <div className="container_inner cd_dg gap20">
                <LeftBar uimg={PRImg} id={id} />
                <div className="posts-wrapper">
                    <CreatePost _uid={props.id} uimg={PRImg}/>
                    <Post uimg={PRImg}/>
                    <Post uimg={PRImg}/>
                    <Post uimg={PRImg}/>
                    <Post uimg={PRImg}/>
                </div>
            </div>
        </div>
    )
}
