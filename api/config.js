'use strict';

const Confidence = require('confidence');
const Package = require('../package');
const Path = require('path');


// Declare criteria

const criteria = {
    env: process.env.NODE_ENV
};


// Config

const config = {
    version: Package.version,
    api: {
        version: '/v1'
    },
    auth: {
        jwt: {
            $filter: 'env',
            $base: {
                issuer: 'example.io'
            },
            production: {
                secret: process.env.JWT_SECRET
            },
            $default: {
                secret: 'TheMinimumLengthOfPasswordsIs32!'
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
    server: {},
    showServerErrors: {
        $filter: 'env',
        production: false,
        $default: true
    }
};

const store = new Confidence.Store(config);

exports.get = (key) => store.get(key, criteria);
