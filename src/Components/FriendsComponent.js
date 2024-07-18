import { useState, useEffect } from "react"
import { backendURL } from "../Globals"

let FriendsComponent = (props) => {

    let { createNotification } = props
    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
        getFriends()
    }, [])

    useEffect( () =>  {
        let error = ""
        if (email != undefined && email != "" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            error = "Invalid email"
        setErrorEmail(error) // prevent race condition
        if (error != "" || email == undefined || email == "")
            setDisabled(true)
        else
            setDisabled(false)
    }, [email])

    let getFriends = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok){
            setFriends(jsonData.friends)
        } else {
            setFriends({})
            setMessage(jsonData.error)
        }
    }

    let deleteFriend = async (email) => {
        let response = await fetch(backendURL + "/friends/" + email + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok) {
            createNotification("Friend deleted successfully")
            setFriends(friends.filter( f => f !== email ))
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let clickAdd = async () => {
        let response = await fetch(backendURL + "/friends/?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailFriend: email
            })
        })
        if (response.ok) {
            createNotification("Friend added successfully")
            setFriends([...friends, email])
            setEmail("")
            setDisabled(true)
            setMessage("")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }

    return (
        <div>
            <section>
                <h2>Add a friend</h2>
                {message != "" && <p className="error" >{message}</p>}
                <div className="center-box">
                    <div className="form-group">
                        <input onChange={changeEmail} type="text" placeholder="Email..."></input>
                    </div>
                    {errorEmail !== undefined && <p className="error">{errorEmail}</p>}
                    <button disabled={disabled} onClick={clickAdd}>Add friend</button>
                </div>
            </section>
            <section>
                <h2>My friends' emails</h2>
                <table className="present-info">
                    <tr>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                    { friends.map( f => 
                        <tr>
                            <td>{f}</td>
                            <td>
                                <button onClick={() => deleteFriend(f)} className="action-button delete-present">Delete</button>
                            </td>
                        </tr>
                    )}
                </table>
            </section>
        </div>
    )
}

export default FriendsComponent