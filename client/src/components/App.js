// import { useState } from "react";
import { useStorage } from "../hooks/useStorage";
import { Login } from "./Login";
import {Dashboard} from "./Dashboard"
import { ContactsProvider } from "../context/ContactsProvider";
import { ConversationsProvider } from "../context/ConversationsProvider";
import { SocketProvider } from "../context/SocketProvider";

function App() {

  const [id, setId] = useStorage('id');

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id}/>
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )


  return (

    id 
    ? 
    dashboard
    :
    <Login onIdSubmit={setId}/>
  );
}

export default App;
