import { Request , Response } from "express"
import { fileUploadHelper } from "../../helper/fileUploadHelper"
import { ObjectId } from "mongodb"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')



const createSpecialties = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('specialties')

        const { name } = req.body
        if (!name){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Name required!!!',
            })
        }

        const file = req.file
        if(!file){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'File required!!!',
            })
        }

        const uploaded:any = await fileUploadHelper.uploadToCloud(file)
        if(!uploaded){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Failed to upload!!!',
                data: uploaded,
            })
        }

        const insertObj = {
            name: name,
            url: uploaded.url
        }

        const result = await collection.insertOne(insertObj)

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Insertion succeeded',
            data: result,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllSpecialties = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('specialties')


        const specialties = await collection.find().sort({"_id": -1}).toArray()
        const countSp     = await collection.countDocuments()

        const metaData = {
            page: 0,
            limit: 0,
            total: countSp,
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Specialty retrieval successfully',
            meta: metaData,
            data: specialties,
        })
    }catch(err){
        console.log(err)
    }
}


const deleteSpecialty = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('specialties')

        const id  = req.params.id
        const query = { _id : new ObjectId(id) }
        const exist = await collection.findOne(query)


        if(!exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No data exist',
                data: exist,
            })
        }

        const result = await collection.deleteOne(query);
        
        if(!result.acknowledged){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: "Failed to delete!!!",
                data: result,
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Successfully deleted!!!",
            data: result,
        })
    }catch(err){
        console.log("error",err)
    }
}


module.exports = {
    getAllSpecialties,
    createSpecialties,
    deleteSpecialty
}