import { addAdminModule } from "../modules/addAdminModule"
import { authModule } from "../modules/authModule"
import { bannerModules } from "../modules/bannerModules"
import { courseContentModule } from "../modules/courseContentModule"
import { courseModule } from "../modules/courseModule"
import { specialtiesModule } from "../modules/specialtiesModule"

const express = require('express')
const router = express.Router()


const allRoutes = [
    {
        path: '/auth',
        route: authModule
    },
    {
        path: '/specialty',
        route: specialtiesModule
    },
    {
        path: '/course',
        route: courseModule
    },
    {
        path: '/s-admin',
        route: addAdminModule
    },
    {
        path: '/banner',
        route: bannerModules
    },
    {
        path: '/course-content',
        route: courseContentModule
    },
]

allRoutes.forEach(route => router.use(route.path,route.route))
module.exports = router