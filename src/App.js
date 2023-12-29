import React, { Component } from "react";
import "./default.css";
import Home from "./pages/Home";
import Initial from "./pages/ini";
import Chat from "./pages/Chat";
import Nav from "./components/nav";
import Profile from "./pages/Profile";
import Err from "./pages/Err";
import PRImg from './assets/img/pr.JPG'
import { Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import socketConn from "./assets/functions/p2pSocket";
import uri from "./assets/functions/uri";
import Collaboration from "./pages/Collaboration";



const _uid = Cookies.get('id');
const socketInitiator = new socketConn();
socketInitiator.startConnection('ws'+uri.slice(4, -4)+'7071', _uid)
const darkMode = Cookies.get('darkThemeEnabled') === 'false' ? false : true;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      darkModeEnabled: darkMode,
      ShowHeader: false,
      pr: PRImg,
      redirect: _uid!==undefined?false:true
    });
  }
  socket = socketInitiator
  changeHeader = ()=>{
    this.setState({ ShowHeader: !this.state.ShowHeader });
  }
  changeMode = () => {
    this.setState({ darkModeEnabled: !this.state.darkModeEnabled });
    if(Cookies.get('darkThemeEnabled')){
      Cookies.remove('darkThemeEnabled', { path: '' })
    }
    Cookies.set('darkThemeEnabled', !this.state.darkModeEnabled, { expires: 10, path: '' });
    document.documentElement.setAttribute("data-mode", this.state.darkModeEnabled ? "white" : "dark");
  };
  componentDidMount(){
    document.documentElement.setAttribute("data-mode", this.state.darkModeEnabled ? "dark" : "white");
  }

  render() {
  //   if (this.state.redirect) {
  //     console.log(this.state.redirect)
  //     // return <Redirect exact to="/login" />;
  // }
    return (
      <>
        <Nav mode={this.state.darkModeEnabled} headerMode={this.state.ShowHeader} changeHeaderMode={this.changeHeader} socket={this.socket} uinfo={{id: _uid ,img: PRImg}} changeMode={this.changeMode} />
        <Switch>
          <Route exact path="/" component={_uid?()=><Home id={_uid} socket={this.socket} />:Home} />
          <Route exact path="/profile" component={()=><Profile socket={this.socket} id={_uid}/>} />
          <Route exact path="/welcome" component={Initial} />
          <Route exact path="/collaboration" component={Collaboration} />
          <Route exact path="/login" component={Initial} />
          <Route exact path="/signup" component={Initial} />
          <Route exact path="/chat" component={_uid?()=><Chat socket={this.socket} id={_uid}/>:Chat} />
          <Route component={Err} />
        </Switch>
      </>
    );
  }
}
