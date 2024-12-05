import React, { Component } from 'react'
import VisibleHeader from './mini/VisibleHeader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import CDShare from './CDShare';
import Feature from '../assets/functions/cd-features';
import uri from '../assets/functions/uri';
import i from '../assets/img/icons/features.32x32.png'



export default class Nav extends Component {
    constructor(props){
        super(props);
        this.features = new Feature()
        this.state = {
            clicked: false,
            featuresTabActive: false,
            searchActive: false,
            uid: Cookie.get('id'),
            uname: 'unknown',
            uimg: props.uinfo.img,
            navExpanded: false
        }
        // this.usrInfo(this.state.uid)
    }
    
    usrInfo = (i)=>{
        axios.post(uri+'/api/v1/info', {id: i}).then(rs => {
            this.setState({uname: rs.data.name});
        }).catch(e => {
            console.error(e);
        });
    }
    styleWiper = (elm1, elm2)=>{
        if(elm1){
            elm1.style = ''
        }
        if(elm2) {
            elm2.style = ''
        }
    }
    iniNav = {
        'w': 0,
        'h': 0
    }
    navExpand = (w, h)=>{
        if(this.iniNav.w === 0){
            this.iniNav.w = this.navInner.clientWidth;
            this.iniNav.h = this.navInner.clientHeight;
            this.setState({navExpanded: true});
        }else {
            this.navInner.classList.remove('inlineStyled')
            this.navInner.style.width = this.iniNav.w+'px'
            this.navInner.style.height = this.iniNav.h+'px'
            this.navInner.style.borderRadius = 50+'px'
            this.navInner.style.paddingTop = 0+'px';
            this.iniNav.w = 0;
            this.iniNav.h = 0;
            this.setState({navExpanded: false});
            return
        }
        this.navInner.classList.add('inlineStyled')
        this.navInner.style.width = w+'px'
        this.navInner.style.height = h+'px'
        if(h > 50 ) {
            this.navInner.style.paddingTop = '6px'
            this.navInner.style.borderRadius = 10+'px'
        }
        this.navInner.style.alignItems = 'flex-start'
        this.navInner.style.justifyContent = 'flex-end'
    }

    handleSearch = ()=>{
        this.setState({searchActive: !this.state.searchActive, clicked: false });
        this.styleWiper(this.navInner)
        this.navExpand(300, 34)
    }

    handleSettings = ()=>{
        let i = Cookie.get('id')
        if(this.state.uid !== i){
            this.setState({uid: i})
            // this.usrInfo(i)
        }
        this.setState({clicked: true, searchActive: false});
        const axis = this.navSettingsContainer.getBoundingClientRect();
        this.navSettingsBtn.style.textAlign = 'right'
        this.navSettingsBtn.style.width = '100%'
        this.styleWiper(this.notificationElm, this.notifContainer);
        this.navExpand(axis.width, (axis.height+35));
    }
    openFeaturesTab = ()=>{
        this.setState({featuresTabActive: !this.state.featuresTabActive});
    }


    cdShare = ()=>{
        const height = this.cdShareContainer.getBoundingClientRect().height + 40;
        this.cdShareContainer.parentElement.style.height = height + 'px'
    }
    handleNotifications = ()=>{
        this.notificationElm.style = 'fill: var(--srColor) !important'
        this.notificationElm.style.width = '100%'
        this.notificationElm.style.textAlign = 'right'
        this.notifContainer.style.height = 'auto'
        
        this.setState({clicked: false})
        this.styleWiper(this.navSettingsBtn)
        this.navExpand(220, 300)
    }
    handleWindowClick = (e) => {
        const target = e.target;
        const navMain = target.closest('.cd_mini_nav');
        const axis = this.navSettingsContainer.getBoundingClientRect();

        if(navMain || !this.state.navExpanded) return;

        this.navSettingsBtn.style.textAlign = 'right'
        this.navSettingsBtn.style.width = '100%'
        this.styleWiper(this.notificationElm, this.notifContainer);
        this.navExpand(axis.width, (axis.height+35));
    }
    
    componentDidMount(){
        const axis = this.navInner.getBoundingClientRect()
        this.navInner.style.width = axis.width +'px';
        this.navInner.style.height = axis.height+'px';
        const socket = this.props.socket
        this.notificationElm.addEventListener('notification', (ev)=>{
            this.notificationElm.firstElementChild.classList.remove('cd_dn');
            this.notificationElm.firstElementChild.innerHTML = ev.detail.notification.length;
        })

        this.usrInfo(this.state.uid);
        window.addEventListener('click', this.handleWindowClick);
        socket.onNotification(this.notificationElm);
    }
    componentWillUnmount() {
        // Remove the event listener when the component is unmounted
        window.removeEventListener('click', this.handleClick);
      }

