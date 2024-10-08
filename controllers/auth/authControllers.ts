import { Request , Response } from "express"
import { UserObject } from "./commonType"
import sendResponse from "../../helper/sendResponse"
const { getDb } = require('../../config/connectDB')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const emaiReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const logIn = async(req: Request, res: Response) => {
    try{
        const db = await getDb()
        const collection = db.collection('users')

        const { email , password } = req.body

        if(!email || !password){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'No empty field allowed!!!',
            })
        }

        if(emaiReg.test(email) === false){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Invalid email format!!!',
            })
        }

        if(password.length < 6){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Password is to short!!!',
            })
        }
        const query = { email: email }
        
        const user = await collection.findOne(query)
        console.log(user._id)
        if(!user){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'No user exist with this email!!!',
            })
        }

        const pass = await bcrypt.compare(password, user.password)
        if(!pass){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Invalid password!!!',
            })
        }

        const userData = {
            id: user._id,
            email: email,
            role: user.role
        }
        const accessToken = jwt.sign(
            userData, 
            process.env.ACCESSTOKEN, { 
            expiresIn: "1d" 
        })

        const refreshToken = jwt.sign(
            userData, 
            process.env.REFRESHTOKEN,{ 
            expiresIn: "1d" 
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })
    
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Login successful!!!",
            meta: accessToken,
        })
    }catch(err){
        console.log(err)
    }
}

const signUp = async(req: Request, res: Response) => {
    try{
        const db = await getDb()
        const collection = db.collection('users')

        const { name , email , password } = req.body
        
        if(!email || !password){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'No empty field allowed!!!',
            })
        }


        if(emaiReg.test(email) === false){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Invalid email format!!!',
            })
        }

        if(password.length < 6){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'Password is to short!!!',
            })
        }
        const query = { email: email }
        
        const user = await collection.findOne(query)
        if(user){
            return sendResponse( res, {
                statusCode: 500,
                success: false,
                message: 'User already exist!!!',
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const userObject:UserObject = {
            name:name,
            email:email,
            password:hashedPassword,
            role: ''
        }

        const result = await collection.insertOne(userObject)

        const userData = {
            id: result.insertedId,
            email: email,
            role: ''
        }

        const accessToken = jwt.sign(
            userData, 
            process.env.ACCESSTOKEN, { 
            expiresIn: "1d" 
        })

        const refreshToken = jwt.sign(
            userData, 
            process.env.REFRESHTOKEN,{ 
            expiresIn: "1d" 
        })

        res.cookie(
            "refreshToken",
            refreshToken,{
                maxAge: 1000 * 60 * 15,
                httpOnly: true,
                signed: true 
            }
        )

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Signup successful!!!",
            data: result,
            meta: accessToken,
        })
    }catch(err){
        console.log(err)
    }
}

module.exports  = {
    logIn,
    signUp
} 