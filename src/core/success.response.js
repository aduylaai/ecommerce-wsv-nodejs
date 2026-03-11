'use strict'

const httpCodes = require('./httpCodes/httpCode')


class SucessResponse extends Response {
    constructor(message,status){
        super(message) //Truyen vao cha la Error
        this.status = status
    }
}





module.exports = {
    ConflictResponeError,
    BadRequestError
}