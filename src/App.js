import { Box, Button, Container, HStack, Input, VStack } from "@chakra-ui/react";
import Message from "./Components/Message";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { app } from "./firebase"
import { useEffect, useRef, useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

const auth = getAuth(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}

const logoutHandler = () => {
  signOut(auth);
}
const db = getFirestore(app);


function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const quer = query(collection(db, "Messages"), orderBy("createdAt", "asc"))
  const messagesContainerRef = useRef(null); // Ref to messages container
  


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        url: user.photoURL,
        name:user.displayName,
        createdAt: serverTimestamp(),
      });
      // Scroll to the bottom of messages container
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" })

    } catch (error) {
      alert(error);
    }
  }

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    })
    console.log(user);

    const unsubscribeforMessage = onSnapshot(quer, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() } // Add id to it
        })
      )
      console.log(`this is message items ${messages}`);
    })


    return () => {
      unsubscribe();
      unsubscribeforMessage()
    }
  }, [])

  return (
    <Box bg={"purple.100"}>
      {
        user ? (
          <Container h={"100vh"} bg={"blue.100"}>
            <VStack h={"full"} paddingY={"4"} spacing={4}>
              <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
                Logout
              </Button>

              <VStack h="full" w="full" overflowY="auto" css={{"&::-webkit-scrollbar":{
                display:"none"
              }}}>
                {
                  messages.map((item) => (
                    <Message
                      key={item.id}
                      user={item.uid === user.uid ? "me" : "other"}
                      text={item.text}
                      url={item.url}
                      name={item.name}
                    />
                  ))
                }
                <div ref={messagesContainerRef} /> {/* Ref to messages container */}
              </VStack>

              <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <HStack>
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a Message" flex="1" />
                  <Button type="submit">Send</Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ) : (
          <VStack justifyContent="center" h="100vh" bg={"white"}>
            <Button onClick={loginHandler} colorScheme="purple">Signin With Google</Button>
          </VStack>
        )
      }
    </Box>
  );
}

export default App;
