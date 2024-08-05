import { Request , Response } from "express"
import { UserObject } from "./commonType"
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
            return res.status(400).json({
                message: "No empty field allowed"
            })
        }


        if(emaiReg.test(email) === false){
            return res.status(400).json({
                message: "Invalid email format"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message: "Password is to short"
            })
        }
        const query = { email: email }
        
        const user = await collection.findOne(query)
        if(!user){
            return res.status(400).json({
                message: "No user found with this email"
            })
        }

        const pass = await bcrypt.compare(password, user.password)
        if(!pass){
            return res.status(400).json({
                message: "Invalid password"
            })
        }

        const userData = {
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
    

        res.status(200).json({
            "accessToken": accessToken, 
            message : "Login successfull" 
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
        console.log(req.body)
        if(!email || !password){
            return res.status(400).json({
                message: "No empty field allowed"
            })
        }


        if(emaiReg.test(email) === false){
            return res.status(400).json({
                message: "Invalid email format"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message: "Password is to short"
            })
        }
        const query = { email: email }
        
        const user = await collection.findOne(query)
        if(user){
            return res.status(400).json({
                message: "User already exist. Please login!"
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
            "refresh-token",
            refreshToken,{
                maxAge: 1000 * 60 * 15,
                httpOnly: true,
                signed: true 
            }
        )

        res.json({
            "response": result,
            "accessToken": accessToken, 
            message : "Signin successfull" 
        })
    }catch(err){

    }
}

module.exports  = {
    logIn,
    signUp
} 