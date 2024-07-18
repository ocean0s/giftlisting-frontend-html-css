import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"

let EditPresentComponent = (props) => {

    let {id} = useParams()
    let {createNotification} = props
    let [message, setMessage] = useState("")
    let [item, setItem] = useState({})
    let [itemOriginal, setItemOriginal] = useState({})
    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        getItem()
        setDisabled(true)
    }, [])

    let getItem = async () => {
        let response = await fetch(backendURL+"/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"))
        if (response.ok) {
            let jsonData = await response.json()
            setItem(jsonData.present[0])
            setItemOriginal(jsonData.present[0])
        } else {
            setMessage("Error")
            setItem({})
        }
    }

    useEffect( () => {
        checkErrors()
    }, [item])

    let checkErrors = () => {
        let newError = {}
        if (item.url != undefined && item.url == "")
            newError.url = "URL cannot be empty"
        if (item.description != undefined && item.description == "")
            newError.description = "Description cannot be empty"
        if (item.name != undefined && item.name == "")
            newError.name = "Name cannot be empty"
        if ((item.price != undefined && isNaN(item.price)) || (!isNaN(item.price) && parseFloat(item.price) <= 0))
            newError.price = "Price has to be a positive number"
        setError(newError)
        if ((newError.url != undefined || newError.description != undefined || newError.name != undefined || newError.price != undefined)
             || item.url == undefined || item.description == undefined || item.name == undefined || item.price == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }

    let clickEdit = async () => {
        let response = await fetch(backendURL+"/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                url: item.url,
                name: item.name,
                description: item.description,
                price: parseFloat(item.price)
            })
        })

        if (response.ok) {
            createNotification("Present created successfully")
            navigate("/presents")
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

    let changeProperty = (propertyName, e) => {
        let itemNew = {...item, [propertyName] : e.currentTarget.value}
        setItem(itemNew)
    }

    return (
        <div> 
            <section>
                <h2>Original item data</h2>
                <table className="present-info">
                        <tr>
                            <th>Name</th>
                            <td><b>{itemOriginal.name}</b></td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>{itemOriginal.description}</td>
                        </tr>
                        <tr>
                            <th>URL</th>
                            <td>{itemOriginal.url}</td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>{itemOriginal.price + " €"}</td>
                        </tr>
                        <tr>
                            <th>Chosen by</th>
                            <td>{itemOriginal.chosenBy == null ? "No one yet" : itemOriginal.chosenBy}</td>
                        </tr>
                    </table>
            </section>
            <section>
                <h2>Edit your present</h2>
                {message != "" && <p className="error">{message}</p>}
                <div className="center-box">
                    <div className="form-group">
                        <input value={item.name} onChange={(e) => changeProperty("name",e)} type="text" placeholder="Name..."></input>
                    </div>
                    {error.name !== undefined && <p className="error">{error.name}</p>}
                    <div className="form-group">
                        <input value={item.description} onChange={(e) => changeProperty("description",e)} type="text" placeholder="Description..."></input>
                    </div>
                    {error.description !== undefined && <p className="error">{error.description}</p>}
                    <div className="form-group align-center">
                        <span className="http-input">http://</span>
                        <input value={item.url} onChange={(e) => changeProperty("url",e)} type="text" placeholder="URL..."></input>
                    </div>
                    {error.url !== undefined && <p className="error">{error.url}</p>}
                    <div className="form-group">
                        <input value={item.price} onChange={(e) => changeProperty("price",e)} type="number" placeholder="Price..."></input>
                    </div>
                    {error.price !== undefined && <p className="error">{error.price}</p>}
                    <button disabled={disabled} onClick={clickEdit}>Edit present</button>
                </div>
            </section>
        </div>
    )
}

export default EditPresentComponent