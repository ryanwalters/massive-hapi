'use strict';

const Joi = require('joi');

module.exports = {


    // Create/update user

    save: {
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.save(request.payload, (err, user) => reply({ err, user }));
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required(),
                id: Joi.number().integer(),
                password: Joi.string()
            }).or('id', 'password')
        }
    },


    // Retrieve user

    find: {
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


    // Delete user

    destroy: {
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.destroy(request.payload, (err, user) => reply({ err, user }));
        },
        validate: {
            payload: Joi.object({
                id: Joi.number().integer().required()
            })
        }
    }
};