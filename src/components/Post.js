import React from 'react'
import './css/post.css'
import PR from '../assets/img/pr.JPG'

export default function Post(props) {
    return (
        <div className="cd_post cd_w100 brd-rds cd_mb20">
            <div className="post-top cd_px20 cd_py10 uslctN cd_df cd_jstfy-cspb">
                <div className="post-top-left cd_df cd_al-ic gap5 cd_my5">
                    <div className="small-user-ico brd-rds50"></div>
                    <div className="post-top-details">
                        <h4>Hridoy Patwary</h4>
                        <small className='cd_srTxtClr'>10.12.2020</small>
                    </div>
                </div>
                <div className="post-top-right cd_df cd_al-ic">
                    <div className="three-dott cd_df cd_al-ic cd_jstfy-cc brd-rds50 cp uslctN">
                        <span className="cd_db brd-rds50"></span><span className="cd_db brd-rds50"></span><span className="cd_db brd-rds50"></span>
                    </div>
                </div>
            </div>
            <div className="post-main cd_px20">
                <div className="post-content cd_srTxtClr cd_py10">
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum porro officia exercitationem quaerat libero, similique laborum ipsa maxime impedit molestias sapiente a dolorum culpa omnis cupiditate nulla inventore doloremque
                        tempora? <span className="link">Click</span>
                    </p>
                </div>
                <div className="post-media cp uslctN">
                    <img className="cd_w100" src={PR} alt="" />
                </div>
                <div className="post-bottom cd_df cd_al-ic cd_jstfy-cspb cd_pt5 cd_pb10 f-bld uslctN">
                    <div className="react pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp">
                        <div className="ico"></div>
                        <span>Like</span>
                    </div>
                    <div className="comment pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp">
                        <div className="ico"></div>
                        <span>Comment</span>
                    </div>
                    <div className="share pb-buttons brd-rds cd_px20 cd_py10 cd_df cd_al-ic gap5 cp">
                        <div className="ico"></div>
                        <span>Share</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
