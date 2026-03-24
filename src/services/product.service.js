'use strict'
const {product, clothing, electronic, furniture} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
//Define factory class to create

class ProductFactory{

    static productTypeRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productTypeRegistry[type] = classRef
    }

    static async createProduct(type, payload){
        //V2: APPLY stragery 
        const productClass = ProductFactory.productTypeRegistry[type]
        if (!productClass) {
            throw new BadRequestError(`Invalid product types ${type}`);
        }

        return new productClass(payload)


        // switch (type) {
        //     case 'Electronics':
        //         return new ElectronicProduct(payload).createProduct()
        //     case 'Clothing':
        //         return new ClothingProduct(payload).createProduct()
        //     default:
        //         throw new BadRequestError(`Invalid product types ${type}`);
        // }
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

    async createProduct(productId){
        return await product.create({
            ...this,
            _id: productId
        })
    }
}

class ClothingProduct extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if(!newClothing) throw new BadRequestError('Create New Product Error!')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error!')
        
        return newProduct;
        
    }
}

class ElectronicProduct extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create New Product Error!')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error!')
        
        return newProduct;
    }
}

class FurnitureProduct extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Create New Product Error!')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error!')
        
        return newProduct;
    }
}


ProductFactory.registerProductType('Clothing', ClothingProduct)
ProductFactory.registerProductType('Electronics', ElectronicProduct)
ProductFactory.registerProductType('Furniture', FurnitureProduct)

module.exports = ProductFactory