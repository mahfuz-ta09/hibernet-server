import { Request , Response } from "express"
import { fileUploadHelper } from "../../helper/fileUploadHelper"
import { ObjectId } from "mongodb"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')



const createBanner = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('banner')

        const { name , details } = req.body
        if ( !name || !details ){
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
        if(!uploaded.url){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Failed to upload!!!',
                data: uploaded,
            })
        }

        const insertObj = {
            name    : name,
            file     : uploaded.url,
            details : details
        }

        const result = await collection.insertOne(insertObj)
        if(!result){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Failed to insert',
                data: result
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Insertion succeeded',
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

const getAllBanner = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('banner')


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
            message: 'Banner retrieval successfully',
            meta: metaData,
            data: specialties,
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


const deleteBanner = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('banner')

        const id  = req.params.id
        const query = { _id : new ObjectId(id) }
        const exist = await collection.findOne(query)


        if(!exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No data exist to delete!',
                data: exist,
            })
        }

        const deleted:any = await fileUploadHelper.deleteFromCloud(exist?.url)        
        const result = await collection.deleteOne(query)

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
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Internel server error',
            data: err
        })
    }
}

const updateBanner = async( req: Request , res: Response ) =>{
    try{
        const db = getDb()
        const collection = db.collection('banner')

        const id = req.params.id
        const { name , details } = req.body
        const file = req?.file

        const query = { _id : new ObjectId(id) }
        const banner = await collection.findOne(query)

        if(!banner){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: "No banner exist with the id!!!",
            })
        }

        let uploaded:any

        if(file) uploaded = await fileUploadHelper.uploadToCloud(file)
        
        const field:any = {
            name: name ? name : banner.name , 
            details: details ? details : banner.details,
            file: uploaded.url ? uploaded.url : banner.file
        }

        
        const updateDoc = {
            $set: field,
        }

        const result = await collection.updateOne(query, updateDoc)

        if(!result.acknowledged){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: "Failed to update!!!",
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Successfully updated!!!",
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

module.exports = {
    getAllBanner,
    createBanner,
    deleteBanner,
    updateBanner
}