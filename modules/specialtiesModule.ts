import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { createSpecialties , getAllSpecialties , deleteSpecialty } = require('../controllers/specialties/specialtiesControllers')


router.get('/all', getAllSpecialties)
router.post('/create', fileUploadHelper.upload.single('file'), createSpecialties)
router.delete(`/delete/:id`, deleteSpecialty)


export const specialtiesModule  = router