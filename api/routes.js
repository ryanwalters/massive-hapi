'use strict';

const Auth = require('./controllers/auth');
const Users = require('./controllers/users');


// Declare internals

const internals = {};


// todo: https://github.com/hapijs/crumb

// Routes

internals.routes = [


    // Auth

    { method: 'POST', path: '/login', config: Auth.login },
    { method: 'POST', path: '/logout', config: Auth.logout },


    // Users

    { method: 'POST', path: '/users', config: Users.save },
    { method: 'GET', path: '/users/{id}', config: Users.find },
    { method: 'DELETE', path: '/users/{id}', config: Users.destroy }
];


// Plugin

exports.register = (server, options, next) => {

    server.route(internals.routes);

    return next();
};

exports.register.attributes = {
    name: 'api-routes',
    version: '1.0.0'
};