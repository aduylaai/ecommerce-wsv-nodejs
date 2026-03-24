'use strict'

const ProductService = require("../services/product.service");
const {CreatedResponse,SuccessResponse} = require('../core/success.response')


class AccessController
{
   createProduct = async (req,res,next) => {

    new SuccessResponse({
        message:'Create new Prodduct Succeess!!!',
        statusCode: 201,
        metadata: await ProductService.createProduct(req.body.product_type, {
            ...req.body,
            product_shop: req.user.userID
        })
    }).send(res)

   }
}

module.exports = new AccessController()