    handleLogOut = ()=>{
        this.setState({clicked: false})
        Cookie.remove('id', {path: ''})
    }
    headerChange = ()=>{
        this.props.changeHeaderMode()
    }
    handleMode = ()=>{
        this.props.changeMode();
    }
    render() {
        return (
            <>
                <VisibleHeader show={this.props.headerMode}/>
                <div className="cd_mini_nav cd_psF cd_zindx999 fOpSans uslctN">
                    <div className="inner cd_psR cd_df cd_al-ic cd_px10" ref={e => this.navInner = e}>
                        <div className="cd_p5 nav_menu_item cp cd_df cd_al-ic">
                            <span onClick={this.handleSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1792 1792" ><path d="M1216 832q0-185-131.5-316.5T768 384 451.5 515.5 320 832t131.5 316.5T768 1280t316.5-131.5T1216 832zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225T64 832t55.5-273.5 150-225 225-150T768 128t273.5 55.5 225 150 150 225T1472 832q0 220-124 399l343 343q37 37 37 90z"></path></svg>
                            </span>
                            <input className={`searchInp bg-none brd-none cd_srTxtClr${this.state.searchActive?' active':''}`} type="text" placeholder='Search'/>
                        </div>
                        <div className='cd_p5 cp cd_psR nav_menu_item' ref={e =>  this.notificationElm = e} onClick={this.handleNotifications}>
                            <div className='notif_indicator cd_psA r0 t0 brd-rds50 cd_df cd_al-ic cd_jstfy-cc bg-srClr cd_zindx_ng1 cd_dn'></div>
                            <svg viewBox="0 0 28 28" alt="" fill="currentColor" height="24" width="24"><path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path></svg>
                        </div>
                        <div className='notif_container cd_psA l0 cd_w100 cd_h90' ref={e => this.notifContainer = e}>
                            <ul className="notif_inner note-txt cd_p10 cd_dg gap10">
                                <li className='cd_df cd_al-ic gap5 bg_grayTrnsparent cd_p5 brd-rds cp'>
                                    <div>
                                        <img src={i} alt="" />
                                    </div>
                                    <div>
                                        <p className='f-bld'>Notification Title</p>
                                        <p className='note-txt fw300'>Lorem ipsum dolor sit amet, consectetur </p>
                                    </div>
                                </li>
                                <li className='cd_df cd_al-ic gap5 bg_grayTrnsparent cd_p5 brd-rds cp'>
                                    <div>
                                        <img src={i} alt="" />
                                    </div>
                                    <div>
                                        <p className='f-bld'>Notification Title</p>
                                        <p className='note-txt fw300'>Lorem ipsum dolor sit amet, consectetur </p>
                                    </div>
                                </li>
                                <li className='cd_df cd_al-ic gap5 bg_grayTrnsparent cd_p5 brd-rds cp'>
                                    <div>
                                        <img src={i} alt="" />
                                    </div>
                                    <div>
                                        <p className='f-bld'>Notification Title</p>
                                        <p className='note-txt fw300'>Lorem ipsum dolor sit amet, consectetur </p>
                                    </div>
                                </li>
                                <li className='cd_df cd_al-ic gap5 bg_grayTrnsparent cd_p5 brd-rds cp'>
                                    <div>
                                        <img src={i} alt="" />
                                    </div>
                                    <div>
                                        <p className='f-bld'>Notification Title</p>
                                        <p className='note-txt fw300'>Lorem ipsum dolor sit amet, consectetur </p>
                                    </div>
                                </li>
                                <li className='cd_df cd_al-ic gap5 bg_grayTrnsparent cd_p5 brd-rds cp'>
                                    <div>
                                        <img src={i} alt="" />
                                    </div>
                                    <div>
                                        <p className='f-bld'>Notification Title</p>
                                        <p className='note-txt fw300'>Lorem ipsum dolor sit amet, consectetur </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="cd_nav-settings cd_p5 nav_menu_item cp" onClick={this.handleSettings} ref={e => this.navSettingsBtn = e}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56c-.03.26-.06.53-.06.79s.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"/><circle cx="12" cy="12" r="3.5"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>
                        </div>
                        <div className={`cd_settings-container cd_psA brd-rds fOpSans f-bld${this.state.clicked?" cd_nav-active":""}`} ref={e => this.navSettingsContainer = e}>
                            <div className={`nav_slider-container${this.state.featuresTabActive?" features-active":""}`}>
                                <div className="cd_settings_container_inner nav_slide cd_px20 cd_py10">
                                    <Link to="/profile" className="lDefault cd_df cd_jstfy-cspb cd_prTxtClr cd_al-ic cd_mb20" onClick={this.handleSettings}>
                                        <span className="cd_TgrayClr mini-nav-usrName f-bld">{this.state.uname}</span>
                                        {/* <img src={JSON.p} alt="" /> */}
                                        <div className={`cd_user-ico cd_px5 cp ${this.state.uimg?"small-user-ico brd-rds50":""}`}></div>
                                    </Link>
                                    <div className="cd_df cd_jstfy-cspb cd_al-ic cd_mb15 fw400 cd">
                                        <span><small>Dark Mode:</small></span>
                                        <div className="cd_onOffBtn">
                                            <span className={`btn-inner cd_db bg-white cp ${this.props.mode?"active":""}`} onClick={this.handleMode}></span>
                                        </div>
                                    </div>
                                    <div className="cd_df cd_jstfy-cspb cd_al-ic cd_mb15 fw400 cd">
                                        <span><small>Show Header:</small></span>
                                        <div className="cd_onOffBtn">
                                            <span className={`btn-inner cd_db bg-white cp ${this.props.headerMode?"active":""}`} onClick={this.headerChange}></span>
                                        </div>
                                    </div>
                                    <div className="cd_df cd_jstfy-cspb cd_al-ic cd_mb15 fw400 cp nav_features" onClick={this.openFeaturesTab}>
                                        <span><small>Features:</small></span>
                                        <span className='features_icon'></span>
                                    </div>
                                    <div className="tc cd_py10">
                                        <Link to="/login" className='log-out cd_db brd-rds lDefault cd_w100 cd_py10 bg-white cd_blkTxtClr' onClick={this.handleLogOut}>Log Out</Link>
                                    </div>
                                </div>
                                <div className="cd_features_container nav_slide cd_w100 cd_px20 cd_py10">
                                    <div className="nav_features_header cd_p10 cd_df cd_jstfy-cspb">
                                        <span className='features_icon cd_db cp' onClick={()=>this.setState({featuresTabActive: !this.state.featuresTabActive})}></span>
                                        <h4>CD Features</h4>
                                    </div>
                                    <div className="cd_features_main cd_pt20">
                                        <div className='cd_feature cd_mb10' onClick={this.cdShare}>
                                            <div className="cd_df cd_jstfy-cspb cd_al-ic fw400 cd_px10 fcdt cp">
                                                <span><small>CD Share:</small></span>
                                                <span>
                                                    <svg fill="#000" version="1.1" width="18" height="18" viewBox="0 0 483 483"><g><path d="M395.72,0c-48.204,0-87.281,39.078-87.281,87.281c0,2.036,0.164,4.03,0.309,6.029l-161.233,75.674   c-15.668-14.971-36.852-24.215-60.231-24.215c-48.204,0.001-87.282,39.079-87.282,87.282c0,48.204,39.078,87.281,87.281,87.281   c15.206,0,29.501-3.907,41.948-10.741l69.789,58.806c-3.056,8.896-4.789,18.396-4.789,28.322c0,48.204,39.078,87.281,87.281,87.281   c48.205,0,87.281-39.078,87.281-87.281s-39.077-87.281-87.281-87.281c-15.205,0-29.5,3.908-41.949,10.74l-69.788-58.805   c3.057-8.891,4.789-18.396,4.789-28.322c0-2.035-0.164-4.024-0.308-6.029l161.232-75.674c15.668,14.971,36.852,24.215,60.23,24.215   c48.203,0,87.281-39.078,87.281-87.281C482.999,39.079,443.923,0,395.72,0z"/></g></svg>
                                                </span>
                                            </div>
                                            <div className='cdShare_container cd_p10' ref={e => this.cdShareContainer = e}>
                                                <CDShare reSize={this.cdShare} uname={this.state.uname}/>
                                            </div>
                                        </div>
                                        <div className='cd_df cd_feature cd_px10 cd_jstfy-cspb cd_al-ic cd_mb10 cp fw400'>
                                            <span><small>Simple Login System:</small></span>
                                            <span>
                                                <svg fill="#000" height="22" width="22" version="1.1" viewBox="0 0 489.10 489.10"  stroke="#000" strokeWidth="0.004891"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="9.782"></g><g><g><g><path d="M208.954,200.1v60.6l-1,147.3l-15.5-12c-19-16.6-63.8-37-99.8,2.4c-3.9,4.3-4.3,10.6-0.9,15.3c1,1.4,25.2,35.3,63.7,71.8 c4.9,4.7,12.7,4.4,17.3-0.5s4.4-12.7-0.5-17.3c-25.5-24.2-44.7-47.5-54.2-59.6c26.5-19.8,55,3.5,58.4,6.5c0.2,0.2,0.4,0.4,0.6,0.5 l35.4,27.3c3.7,2.8,8.7,3.4,12.8,1.3c4.2-2,6.8-6.3,6.9-10.9l1.2-172v-59.9c0-0.1,0-0.2,0-0.4c0.3-9.6,8-17.2,17.7-17.2 c9.8,0,17.7,7.9,17.7,17.7c0,0.5,0,1,0.1,1.5l13.4,111.8c0.6,5.4,4.8,9.7,10.1,10.6c0.8,0.1,83.4,14.3,142.4,52.8 c2.2,14.1,7.2,56.7-2.7,96.1c-1.7,6.6,2.3,13.2,8.9,14.9c1,0.3,2,0.4,3,0.4c5.5,0,10.5-3.7,11.9-9.3 c13.4-53.2,2.6-109.3,2.2-111.7c-0.6-3.1-2.4-5.9-5.1-7.7c-52.7-36.2-122.7-52.8-147.5-57.9l-12.3-102.2 c-0.4-22.9-19.2-41.4-42.2-41.4c-22.7,0-41,17.5-42.1,40.1C208.954,199.2,208.954,199.6,208.954,200.1z"></path><path d="M130.754,24.6h33.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S123.954,24.6,130.754,24.6z"></path><path d="M130.754,116.8h33.9c6.8,0,12.3-5.5,12.3-12.2s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S123.954,116.8,130.754,116.8z"></path><path d="M130.754,208.8h33.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S123.954,208.8,130.754,208.8z"></path><path d="M130.754,300.8h33.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S123.954,300.8,130.754,300.8z"></path><path d="M38.854,24.6h33.9c6.8,0,12.3-5.5,12.3-12.3S79.554,0,72.754,0h-33.9c-6.8,0-12.3,5.5-12.3,12.3S32.054,24.6,38.854,24.6z "></path><path d="M38.854,116.8h33.9c6.8,0,12.3-5.5,12.3-12.2s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S32.054,116.8,38.854,116.8z"></path><path d="M38.854,208.8h33.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S32.054,208.8,38.854,208.8z"></path><path d="M222.554,24.6h33.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S215.854,24.6,222.554,24.6z"></path><path d="M222.554,116.8h33.9c6.8,0,12.3-5.5,12.3-12.2s-5.5-12.3-12.3-12.3h-33.9c-6.8,0-12.3,5.5-12.3,12.3 S215.854,116.8,222.554,116.8z"></path></g></g></g></svg>
                                            </span>
                                        </div>
                                        <div className='cd_df cd_feature cd_px10 cd_jstfy-cspb cd_al-ic cp fw400'>
                                            <span><small>Collaborate:</small></span>
                                            <span>
                                                <svg fill="#000" width="25" height="25" viewBox="0 0 32 32"><path d="M6,21V20H4v1a7,7,0,0,0,7,7h3V26H11A5,5,0,0,1,6,21Z"/><path d="M24,11v1h2V11a7,7,0,0,0-7-7H16V6h3A5,5,0,0,1,24,11Z"/><path d="M11,11H5a3,3,0,0,0-3,3v2H4V14a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v2h2V14A3,3,0,0,0,11,11Z"/><path d="M8,10A4,4,0,1,0,4,6,4,4,0,0,0,8,10ZM8,4A2,2,0,1,1,6,6,2,2,0,0,1,8,4Z"/><path d="M27,25H21a3,3,0,0,0-3,3v2h2V28a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v2h2V28A3,3,0,0,0,27,25Z"/><path d="M20,20a4,4,0,1,0,4-4A4,4,0,0,0,20,20Zm6,0a2,2,0,1,1-2-2A2,2,0,0,1,26,20Z"/></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
