import { useState, useEffect } from "react"
import { backendURL } from "../Globals"

let GiftPresentComponent = (props) => {

    let { createNotification } = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
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

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?userEmail=" + email + "&apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    let clickGift = async (id) => {
        let response = await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT"
        })
        if (response.ok) {
            createNotification("Present chosen successfully")
            setMessage("")
            getPresents()
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }

    return (
        <div>
            <section>
                <h2>Search friend's gifts</h2>
                {message != "" && <p className="error centered" >{message}</p>}
                <div className="center-box">
                    <div className="form-group">
                        <input onChange={changeEmail} type="text" placeholder="Email..."></input>
                    </div>
                    {errorEmail !== undefined && <p className="error">{errorEmail}</p>}
                    <button disabled={disabled} onClick={getPresents}>Search gifts</button>
                </div>
            </section>
            <section>
            {presents.length != 0?
                <>
                <h2>Friend's presents</h2>
                <table className="present-list">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>URL</th>
                        <th>Price</th>
                        <th>Chosen by</th>
                        <th>List</th>
                        <th>Actions</th>
                    </tr>
                    { presents.map( p=> 
                        <tr>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.url}</td>
                            <td>{p.price + " €"}</td>
                            <td>{p.chosenBy == null ? "No one yet" : p.chosenBy}</td>
                            <td>{p.listName}</td>
                            <td>
                                <button disabled={p.chosenBy != null} className="action-button" onClick={() => clickGift(p.id)}>Choose present</button>
                            </td>
                        </tr>
                    )}
                </table>
                </> : 
                <h2>No gifts found</h2>
            }
            </section>
        </div>
    )
}

export default GiftPresentComponent