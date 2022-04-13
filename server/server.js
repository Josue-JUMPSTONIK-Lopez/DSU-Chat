
var express = require('express')
var cors = require('cors')
var app = express()
var server = require("http").createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
app.use(express.json())
let conversations = [];

app.use(cors({
    origin: "*",
}))

app.post('/messages' , (req, res)=>{
    try {
        conversations.push(req.body)
        console.log(conversations)
        res.status(200).send({message: "message added"})
    } catch (error) {
        res.status(400).send({error})
    }
})

app.get('/messages' , (req, res)=>{
    try {
        res.status(200).send({conversations})
    } catch (error) {
        res.status(400).send({error})
    }
})

app.delete('/messages' , (req, res)=>{
    try {
        conversations = [];
        console.log(conversations)
        res.status(200).send({message: "all the conversations were deleted"})
    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }
})


io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
        const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            })
        })
    })
    console.log(id)
    // console.log(recipients)
    console.log('connected')
})

server.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
})





