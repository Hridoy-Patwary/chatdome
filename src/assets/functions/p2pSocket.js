class socketConn{
    constructor(){
        this.uri = ''
        this.id = ''
        this.notifcationEvent = new CustomEvent("notification", {
            detail: {
                notification:{}
            },
            cancelable: true,
            bubbles: true,
        });
    }


    static socket = '';
    static eventList = ['']
    static msgKeys = [''];



    startConnection = (uri, id)=>{
        this.uri = uri;
        this.id = id
        this.socket = new WebSocket(this.uri+'?id='+this.id);
        this.socket.binaryType = 'arraybuffer';
    }
    closeConnection = ()=>{
        this.socket.close()
    }
    emit = (key, value)=>{
        let _obj = {
            [key]: value
        }
        this.socket.send(JSON.stringify(_obj));
    }
    status = ()=>{
        return this.socket.readyState;
    }
    getSocket = ()=>{
        return this.socket;
    }
    onNotification = (ex)=>{
        this.socket.onmessage = (e)=>{
            const data = JSON.parse(e.data);
            if(data.req){
                this.notifcationEvent.detail.notification = {data, length: 1};
                ex.dispatchEvent(this.notifcationEvent)
            }
        }
    }
}
export default socketConn