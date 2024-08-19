const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const { createAdmin , updateAdminStatus , getAllAdmin } = require('../controllers/superAdmin/addAdminControllers')


router.post('/create',
    upload.none(),
    createAdmin)

router.patch(`/update/:status/:id`,
    updateAdminStatus)

router.get('/all/admin',
    getAllAdmin)

export const addAdminModule = router