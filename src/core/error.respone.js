'use strict'

const httpCodes = require('./httpCodes/httpCode')


class ErrorRespone extends Error {
    constructor(message,status){
        super(message) //Truyen vao cha la Error
        this.status = status
    }
}


class ConflictResponeError extends ErrorRespone{
    constructor(message = httpCodes.ReasonPhrases.CONFLICT , statusCode = httpCodes.StatusCodes.CONFLICT){
        super(message,statusCode)
    }
}

class BadRequestError extends ErrorRespone{
    constructor(message = httpCodes.ReasonPhrases.BAD_REQUEST , statusCode = httpCodes.StatusCodes.BAD_REQUEST){
        super(message,statusCode)
    }
}


module.exports = {
    ConflictResponeError,
    BadRequestError
}