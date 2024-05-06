import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBbLlrgT2W8iYXV2Quv6rDLK2REpz1epHU",
  authDomain: "chatapp-dae72.firebaseapp.com",
  projectId: "chatapp-dae72",
  storageBucket: "chatapp-dae72.appspot.com",
  messagingSenderId: "823344687378",
  appId: "1:823344687378:web:74f52a25decbe402acabcb"
};

export const app = initializeApp(firebaseConfig);