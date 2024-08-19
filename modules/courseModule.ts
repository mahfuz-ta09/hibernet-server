import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { createCourse , getAllCourses , getSingleCourse , deleteCourse , editCourse } = require('../controllers/course/courseEditorailsControllers')
const { enroleCourse } = require('../controllers/course/courseEnrolControllers')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })


// course editorials 
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

router.delete('/delete/:id', 
    deleteCourse)


// course enrol handler

router.post('/enrol/:id', 
    upload.none(),
    enroleCourse)

export const courseModule = router