import React, {useRef} from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import {v4 as uuidV4} from 'uuid';


export const Login = (props) => {
    const idRef = useRef(null);

    const handleSubmit = (event) =>{
        event.preventDefault();
        props.onIdSubmit(idRef.current.value)
    }
    
    const createNewId = () =>{
        props.onIdSubmit(uuidV4())
    }

    return (
        <Container 
        className='align-items-center d-flex'
        style={{
            height: '100vh'
        }}>
            <Form onSubmit={handleSubmit} className='w-100'>
                <Form.Group>
                    <Form.Label>Enter Your Id</Form.Label>
                    <Form.Control type='text' ref={idRef}></Form.Control>
                </Form.Group>
                <Button type='submit' className='me-2 mt-2'>Login</Button>
                <Button onClick={createNewId} variant='secondary' className='mt-2'>Create a new Id</Button>
            </Form>
        </Container>
    )
}
