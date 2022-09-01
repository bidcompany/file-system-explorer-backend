const express = require('express');
const fileController = require('./../controllers/fileController');

const router = express.Router();



router
    .route('/')
    .get(fileController.getList)
    ;

router
    .route('/donwload')
    .get(fileController.getFile)
    ;

router
    .route('/size')
    .get(fileController.getFolderSize)
    ;

router
    .route('/folder')
    .get(fileController.getCompressedFolder)
    ;

module.exports = router ;  