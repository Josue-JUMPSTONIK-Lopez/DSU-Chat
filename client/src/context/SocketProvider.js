import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
const SocketContext = React.createContext();

export const useSocket= ()=>{
    return  useContext(SocketContext)
}

export const SocketProvider = ({id, children}) => {
  
    const [socket, setSocket] = useState();

    useEffect(()=>{
    const newSocket = io(
        'http://localhost:4000',
        {transports:['websocket'],
                    query: {id}}
        )
        setSocket(newSocket)
        return ()=> newSocket.close()
    },[])
  
    return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}
