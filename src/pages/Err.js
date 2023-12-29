import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/css/err.css";

export default function Err() {
    useEffect(() => {
        document.title = "404 Page not found!";
    });
    return (
        <section className="page_404 cd_py40">
            <div className="cd_dg cd_al-ic h100vh">
                <div className="tc">
                    <div className="four_zero_four_bg">
                        <h1>404</h1>
                    </div>
                    <div>
                        <h3 className="h2">
                            Look like you're lost
                        </h3>
                        <p>the page you are looking for not avaible!</p>
                        <Link to="/" className="link_404 cd_my20 cd_py10 cd_px20 lDefault">Go to Home</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
