'use strict';

const Confidence = require('confidence');
const Package = require('../package');
const Path = require('path');


// Declare criteria

const criteria = {
    env: process.env.NODE_ENV
};


// Declare internals, anything used in multiple places

const internals = {
    cookieName: 'cookie-name'
};


// Config

const config = {
    version: Package.version,
    api: {
        version: '/v1'
    },
    auth: {
        cookie: {
            $filter: 'env',
            $base: {
                cookie: internals.cookieName
            },
            production: {
                isSecure: true,
                password: process.env.COOKIE_PASSWORD
            },
            $default: {
                isSecure: false,
                password: 'TheMinimumLengthOfPasswordsIs32!'
            }
        },
        jwt: {
            $filter: 'env',
            $base: {
                cookie: internals.cookieName,
                issuer: 'example.io',
                token: 'accessToken'
            },
            production: {
                secret: process.env.JWT_SECRET
            },
            $default: {
                secret: 'ADifferentPasswordAlsoAtLeast32!'
            }
        }
    },
    connection: {
        port: {
            $filter: 'env',
            production: process.env.PORT,
            $default: 5001
        },
        routes: {
            cors: {
                origin: ['.example.io']
            }
        },
        uri: {
            $filter: 'env',
            production: 'https://api.example.io'
        }
    },
    db: {
        $filter: 'env',
        test: {
            connectionString: Path.join('sqlite://', __dirname, '/database.sqlite')
        },
        $default: {
            connectionString: process.env.DATABASE_URL
        }
    },
    server: {}
};

const store = new Confidence.Store(config);

exports.get = (key) => store.get(key, criteria);
