import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

export const Context = createContext({});


const AppWrapper = () => {
  const [roomid, setRoomid] = useState("");
  const [user,setUser] = useState(false);
  const [loader,setLoader] = useState(false);

  return (
    <Context.Provider value={{
      roomid,
      setRoomid,
      user,
      setUser,
      loader,
      setLoader,
    }}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Context.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)

