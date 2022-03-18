WebSocket provides real-time comunication, with that we can sent notification when one signal in found.

> Note: Your WebSocket client implementation must comply with
> the `v13` version of the protocol documented in the
> <a href="https://www.ietf.org/rfc/rfc6455.txt" target="_blank">RFC6455.</a>

To connect with server you should be send the next Model as second parameter.
<!-- <SchemaDefinition schemaRef="#/components/schemas/users_res" /> -->

### Nodejs example:
```js
import { io } from "socket.io-client";

const options = {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 10000,
  "transports": [ "websocket" ],
  "auth": {
    "key": "string"
  }
}
      
const socket = io("wss://dseniales.blockchainconsultora.com", options)
```

To more information abound socket integration as client, review
Mas informacion acerca de integracion socket como cliente revise
<a href="https://socket.io/docs/v3/client-api" target="_blank">socket.io</a>