import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUserComponent from "./Components/CreateUserComponent";
import LoginUserComponent from "./Components/LoginUserComponent";
import { backendURL } from "./Globals";
import ListPresentsComponent from "./Components/ListPresentsComponent";
import CreatePresentComponent from "./Components/CreatePresentComponent";
import EditPresentComponent from "./Components/EditPresentComponent";
import FriendsComponent from "./Components/FriendsComponent";
import GiftPresentComponent from "./Components/GiftPresentComponent";
import IndexComponent from "./Components/IndexComponent";

function App() {
  let [notification, setNotification] = useState("")
  let [login, setLogin] = useState(false)
  let navigate = useNavigate()

  useEffect( () => {
    checkLogin()
  }, [])

  let createNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification("")
    }, 3000)
  }

  let checkLogin = async () => {
    let apiKey = localStorage.getItem("apiKey")
    if (apiKey == null) {
      setLogin(false)
    } else {
      let response = await fetch(backendURL + "/friends?apiKey=" + apiKey)
      if (response.ok)
        setLogin(true)
      else{
        setLogin(false)
        localStorage.removeItem("apiKey")
        navigate("/login")
      }
    }
  }

  let disconnect = async () => {
    await fetch(backendURL + "/users/disconnect?apiKey=" + localStorage.getItem("apikey"),
      {method: "POST"})
    localStorage.removeItem("apiKey")
    setLogin(false)
    navigate("/login")
  }

  return (
    <div className="main-container">
      <header>
        <nav>
          <ul className="navbar">
            <li><Link to="/">Index</Link></li>
            {!login && <li><Link to="/register">Register</Link></li>}
            {!login && <li><Link to="/login">Login</Link></li>}
            {login && <li><Link to="/presents">Presents</Link></li>}
            {login && <li><Link to="/presents/create">Create a present</Link></li>}
            {login && <li><Link to="/friends">Friends</Link></li>}
            {login && <li><Link to="/presents/friends">Gift a friend</Link></li>}
            {login && <li><Link to="#" onClick={disconnect} >Disconnect</Link></li>}
          </ul>
        </nav>
        {notification != "" && (
        <div className='notification'>
          {notification}
          <span className='close-btn' onClick={() => setNotification("")}>X</span>
        </div>
      )}
      </header>
      <main>
        <Routes>
          <Route path="/register" element={
            <CreateUserComponent createNotification={createNotification}/>
          }></Route>
          <Route path="/login" element={
            <LoginUserComponent createNotification={createNotification} setLogin={setLogin}/>
          }></Route>
          <Route path="/" element={
            <IndexComponent login={login}/>
          }></Route>
          <Route path="/presents" element={
            <ListPresentsComponent createNotification={createNotification}/>
          }></Route>
          <Route path="/presents/create" element={
            <CreatePresentComponent createNotification={createNotification}/>
          }></Route>
          <Route path="/presents/edit/:id" element={
            <EditPresentComponent createNotification={createNotification}/>
          }></Route>
          <Route path="/friends" element={
            <FriendsComponent createNotification={createNotification}/>
          }></Route>
          <Route path="/presents/friends" element={
            <GiftPresentComponent createNotification={createNotification}/>
          }></Route>
        </Routes>
      </main>
      <footer>
        <p>Presents App &copy;</p>
      </footer>
    </div>
  );
}

export default App;
