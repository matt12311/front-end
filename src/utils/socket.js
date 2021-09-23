
import io from 'socket.io-client';

const BASE_URL = 'http://localhost:5000'
var connectionOptions =  {                          //before connect_error and connect_timeout are emitted.
    upgrade: false                //forces the transport to be only websocket. Server needs to be setup as well/
}
const socket = io(BASE_URL,connectionOptions);


socket.on('connect', (e) => {
    console.log("connected")
    socket.on('disconnect', () => {
        console.log("client disconnected");
    });
});

export default socket;