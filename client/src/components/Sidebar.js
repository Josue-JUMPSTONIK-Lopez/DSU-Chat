import React,{useState} from 'react'
import { Button, Modal, Nav, Tab } from 'react-bootstrap'
import { Contacts } from './Contacts';
import { Conversations } from './Conversations';
import { NewContactModal } from './NewContactModal';
import { NewCoversationModal } from './NewCoversationModal';

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts"

export const Sidebar = (props) => {

    const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
    const [modalOpen, setModalOpen] = useState(false)
    const conversationOpen = activeKey === CONVERSATIONS_KEY 
    
    const closeModal = () =>{
        setModalOpen(false)
    }

    return (
    <aside style={{
        width: '250px'
    }} 
    className="d-flex flex-column">
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
            <Nav variant='tabs' className='justify-content-center'>
                <Nav.Item>
                    <Nav.Link eventKey={CONVERSATIONS_KEY}> Conversation</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={CONTACTS_KEY}> Contacts</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content className='border-end overflow-auto flex-grow-1'>
                <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                    <Conversations />
                </Tab.Pane>
                <Tab.Pane eventKey={CONTACTS_KEY}>
                    <Contacts />
                </Tab.Pane>
            </Tab.Content>
            <div className='p-2 border-top border-end small'>
                Your Id: <span className='text-muted'>{props.id}</span>
            </div>
            <Button onClick={()=> setModalOpen(true)} className='rounded-0'>
                New {conversationOpen ? 'Conversation' : "Contact"}
            </Button>
        </Tab.Container> 
        <Modal show={modalOpen} onHide={closeModal}>
            {conversationOpen 
            ?
            <NewCoversationModal closeModal={closeModal}/>
            :
            <NewContactModal closeModal={closeModal}/>
            }
        </Modal>  
    </aside>
  )
}
