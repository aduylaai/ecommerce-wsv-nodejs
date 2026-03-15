'use strict'

const httpCodes = require('../utils/httpCodes/httpCode')
const {StatusCodes,ReasonPhrases} = require('../utils/httpCodes/httpCode')

class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonCode = ReasonPhrases.OK, metadata = {}}){
        this.message = !message ? reasonCode : message
        this.statusCode = statusCode
        this.metadata = metadata
    }

    send(res) {
        return res.status(this.statusCode).json({
            message: this.message,
            metadata: this.metadata
        })
    }
}

class OKResponse extends SuccessResponse{
    constructor({message,metadata}){
        super({
            message,
            metadata
        })
    }
}

class CreatedResponse extends SuccessResponse{
    constructor({message, metadata}){
        super({
            message,
            statusCode: StatusCodes.CREATED,
            reasonCode: ReasonPhrases.CREATED,
            metadata
        })
    }
}

module.exports = {
    OKResponse,
    CreatedResponse,
    SuccessResponse
}