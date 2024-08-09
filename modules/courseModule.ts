import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { createCourse , getAllCourses , getSingleCourse , deleteCourse , editCourse } = require('../controllers/course/courseEditorailsControllers')


router.get('/all', 
    getAllCourses)

router.get('/single/:id', 
    getSingleCourse)

router.post('/create', 
    fileUploadHelper.upload.single('file'), 
    createCourse)

router.patch('/update/:id', 
    fileUploadHelper.upload.single('file'), 
    editCourse)

router.delete(`/delete/:id`, 
    deleteCourse)


export const courseModule  = router