import React, {useRef} from 'react'
import {Modal, Form, Button} from 'react-bootstrap'
import { useContacts } from '../context/ContactsProvider';

export const NewContactModal = (props) => {

    const idRef = useRef();
    const nameRef = useRef()
    const {createContact } =  useContacts()

    const handleSubmit = (event) =>{
        event.preventDefault()
        // console.log('hello')
        createContact(idRef.current.value, nameRef.current.value)
        props.closeModal()
    }

    return (
        <>
        <Modal.Header closeButton>Create Contact</Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Id</Form.Label>
                    <Form.Control type='text' ref={idRef} required></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' ref={nameRef} required></Form.Control>
                </Form.Group>
            </Form>
            <Button onClick={handleSubmit} className='mt-2' type='submit'>Create</Button>
        </Modal.Body>
        </>
    )
}
