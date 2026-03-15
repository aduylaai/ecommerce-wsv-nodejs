'use strict'

const httpCodes = require('../utils/httpCodes/httpCode')


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

class ForbiddenError extends ErrorRespone{
    constructor(message = httpCodes.ReasonPhrases.FORBIDDEN , statusCode = httpCodes.StatusCodes.FORBIDDEN){
        super(message,statusCode)
    }
}

class AuthFailureError extends ErrorRespone{
    constructor(message = httpCodes.ReasonPhrases.UNAUTHORIZED , statusCode = httpCodes.StatusCodes.UNAUTHORIZED){
        super(message,statusCode)
    }
}


module.exports = {
    ConflictResponeError,
    BadRequestError,
    ForbiddenError,
    AuthFailureError
}