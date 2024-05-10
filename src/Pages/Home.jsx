import { Box, Button, Center, Container, HStack, Input, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';


export default function Home() {
    const navigate = useNavigate();
    const { roomid, setRoomid, user, setUser, loader, setLoader } = useContext(Context);
    const [roompass, setRoompass] = useState("")
    const [lroomid, setLroomid] = useState("");
    const [lroompass, setLroompass] = useState("");
    const [regroomid, setRegroomid] = useState("");
    const [regroompass, setRegroompass] = useState("");

    //Firebase Config
    const auth = getAuth(app);
    const db = getFirestore(app);

    const loginHandler = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setLoader(true);
            await signInWithPopup(auth, provider);
            toast.success("Welcome", {
                icon: '👋',
            });
            setLoader(false)
        } catch (error) {
            toast.error('Failed to sign in. Please try again later.');
            console.error(error);
            setLoader(false)
        }
    };

    //---------------------------------------------------------------
    // const roomHandler = (e) => {
    //     e.preventDefault();
    //     try {
    //         if (roomid !== "Messages") {
    //             const trimmedRoomId = roomid.trim().toLowerCase();
    //             setRoomid(trimmedRoomId);

    //         }
    //         navigate('/chat');
    //     } catch (error) {

    //     }

    // };

    const register = async (e) => {
        e.preventDefault()
        try {
            setLoader(true);
            const roomDoc = await getDoc(doc(db, 'ROOMS', regroomid.trim().toLowerCase()));
            if (roomDoc.exists()) {
                toast.error("Room Already Exist")
                setLoader(false);
            }

            else {
                await setDoc(doc(db, 'ROOMS', regroomid.trim().toLowerCase()), {
                    roomid: regroomid.trim().toLowerCase(),
                    password: regroompass,
                });
                toast.success("Room Created")
                setRegroomid("")
                setRegroompass("")
                setLoader(false);
            }
        } catch (error) {
            toast.error(error.message);
            setLoader(false);
        }
    }

    const joinroom = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const roomDoc = await getDoc(doc(db, 'ROOMS', lroomid.trim().toLowerCase()));
            if (roomDoc.exists()) {
                const userData = await roomDoc.data();
                if (userData.password === lroompass) {
                    setRoomid(userData.roomid)
                    console.log(roomid);
                    toast.success(`Welcome to the Room ${lroomid}`)
                    navigate('/chat')
                    setLroomid("")
                    setLroompass("")
                    setLoader(false);
                }
                else {
                    toast.error("Incorrect Room Password")
                    setLoader(false);
                }
            }
            else {
                toast.error("Room doesn't Exist")
                setLoader(false);
            }
        } catch (error) {
            toast.error(error.message);
            setLoader(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (data) => {
            setUser(data);
        })

        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <Box bg={"purple.100"}>
            {
                user ? (

                    <Container h={"100vh"} bg={"white"} borderRadius={"25px"}>
                        <VStack bg={"purple.200"} borderRadius={"100px"} padding={"10px"}>
                            <Text textAlign={"center"} fontSize="l" style={{ fontSize: '20px' }} fontWeight="bold">Welcome <br /> {user.displayName}</Text>
                        </VStack>
                        <br /> <br />
                        <VStack bg={"purple.200"} borderRadius={"100px"} padding={"10px"} _hover={{backgroundColor:"purple.300"}}>
                            {/* <h4 style={{ fontSize: '19px' }}> Enter Room ID</h4> */}
                            <form onSubmit={joinroom}>
                                <VStack>
                                    <Text fontWeight="bold" color={"indigo"} style={{ fontSize: '19px' }}>Join Room</Text>
                                    <Input textAlign={"center"} value={lroomid} onChange={(e) => setLroomid(e.target.value)} borderRadius={"25px"} placeholder="Room ID" flex="1" />
                                    <Input type="password" textAlign={"center"} value={lroompass} onChange={(e) => setLroompass(e.target.value)} borderRadius={"25px"} placeholder="Password" flex="1" />
                                    <Button isDisabled={loader} borderRadius={"25px"} _hover={{ backgroundColor: "purple.100" }} type="submit">Join Chat</Button>
                                </VStack>
                            </form>
                        </VStack>
                        <br /> <Box display="flex" alignItems="center" justifyContent="center">
                            {loader && <Loader />}
                        </Box> <br />
                        <VStack bg={"purple.200"} borderRadius={"100px"} padding={"10px"} _hover={{backgroundColor:"purple.300"}}>

                            {/* <h4 style={{ fontSize: '19px' }}> Enter Room ID</h4> */}
                            <form onSubmit={register}>
                                <VStack>
                                    <Text fontWeight="bold" color={"indigo"} style={{ fontSize: '19px' }}>Create Room</Text>
                                    <Input textAlign={"center"} value={regroomid} onChange={(e) => setRegroomid(e.target.value)} borderRadius={"25px"} placeholder="Room ID" flex="1" />
                                    <Input type="password" textAlign={"center"} value={regroompass} onChange={(e) => setRegroompass(e.target.value)} borderRadius={"25px"} placeholder="Password" flex="1" />
                                    <Button isDisabled={loader} borderRadius={"25px"} _hover={{ backgroundColor: "purple.100" }} type="submit">Create Room</Button>
                                </VStack>
                            </form>

                        </VStack>
                    </Container>
                ) : (
                    <VStack justifyContent="center" h="100vh" bg={"white"}>
                        {loader && <Loader />}
                        <Button onClick={loginHandler} colorScheme="purple">SignIn With Google</Button>
                    </VStack>
                )
            }
        </Box>
    );
}
