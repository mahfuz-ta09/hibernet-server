import { Request , Response } from "express"
import { fileUploadHelper } from "../../helper/fileUploadHelper"
const { getDb } = require('../../config/connectDB')



const createSpecialties = async( req: Request , res: Response ) => {
    try{
        const db = getDb()
        const collection = db.collection('specialties')

        const { name } = req.body

        if (!name){
            return res.status(400).json({
                statusCode: 400,
                message: "Failed!",
                errorMessage: "Name required!"
            })
        }

        const file = req.file

        if(!file){
            return res.status(400).json({
                statusCode: 400,
                message: "Failed!",
                errorMessage: "File required!"
            })
        }

        const uploaded:any = await fileUploadHelper.uploadToCloud(file)

        if(!uploaded){
            return res.status(401).json({data:{data:"Unable to upload photo",meta:{}}})
        }

        const insertObj = {
            name: name,
            url: uploaded.url
        }

        const result = await collection.insertOne(insertObj)

        if(!result.acknowledged){
            return res.status(500).json({data:{
                statusCode:500,
                message:"Failed",
                errorMessage:"Insertion failed"
            }})
        }

        res.status(200).json({data:{ data:"Insertion succeeded",meta: result }})
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


        res.status(200).json({data:{ data: specialties ,meta: countSp }})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllSpecialties,
    createSpecialties
}