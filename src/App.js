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
    <>
    </>
  );
}

export default App;
