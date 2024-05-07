import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import { useContext, useEffect } from "react";
import { Context } from "./index";
import Home from "./Pages/Home";
import Chat from "./Pages/Chatt"
import { Toaster } from "react-hot-toast";

function App() {

  const {roomid,setRoomid} = useContext(Context);


  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
      <Toaster/>
    </Router>
    </div>
  );
}

export default App;
