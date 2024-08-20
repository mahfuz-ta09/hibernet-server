import { Request , Response } from "express"
import { fileUploadHelper } from "../../helper/fileUploadHelper"
import { ObjectId } from "mongodb"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')


const getCourseName = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('course')

        const options = {
            projection: { _id: 1, name: 1 }
        }

        const courses = collection.find(options).sort({ "_id": -1 }).toArray()
        const courseCount = collection.countDocuments()

        const metaData = {
            total: courseCount,
            page: 1,
            limmit: 10
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Course retrieval successful!!!',
            meta: metaData,
            data: courses,
        })

    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}


const getCourseContent = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('course')

        const id = req.params.id
        
        if(!id){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No course found!',
            })
        }

        const query = { _id: new ObjectId(id)  }
        const options = {
            projection: { _id: 0, title: 1, imdb: 1 },
        }

        const result = await collection.findOne(query, options)

        if(!result){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Internel server error',
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Data retrieval successfull!',
            data: result,
        })
    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}


const createCourseContent = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('course')

    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}


const updateCourseContent = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('course')

    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}


const deleteCourseContent = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('course')

    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}

module.exports = {
    getCourseName,
    getCourseContent,
    createCourseContent,
    updateCourseContent,
    deleteCourseContent
}