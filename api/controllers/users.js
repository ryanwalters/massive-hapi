'use strict';

const Joi = require('joi');
const Scopes = require('../constants').Scopes;


module.exports = {


    // todo: hash the password
    
    // Create user

    insert: {
        auth: false,
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.save(request.payload, (err, user) => reply({ err, user }));
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
        }
    },


    // Retrieve user

    find: {
        auth: {
            access: {
                scope: [Scopes.USER_ID]
            }
        },
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.findOne(request.params.id, (err, user) => reply({ err, user }));
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            })
        }
    },


    // Update user

    update: {
        auth: {
            access: {
                scope: [Scopes.USER_ID]
            }
        },
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.save(Object.assign(request.params, request.payload), (err, user) => reply({ err, user }));
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            }),
            payload: Joi.object({
                email: Joi.string().email(),
                password: Joi.string()
            }).or('email', 'password')
        }
    },


    // Delete user

    destroy: {
        auth: {
            access: {
                scope: [Scopes.USER_ID]
            }
        },
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.destroy(request.params, (err, user) => reply({ err, user }));
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            })
        }
    }
};