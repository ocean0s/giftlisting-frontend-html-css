import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"

let CreatePresentComponent = (props) => {

    let { createNotification } = props

    let [url, setUrl] = useState()
    let [name, setName] = useState()
    let [description, setDescription] = useState()
    let [price, setPrice] = useState()
    let [listName, setListName] = useState()

    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        setDisabled(true)
    }, [])

    useEffect( () => {
        checkErrors()
    }, [name, url, description, price, listName])

    let checkErrors = () => {
        let newError = {}
        if (url != undefined && url == "")
            newError.url = "URL cannot be empty"
        if (description != undefined && description == "")
            newError.description = "Description cannot be empty"
        if (name != undefined && name == "")
            newError.name = "Name cannot be empty"
        if ((price != undefined && isNaN(price)) || (!isNaN(price) && parseFloat(price) <= 0))
            newError.price = "Price has to be a positive number"
        if (listName != undefined && listName == "")
            newError.listName = "List name cannot be empty"
        setError(newError)
        if ((newError.url != undefined || newError.description != undefined || newError.name != undefined || newError.price != undefined || newError.listName != undefined)
            || url == undefined || description == undefined || name == undefined || price == undefined || listName == undefined)
           setDisabled(true)
        else
            setDisabled(false)
    }

    let changeUrl = (e) => { setUrl(e.currentTarget.value) }
    let changeName = (e) => { setName(e.currentTarget.value) }
    let changeDescription = (e) => { setDescription(e.currentTarget.value) }
    let changePrice = (e) => { setPrice(e.currentTarget.value) }
    let changeListName = (e) => { setListName(e.currentTarget.value) }

    let clickCreate = async () => {
        let response = await fetch(backendURL+"/presents?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                url: url,
                name: name,
                description: description,
                price: parseFloat(price),
                listName: listName
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

    return (
         <div>
         <h2>Create a present</h2>
         <div className="center-box">
             <div className="form-group">
                 <input onChange={changeName} type="text" placeholder="Name..."></input>
             </div>
             {error.name !== undefined && <p className="error">{error.name}</p>}
             <div className="form-group">
                 <input onChange={changeDescription} type="text" placeholder="Description..."></input>
             </div>
             {error.description !== undefined && <p className="error">{error.description}</p>}
             <div className="form-group align-center">
                 <span className="http-input">http://</span>
                 <input onChange={changeUrl} type="text" placeholder="URL..."></input>
             </div>
             {error.url !== undefined && <p className="error">{error.url}</p>}
             <div className="form-group">
                 <input onChange={changePrice} type="number" placeholder="Price..."></input>
             </div>
             {error.price !== undefined && <p className="error">{error.price}</p>}
             <div className="form-group">
                 <input onChange={changeListName} type="text" placeholder="List..."></input>
             </div>
             {error.listName !== undefined && <p className="error">{error.listName}</p>}
             <button disabled={disabled} onClick={clickCreate}>Create present</button>
         </div>
     </div>
    )
}

export default CreatePresentComponent