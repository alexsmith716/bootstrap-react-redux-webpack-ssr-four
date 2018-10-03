import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import axios from 'axios';
import config from '../config/config';


// localForage is a asynchronous storage library for JavaScript
// localForage uses localStorage in browsers
// configure client side storage
// store any type in localForage
// localForage automatically does `JSON.parse()` and `JSON.stringify()` when getting/setting values
const storage = __SERVER__ ? null : require('localforage');

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

// ===================================================================================

// localforage: API to access localStorage

// Returning '@feathersjs/feathers' instance

// SERVER
//    Connection:       'REST'
//    Transport method: 'axios/ajax'
//    Authentication:   'null'

// CLIENT:
//    Connection:       'real-time'
//    Transport method: 'socket'
//    Authentication:   'passing localforage'

// ===================================================================================


// Feathers: REST and realtime API layer
// Feathers is a set of tools and an architecture pattern 
//    that make it easy to create scalable REST APIs and real-time applications
const configureApp = transport =>
  feathers()
    .configure(transport)
    .configure(authentication({ storage }));

// ===================================================================================

// return instance of 'socket' if client '{ socket, createApp }'
export const socket = io('', { path: host('/ws'), autoConnect: false });

// ===================================================================================

export function createApp(req) {

  // test if 'rest-client' (server)
  if (req === 'rest') {
    return configureApp( rest(host('/api')).axios(axios) );
  }

  // -------- SERVER ----------------------------------------------
  if (__SERVER__ && req) {

    // const app = configureApp( rest(host('/api')).axios(axios.create(headers:{})) );
    const app = configureApp( rest(host('/api')).axios(axios.create({
      headers: {
        Cookie: req.get('cookie'),
        authorization: req.header('authorization') || ''
      }
    })) );

    const accessToken = req.header('authorization') || (req.cookies && req.cookies['feathers-jwt']);
    app.set('accessToken', accessToken);

    return app;
  }

  // -------- CLIENT ----------------------------------------------
  return configureApp( socketio(socket) );
}


