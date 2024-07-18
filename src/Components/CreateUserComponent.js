import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals";

let CreateUserComponent = (props) => {
    let { createNotification } = props

    let [email, setEmail] = useState()
    let [username, setUsername] = useState()
    let [password, setPassword] = useState()

    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        setDisabled(true)
    }, [])

    useEffect( () => {
        checkErrors()
    }, [username, email, password])

    let checkErrors = () => {
        let newError = {}
        if (email != undefined && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            newError.email = "Invalid email"
        if (password != undefined && password.length < 5)
            newError.password = "Password too short"
        if (username != undefined && username == "")
            newError.username = "Username cannot be empty"
        setError(newError)
        if ((newError.email != undefined || newError.password != undefined || newError.username != undefined) || email == undefined || username == undefined || password == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changeUsername = (e) => { setUsername(e.currentTarget.value) }
    let changePassword = (e) => { setPassword(e.currentTarget.value) }

    let clickCreate = async () => {
        let response = await fetch(backendURL+"/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        })

        if (response.ok) {
            createNotification("User created successfully")
            navigate("/login")
        } else {
            let jsonData = await response.json()
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
            <h2>Register</h2>
            <div className="center-box">
                <div className="form-group">
                    <input onChange={changeEmail} type="text" placeholder="Email..."></input>
                </div>
                {error.email !== undefined && <p className="error">{error.email}</p>}
                <div className="form-group">
                    <input onChange={changeUsername} type="text" placeholder="Username..."></input>
                </div>
                {error.username !== undefined && <p className="error">{error.username}</p>}
                <div className="form-group">
                    <input onChange={changePassword} type="text" placeholder="Password..."></input>
                </div>
                {error.password !== undefined && <p className="error">{error.password}</p>}
                <button disabled={disabled} onClick={clickCreate}>Create account</button>
            </div>
        </div>
    )
}

export default CreateUserComponent