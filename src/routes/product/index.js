'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const {asyncHandler} = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');


//Sign-up

// Authentication
router.use(authentication)
/////////////////////////////
router.post('',asyncHandler(productController.createProduct))



module.exports = router;