import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { createSpecialties , getAllSpecialties } = require('../controllers/specialties/specialtiesControllers')


router.get('/all', getAllSpecialties)
router.post('/create', fileUploadHelper.upload.single('file'), createSpecialties)


export const specialtiesModule  = router