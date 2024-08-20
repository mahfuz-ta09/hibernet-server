import { fileUploadHelper } from "../helper/fileUploadHelper"
const express = require('express')
const router = express.Router()
const { getCourseName , getCourseContent , createCourseContent , updateCourseContent , deleteCourseContent } = require('../controllers/course/courseContentControllers')


router.get('',
    getCourseName)

router.get('',
    getCourseContent)

router.put('',
    createCourseContent)

router.patch('',
    updateCourseContent)

router.delete('',
    deleteCourseContent)


export const courseContentModule = router