'use strict'

const { ForbiddenError } = require("../core/error.response")
const apikeyModel = require("../models/apikey.model")
const { findById } = require("../services/apikey.service")
const crypto = require('crypto')


const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const apiKey = async (req, res, next) => {
    try {

        //Code newKey
        // const newApiKey = apikeyModel.create({
        //     key: crypto.randomBytes(64).toString('hex'), permission: ['0000']
        // })
        
        // console.log(`APIKEY :: `,newApiKey.key);

        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permission){
            return res.status(403).json({
                message: 'Permission Denined'
            })
        }
        console.log('Permission :: ', req.objKey.permission);

        //Check valid
        const validPermission = req.objKey.permission.includes(permission)
        if(!validPermission)
        {
            throw new ForbiddenError("Permission denied");
        }
        return next()
    }
}

const asyncHandler = fn => {
    return (req,res,next) =>{
        fn(req,res,next).catch(next)
    }
}


module.exports = {
    apiKey,
    permission,
    asyncHandler
}