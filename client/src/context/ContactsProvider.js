import React, {useContext} from 'react'
import { useStorage } from '../hooks/useStorage';

const ContactsContext = React.createContext();

export const useContacts = () =>{
  return useContext(ContactsContext)
}

export const ContactsProvider = (props) => {

  const [contacts, setContacts] = useStorage('contacts', [])

  function createContact(id, name) {
    setContacts(prevContacts => {
      return [...prevContacts, { id, name }]
    })
  }

  return (
    <ContactsContext.Provider value={{contacts, createContact}}>
      {props.children}
    </ContactsContext.Provider>
  )
}
