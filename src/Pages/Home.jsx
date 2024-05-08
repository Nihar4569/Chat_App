import { Box, Button, Container, HStack, Input, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Home() {
    const navigate = useNavigate();
    const { roomid, setRoomid, user, setUser } = useContext(Context);

    //Firebase Config
    const auth = getAuth(app)
    const loginHandler = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success("Welcome", {
                icon: '👋',
            });
        } catch (error) {
            toast.error('Failed to sign in. Please try again later.');
            console.error(error);
        }
    };
    
    //---------------------------------------------------------------
    const roomHandler = (e) => {
        e.preventDefault();
        navigate('/chat');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (data) => {
            setUser(data);
        })

        return ()=>{
            unsubscribe();
        }
    },[])

    return (
        <Box bg={"purple.100"}>
            {
                user ? (
                    <Container h={"100vh"} bg={"white"} borderRadius={"25px"}>
                        <VStack bg={"purple.200"} borderRadius={"100px"} padding={"10px"}>
                            <Container>
                                <Text textAlign={"center"} fontSize="l" style={{ fontSize: '20px' }} fontWeight="bold">Welcome <br/> {user.displayName}</Text>
                            </Container>
                            <h4 style={{ fontSize: '19px' }}> Enter Room ID</h4>
                            <form onSubmit={roomHandler}>
                                <HStack>
                                    <Input value={roomid} onChange={(e) => setRoomid(e.target.value)} borderRadius={"25px"} placeholder="Enter Room ID" flex="1" />
                                    <Button borderRadius={"25px"} _hover={{ backgroundColor: "purple.100" }} type="submit">Chat</Button>
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
