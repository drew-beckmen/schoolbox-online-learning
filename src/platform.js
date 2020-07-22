class Platform {
    static fetchById(id) {
        return fetch(baseURL + `platforms/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }
}
