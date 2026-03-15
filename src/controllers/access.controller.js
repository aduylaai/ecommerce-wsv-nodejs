'use strict'

const AccessService = require("../services/access.service");
const {CreatedResponse,SuccessResponse} = require('../core/success.response')


class AccessController
{
    signUp = async (req , res , next) => {
         new CreatedResponse({
                message: 'Register OK!',
                metadata: await AccessService.signUp(req.body)
            }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            Message: 'Succesful Login!',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

}

module.exports = new AccessController()