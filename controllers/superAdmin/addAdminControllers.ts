import { Request , Response } from "express"
const bcrypt = require("bcrypt")
import { fileUploadHelper } from "../../helper/fileUploadHelper"
import { ObjectId } from "mongodb"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')


const createAdmin = async( req: Request , res: Response ) =>{
    try{
        const db = getDb()
        const collection = db.collection('admin')


        const { email , password } = req.body
        if(!email || !password){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No empty field allowed!',
            })
        }

        const query = { email : email }
        const exist = await collection.findOne(query)

        if(exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Already exist in the list!',
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const insertData = {
            email : email,
            password:  hashedPassword,
            status: true
        }
        const result = await collection.insertOne(insertData)

        if(!result.acknowledged){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Failed to add admin',
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Successfully added new admin',
            data:result
        })
    }catch(err){
        console.log(err)
    }
}


const deleteAdmin = async( req: Request , res: Response) =>{
    try{
        const db = getDb()
        const collection = db.collection('admin')

        const id = req.params.id
        if(!id){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Must need id!',
            })
        }

        const query = { _id: new ObjectId(id) }
        const exist = await collection.findOne(query)
        if(!exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No data exist to delete!',
            })
        }

        const result = await collection.deleteOne(query)

        if(!result.acknowledged){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Failed to delete.',
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Successfully deleted!',
            data:result
        })
    }catch(err){
        console.log(err)
    }
}



const updateAdminStatus = async ( req: Request , res: Response ) =>{
    try{
        const db = getDb()
        const collection = db.collection('admin')

        const id = req.params.id
        const status = req.params.status
        
        if(!id){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Must need id!',
            })
        }


        const query = { _id: new ObjectId(id) }
        const exist = await collection.findOne(query)
        
        if(!exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No data exist to delete!',
            })
        }


        const updateDoc = {
            $set: {
                status: exist?.status == true ? false : true
            },
        }
        const result = await collection.updateOne(query, updateDoc)
        
        if(result.modifiedCount !== 1){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Failed to update status.',
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Successfully deleted!',
            data:result
        })
    }catch(err){
        console.log(err)
    }
}


const updateAdminPassword = async( req: Request , res: Response) =>{
    try{
        const db = getDb()
        const collection = db.collection('admin')

        const id = req.params.id
        const password = req.params.password
        if(!id || !password){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Empty field not allowed!',
            })
        }

        const query = { _id: new ObjectId(id) }
        const exist = await collection.findOne(query)
        if(!exist){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'No data exist to delete!',
            })
        }
        console.log(exist)
        const updateDoc = {
            $set: {
                status: exist?.status == true ? false : true
            },
        }
        const result = await collection.updateOne(query, updateDoc)
        if(result.updateCount !== 1){
            return sendResponse(res,{
                statusCode: 500,
                success: false,
                message: 'Failed to delete.',
            })
        }

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Successfully deleted!',
            data:result
        })
    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Interner error',
            data: err
        })
    }
}

const getAllAdmin = async( req: Request , res: Response) =>{
    try{
        const db = getDb()
        const collection = db.collection('admin')

        const options = {
            projection: { email: 1, _id: 1, status: 1 },
        }

        const result = await collection.find({}, options).sort({ _id: -1 }).toArray()
        const all = await collection.countDocuments()


        if (result.length === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: 'No data found!!!',
            })
        }


        sendResponse(res,{
            statusCode: 200,
            success: true,
            meta: { page: 1 , limit: 10 , total: all },
            message: 'Failed to delete.',
            data: result
        })
    }catch(err){
        console.log(err)
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Interner error',
            data: err
        })
    }
}

module.exports = {
    createAdmin,
    deleteAdmin,
    updateAdminStatus,
    updateAdminPassword,
    getAllAdmin
}