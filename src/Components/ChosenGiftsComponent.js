import { useEffect, useState } from "react"
import { backendURL } from "../Globals"

let ChosenGiftsComponent = (props) => {

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")

    useEffect(() => {
        getPresents()
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents/gifting?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    // let columns = [
    //     { title: "Name", dataIndex: "name" },
    //     { title: "Description", dataIndex: "description" },
    //     { title: "URL", dataIndex: "url"},
    //     { title: "Price", dataIndex: "price", render: (p) => (p + " €") },
    //     { title: "List", dataIndex: "listName"},
    //     { title: "Email", dataIndex: "email"},
    // ]

    return (
        <div>
            <h2>My gifts to friends</h2>
            {message != "" && <p className="error">{message}</p> }
            <table className="present-list">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>URL</th>
                    <th>Price</th>
                    <th>List</th>
                    <th>Email</th>
                </tr>
                { presents.map( p=> 
                    <tr>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{p.url}</td>
                        <td>{p.price + " €"}</td>
                        <td>{p.listName}</td>
                        <td>{p.email}</td>
                    </tr>
                )}
            </table>
        </div>
    )
}

export default ChosenGiftsComponent