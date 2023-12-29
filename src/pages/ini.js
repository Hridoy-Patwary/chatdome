import React, { Component } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../components/css/ini.css'
import Earth from '../assets/earth.svg'
import Moon from '../assets/moon.svg'
import Rocket from '../assets/rocket.svg'
import Astronaut from '../assets/astronaut.svg';
import { Redirect } from 'react-router-dom'
import uri from '../assets/functions/uri';



export default class Initial extends Component {
    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            lActive: window.location.pathname==="/login"?true:false,
            heading: 'Sing Up',
            name: '',
            email: '',
            pass: ''
        }
    }
    componentDidMount(){
        this.setState({heading: !this.state.lActive?"Sign Up":"Log In"});
        document.title = "Welcome to the Dome";
    }


    handleLogIn = ()=>{
        this.props.history.push(!this.state.lActive?"/login":"/signup");
        this.setState({lActive: !this.state.lActive, heading: this.state.lActive?"Sign Up":"Log In"})
    }
    crdUpdate = (e)=>{
        this.setState({name: this.inpContainer.children[0].children[0].value,email: this.inpContainer.children[1].children[0].value, pass: this.inpContainer.children[2].children[0].value});
        if(e.key === "Enter"){
            this.submitCredentians()
        }
    }
    postRq = (url, json)=>{
        axios.post(url, json).then(rs => {
            if(rs.data.uid){
                Cookies.set('id', rs.data.uid, { expires: 7, path: '' }); // add user id in cookie
                this.setState({redirect: true}); // then redirect to the home page
            }else if(rs.data === 'NE'){
                alert('Wrong email')
            }else if(rs.data === 'WP'){
                alert('Wrong password')
            }
        }).catch(error => {
            console.error(error);
        });
    }
    submitCredentians = ()=>{
        const crd = {
            name: this.state.name,
            email: this.state.email,
            pass: this.state.pass
        }
        if(this.state.heading === "Log In"){
            this.postRq(uri+'/api/v1/login', {email: crd.email, pass: crd.pass});
        }else{
            this.postRq(uri+'/api/v1/signup', crd);
        }
    }
    render() {
        if (this.state.redirect) {
            return <Redirect exact to="/profile" />;
        }
        return (
            <div className="cd_ini_pg cd_h100">
                <div className="ini_inner cd_h100 cd_dg">
                    <div className="tc uslctN pntrEvN cd_py30 al_slfEnd cd_psR fTeko">
                        <h1 className="f-lighter">Welcome to the <span className="cd_TsrClr f-bld">Dome</span></h1>
                        <div className="cd_circle cd_psA"></div>
                    </div>
                    <div className={`ini-grid cd_dg cd_jstfy-cc cd_w90 cd_mxauto cd_px20 cd_py30 gap40 al_slfBase${this.state.lActive?" logInActive":""}`}>
                        <div className="ini_boxes content">
                            <h2>New on ChatDome?</h2>
                            <p className="cd_TgrayClr cd_mb20">ChatDome is a way to commiunicate with your friends and family, also you can make friends all over the world.</p>
                            <p className="cd_TlsgrayClr f-bld">Maybe you're wondering why should you use <span className="cd_prTxtClr"> ChatDome</span>, right?</p>
                            <p className="cd_TlsgrayClr f-bld cd_mb5">Well, let me explain. Here's why you should use <span className="cd_prTxtClr">ChatDome</span> instead of current social media giants</p>
                            <ul className="cd_TgrayClr cd_ml10">
                                <li>First and foremost is <span className="cd_prTxtClr f-bld">ChatDome does not collect user data</span></li>
                                <li>You can send messages encrypted or without encryption</li>
                                <li>It's easy to use</li>
                                <li>Too many customization available</li>
                                <li>You can also create posts, comment on posts and lots of features</li>
                                <li>It doesn't require user personal information</li>
                                <li>To create an account in ChatDome, you just need your Name, mail account or a phone number nothing else</li>
                            </ul>
                        </div>
                        <div className="ini_boxes cd_signOrLog cd_p30 brd-rds uslctN">
                            <h2 className="tc cd_py10 uslctN fTeko">{this.state.heading}</h2>
                            <div className="inp-container tc" ref={(e)=>this.inpContainer = e}>
                                <div className="txt_field cd_psR cd_my10">
                                    <input type="text" className="inp_name cd_w100" required onKeyUp={this.crdUpdate}></input>
                                    <span></span>
                                    <label className="cd_psA pntrEvN cd_TlsgrayClr">name</label>
                                </div>
                                <div className="txt_field cd_psR cd_my10">
                                    <input type="email" className="inp_email cd_w100" required onKeyUp={this.crdUpdate}></input>
                                    <span></span>
                                    <label className="cd_psA pntrEvN cd_TlsgrayClr">email</label>
                                </div>
                                <div className="txt_field cd_psR cd_my10">
                                    <input type="password" className="inp_pass cd_w100" required onKeyUp={this.crdUpdate}></input>
                                    <span></span>
                                    <label className="cd_psA pntrEvN cd_TlsgrayClr">pass</label>
                                </div>
                                <button className="submit-btn brd-rds bg-srClr f-bld cp cd_mt10 cd_mb5" onClick={this.submitCredentians}>{this.state.lActive?"Log In": "Sign Up"}</button>
                                <p className="tc cd_pt5">{this.state.lActive?"Don't have an account?":"Already Have an account?"} <span className="have-an-cd-acc link f-bld" onClick={this.handleLogIn}>{this.state.lActive?"Sign Up": "Log In"}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="floating-objects stars cd_psA t0 l0 w100vw h100vh uslctN cd_zindx_ng1 pntrEvN">
                    <img className="object_rocket cd_psA" src={Rocket} width="40px" alt='' />
                    <div className="earth-moon">
                        <img className="object_earth cd_psA cd_zindx1" src={Earth} width="100px" alt=''/>
                        <img className="object_moon cd_psA" src={Moon} width="80px" alt='' />
                    </div>
                    <div className="glowing_stars">
                        <div className="star cd_psA brd-rds50"></div>
                        <div className="star cd_psA brd-rds50"></div>
                        <div className="star cd_psA brd-rds50"></div>
                        <div className="star cd_psA brd-rds50"></div>
                        <div className="star cd_psA brd-rds50"></div>
                    </div>
                    <div className="box_astronaut cd_psA">
                        <img className="object_astronaut" src={Astronaut} width="140px" alt=''/>
                    </div>
                </div>
            </div>
        )
    }
}
