'use strict'
const {product, clothing, electronic} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
//Define factory class to create

class ProductFactory{
    static async createProduct(type, payload){
      /* 
      INPUT::
      type: 'Clothing'
      payload
      */

        switch (type) {
            case 'Electronic':
                return new ElectronicProduct(payload).createProduct()
            case 'Clothing':
                return new ClothingProduct(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product types ${type}`);
        }

    }
}

class Product {
    constructor({
        product_name,product_thumb,product_description,product_price,product_quantity,product_type,product_shop,product_attributes
    }){
        this.product_name=product_name
        this.product_thumb=product_thumb
        this.product_description=product_description
        this.product_price=product_price
        this.product_quantity=product_quantity
        this.product_type=product_type
        this.product_attributes=product_attributes
        this.product_shop=product_shop
    }

    async createProduct(){
        return await product.create(this)
    }
}

class ClothingProduct extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Create New Product Error!')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create New Product Error!')
        
        return newProduct;
        
    }
}

class ElectronicProduct extends Product{
    async createProduct(){
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestError('Create New Product Error!')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create New Product Error!')
        
        return newProduct;
    }
}

module.exports = ProductFactory