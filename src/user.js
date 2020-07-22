class User {
    static findAllUsers() {
        return fetch(baseURL + "users")
        .then(resp => resp.json())
        .then(obj => obj.data)
    }

    static isValidUser(name, users) {
        let currentUser = users.find(user => user.attributes.name === name)
        if (!!currentUser) return currentUser.id 
        else return false 
    }

    static postNewUser(name) {
        return fetch(baseURL + "users", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                name
            })
        })
        .then(resp => resp.json())
        .then(obj => obj.data.id)
    }
}