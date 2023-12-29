import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../logo.svg'

export default function VisibleHeader(props) {
    return (
        <div className={`visible-header cd_py10 cd_psA t0 l0 cd_zindx1 cd_w100${props.show?" fade-in": ""}`}>
            <div className="container">
                <Link to="/" className="lDefault cp uslctN cd_df cd_al-ic gap5">
                    <img src={logo} alt="" width={30}/>
                    <h3>ChatDome</h3>
                </Link>
            </div>
        </div>
    )
}
