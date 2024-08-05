import { authModule } from "../modules/authModule"
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
]

allRoutes.forEach(route => router.use(route.path,route.route))
module.exports = router