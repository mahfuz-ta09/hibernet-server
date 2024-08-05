import { SourceOrigin } from "module"
const allowedOrigins = require('./allowedOrigins')

const corsOption = {
    origin: (origin: SourceOrigin, callback:any) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error("Not Allowed by CORS"))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOption