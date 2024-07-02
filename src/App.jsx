import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Registration from "./Registeration";
import "./App.css"

import Sign from "./Sign";
import SetAvtar from "./SetAvtar";
import Chat from "./Chat";

function App(){
return <>
<BrowserRouter>
<Routes>
  <Route path="/register" element={<Registration/>}></Route>
   <Route path="/" element={<Chat/>}></Route> 
  <Route path="/login" element={<Sign/>}></Route>
  <Route path="/avatar" element={<SetAvtar/>}></Route>
</Routes>

</BrowserRouter>
</>
}
export default App;