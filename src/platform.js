class Platform {

    constructor(data) {
        this.id = data.id 
        this.name = data.attributes.name 
        Platform.all.push(this)
    }


    static fetchById(id) {
        return fetch(baseURL + `platforms/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }

    static getAllPlatforms() {
        return fetch(baseURL + "platforms")
        .then(resp => resp.json())
        .then(obj => { obj.data })
    }

    static postNewPlatform(name) {
        return fetch(baseURL + "platforms", {
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
        .then(obj => {
            new Platform(obj.data)
        })
    }
}

Platform.all = []; 
