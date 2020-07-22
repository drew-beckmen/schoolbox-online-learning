class Course {
    static fetchById(id) {
        return fetch(baseURL + `courses/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }
}