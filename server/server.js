
const express = require('express')
const cors = require('cors')
const app = express()
const server = require("http").createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const path = require('path');

let conversations = [];

//SWAGGER
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "DSU-Chat API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: [`${__dirname}/server.js`]
}

//CORS
app.use(cors({
    origin: "*",
}))

//MIDDLEWARES
app.use(express.json())
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

//ROUTES
app.post('/messages' , (req, res)=>{
    try {
        conversations.push(req.body)
        console.log(conversations)
        res.status(200).send({message: "message added"})
    } catch (error) {
        res.status(400).send({error})
    }
})

/**
 * @swagger
 * components:
 *  schemas:
 *      conversations:
*           type: array
*           properties:
*           recipients:
*               type: array
*               description: "Usuarios a quienes se dirige el mensaje"
*           text:
*               type: string
*               description: "mensaje enviado por el usuario que lo envio"
*           sender:
*               type: string
*               description: "usuario que envio el usuario"
*           required:
*               - recipients
*               - text
*               - email
*           example:
*               recipients: ['Josue','Raul']
*               text: hello
*               sender: Pedro 
 */

/**
 * @swagger
 * /messages:
 *  get:
 *      summary: get all the messages
 *      tags: [Messages]
 *      responses:
 *          200:
 *              description: This are all the messages of conversations
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/conversations'
 *          404:
 *              description: "messages not found"
 */
app.get('/messages' , (req, res)=>{
    try {
        res.status(200).send({conversations})
    } catch (error) {
        res.status(400).send({error})
    }
})

/**
 * @swagger
 * /messages:
 *  delete:
 *      summary: delete all the messages
 *      tags: [Messages]
 *      responses:
 *          200:
 *              description: All conversation's messages were deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/conversations'
 *          404:
 *              description: "Error: We couldn't delete all the messages"
 */
app.delete('/messages' , (req, res)=>{
    try {
        conversations = [];
        // console.log(conversations)
        res.status(200).send({message: "all the conversations were deleted"})
    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }
})

//SOCKET.IO
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

//SERVER LISTENING
server.listen(4000, function () {
  console.log('CORS-enabled web server listening on port 4000')
})





