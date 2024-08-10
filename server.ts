require('dotenv').config()
import express, { Express, Request, Response } from "express"
const app: Express = express()
const corsOption = require('./config/corsOption')
const cors =  require('cors')
const path = require("path")
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const { logger } = require('./middleware/logger')
const { connectDb } = require('./config/connectDB')
const routes = require('./routes/app')
const port = process.env.PORT || 7373

connectDb()

app.use(logger)
app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.PARSERSECRET))


app.use('/', express.static(path.join(__dirname, "public")))
app.use('/', require('./routes/roots'))


app.use('/app/v1',routes)

app.get('/test', async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server working...!!!',
  })
})


app.all('*',(req:Request,res:Response) =>{
    res.status(404)
    if(req.accepts('html')){
      res.sendFile(path.join(__dirname, 'views' , '404.html'))
    }else if(req.accepts('json')){
      res.json({ message: '404 Not Found'})
    }else{
      res.type('txt').send('404 Not Found')
    }
})
  

app.use(errorHandler)

app.listen(port, () => {
    console.log(`server running on http://localhost/${port}`)
})