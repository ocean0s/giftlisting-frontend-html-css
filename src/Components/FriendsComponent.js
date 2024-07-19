import { useState, useEffect } from "react"
import { backendURL } from "../Globals"

let FriendsComponent = (props) => {

    let { createNotification } = props
    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [listName, setListName] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [errorListName, setErrorListName] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
        getFriends()
    }, [])

    useEffect( () =>  {
        let errorEmail = ""
        let errorListName = ""
        if (email != undefined && email != "" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            errorEmail = "Invalid email"
        }
        setErrorEmail(errorEmail) // prevent race condition
        if (listName != undefined && listName == ""){
            errorListName = "Invalid list name"
        }
        setErrorListName(errorListName)
        if (errorEmail != "" || email == undefined || email == "" || errorListName != "" || listName == undefined || listName == "")
            setDisabled(true)
        else
            setDisabled(false)
    }, [email, listName])

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

    let deleteFriend = async (email, listName) => {
        let response = await fetch(backendURL + "/friends/" + email + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                listName: listName
            })
        })
        if (response.ok) {
            createNotification("Friend deleted successfully")
            setFriends(friends.filter( f => (f.emailFriend !== email || f.listName !== listName ) ))
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
                emailFriend: email,
                listName: listName
            })
        })
        if (response.ok) {
            createNotification("Friend added successfully")
            setFriends([...friends, {emailFriend: email, listName: listName}])
            setEmail("")
            setListName("")
            setDisabled(true)
            setMessage("")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changeListName = (e) => { setListName(e.currentTarget.value) }

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
                    <div className="form-group">
                        <input onChange={changeListName} type="text" placeholder="List..."></input>
                    </div>
                    {errorListName !== undefined && <p className="error">{errorListName}</p>}
                    <button disabled={disabled} onClick={clickAdd}>Add friend to list</button>
                </div>
            </section>
            <section>
                <h2>My friends' emails</h2>
                <table className="present-info">
                    <tr>
                        <th>Email</th>
                        <th>List</th>
                        <th>Action</th>
                    </tr>
                    { friends.map( f => 
                        <tr>
                            <td>{f.emailFriend}</td>
                            <td>{f.listName}</td>
                            <td>
                                <button onClick={() => deleteFriend(f.emailFriend, f.listName)} className="action-button delete-present">Delete</button>
                            </td>
                        </tr>
                    )}
                </table>
            </section>
        </div>
    )
}

export default FriendsComponent