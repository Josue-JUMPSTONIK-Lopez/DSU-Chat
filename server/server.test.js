const server = require("./server");
const supertest = require('supertest');
const request = require('supertest')
// const { request } = require("express");

//SERVER LISTENING
server.listen(4000, function () {
    console.log('CORS-enabled web server listening on port 4000')
  })

describe("POST /messages", ()=>{

    describe("given a message and conversation" , () =>{
        test('should respond with a 200 status code', async() => {
            const response = await request(server).post('/messages').send({ 
                recipients: [ 'Josue', 'Raul' ], 
                text: 'dddd\n', 
                sender: 'Ruben' 
            })
            expect(response.statusCode).toBe(200);
        });
        test('should specify json in the content type header', async() => {
            const response = await request(server).post('/messages').send({ 
                recipients: [ 'Josue', 'Raul' ], 
                text: 'dddd\n', 
                sender: 'Ruben' 
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        });

        test('response has message', async() => {
            const response = await request(server).post('/messages').send({ 
                recipients: [ 'Josue', 'Raul' ], 
                text: 'dddd\n', 
                sender: 'Ruben' 
            })
            expect(response.body.message).toBeDefined()
        });
    })

    describe("when the message and conversation is missing", ()=>{
        test('Should respond with a status code of 400', async() => {
            const response = await request(server).post('/messages').send({ 
                recipients: [ 'Josue', 'Raul' ], 
                sender: 'Ruben' 
            })
            expect(response.statusCode).toBe(400)
        });
    })
})