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

    // let columns = [
    //     { title: "Name", dataIndex: "name" },
    //     { title: "Description", dataIndex: "description" },
    //     { title: "URL", dataIndex: "url"},
    //     { title: "Price", dataIndex: "price", render: (p) => (p + " €") },
    //     { title: "Chosen by", dataIndex: "chosenBy", render: (c) => (c == null ? "No one yet" : c) },
    //     { title: "Actions", dataIndex: "id",
    //         render: (id) => (
    //             <>
    //                 <Button danger style={{margin: "4px"}} onClick={() => deletePresent(id)}>Delete</Button>
    //                 <Button style={{margin: "4px"}} onClick={() => editPresent(id)}>Edit</Button>
    //             </>)
    //      },
    // ]

    return (
        <div className="item-list">
            <h2>My presents</h2>
            {message != "" && <p className="error">{message}</p> }
            { presents.map( p => 
                <div className="item">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <p>{p.url}</p>
                    <p>{p.price + " €"}</p>
                    <p>{p.chosenBy == null ? "No one yet" : p.chosenBy }</p>
                    <button className="action-button delete-present" onClick={() => deletePresent(p.id)}>Delete</button>
                    <button className="action-button" onClick={() => editPresent(p.id)}>Edit</button>
                </div>
            )}
        </div> // TODO add better table, classes do not exist yet
    )
}

export default ListPresentsComponent