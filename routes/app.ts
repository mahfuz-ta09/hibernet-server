import { authModule } from "../modules/authModule"
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
]

allRoutes.forEach(route => router.use(route.path,route.route))
module.exports = router