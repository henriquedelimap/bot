import express, { Request, Response } from "express"
import Sender from "./sender"

//criar um Sende() e atribuir a variavel sender
const sender = new Sender();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/status', (req: Request, res: Response) => {
    //enviar (.send) uma resposta contendo um objeto json com os valores do qrCode e do connected contidos na variável sender 
    return res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected
    })
}) 

app.post("/send", async(req: Request, res: Response)=>{
    const {type, number, message} = req.body
    try{
        if(type === "message"){
            //chama a função sendText contido no sender
            await sender.sendText(number, message)
        } 
        else if (type === "location"){
            //chama a função sendLocation contido no sender
            await sender.sendLocation(number)
        }
        
        return res.status(200).json()
    } catch(error){
        console.log(error)
        res.status(500).json({status: "error", message: error})
    }
})

app.listen(5000, ()=> {
    console.log('****** server started ******')
})
