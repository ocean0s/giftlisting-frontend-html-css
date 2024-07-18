import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"

let LoginUserComponent = (props) => {

    let { createNotification, setLogin } = props

    let [email, setEmail] = useState()
    let [password, setPassword] = useState()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    let navigate = useNavigate()

    useEffect(() => {
        setDisabled(true)
    }, [])

    useEffect( () => {
        checkErrors()
    }, [email, password])

    let checkErrors = () => {
        let newError = {}
        if (email != undefined && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            newError.email = "Invalid email"
        if (password != undefined && password.length < 5)
            newError.password = "Password too short"
        setError(newError)
        if ((newError.email != undefined || newError.password != undefined) || email == undefined || password == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }


    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changePassword = (e) => { setPassword(e.currentTarget.value) }

    let clickLogin= async () => {
        let response = await fetch(backendURL+"/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        let jsonData = await response.json()
        if (response.ok) {
            localStorage.setItem("apiKey", jsonData.apiKey)
            setLogin(true)
            navigate("/")
        } else {
            if (Array.isArray(jsonData.error)){
                let error = ""
                jsonData.error.forEach(element => {
                    {error += element.error + "\n"}
                });
                createNotification(error)
            } else 
                createNotification(jsonData.error)
        }
    }

    return (
         <div>
            <h2>Login</h2>
            <div className="center-box">
                <div className="form-group">
                    <input onChange={changeEmail} type="text" placeholder="Email..."></input>
                </div>
                {error.email !== undefined && <p className="error">{error.email}</p>}
                <div className="form-group">
                    <input onChange={changePassword} type="text" placeholder="Password..."></input>
                </div>
                {error.password !== undefined && <p className="error">{error.password}</p>}
                <button disabled={disabled} onClick={clickLogin}>Login</button>
            </div>
        </div>
    )
}

export default LoginUserComponent