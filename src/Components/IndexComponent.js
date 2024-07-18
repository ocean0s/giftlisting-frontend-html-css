

let IndexComponent = (props) => {

    let { login } = props

    if (login)
        return (
            <>
                <h2>Welcome to the gift app dasboard!</h2>
                <p className="welcome-p">Please, select one of the options in the menu bar at the top of the page to start.</p>
            </>
        )
    else 
        return (
            <>
                <h2>Welcome to the gifts app!</h2>
                <p className="welcome-p">Please, log in to your account to access the user dashboard.</p>
            </>
        )
}

export default IndexComponent