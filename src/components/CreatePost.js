import axios from 'axios';
import React from 'react'
import uri from '../assets/functions/uri';




const CREATEPOSTENDPOINT = uri+'/api/v1/npost';



export default function CreatePost(props) {
    let createPostMainContainer;
    const handlePost = ()=>{
        let postObj = {
            txt: createPostMainContainer.children[0].value,
            uid: props._uid,
            privacy: 'public'
        }
        createPostMainContainer.children[0].value = ''
        axios.post(CREATEPOSTENDPOINT, postObj).then(rs => {
            console.log(rs.data)
        }).catch(error => {
            console.error(error);
        });
    }
    return (
        <div className='create-post-container cd_pb20 cd_px20 cd_w100 brd-rds cd_mb10'>
            <div className='heading cd_py20 tc cd_df cd_jstfy-cspb cd_al-ic'>
                <div className="small-user-ico brd-rds50" style={{background: `url(${props.img})`}}></div>
                <h4>Create Post</h4>
                <div className="three-dott cd_df cd_al-ic cd_jstfy-cc brd-rds50 cp uslctN"><span className="cd_db brd-rds50"></span><span className="cd_db brd-rds50"></span><span className="cd_db brd-rds50"></span></div>
            </div>
            <div className='create-post-main cd_py10' ref={e=>createPostMainContainer = e}>
                <textarea className='cd_w100 cd_p10 fOpSans' placeholder="What's in your mind? type here..."></textarea>
            </div>
            <div className="cd_py10 cp uslctN bg-srClr brd-rds cp post-submit tc" onClick={handlePost}>
                <h4 className='cd_py5'>Post</h4>
            </div>
        </div>
    )
}
