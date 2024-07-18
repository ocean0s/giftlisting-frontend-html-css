import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate } from "react-router-dom"

let ListPresentsComponent = (props) => {

    let { createNotification } = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let navigate = useNavigate()

    useEffect(() => {
        getPresents()
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    let deletePresent = async (id) => {
        let response = await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok) {
            createNotification("Item deleted successfully")
            setPresents(presents.filter( p => p.id !== id ))
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let editPresent = async (id) => {
        navigate("/presents/edit/" + id)
    }

    return (
        <div className="item-list">
            <h2>My presents</h2>
            {message != "" && <p className="error">{message}</p> }
            <table className="present-list">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>URL</th>
                    <th>Price</th>
                    <th>Chosen by</th>
                    <th>Actions</th>
                </tr>
                { presents.map( p=> 
                    <tr>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{p.url}</td>
                        <td>{p.price + " €"}</td>
                        <td>{p.chosenBy == null ? "No one yet" : p.chosenBy}</td>
                        <td>
                            <button className="action-button delete-present" onClick={() => deletePresent(p.id)}>Delete</button>
                            <button className="action-button" onClick={() => editPresent(p.id)}>Edit</button>
                        </td>
                    </tr>
                )}
            </table>
        </div> 
    )
}

export default ListPresentsComponent