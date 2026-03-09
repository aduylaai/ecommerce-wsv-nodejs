'use strict'
//Luu lai id user + public key
// MUC DICH: 

const {Schema, model} = require('mongoose'); 

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
   publicKey:{
        type: String,
        required: true,
   },
   refreshToken:{
    type: Array, default: []
   } //Detect cac token da su dung roi
},
{
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME,keyTokenSchema);