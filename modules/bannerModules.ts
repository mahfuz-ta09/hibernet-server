import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { getAllBanner , createBanner , deleteBanner , updateBanner} = require('../controllers/banner/bannerControllers')


router.get('/get/all',
    getAllBanner)

router.post('/create',
    fileUploadHelper.upload.single('file'), 
    createBanner)

router.delete('/delete/:id',
    deleteBanner)

router.patch('/update/:id',
    fileUploadHelper.upload.single('file'),
    updateBanner)

export const bannerModules = router