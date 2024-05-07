import { Box, Button, Container, HStack, Input, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../index';
import Message from "../Components/Message";
import { Timestamp, addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { app } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Chatt() {
  const { user, setUser } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const {roomid,setRoomid} = useContext(Context);
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const currentTime = new Date(); // Define currentTime here
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const navigate = useNavigate();

  //Firebase------------------------------------
  const auth = getAuth(app);
  const db = getFirestore(app);
  
//---------------------------------------------------

const logoutHandler = (e) => {
  
  signOut(auth).then(() => {
    setUser(null); // Set user to null after logout
  });
};
const switchHandler = (e)=>{
  navigate("/");
}

  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db,roomid),{
        text: message,
        uid: user.uid,
        url: user.photoURL,
        name:user.displayName,
        createdAt: serverTimestamp(),
        time: formattedTime,
      })
      // Scroll to the bottom of messages container
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      alert(error);
    }
  }

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    return unsubscribe;
  }, [auth, setUser]);

  useEffect(() => {
    if (!roomid) {
      navigate("/");
      return;
    }

    const quer = query(collection(db, roomid), orderBy("createdAt", "asc"));
    const unsubscribeforMessage = onSnapshot(quer, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() } // Add id to it
        })
      );
    });

    return unsubscribeforMessage;
  }, [roomid, db, navigate]);

 

  if (!user) return <Navigate to="/" />;
  return (
    <Box bg={"purple.100"}>
      <Container h={"100vh"} bg={"white"} borderRadius={"25px"}>
        <VStack h={"full"} paddingY={"4"} spacing={4}>
          <h2>{roomid}</h2>
          <HStack>
          <Button onClick={logoutHandler} borderRadius={"25px"} colorScheme={"red"} w={"full"}>
            Logout
          </Button>
          <Button onClick={switchHandler} borderRadius={"25px"} colorScheme={"green"} w={"full"}>Switch Room</Button>
          </HStack>
          <VStack h="full" w="full" overflowY="auto" css={{
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}>
            {
              messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  url={item.url}
                  name={item.name}
                  time={item.time}
                />
              ))
            }
            <div ref={messagesContainerRef} /> {/* Ref to messages container */}
          </VStack>
          <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <HStack>
                  <Input borderRadius={"25px"} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a Message" flex="1" />
                  <Button borderRadius={"25px"} _hover={{backgroundColor:"purple.100"}} type="submit">Send</Button>
                </HStack>
              </form>
        </VStack>
      </Container>
    </Box>
  );
}
