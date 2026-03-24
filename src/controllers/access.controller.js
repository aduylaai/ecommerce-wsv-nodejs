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

    logout = async (req, res, next) => {
        new SuccessResponse({
            Message: 'Succesful Logout!',
            metadata: await AccessService.logout( req.keyStore )
        }).send(res)
    }

    handleRefreshToken = async (req,res,next)=>{
        // new SuccessResponse({
        //     message: 'Get token Sucess!',
        //     metadata: await AccessService.handleRefreshToken(req.body)
        // }).send(res)


        //V2 fixed no need AT to verify for this route
        new SuccessResponse({
            message: 'Get token Sucess!',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
        
    } 

}

module.exports = new AccessController()