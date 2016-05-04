'use strict';

const Config = require('../config');
const Scopes = require('../constants').Scopes;
const Joi = require('joi');
const Jwt = require('jsonwebtoken');


// todo: hash the password
// todo: invalidate refresh tokens by resetting user's jti

module.exports = {


    // Login

    login: {
        auth: false,
        handler: (request, reply) => {

            const db = request.server.app.db;

            db.users.findOne(request.payload, (err, user) => {


                // Bad login

                if (!user) {
                    return reply(false);
                }


                // Valid login, create tokens

                const accessToken = Jwt.sign({
                    scope: [`${Scopes.USER}-${user.id}`]
                }, Config.get('/auth/jwt/secret'), {
                    expiresIn: 60,
                    issuer: Config.get('/auth/jwt/issuer')
                });

                const refreshToken = Jwt.sign({
                    scope: [Scopes.REFRESH]
                }, Config.get('/auth/jwt/secret'), {
                    expiresIn: 60 * 60 * 24,
                    issuer: Config.get('/auth/jwt/issuer')
                });


                // Set tokens in the cookie

                request.cookieAuth.set({ accessToken, refreshToken });

                return reply(true);
            });
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
        }
    },


    // Logout

    logout: {
        auth: false,
        handler: (request, reply) => {

            request.cookieAuth.clear();

            return reply(true);
        }
    }
};