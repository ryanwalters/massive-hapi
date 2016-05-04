'use strict';

const Config = require('./api/config');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Massive = require('massive');
const Scopes = require('./api/constants').Scopes;

const server = new Hapi.Server(Config.get('/server'));

server.connection(Config.get('/connection'));


// DB

server.app.db = Massive.connectSync({
    connectionString: Config.get('/db/connectionString')
});


// Cookies

server.register(require('hapi-auth-cookie'), (err) => {

    Hoek.assert(!err, err);

    server.auth.strategy('session', 'cookie', Config.get('/auth/cookie'));
});


// JWT

server.register(require('jot'), (err) => {

    Hoek.assert(!err, err);

    server.auth.strategy('jwt', 'jwt', Config.get('/auth/jwt'));
    
    server.auth.default({
        strategy: 'jwt',
        scope: [Scopes.ADMIN]
    });
});


// Routes

server.register(require('./api/routes'), {
    routes: {
        prefix: Config.get('/api/version')
    }
}, (err) => Hoek.assert(!err, err));


// Start server

/* $lab:coverage:off$ */
if (!module.parent) {
    server.start(() => console.log('Server started', server.info.uri));
}
/* $lab:coverage:on$ */

module.exports = server;