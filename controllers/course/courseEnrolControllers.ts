import { Request , Response } from "express"
import { ObjectId } from "mongodb"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')



const enroleCourse = async( req: Request , res: Response) =>{
    try{
        const db = getDb()
        const collection = db.collection('course')

        const id = req.params.id
        console.log(id,req.body)
        const { stdID , stdEmail } = req.body

        if(!id || !stdID || !stdEmail){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: "Something missing!!!",
            })
        }

        const enrolObj = {
            stdID: stdID,
            stdEmail: stdEmail,
            paid: false,
            lastWatched: '',
            watchLst:[],
        }

        const query = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
            $push: {
                studentData: enrolObj,
            },
        }

        const result = await collection.updateOne(query , updateDoc , options)
        console.log(result)
        if(!result.acknowledged){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: "Failed to enrol!!!",
            })
        }
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: "Successfull! Pay to finish the process!!!",
            data: result,
        })

    }catch(err){
        console.log(err)
    }
}

module.exports = {
    enroleCourse
}